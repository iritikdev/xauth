"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    username: z
        .string()
        .length(12, "Username must be 12 characters.")
        .regex(
            /^[a-zA-Z0-9]+$/,
            "Username can only contain letters and numbers."
        ),
})

export default function page() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            console.log("Data", data)
            const res = await fetch(`/api/user/${data.username}`);
            console.log("Data", res)
            if (!res.ok) throw new Error("Failed to fetch sponsor");

            const result = await res.json();

            toast.success("Sponsor found!", {
                description: `Sponsor Name: ${result.name}`,
                position: "bottom-right",
            });
        } catch (err) {
            console.error("Error fetching sponsor:", err);
            toast.error("Unable to fetch sponsor. Please try again.");
        }
    }

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Sponsor Settings</CardTitle>
                <CardDescription>
                    Choose your Sponsor.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
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
                                        This is your public display name. Must be between 12
                                        characters. Must only contain letters, numbers.

                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Reset
                    </Button>
                    <Button type="submit" form="form-rhf-input">
                        Save
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}
