"use server";

import { login, register, updatePassword } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signIn(prevState: unknown, formData: FormData) {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  try {
    const { token } = await login(data.email, data.password);
    (await cookies()).set("token", token, {
      httpOnly: true,
      maxAge: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    });
  } catch (err) {
    if (err instanceof Error) {
      return { error: err.message };
    }
  }

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

  try {
    const { token } = await register(data.username, data.email, data.password);
    (await cookies()).set("token", token, {
      httpOnly: true,
      maxAge: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    });
  } catch {
    return {
      error: "Failed to register",
    };
  }

  redirect("/");
}

export async function signOut() {
  (await cookies()).delete("token");
  redirect("/signin");
}

export async function changePassword(prevState: unknown, formData: FormData) {
  const data = {
    old_password: formData.get("old_password") as string,
    new_password: formData.get("new_password") as string,
    new_password_confirm: formData.get("new_password_confirm") as string,
  };

  if (data.new_password !== data.new_password_confirm) {
    return {
      message: "Passwords don't match!",
    };
  }

  try {
    await updatePassword(data.old_password, data.new_password);
  } catch {
    return {
      message: "Failed to get response. Please, try again in a few seconds.",
    };
  }

  return {
    message: "Password updated successfully!",
  };
}
