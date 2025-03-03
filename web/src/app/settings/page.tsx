import Button from "@/components/ui/Button";
import { Metadata } from "next";
import { signOut } from "../actions";
import ChangePasswordForm from "@/components/forms/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Settings - Blaze",
};

export default function Settings() {
  return (
    <>
      <h2 className="mb-4 text-2xl font-bold">Update Password</h2>

      <ChangePasswordForm />

      <h2 className="mb-4 text-2xl font-bold mt-6">Danger Zone</h2>

      <Button className="bg-red-500 hover:bg-red-600" onClick={signOut}>
        Sign out
      </Button>
    </>
  );
}
