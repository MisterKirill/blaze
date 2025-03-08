"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { signIn } from "@/app/actions";

const defaultState = {
  error: "",
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
      </div>

      {state.error && <p className="font-semibold text-sm mb-4 text-left">{state.error}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        Submit
      </Button>
    </form>
  );
}
