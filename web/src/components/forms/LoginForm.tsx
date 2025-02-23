"use client";

import { useActionState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { login } from "@/app/actions";

export default function LoginForm() {
  const [error, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2 my-6 max-w-[30rem] mx-auto">
      <Input type="email" name="email" placeholder="Email" required />
      <Input type="password" name="password" placeholder="Password" minLength={8} required />
      <Button type="submit" disabled={pending}>Submit</Button>
      {error && (
        <span className="bg-red-800 p-2 font-semibold rounded-lg text-sm mt-2">{error}</span>
      )}
    </form>
  );
}
