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

  const res = await searchUsers(query);
  const { users } = (await res.json()) as { users: User[] };

  if (res.status !== 200) {
    return <span>Failed to search users. Please, try again in a few seconds.</span>;
  }

  return (
    <>
      <h1 className="font-bold text-4xl mb-4">Search results – {query}</h1>

      <div className="flex items-start flex-wrap gap-4 mb-12">
        {users.length == 0 ? (
          <p>No users found!</p>
        ) : (
          users.map((user) => <SearchUserCard key={user.username} user={user} />)
        )}
      </div>
    </>
  );
}
