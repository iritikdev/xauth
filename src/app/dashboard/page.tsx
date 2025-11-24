"use client";

;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Spinner } from "@/components/ui/spinner";
import { formatDateTime } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";


import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


import { Badge } from "@/components/ui/badge";



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


    <main className="container mx-auto px-4 py-2 space-y-6">
      <Card className="rounded-2xl shadow-xl bg-gradient-to-r backdrop-blur-lg border border-white/20 bg-[#82d3491a]">
        <CardHeader className="flex items-center gap-6">
          <Avatar className="h-20 w-20 ring-2 ring-white/40">
            <AvatarImage src={"/aalogoc.png"} width={80} height={80} />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-bold text-black drop-shadow-md">
              {session?.user?.name || "Unknown User"}
            </CardTitle>
            <p className="text-sm text-black/80">Role: MLM Employee</p>
            <p className="text-sm text-green-300 font-semibold">
              Status: Active
            </p>
            <p className="text-sm text-black/90">{session?.user?.email}</p>
          </div>
        </CardHeader>

        <Separator className="my-6 bg-bltext-black/30" />

        <CardContent className="grid grid-cols-1 gap-6 text-black/90">

          <h2 className="text-xl font-semibold text-black">Distributor Details</h2>
          <Table>

            <TableBody className="text-black/90">
              <TableRow>
                <TableCell className="font-medium">UserId</TableCell>
                <TableCell>{userData.username}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Name</TableCell>
                <TableCell>{userData.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Email</TableCell>
                <TableCell>{userData.email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Joining Date</TableCell>
                <TableCell>{formatDateTime(userData.createdAt)}</TableCell>
              </TableRow>
              {userData.sponsor && (
                <TableRow>
                  <TableCell className="font-medium">Sponsor</TableCell>
                  <TableCell>
                    {userData.sponsor.username} - {userData.sponsor.name}
                  </TableCell>
                </TableRow>
              )}
              {userData.downlines?.length > 0 && (
                <TableRow>
                  <TableCell className="font-medium">Downlines</TableCell>
                  <TableCell>
                    <ul className="list-disc ml-6">
                      {userData.downlines.map((d: any) => (
                        <li key={d.id}>{d.username} | {d.name}</li>
                      ))}
                    </ul>
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell className="font-medium">PAN Number</TableCell>
                <TableCell>{userData.panNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Team</TableCell>
                <TableCell>NIL</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Active Team</TableCell>
                <TableCell>NIL</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Monthly Self BV</TableCell>
                <TableCell>NIL</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Weekly Self BV</TableCell>
                <TableCell>NIL</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Weekly Group BV</TableCell>
                <TableCell>NIL</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Total Payout</TableCell>
                <TableCell>₹NIL</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Weekly Payout</TableCell>
                <TableCell>₹NIL</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Rank</TableCell>
                <TableCell>0</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Rank Target</TableCell>
                <TableCell>NIL</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Upcoming Rank</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-white/20 text-black border-white/40">
                    Star
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>



        </CardContent>
      </Card>
    </main>

  );
}
