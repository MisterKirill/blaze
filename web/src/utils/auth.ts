import { cookies } from "next/headers";
import axios from "./axios";

type User = {
  username: string;
  display_name: string;
  stream_name: string;
  bio: string;
};

export async function getUser() {
  const token = (await cookies()).get("token");
  if (!token) return null;

  try {
    const res = await axios.get("/me");
    return res.data as User;
  } catch {
    return null;
  }
}
