import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface User {
  username: string;
  bio: string | null;
  display_name: string | null;
  stream_name: string | null;
}

export interface AuthenticatedUser {
  username: string;
  email: string;
  bio: string | null;
  display_name: string | null;
  stream_name: string | null;
  stream_key: string;
}

export interface Stream {
  url: string;
  viewers_count: number;
  ready_time: string;
  user: User;
}

interface RequestParams {
  path: string;
  params?: RequestInit;
  authenticated?: boolean;
}

async function request<T>({ path, params, authenticated = false }: RequestParams): Promise<T> {
  let token;
  
  if (authenticated) {
    token = (await cookies()).get("token")?.value;

    if (!token) {
      redirect("/signin");
    }
  }

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL + path, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...params,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error);
  }

  return res.json() as T;
}

export async function signin(email: string, password: string) {
  return request<{ token: string }>({
    path: "/auth/login",
    params: {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
  });
}

export async function signup(username: string, email: string, password: string) {
  return request<{ token: string }>({
    path: "/auth/register",
    params: {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    },
  });
}

export async function searchUsers(username: string) {
  return request<{ users: User[] }>({
    path: `/users?query=${encodeURIComponent(username)}`,
  });
}

export async function getUser(username: string) {
  return request<User>({ path: `/users/${username}` });
}

export async function getActiveStreams() {
  return request<{ active_streams: Stream[] }>({ path: "/streams/active" });
}

export async function getMe() {
  return request<AuthenticatedUser>({ path: "/users/me", authenticated: true });
}

export async function updateMe(
  email?: string,
  bio?: string,
  display_name?: string,
  stream_name?: string
) {
  return request<User>({
    path: "/users/me",
    params: {
      method: "PATCH",
      body: JSON.stringify({ email, bio, display_name, stream_name }),
    },
    authenticated: true,
  });
}

export async function updatePassword(old_password: string, new_password: string) {
  return request({
    path: "/users/me/password",
    params: {
      method: "PUT",
      body: JSON.stringify({ old_password, new_password }),
    },
    authenticated: true,
  });
}

export async function follow(username: string) {
  return request({
    path: `/users/${username}/follow`,
    params: { method: "POST" },
    authenticated: true,
  });
}

export async function unfollow(username: string) {
  return request({
    path: `/users/${username}/unfollow`,
    params: { method: "POST" },
    authenticated: true,
  });
}
