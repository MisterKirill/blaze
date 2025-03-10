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

  try {
    const res = await signin(data.email, data.password);

    (await cookies()).set("token", res.token, {
      httpOnly: true,
      maxAge: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    });
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message };
    }
  }

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
    return { message: "Passwords don't match!" };
  }

  try {
    const res = await signup(data.username, data.email, data.password);
  
    (await cookies()).set("token", res.token, {
      httpOnly: true,
      maxAge: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    });
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message };
    }
  }

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

  try {
    await updateMe(undefined, data.bio, data.display_name, data.stream_name);
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message };
    }
  }

  revalidatePath("/dashboard");
  return { message: "Account updated!" };
}

export async function updatePasswordAction(prevState: unknown, formData: FormData) {
  const data = {
    old_password: formData.get("old_password") as string,
    new_password: formData.get("new_password") as string,
    new_password_confirm: formData.get("new_password_confirm") as string,
  };

  if (data.new_password !== data.new_password_confirm) {
    return { message: "Passwords don't match!" };
  }

  try {
    await updatePassword(data.old_password, data.new_password);
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message };
    }
  }
  
  return { message: "Password updated successfully" };
}
