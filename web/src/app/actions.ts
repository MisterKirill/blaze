"use server";

import axios from "@/utils/axios";
import { AxiosError } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function register(prevState: unknown, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirm_password"),
    captcha: formData.get("h-captcha-response"),
  };

  if (data.password !== data.confirmPassword) {
    return "Passwords don't match!";
  }

  try {
    const res = await axios.post("/auth/register", data);
    const cookieStore = await cookies();
    cookieStore.set("token", res.data.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });
  } catch (err) {
    if (err instanceof AxiosError) {
      if (!err.response) {
        return "Failed to get a response!";
      }
  
      return err.response.data.error;
    }
  }

  redirect("/");
}

export async function login(prevState: unknown, formData: FormData) {
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const res = await axios.post("/auth/login", data);
    const cookieStore = await cookies();
    cookieStore.set("token", res.data.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 30,
    });
  } catch (err) {
    if (err instanceof AxiosError) {
      if (!err.response) {
        return "Failed to get a response!";
      }
  
      return err.response.data.error;
    }
  }

  redirect("/");
}
