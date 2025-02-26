import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export type User = {
  username: string;
};

export async function getUser(): Promise<User | null> {
  const token = (await cookies()).get("token");
  if (!token) return null;
  return jwtDecode<User>(token.value);
}
