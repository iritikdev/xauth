'use client'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { FieldGroup, Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// or use your preferred dialog/modal component
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm, useWatch, Controller } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { useSession } from "next-auth/react"


const formSchema = z.object({ username: z.string().length(12, "Username must be 12 characters.").regex(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers."), })


export default function Page() {
    const { data: session } = useSession()
    const currentUsername = session?.user?.username

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    const username = useWatch({ control: form.control, name: "username" })
    const [sponsorInfo, setSponsorInfo] = useState<{ name: string; mobile: string } | null>(null)
    const [showConfirm, setShowConfirm] = useState(false)

    // new


    useEffect(() => {
        const fetchSponsor = async () => {
            try {
                const isValid = formSchema.safeParse({ username })
                if (!isValid.success) return

                const res = await fetch(`/api/user/${username}`)
                if (!res.ok) throw new Error("Failed to fetch sponsor")

                const result = await res.json()
                setSponsorInfo({ name: result.name, mobile: result.mobile })

                toast.success("Sponsor found!", {
                    description: `Name: ${result.name}, Mobile: ${result.mobile}`,
                    position: "bottom-right",
                })
            } catch (err) {
                console.error("Error fetching sponsor:", err)
                toast.error("Unable to fetch sponsor. Please try again.")
            }
        }

        if (username.length !== 12) {
            setSponsorInfo(null)
        } else {
            fetchSponsor()
        }
    }, [username])

    const handleSave = () => {
        if (sponsorInfo) {
            setShowConfirm(true)
        } else {
            toast.error("Please enter a valid sponsor username.")
        }
    }

    const confirmSponsor = async () => {
        try {
            const res = await fetch("/api/user/set-sponsor", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sponsorUsername: username, currentUsername: currentUsername,
                }),
            })

            if (!res.ok) throw new Error("Failed to set sponsor")

            toast.success("Sponsor set successfully!", {
                description: `${sponsorInfo?.name} is now your sponsor.`,
                position: "bottom-right",
            })
            setShowConfirm(false)
            form.reset()
            setSponsorInfo(null)
        } catch (err) {
            console.error("Error setting sponsor:", err)
            toast.error("Failed to set sponsor. Please try again.")
        }
    }

    return (
        <>
            <Card className="w-full sm:max-w-md">
                <CardHeader>
                    <CardTitle>Sponsor Settings</CardTitle>
                    <CardDescription>Choose your Sponsor.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="form-rhf-input" onSubmit={form.handleSubmit(() => { })}>
                        <FieldGroup>
                            <Controller
                                name="username"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-rhf-input-username">
                                            Username
                                        </FieldLabel>
                                        <Input
                                            {...field}
                                            id="form-rhf-input-username"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="AMZ251000008"
                                            autoComplete="username"
                                        />
                                        <FieldDescription>
                                            Must be 12 characters. Letters and numbers only.
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                        {sponsorInfo && (
                                            <div className="mt-4 text-sm text-green-700 space-y-1">
                                                <p><strong>Sponsor's Name:</strong> {sponsorInfo.name}</p>
                                                <p><strong>Sponsor's Mobile:</strong> {sponsorInfo.mobile}</p>
                                            </div>
                                        )}
                                    </Field>
                                )}
                            />
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal">
                        <Button type="button" variant="outline" onClick={() => {
                            form.reset()
                            setSponsorInfo(null)
                        }}>
                            Reset
                        </Button>
                        <Button type="button" onClick={handleSave}>
                            Save
                        </Button>
                    </Field>
                </CardFooter>
            </Card>


            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogTrigger asChild>
                    {/* You can trigger this with a hidden button or keep it controlled via state */}
                    <span />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Sponsor</AlertDialogTitle>
                        <AlertDialogDescription>
                            Do you want <strong>{sponsorInfo?.name}</strong> as your sponsor?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowConfirm(false)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmSponsor}>
                            Yes, Confirm
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>


        </>
    )
}