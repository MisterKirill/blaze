"use client";

import { useActionState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { register } from "@/app/actions";

export default function RegisterForm() {
  const [error, formAction, pending] = useActionState(register, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-2 my-6 max-w-[30rem] mx-auto">
      <Input type="text" name="username" placeholder="Username" minLength={3} maxLength={40} required />
      <Input type="email" name="email" placeholder="Email" required />
      <Input type="password" name="password" placeholder="Password" minLength={8} required />
      <Input type="password" name="confirm_password" placeholder="Confirm password" minLength={8} required />
      <Button type="submit" disabled={pending}>Submit</Button>
      {error && (
        <span className="bg-red-800 p-2 font-semibold rounded-lg text-sm mt-2">{error}</span>
      )}
    </form>
  );
}
