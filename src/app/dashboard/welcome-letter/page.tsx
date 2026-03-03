<<<<<<< HEAD
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
=======
// components/WelcomeLetter.tsx
'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useSession } from 'next-auth/react';

const WelcomeLetter = () => {
    const contentRef = useRef<HTMLDivElement>(null);
    const { data: session, status } = useSession()

    const handlePrint = useReactToPrint({ contentRef });

    return (
        <Card className="max-w-3xl mx-auto mt-10 p-6 shadow-lg bg-white rounded-lg">
            <CardHeader>
                <h1 className="text-2xl font-bold text-center text-green-700">Welcome Letter</h1>
            </CardHeader>
            <CardContent ref={contentRef}>
                <p className="mb-4">
                    <strong>To,</strong><br />
                    {session?.user.name}<br />
                    {"address..."}
                    <br />

                </p>

                <h2 className="text-xl font-semibold mb-2 text-green-600">Welcome {session?.user.name}!</h2>

                <p className="mb-4">
                    Congratulations on your decision to join <strong>Amaze Ayurveda Pvt. Ltd.</strong> — a vibrant and visionary platform dedicated to transforming lives through holistic wellness and entrepreneurial empowerment.
                </p>

                <p className="mb-4">
                    You are now part of a once-in-a-lifetime opportunity. Amaze Ayurveda is more than a business — it’s a movement built on trust, community, and the power of natural healing. As you embark on this journey, you’ll forge lasting friendships and become part of a support system that’s unmatched in any other industry.
                </p>

                <p className="mb-4">
                    This is your business — but you’re never alone. We’ve crafted a proven, step-by-step roadmap to help you build a thriving enterprise tailored to your lifestyle and personal goals. Whether you commit part-time or full-time, the rewards are immense for those who invest their energy and passion into building a strong foundation.
                </p>

                <p className="mb-4">
                    At Amaze Ayurveda Pvt. Ltd., our mission is simple: <strong>to inspire success and well-being in every life we touch.</strong> We believe in spreading positivity, purpose, and prosperity — and you are now a key part of that mission.
                </p>

                <div className="bg-gray-100 p-4 rounded-md mb-4">
                    <p><strong>Your ID:</strong> {session?.user.username}</p>
                    <p><strong>Name:</strong> {session?.user.name}</p>
                    <p><strong>Sponsor ID:</strong> </p>
                </div>

                <p className="mb-4">
                    We’re confident that your journey with Amaze Ayurveda Pvt. Ltd. will be deeply fulfilling. You’ve taken the first step toward a future filled with growth, impact, and success.
                </p>

                <p className="font-semibold">
                    Keep striving. Keep shining. See you at the top!
                </p>

                <p className="mt-6">
                    <strong>Warm regards,</strong><br />
                    Amaze Ayurveda Pvt. Ltd.
                </p>
            </CardContent>

            <div className="text-center mt-6">
                <Button onClick={handlePrint}>Download as PDF</Button>
            </div>
        </Card>

    );
};

export default WelcomeLetter;
>>>>>>> 52d82472271f0f53f5919ae5b028d724f38db1d7
