"use server";

import axios from "@/lib/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(prevState: unknown, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const res = await axios.post("/auth/login", data);
    (await cookies()).set("token", res.data.token, {
      httpOnly: true,
      expires: 60 * 60 * 24 * 30,
    });
  } catch (err) {
    if (err instanceof AxiosError) {
      return err.response?.data;
    } else {
      return {
        email: "Failed to authenticate!",
        password: "",
      };
    }
  }

  redirect("/");
}
