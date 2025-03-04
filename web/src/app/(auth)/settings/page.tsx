import Button from "@/components/ui/Button";
import { Metadata } from "next";
import { signOut } from "../../actions";
import UpdatePasswordForm from "@/components/forms/UpdatePasswordForm";

export const metadata: Metadata = {
  title: "Settings - Blaze",
};

export default async function Settings() {
  return (
    <>
      <h2 className="mb-4 text-2xl font-bold">Update Password</h2>

      <UpdatePasswordForm />

      <h2 className="mb-4 text-2xl font-bold mt-6">Danger Zone</h2>

      <Button className="bg-red-500 hover:bg-red-600" onClick={signOut}>
        Sign out
      </Button>
    </>
  );
}
