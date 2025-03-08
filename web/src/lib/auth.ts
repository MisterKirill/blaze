import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export async function getUsername() {
  const token = (await cookies()).get("token")?.value;
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.sub; 
  }
}
