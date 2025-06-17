import CreateGroupButton from "@/components/create-group-button";
import GroupsTable from "@/components/groups-table";
import Navbar from "@/components/navbar";
import { SignedIn } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
            Group Meals Planner
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Plan, organize, and enjoy meals together with your group
          </p>
        </div>

        <div className="mx-auto flex max-w-4xl flex-col gap-8">
          <CreateGroupButton />

          <SignedIn>
            <GroupsTable />
          </SignedIn>
        </div>
      </div>
    </>
  );
}
