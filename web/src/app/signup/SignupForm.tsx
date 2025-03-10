"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { signUpAction } from "@/app/actions";

const defaultState = {
  message: "",
};

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signUpAction, defaultState);

  return (
    <form action={formAction} className="max-w-[30rem] mx-auto">
      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="username" className="font-semibold text-sm">
          Username
        </label>
        <Input type="text" name="username" id="username" placeholder="coolguy" required />
      </div>

      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="email" className="font-semibold text-sm">
          Email
        </label>
        <Input type="email" name="email" id="email" placeholder="coolguy@gmail.com" required />
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

      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="confirm_password" className="font-semibold text-sm">
          Confirm password
        </label>
        <Input
          type="password"
          name="confirm_password"
          id="confirm_password"
          placeholder="strongpa$$word"
          minLength={8}
          required
        />
      </div>

      {state.message && <p className="font-semibold text-sm mb-4 text-left">{state.message}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        Submit
      </Button>
    </form>
  );
}
