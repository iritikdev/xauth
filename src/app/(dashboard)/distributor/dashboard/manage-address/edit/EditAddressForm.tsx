"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    Home as HomeIcon, Briefcase, Layers,
    ArrowLeft, Loader2, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { addressFormSchema, AddressFormValues } from "../add/address-schema";
import { usePincodeAutoFill } from "@/hooks/use-pincode-autofill";
import { updateExistingAddress } from "../add/address-action"; // 💡 सर्वर एक्शन इम्पोर्ट
import { baseDashboardUrl } from "@/lib/constants";
import { useRouter } from "next/navigation";

interface EditAddressProps {
    addressId: string;
    initialData: AddressFormValues & { isDefault: boolean }; // 💡 पुराना डेटा प्रोप्स में आएगा
}

export default function EditAddressForm({ addressId, initialData }: EditAddressProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const form = useForm<AddressFormValues & { isDefault: boolean }>({
        resolver: zodResolver(addressFormSchema),
        mode: "all",
        defaultValues: initialData, // 💡 पुराने डेटा को डिफ़ॉल्ट वैल्यू सेट किया गया
    });

    const { setValue, control, handleSubmit } = form;
    const pinCodeValue = useWatch({ control, name: "pinCode" });

    // Pincode background auto-fill engine
    const { isFetchingGeo } = usePincodeAutoFill({
        pincode: pinCodeValue,
        setValue,
    });

    const onSubmit = async (data: AddressFormValues) => {
        setIsSubmitting(true);

        try {
            const response = await updateExistingAddress(addressId, data);

            if (!response.success) {
                toast.error("Failed to update address", {
                    description:
                        response.error ?? "Something went wrong while updating your address.",
                });
                return;
            }

            toast.success("Address Updated", {
                description: "Your address has been updated successfully.",
            });

            router.push(`${baseDashboardUrl}/manage-address`);
            router.refresh();
        } catch (error) {
            console.error(error);

            toast.error("Update Failed", {
                description:
                    "Unable to update your address. Please check your connection and try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };




    return (
        <div className="w-full  bg-white  border border-zinc-200/60 p-5 sm:p-6 shadow-xl text-zinc-900 font-sans relative overflow-hidden select-none">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#e8a020] to-transparent pointer-events-none" />

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-zinc-100 pb-4 mb-5">
                <Button variant="ghost" size="sm" onClick={() => router.push(`${baseDashboardUrl}/manage-address`)} className="h-8 w-8 p-0 rounded-xl border border-zinc-100 bg-white">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-lg font-black tracking-tight">Edit Address Details</h1>
                    <p className="text-[11px] font-medium text-zinc-400">Modify your selected delivery destination node</p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Pincode Matrix Group */}
                    <div className="grid grid-cols-3 gap-3">
                        <FormField control={control} name="pinCode" render={({ field }) => (
                            <FormItem className="space-y-1 col-span-1">
                                <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                                    <span>Pincode *</span>
                                    {isFetchingGeo && <Loader2 className="h-3 w-3 animate-spin text-emerald-600" />}
                                </FormLabel>
                                <Input {...field} maxLength={6} placeholder="842001" className="h-12 rounded-xl bg-zinc-50 font-bold text-xs border-zinc-100 focus-visible:ring-emerald-500/10" />
                                <FormMessage className="text-[10px] font-bold text-rose-500" />
                            </FormItem>
                        )} />

                        <FormField control={control} name="state" render={({ field }) => (
                            <FormItem className="space-y-1 col-span-1">
                                <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">State</FormLabel>
                                <Input {...field} readOnly placeholder="State" className="h-12 rounded-xl bg-zinc-100/60 text-xs font-bold text-zinc-400 cursor-not-allowed border-zinc-100 select-none" />
                            </FormItem>
                        )} />

                        <FormField control={control} name="district" render={({ field }) => (
                            <FormItem className="space-y-1 col-span-1">
                                <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">District</FormLabel>
                                <Input {...field} readOnly placeholder="District" className="h-12 rounded-xl bg-zinc-100/60 text-xs font-bold text-zinc-400 cursor-not-allowed border-zinc-100 select-none" />
                            </FormItem>
                        )} />
                    </div>

                    {/* Address Line Textarea */}
                    <FormField control={control} name="addressLine" render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">House No. / Building / Locality *</FormLabel>
                            <textarea {...field} rows={2} placeholder="Flat number, Street details..." className="w-full rounded-xl border border-zinc-200/80 bg-zinc-50 p-3 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 text-zinc-800 resize-none select-text" />
                            <FormMessage className="text-[10px] font-bold text-rose-500" />
                        </FormItem>
                    )} />

                    {/* Address Type Chips */}
                    <FormField control={control} name="addressType" render={({ field }) => (
                        <FormItem className="space-y-1.5 select-none">
                            <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400 ml-0.5">Address Label</FormLabel>
                            <div className="grid grid-cols-3 gap-2 bg-zinc-100/80 p-1 rounded-xl">
                                {[
                                    { value: "HOME", label: "Home", icon: HomeIcon },
                                    { value: "WORK", label: "Work", icon: Briefcase },
                                    { value: "OTHER", label: "Other", icon: Layers }
                                ].map((type) => {
                                    const isChecked = field.value === type.value;
                                    return (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => field.onChange(type.value)}
                                            className={cn(
                                                "flex items-center justify-center py-2 rounded-lg gap-1.5 transition-all text-xs font-bold h-9",
                                                isChecked ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/30" : "text-zinc-400 hover:text-zinc-600"
                                            )}
                                        >
                                            <type.icon className={cn("h-3.5 w-3.5", isChecked ? "text-emerald-500" : "")} />
                                            <span className="text-[10px] tracking-wide uppercase">{type.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </FormItem>
                    )} />
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={control}
                            name="receiverName"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                        Receiver Name <span className="text-rose-500">*</span>
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        placeholder="Enter receiver's name"
                                        className="h-12 rounded-xl bg-white text-sm font-medium border-zinc-200 focus-visible:ring-emerald-500/20"
                                    />
                                    <FormMessage className="text-[10px] font-bold text-rose-500" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name="receiverMobile"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                                        Mobile Number <span className="text-rose-500">*</span>
                                    </FormLabel>
                                    <Input
                                        {...field}
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        placeholder="9876543210"
                                        className="h-12 rounded-xl bg-white text-sm font-medium border-zinc-200 focus-visible:ring-emerald-500/20"
                                        onChange={(e) =>
                                            field.onChange(e.target.value.replace(/\D/g, "").slice(0, 10))
                                        }
                                    />
                                    <FormMessage className="text-[10px] font-bold text-rose-500" />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* Set As Default Option */}
                    <FormField control={control} name="isDefault" render={({ field }) => (
                        <FormItem className="flex items-center gap-3 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/30 p-3 select-none">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5 border-zinc-300 data-[state=checked]:bg-zinc-950 data-[state=checked]:border-zinc-950 rounded-md h-4 w-4" />
                            </FormControl>
                            <Label className="text-[11px] font-bold text-zinc-700 cursor-pointer">Set this as my preferred / default delivery address</Label>
                        </FormItem>
                    )} />

                    {/* Submit Action */}
                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 rounded-xl font-black uppercase tracking-wider text-xs transition-all shadow-md bg-zinc-950 hover:bg-zinc-800 text-white min-h-[48px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                                    Updating Ledger...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="h-4 w-4 stroke-[2.5] mr-1.5" />
                                    Update Address Vector
                                </>
                            )}
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
}