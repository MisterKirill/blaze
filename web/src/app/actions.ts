"use server";

import { signin, signup, updateMe, updatePassword } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function signInAction(prevState: unknown, formData: FormData) {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const res = await signin(data.email, data.password);
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

export async function signUpAction(prevState: unknown, formData: FormData) {
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

  const res = await signup(data.username, data.email, data.password);
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

export async function signOutAction() {
  (await cookies()).delete("token");
  redirect("/signin");
}

export async function updateProfileAction(prevState: unknown, formData: FormData) {
  const data = {
    bio: formData.get("bio") as string,
    display_name: formData.get("display_name") as string,
    stream_name: formData.get("stream_name") as string,
  };

  const res = await updateMe(undefined, data.bio, data.display_name, data.stream_name);

  if (res.status !== 200) {
    return {
      error: "Failed to update account",
    };
  }

  revalidatePath("/dashboard");

  return {
    error: "Account updated!",
  };
}

export async function updatePasswordAction(prevState: unknown, formData: FormData) {
  const data = {
    old_password: formData.get("old_password") as string,
    new_password: formData.get("new_password") as string,
    new_password_confirm: formData.get("new_password_confirm") as string,
  };

  if (data.new_password !== data.new_password_confirm) {
    return {
      error: "Passwords don't match!",
    };
  }

  const res = await updatePassword(data.old_password, data.new_password);

  if (res.status !== 200) {
    return {
      error: "Failed to update password",
    };
  }

  return {
    error: "Password updated successfully",
  };
}
