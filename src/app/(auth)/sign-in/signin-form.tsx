"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, User, Lock } from "lucide-react"; // Added Icons

import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/validations/login";
import { cn } from "@/lib/utils";
import Link from "next/link";

type LoginFormValues = z.infer<typeof loginSchema>;

const SignInForm = () => {
  const session = useSession()
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // Password Toggle State

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });



  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    
    try {
      const res = await signIn("credentials", {
        username: data.username.trim(),
        password: data.password,
        redirect: false, // We handle this manually
      });

      if (res?.error) {
        setError("Invalid Associate Credentials");
        toast.error("Invalid Username or Password");
        return;
      }

      toast.success("Welcome to Amaze Ayurveda!");

      if (res?.ok) {
  setTimeout(async () => {
    const sessionRes = await fetch("/api/auth/session");
    const session = await sessionRes.json();

    if (session?.user?.role === "ADMIN") {
      router.replace("/admin");
    } else {
      router.replace("/dashboard");
    }
  }, 500);
}


      // 2. Logic-based Redirect

    } catch (err) {
      setError("An unexpected error occurred during sign-in.");
      console.error(err);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      {/* Username Field */}
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
          Associate ID / Username
        </label>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
            <User size={18} />
          </div>
          <input
            {...register("username")}
            placeholder="e.g. AMZ12345"
            type="text"
            autoComplete="username"
            className={cn(
              "w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-transparent transition-all outline-none font-bold text-slate-900",
              "focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5",
              errors.username && "border-red-500/50 bg-red-50/50"
            )}
          />
        </div>
        {errors.username && (
          <p className="text-[10px] font-bold text-red-500 ml-2 uppercase tracking-wide">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <div className="flex justify-between items-end px-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Security Password
          </label>
          <button type="button" className="text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:underline">
             <Link href="/forgot-password">Forgot?</Link>
          </button>
        </div>
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
            <Lock size={18} />
          </div>
          <input
            {...register("password")}
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            className={cn(
              "w-full h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border-2 border-transparent transition-all outline-none font-bold text-slate-900",
              "focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5",
              errors.password && "border-red-500/50 bg-red-50/50"
            )}
          />
          {/* Toggle Visibility Button */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors p-1"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-[10px] font-bold text-red-500 ml-2 uppercase tracking-wide">
            {errors.password.message}
          </p>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 animate-shake">
          <span className="text-[11px] font-bold uppercase tracking-tight">{error}</span>
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full h-16 rounded-2xl bg-[#0f172a] hover:bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl shadow-slate-200 active:scale-[0.98]" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Log In to Dashboard"
        )}
      </Button>
    </form>
  );
};

export default SignInForm;