import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, MapPin, Award } from "lucide-react";

/**
 * WelcomeCard
 * A reusable React component (Next.js + shadcn/ui + Tailwind) that renders
 * the welcome message you provided. It accepts a `user` prop but also
 * provides sensible defaults matching the original message.
 *
 * Usage:
 * <WelcomeCard user={user} />
 */

type User = {
  name: string;
  address: string;
  cityZip?: string;
  id: string | number;
  sponsorId?: string | number;
  company?: string;
  senderCompany?: string;
};

export default function WelcomeCard({
  user = {
    name: "Sudhanshu Kumar",
    address: "BISARPATTI RUPAULI - 843106",
    cityZip: "Muzaffarpur",
    id: "AMZ25100012356",
    sponsorId: "AMZ25100012357",
    company: "Amaze Ayurveda Pvt. Ltd.",
    senderCompany: "Amaze Ayurveda Pvt. Ltd.",
  },
}: {
  user?: User;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center  p-6">
      <Card className="w-full max-w-3xl">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14">
              <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">Welcome, {user.name} 🎉</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {user.company}
              </CardDescription>
            </div>
          </div>

          <div className="text-right">
            <div className="text-sm font-medium">Your ID: <span className="font-semibold">{user.id}</span></div>
            <div className="text-sm text-muted-foreground">Sponsor ID: {user.sponsorId}</div>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-4">
          <p className="leading-relaxed">
            Congratulations on your decision to join <strong>{user.company}</strong>. You are now a part of the <em>opportunity of the millennium</em>.
          </p>

          <p className="leading-relaxed">
            As you build your business, you'll form lifelong friendships and develop a support system unlike any other. You're in business for yourself, but <strong>not by yourself</strong>.
          </p>

          <p className="leading-relaxed">
            We offer a proven step-by-step plan to help you launch a profitable business. The bottom line: <strong>You are a SUCCESS.</strong>
          </p>

          <div className="rounded-md bg-slate-50 p-4 border">
            <h3 className="text-sm font-medium mb-2">Contact & Address</h3>
            <div className="flex flex-col sm:flex-row sm:items-start sm:gap-6">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" />
                <div>
                  <div className="font-medium">{user.address}</div>
                  <div className="text-muted-foreground text-xs">{user.cityZip}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm mt-3 sm:mt-0">
                <Mail className="w-4 h-4" />
                <div>
                  <div className="font-medium">ID: {user.id}</div>
                  <div className="text-muted-foreground text-xs">Sponsor ID: {user.sponsorId}</div>
                </div>
              </div>
            </div>
          </div>

          <p className="leading-relaxed">
            We are confident that you will gain great satisfaction from your involvement with <strong>{user.company}</strong>. We wish you every success!
          </p>

          <p className="text-sm font-medium">Keep it up! See you at the top!</p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5" />
            <div>
              <div className="text-sm">Winning Regards,</div>
              <div className="font-semibold">{user.senderCompany}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="ghost">View Dashboard</Button>
            <Button>Get Started</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
