import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export interface User {
  username: string;
  bio: string | null;
  display_name: string | null;
  stream_name: string | null;
}

export interface Me {
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

export async function signup(username: string, password: string, email: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password, email }),
  });
}

export async function signin(email: string, password: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
}

export async function searchUsers(query: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?query=${encodeURIComponent(query)}`);
}

export async function getUser(username: string) {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}`);
}

export async function getActiveStreams() {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/streams/active`);
}

export async function getMe() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/signin");
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateMe(
  email?: string,
  bio?: string,
  display_name?: string,
  stream_name?: string
) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/signin");
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      email,
      bio,
      display_name,
      stream_name,
    }),
  });
}

export async function updatePassword(old_password: string, new_password: string) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/signin");
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      old_password,
      new_password,
    }),
  });
}

export async function follow(username: string) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/signin");
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/follow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function unfollow(username: string) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/signin");
  }

  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${username}/unfollow`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
