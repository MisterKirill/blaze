import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  username: string;
  bio: string | null;
  display_name: string | null;
  stream: {
    name: string | null;
    url: string;
  } | null;
}

export interface Me {
  username: string;
  bio: string | null;
  display_name: string | null;
  stream_name: string | null;
  stream_key: string;
}

export interface SearchUser {
  username: string;
  display_name: string | null;
}

export interface Stream {
  name: string | null;
  ready_time: string;
  display_name: string | null;
  username: string;
  viewers_count: number;
}

async function fetchWithErrorHandler(url: string, params?: RequestInit) {
  const res = await fetch(url, params);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error);
  return data;
}

async function getTokenOrRedirect() {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  return token;
}

export async function getUser(username: string): Promise<User> {
  return fetchWithErrorHandler(`${API_URL}/users/${username}`);
}

export async function searchUsers(query: string): Promise<SearchUser[]> {
  return fetchWithErrorHandler(`${API_URL}/users?query=${encodeURIComponent(query)}`);
}

export async function getStreams(): Promise<Stream[]> {
  return fetchWithErrorHandler(`${API_URL}/streams`);
}

export async function login(email: string, password: string): Promise<{ token: string }> {
  return fetchWithErrorHandler(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  username: string,
  email: string,
  password: string
): Promise<{ token: string }> {
  return fetchWithErrorHandler(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
}

export async function updatePassword(old_password: string, new_password: string) {
  return fetchWithErrorHandler(`${API_URL}/me/password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: await getTokenOrRedirect() },
    body: JSON.stringify({ old_password, new_password }),
  });
}

export async function getMe(): Promise<Me> {
  return fetchWithErrorHandler(`${API_URL}/me`, {
    headers: { Authorization: await getTokenOrRedirect() },
  });
}
