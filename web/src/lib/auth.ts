import axios from "./axios";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export type User = {
  username: string;
};

export type UserData = {
  username: string;
  bio: string | null;
  display_name: string | null;
  stream_name: string | null;
  stream_key: string;
};

export async function getUser(): Promise<User | null> {
  const token = (await cookies()).get("token");
  if (!token) return null;
  return jwtDecode<User>(token.value);
}

export async function getUserData(): Promise<UserData | null> {
  const user = await getUser();
  
  if (!user) {
    throw Error("User isn't authenticated");
  }

  try {
    const res = await axios.get("/me");
    return res.data as UserData;
  } catch {
    return null;
  }
}
