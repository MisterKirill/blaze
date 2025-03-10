import Button from "@/components/ui/Button";
import { Metadata } from "next";
import { signOutAction } from "../actions";
import StreamKey from "./StreamKey";
import { AuthenticatedUser, getMe } from "@/lib/api";
import ProfileSettingsForm from "./ProfileSettingsForm";
import PasswordForm from "./PasswordForm";

export const metadata: Metadata = {
  title: "Settings - Blaze",
};

export default async function Settings() {
  let me!: AuthenticatedUser;
  let failed = false;

  try {
    me = await getMe();
  } catch {
    failed = true;
  }

  return failed ? (
    <span>Failed to get data. Please, try again in a few seconds.</span>
  ) : (
    <>
      <h2 className="mb-4 text-2xl font-bold">Stream Key</h2>
      <p className="font-bold bg-red-400 w-fit p-3 rounded-lg mb-6">
        Don&apos;t share your stream key with anyone you don&apos;t trust!
      </p>
      <StreamKey streamKey={me.stream_key} />

      <h2 className="mb-4 text-2xl font-bold mt-8">Profile settings</h2>
      <ProfileSettingsForm user={me} />

      <h2 className="mb-4 text-2xl font-bold mt-8">Update password</h2>
      <PasswordForm />

      <h2 className="mb-4 text-2xl font-bold mt-8">Danger Zone</h2>
      <Button className="bg-red-500 hover:bg-red-600" onClick={signOutAction}>
        Sign out
      </Button>
    </>
  );
}
