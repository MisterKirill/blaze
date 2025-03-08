"use server";

import { login, register } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(prevState: unknown, formData: FormData) {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const res = await login(data.email, data.password);
  const json = await res.json();

  if (res.status !== 200) {
    return { error: json.error };
  }

  (await cookies()).set("token", json.token, {
    httpOnly: true,
    maxAge: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  });

  redirect("/");
}

export async function signUp(prevState: unknown, formData: FormData) {
  const data = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    password_confirm: formData.get("password_confirm") as string,
  };

  if (data.password !== data.password_confirm) {
    return {
      error: "Passwords don't match!",
    };
  }

  const res = await register(data.username, data.email, data.password);
  const json = await res.json();

  if (res.status !== 200) {
    return { error: json.error };
  }

  (await cookies()).set("token", json.token, {
    httpOnly: true,
    maxAge: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  });

  redirect("/");
}

export async function signOut() {
  (await cookies()).delete("token");
  redirect("/signin");
}
