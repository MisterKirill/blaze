"use client";

import { useActionState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { updateProfileAction } from "@/app/actions";
import { AuthenticatedUser } from "@/lib/api";

const defaultState = {
  message: "",
};

export default function ProfileSettingsForm({ user }: { user: AuthenticatedUser }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, defaultState);

  return (
    <form action={formAction} className="max-w-[30rem]">
      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="stream_name" className="font-semibold text-sm">
          Stream name
        </label>
        <Input
          type="text"
          name="stream_name"
          id="stream_name"
          defaultValue={user.stream_name || ""}
          placeholder="The name of your stream"
        />
      </div>

      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="display_name" className="font-semibold text-sm">
          Display name
        </label>
        <Input
          type="text"
          name="display_name"
          id="display_name"
          defaultValue={user.display_name || ""}
          placeholder="Display name will be visible for everyone"
        />
      </div>

      <div className="flex flex-col gap-1 text-left mb-4">
        <label htmlFor="bio" className="font-semibold text-sm">
          Bio
        </label>
        <textarea
          name="bio"
          id="bio"
          defaultValue={user.bio || ""}
          placeholder="Tell your followers who you are"
          className="px-4 py-3 font-medium text-sm bg-slate-800 rounded-lg w-full outline-hidden focus:ring-2 ring-blue-600"
        />
      </div>

      {state.message && <p className="font-semibold text-sm mb-4 text-left">{state.message}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        Submit
      </Button>
    </form>
  );
}
