import Link from "next/link";

import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

import ProfileSection from "./_components/profile";
import ApiKeySection from "./_components/api-keys";

import { redirect } from "next/navigation";
import FileManager from "./_components/file-manager";

export default async function Dashboard({
    searchParams,
  }: {
    searchParams: Promise<{ view: string }>
  }) {

  const session = await auth()
  const { view } = await searchParams
  

  if(!session?.user) redirect("/")
  void api.file.getLatest.prefetch()

    function renderView(){
      switch (view) {
          case "profile":
              return <ProfileSection {...session?.user} />
          case "api_keys":
              return <ApiKeySection />
          case "file_manager":
            return <FileManager />
          default:
              return <ProfileSection {...session?.user} />
      }
    }

  return (
    <HydrateClient>
     <main className="flex min-h-screen flex-col bg-gradient-to-b from-pirrot-blue-900 items-center to-pirrot-blue-950 text-pirrot-blue-50 relative">
     <div id="modal-hook"></div>
        <div className="w-full max-w-screen-xl flex flex-col flex-wrap lg:flex-row gap-4 p-4 py-16 relative">
      
        <h2 className="text-[2rem] w-full uppercase lg:text-7xl font-black">UserDash</h2>
            <div className="w-full max-w-40 flex flex-col uppercase gap-2 text-xl">
                <Link className={view === "profile" || view === undefined ? "font-bold" : ""} href="?view=profile">profile</Link>
                <Link className={view === "api_keys" ? "font-bold" : ""} href="?view=api_keys">api keys</Link>
                <Link className={view === "file_manager" ? "font-bold" : ""} href="?view=file_manager">files</Link>
            
          </div>
           {renderView()}
        </div>
      </main>
    </HydrateClient>
  );
}
