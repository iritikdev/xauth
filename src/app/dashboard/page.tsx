"use client";

import DistributorProfile from "@/components/DistributorProfile";
import { SignOut } from "@/components/sign-out";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarInset } from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { IndianRupee } from "lucide-react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function Page() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter();


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${session?.user.username}`)
        if (!res.ok) throw new Error("Failed to fetch user")
        const data = await res.json()
        setUserData(data)
      } catch (err) {
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [session?.user.username])
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/sign-in");
    }
  }, [status, router]);

  if (status === "loading") return <Spinner />;




  if (loading || !userData) return <Spinner />


  return (


    <main className="container mx-auto px-4 py-6 space-y-6">
      <DistributorProfile />
      {/* Earnings Card */}
      {/* <Card className="bg-gradient-to-r from-green-100 to-green-50 shadow-sm">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="text-green-700">Total Earnings</CardTitle>
          <IndianRupee className="text-green-600" />
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold text-green-800">₹{"NIL"}</p>
          <p className="text-sm text-muted-foreground">Updated this month</p>
        </CardContent>
      </Card> */}

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

          {/* --------------------------------------- */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold">User Info</h2>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            {userData.sponsor && (
              <p><strong>Sponsor:</strong> {userData.sponsor.username} - {userData.sponsor.name}</p>
            )}
            {userData.downlines?.length > 0 && (
              <div>
                <strong>Downlines:</strong>
                <ul className="list-disc ml-6">
                  {userData.downlines.map((d: any) => (

                    <li key={d.id}>{d.username} | {d.name}</li>


                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* --------------------------------------- */}
        </CardContent>
      </Card>
    </main>

  );
}
