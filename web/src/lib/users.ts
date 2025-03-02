import axios from "@/lib/axios";

export interface SearchUser {
  username: string;
  display_name: string;
}

export async function searchUsers(query: string) {
  try {
    const res = await axios.get("/search", {
      params: { query },
    });

    return res.data.users as SearchUser[];
  } catch {
    return null;
  }
}
