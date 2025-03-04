"use client";

import { useActionState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import { changePassword } from "@/app/actions";

const defaultState = {
  old_password: "",
  new_password: "",
  new_password_confirm: "",
};

export default function UpdatePasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, defaultState);

  return (
    <form action={formAction} className="max-w-[30rem]">
      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="old_password" className="font-semibold text-sm">
          Old password
        </label>
        <Input
          type="password"
          name="old_password"
          id="old_password"
          placeholder="oldpa$$word"
          minLength={8}
          required
        />
        {state.old_password && (
          <span className="font-semibold text-sm">{state.old_password}</span>
        )}
      </div>

      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="new_password" className="font-semibold text-sm">
          New password
        </label>
        <Input
          type="password"
          name="new_password"
          id="new_password"
          placeholder="strongnewpa$$word"
          minLength={8}
          required
        />
        {state.new_password && (
          <span className="font-semibold text-sm">{state.new_password}</span>
        )}
      </div>

      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="new_password_confirm" className="font-semibold text-sm">
          Confirm new password
        </label>
        <Input
          type="password"
          name="new_password_confirm"
          id="new_password_confirm"
          placeholder="strongnewpa$$word"
          minLength={8}
          required
        />
        {state.new_password_confirm && (
          <span className="font-semibold text-sm">{state.new_password_confirm}</span>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        Update
      </Button>
    </form>
  );
}
