"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";

const SignInForm = () => {
  const handleCredentialAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    await signIn("credentials", { email, password });
  };

  return (
    <form
      className="space-y-4"
      action={handleCredentialAction}
      // action={async (formData: FormData) => {
      //   "use server";
      //   await executeAction({
      //     actionFn: async () => {
      //       await signIn("credentials", formData);
      //     },
      //   });
      // }}
    >
      <Input
        name="email"
        placeholder="Email"
        type="email"
        required
        autoComplete="email"
      />
      <Input
        name="password"
        placeholder="Password"
        type="password"
        required
        autoComplete="current-password"
      />
      <Button className="w-full" type="submit">
        Sign In
      </Button>
    </form>
  );
};

export default SignInForm;
