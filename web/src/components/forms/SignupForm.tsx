"use client";

import { useActionState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { signUp } from "@/app/actions";

const defaultState = {
  username: "",
  email: "",
  password: "",
  password_confirm: "",
};

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, defaultState);

  return (
    <form action={formAction} className="max-w-[30rem] mx-auto">
      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="username" className="font-semibold text-sm">
          Username
        </label>
        <Input type="text" name="username" id="username" placeholder="coolguy" required />
        {state.username && (
          <span className="font-semibold text-sm">{state.username}</span>
        )}
      </div>

      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="email" className="font-semibold text-sm">
          Email
        </label>
        <Input type="email" name="email" id="email" placeholder="coolguy@gmail.com" required />
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
        {state.password_confirm && (
          <span className="font-semibold text-sm">{state.password_confirm}</span>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        Submit
      </Button>
    </form>
  );
}
