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
      maxAge: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    });
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response) {
        return err.response.data;
      }

      return {
        password: "Failed to get response. Please, try again in a few seconds.",
      };
    } else {
      return {
        password: "Failed to get response. Please, try again in a few seconds.",
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
    password_confirm: formData.get("password_confirm"),
  };

  if (data.password !== data.password_confirm) {
    return {
      password_confirm: "Passwords don't match!",
    };
  }

  try {
    const res = await axios.post("/auth/register", data);
    (await cookies()).set("token", res.data.token, {
      httpOnly: true,
      maxAge: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
    });
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response) {
        return err.response.data;
      }

      return {
        password: "Failed to get response. Please, try again in a few seconds.",
      };
    } else {
      return {
        password: "Failed to get response. Please, try again in a few seconds.",
      };
    }
  }

  redirect("/");
}

export async function signOut() {
  (await cookies()).delete("token");
  redirect("/signin");
}

export async function changePassword(prevState: unknown, formData: FormData) {
  const data = {
    old_password: formData.get("old_password"),
    new_password: formData.get("new_password"),
    new_password_confirm: formData.get("new_password_confirm"),
  };

  if (data.new_password !== data.new_password_confirm) {
    return {
      new_password_confirm: "Passwords don't match!",
    };
  }

  console.log(data);

  try {
    await axios.patch("/me/password", data);
  } catch (err) {
    if (err instanceof AxiosError) {
      if (err.response) {
        return err.response.data;
      }

      return {
        new_password: "Failed to get response. Please, try again in a few seconds.",
      };
    } else {
      return {
        new_password: "Failed to get response. Please, try again in a few seconds.",
      };
    }
  }

  return {
    new_password: "Password updated successfully!",
  };
}
