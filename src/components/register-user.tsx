"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { kycSchema } from "@/lib/validations/register-user"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Spinner } from "./ui/spinner"

type KYCFormData = z.infer<typeof kycSchema>

export default function KYCForm() {
    const { data: session, status } = useSession()
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState<Partial<KYCFormData> | null>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<KYCFormData>({
        resolver: zodResolver(kycSchema),
        defaultValues: {
            name: "",
            mobile: "",
            email: "",
        },
    })

    const username = (session?.user as any)?.username

    useEffect(() => {
        const fetchUser = async () => {
            if (status === "authenticated" && username) {
                try {
                    const res = await fetch(`/api/user/${username}`)
                    if (!res.ok) throw new Error("Failed to fetch user")
                    const data = await res.json()
                    setUserData(data)
                } catch (err) {
                    console.error("Error fetching user:", err)
                }
            }
        }

        fetchUser()
    }, [status, username])

    useEffect(() => {
        if (userData) {
            reset({
                name: userData.name ?? "",
                mobile: userData.mobile ?? "",
                email: userData.email ?? "",
                fatherName: userData.fatherName ?? "",
                motherName: userData.motherName ?? "",
                address: userData.address ?? "",
                district: userData.district ?? "",
                state: userData.state ?? "",
                pincode: userData.pincode ?? "",
                accountNo: userData.accountNo ?? "",
                ifsc: userData.ifsc ?? "",
                branch: userData.branch ?? "",
                panNumber: userData.panNumber ?? "",
                aadharNo: userData.aadharNo ?? ""
            })
        }
    }, [userData, reset])


    const onSubmit = async (data: KYCFormData) => {
        setLoading(true)
        const username = (session?.user as any)?.username
        if (!username) return

        try {
            const res = await fetch(`/api/user/${username}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await res.json()
            if (!res.ok) throw new Error(result.error || "Submission failed")

            toast.success("🎉 Success! Your profile has been refreshed.")
            toast.success("🚀 Profile updated — you're good to go!")
        } catch (err) {
            console.error("Error submitting KYC:", err)
            toast.error("Something went wrong while submitting KYC. Please retry in a moment.");
        } finally {
            setLoading(false)
        }
    }

    if (!userData) return <Spinner />

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-4xl ">
            {[
                { label: "Name", name: "name", disabled: true },
                { label: "Father's Name", name: "fatherName" },
                { label: "Mother's Name", name: "motherName" },
                { label: "Address", name: "address" },
                { label: "District", name: "district" },
                { label: "State", name: "state" },
                { label: "Pin Code", name: "pincode" },
                { label: "Mobile No.", name: "mobile", disabled: true },
                { label: "Email", name: "email" },
                { label: "Account Number", name: "accountNo" },
                { label: "IFSC Code", name: "ifsc" },
                { label: "Branch", name: "branch" },
                { label: "PAN Card Number", name: "panNumber" },
                { label: "Aadhaar No.", name: "aadharNo" },
            ].map(({ label, name, disabled }) => (
                <div key={name}>
                    <Label className="mb-2">{label}</Label>
                    <Input {...register(name as keyof KYCFormData)} disabled={disabled} />
                    {errors[name as keyof KYCFormData] && (
                        <p className="text-red-500 text-sm mt-1">
                            {errors[name as keyof KYCFormData]?.message}
                        </p>
                    )}
                </div>
            ))}

            <Button type="submit" className="mt-4">
                {loading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Submitting..." : "Submit"}


            </Button>
        </form>
    )
}