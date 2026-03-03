"use client";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner"

const SignOut = () => {
  const handleSignOut = async () => {
    await signOut();
    toast.success("Logged out successfully");
  };

  return (
    <div>

      <Button variant="ghost" onClick={handleSignOut}>
        <LogOutIcon />
        Sign Out
      </Button>
    </div>
  );
};

export { SignOut };