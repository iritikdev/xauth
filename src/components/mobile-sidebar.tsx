"use client";

import { X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function MobileSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="left" className="w-64 p-6">
        <SheetHeader>
          <SheetTitle className="flex justify-between items-center"></SheetTitle>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <Input placeholder="Search..." />
          <Link href="/sign-in">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/sign-up">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
