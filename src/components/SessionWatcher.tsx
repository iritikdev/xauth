"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export default function SessionWatcher() {
  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    // Check every 10 seconds
    const interval = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      
      // Agar current time expiry time se zyada hai
      if (session.user.expiresAt && now > session.user.expiresAt) {
        signOut({ callbackUrl: "/sign-in" });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [session]);

  return null;
}