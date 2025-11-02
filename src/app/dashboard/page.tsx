"use client";

import { SignOut } from "@/components/sign-out";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { IndianRupee } from "lucide-react";

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


    <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Earnings Card */}
      <Card className="bg-gradient-to-r from-green-100 to-green-50 shadow-sm">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-green-700">Total Earnings</CardTitle>
          <IndianRupee className="text-green-600" />
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-green-800">₹{12000}</p>
          <p className="text-sm text-muted-foreground">Updated this month</p>
        </CardContent>
      </Card>

      {/* User Info Card */}
      <Card className="shadow-sm">
        <CardHeader className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={"/aalogoc.png"} width={60} height={60} />
            <AvatarFallback>{"AU"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{session?.user?.name || "Unknown User"}</CardTitle>
            <p className="text-sm text-muted-foreground">Role: {"MLM Employee"}</p>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 pt-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Username</p>
            <p className="text-base">{session?.user?.username || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-base text-green-600 font-semibold">Active</p>
            <p className="text-base text-green-600 font-semibold">{session?.user.email}</p>
          </div>
        </CardContent>
      </Card>
    </main>

  );
}
