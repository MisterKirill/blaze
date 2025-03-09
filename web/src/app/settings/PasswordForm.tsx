"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { updatePassword } from "@/app/actions";

const defaultState = {
  error: "",
};

export default function PasswordForm() {
  const [state, formAction, pending] = useActionState(updatePassword, defaultState);

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
          placeholder="Your previous password"
          required
        />
      </div>

      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="new_password" className="font-semibold text-sm">
          New password
        </label>
        <Input
          type="password"
          name="new_password"
          id="new_password"
          placeholder="New password"
          required
        />
      </div>

      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="new_password_confirm" className="font-semibold text-sm">
          Confirm new password
        </label>
        <Input
          type="password"
          name="new_password_confirm"
          id="new_password_confirm"
          placeholder="Confirm new password"
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
