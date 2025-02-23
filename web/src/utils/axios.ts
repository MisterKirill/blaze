import axios from "axios";
import { cookies } from "next/headers";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

instance.interceptors.request.use(async (config) => {
  const token = (await cookies()).get("token");

  if (token) {
    config.headers.Authorization = "Bearer " + token.value;
  }

  return config;
});

export default instance;
