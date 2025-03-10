import SearchUserCard from "./UserCard";
import { searchUsers, User } from "@/lib/api";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search results - Blaze",
};

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ query: string | undefined }>;
}) {
  const query = (await searchParams).query;
  if (!query) {
    return <span>No search query provided!</span>;
  }

  let users: User[] = [];
  let failed = false;

  try {
    const res = await searchUsers(query);
    users = res.users;
  } catch {
    failed = true;
  }

  if (failed) {
    return <span>Failed to search users. Please, try again in a few seconds.</span>;
  }

  return (
    <>
      <h1 className="font-bold text-4xl mb-4">Search results – {query}</h1>

      <div className="flex items-start flex-wrap gap-4 mb-12">
        {failed ? (
          <span>Failed to search users. Please, try again in a few seconds.</span>
        ) : users.length == 0 ? (
          <p>No users found!</p>
        ) : (
          users.map((user, i) => <SearchUserCard key={i} user={user} />)
        )}
      </div>
    </>
  );
}
