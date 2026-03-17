"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, User, Lock, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { loginSchema } from "@/lib/validations/login";
import Link from "next/link";
import { InputField } from "@/components/form/InputField";
import { cn } from "@/lib/utils";

type LoginFormValues = z.infer<typeof loginSchema>;

const SignInForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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
        redirect: false,
      });

      if (!res || res.error) {
        setError("Invalid Username or Password");
        toast.error("Invalid Username or Password");
        return;
      }

      toast.success("Login Successful!");
      setTimeout(() => {
        router.replace("/dashboard");
        router.refresh();
      }, 500);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

      {/* Username Field */}
      <InputField
        label="Associate ID / Username"
        // Icon pass ho raha hai
        icon={<User size={18} />} 
        error={errors.username?.message}
      >
        <input
          {...register("username")}
          placeholder="e.g. AMZ12345"
          type="text"
          autoComplete="username"
          disabled={isSubmitting}
          // pl-12 is important icon ke liye jagah chhodne ke liye
          className={cn(
            "w-full h-14 pl-12 pr-4 rounded-2xl bg-slate-50 border-2 border-transparent transition-all outline-none font-bold text-slate-900",
            "focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5",
            errors.username && "border-red-500/50 bg-red-50/50"
          )}
        />
      </InputField>

      {/* Password Field */}
      <InputField
        label="Security Password"
        // Icon pass ho raha hai
        icon={<Lock size={18} />} 
        error={errors.password?.message}
        // Right element (Eye toggle) InputField handle kar raha hai
        rightElement={
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-slate-400 hover:text-emerald-600 transition-colors p-1"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        }
        extra={
          <Link
            href="/forgot-password"
            className="text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            Forgot?
          </Link>
        }
      >
        <input
          {...register("password")}
          placeholder="••••••••"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          disabled={isSubmitting}
          // pr-12 is important toggle button ke liye jagah chhodne ke liye
          className={cn(
            "w-full h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border-2 border-transparent transition-all outline-none font-bold text-slate-900",
            "focus:bg-white focus:border-emerald-500/20 focus:ring-4 focus:ring-emerald-500/5",
            errors.password && "border-red-500/50 bg-red-50/50"
          )}
        />
      </InputField>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={18} className="shrink-0" />
          <span className="text-xs font-bold uppercase tracking-tight">{error}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full h-16 rounded-2xl bg-[#0f172a] hover:bg-emerald-600 text-white font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl active:scale-[0.98]"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Verifying...</span>
          </div>
        ) : (
          "Log In to Dashboard"
        )}
      </Button>
    </form>
  );
};

export default SignInForm;