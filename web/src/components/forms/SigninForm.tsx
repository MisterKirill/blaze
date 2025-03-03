"use client";

import { useActionState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { signIn } from "@/app/actions";

const defaultState = {
  email: "",
  password: "",
};

export default function SigninForm() {
  const [state, formAction, pending] = useActionState(signIn, defaultState);

  return (
    <form action={formAction} className="max-w-[30rem] mx-auto">
      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="email" className="font-semibold text-sm">
          Email
        </label>
        <Input type="email" name="email" id="email" placeholder="johndoe@gmail.com" required />
        {state.email && <span className="font-semibold text-sm">{state.email}</span>}
      </div>

      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="password" className="font-semibold text-sm">
          Password
        </label>
        <Input
          type="password"
          name="password"
          id="password"
          placeholder="strongpa$$word"
          minLength={8}
          required
        />
        {state.password && (
          <span className="font-semibold text-sm">{state.password}</span>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        Submit
      </Button>
    </form>
  );
}
