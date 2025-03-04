import SearchUserCard from "@/components/SearchUserCard";
import { searchUsers } from "@/lib/users";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `Search results - Blaze`,
};

export default async function Search({
  searchParams,
}: {
  searchParams: Promise<{ query: string | undefined }>;
}) {
  const query = (await searchParams).query;

  if (!query) {
    return <h1 className="font-bold text-4xl mb-4">No query provided!</h1>;
  }

  const users = await searchUsers(query);

  if (!users) {
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
