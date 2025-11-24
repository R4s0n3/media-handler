import Link from "next/link";

import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard")
  }

  return (
    <HydrateClient>
     <main className="flex min-h-screen flex-col bg-gradient-to-b from-pirrot-blue-900 items-center to-pirrot-blue-950 relative">
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="text-center text-2xl text-white">
                {session && <span>Logged in as {session.user?.name}</span>}
              </p>
              <Link
                href={session ? "/api/auth/signout" : "/api/auth/signin"}
                className="rounded-full bg-pirrot-blue-50/10 px-10 py-3 font-semibold no-underline transition hover:bg-pirrot-blue-50/20"
              >
                {session ? "Sign out" : "Sign in"}
              </Link>
            </div>
      </main>
    </HydrateClient>
  );
}
