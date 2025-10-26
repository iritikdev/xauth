"use client";

import { SignOut } from "@/components/sign-out";
import { SidebarInset } from "@/components/ui/sidebar";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";



export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <p className="text-gray-600"> {JSON.stringify(session?.user)}</p>
        <SignOut />
      </div>
    </div>
    
  );
}
