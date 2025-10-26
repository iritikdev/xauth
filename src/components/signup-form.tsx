'use client'

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { signUpSchema } from "@/lib/validations/signup"


type FormData = z.infer<typeof signUpSchema>

export function SignUpForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (form: FormData) => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage(
          `🎉 स्वागत है, ${data.name}!\n\n🆔 आपका उपयोगकर्ता नाम: ${data.username}\n\n✅ पंजीकरण सफल रहा! अब आप ऊपर दिए गए उपयोगकर्ता नाम से लॉगिन कर सकते हैं।`
        )
        toast.success("Registration successful! You can now log in.")
        reset()
        setSignupSuccess(true)
      } else {
        setMessage(data.message || "Registration failed.")
        toast.error(data.message || "Registration failed.")
      }
    } catch (err) {
      setMessage("Something went wrong. Please try again.")
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Create your Amaze Ayurveda Account
                </p>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Amit Singh" {...register("name")} />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="grid gap-3">
                <Label htmlFor="mobile">Mobile No</Label>
                <Input id="mobile" placeholder="9876543210" {...register("mobile")} maxLength={10}/>
                {errors.mobile && <p className="text-sm text-red-500">{errors.mobile.message}</p>}
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="ml-auto text-sm underline-offset-2 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" maxLength={8} placeholder="********" {...register("password")} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>

              {message && <div className="text-sm text-red-500 whitespace-pre-line">{message}</div>}

              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>

              <div className="text-center text-sm">
                Already have an account? <Link href="/sign-in">Log in</Link>
              </div>
            </div>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image
              width={50}
              height={50}
              src="/lgbg.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}