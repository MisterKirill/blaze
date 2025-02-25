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

export async function signUp(prevState: unknown, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  if (data.password !== data.confirm_password) {
    return {
      confirm_password: "Passwords don't match!",
    };
  }

  try {
    const res = await axios.post("/auth/register", data);
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
      };
    }
  }

  redirect("/");
}
