"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Eye, EyeOff, Loader2, User, Lock, 
  AlertCircle, ChevronRight, ShieldCheck 
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Schema (In case it's not imported)
const loginSchema = z.object({
  username: z.string().min(3, "Associate ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const SignInForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      const res = await signIn("credentials", {
        username: data.username.trim(),
        password: data.password,
        redirectTo:"/dashboard",
        redirect: true,
      });

      // if (!res || res.error) {
      //   setError("Invalid Credentials. Please check your Associate ID.");
      //   toast.error("Access Denied", { description: "Invalid Username or Password" });
      //   return;
      // }

      toast.success("Welcome Back!", { description: "Redirecting to your dashboard..." });
      
      // setTimeout(() => {
      //   router.push("/dashboard");
      //   router.refresh();
      // }, 800);
    } catch (err) {
      setError("Server connection failed. Try again.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Username Field */}
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <div className="flex justify-between items-end px-1">
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Associate ID
                </FormLabel>
              </div>
              <FormControl>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <User size={18} strokeWidth={2.5} />
                  </div>
                  <Input
                    {...field}
                    placeholder="e.g. AMZ12345"
                    disabled={form.formState.isSubmitting}
                    className={cn(
                      "h-14 pl-12 rounded-2xl bg-slate-50 border-none font-bold text-slate-900 transition-all",
                      "focus-visible:ring-4 focus-visible:ring-emerald-500/10 focus-visible:bg-white",
                      form.formState.errors.username && "bg-red-50 ring-2 ring-red-100"
                    )}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[10px] font-bold uppercase tracking-tight px-1" />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <div className="flex justify-between items-end px-1">
                <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Security Password
                </FormLabel>
                <Link
                  href="/forgot-password"
                  className="text-[9px] font-black uppercase tracking-widest text-emerald-600 hover:text-slate-900 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <FormControl>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Lock size={18} strokeWidth={2.5} />
                  </div>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    disabled={form.formState.isSubmitting}
                    className={cn(
                      "h-14 pl-12 pr-12 rounded-2xl bg-slate-50 border-none font-bold text-slate-900 transition-all",
                      "focus-visible:ring-4 focus-visible:ring-emerald-500/10 focus-visible:bg-white",
                      form.formState.errors.password && "bg-red-50 ring-2 ring-red-100"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-[10px] font-bold uppercase tracking-tight px-1" />
            </FormItem>
          )}
        />

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span className="text-[10px] font-black uppercase tracking-tight">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className={cn(
            "w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl active:scale-[0.98]",
            "bg-slate-950 hover:bg-emerald-600 text-white"
          )}
        >
          {form.formState.isSubmitting ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verifying Identity...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Log In to Dashboard</span>
              <ChevronRight size={16} />
            </div>
          )}
        </Button>

        {/* Trust Footer */}
        <div className="pt-4 flex items-center justify-center gap-2 text-slate-400">
           <ShieldCheck size={14} className="text-emerald-500" />
           <span className="text-[9px] font-bold uppercase tracking-[0.1em]">Secure Swadeshi Access</span>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;