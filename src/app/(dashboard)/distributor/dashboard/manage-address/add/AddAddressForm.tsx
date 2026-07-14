"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    MapPin, Navigation, Home as HomeIcon, Briefcase,
    Layers, ArrowLeft, Loader2, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { addressFormSchema, AddressFormValues } from "./address-schema";
import { usePincodeAutoFill } from "@/hooks/use-pincode-autofill";
import { saveUserAddress } from "./address-action";
import { Checkbox } from "@/components/ui/checkbox";
import { baseDashboardUrl } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { BackButton } from "@/components/dashboard/BackButton";

interface AddAddressProps {
    onBack?: () => void;
    onSuccess?: () => void; // 💡 प्रोप नेम्स को सिंक किया गया
}

export default function AddAddressForm({ onBack, onSuccess }: AddAddressProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLocatingUser, setIsLocatingGeo] = useState(false);
    const router = useRouter();

    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressFormSchema),
        mode: "all",
        defaultValues: {
            receiverName: "",
            receiverMobile: "",
            addressLine: "",
            pinCode: "",
            state: "",
            district: "",
            landmark: "",
            addressType: "HOME",
            isDefault: false,

        },
    });

    const { setValue, control, handleSubmit } = form;

    // Live fields watcher tracking pipeline
    const pinCodeValue = useWatch({ control, name: "pinCode" });

    // Pincode background auto-fill engine core mapping
    const { isFetchingGeo } = usePincodeAutoFill({
        pincode: pinCodeValue,
        setValue,
    });

    // GPS / Geolocation native hardware trigger
    const handleGPSLocationAutofill = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser software.");
            return;
        }

        // 💡 BUG FIX: 'setIsFetchingGeo' की जगह सही स्टेट 'setIsLocatingGeo' सेट की गई
        setIsLocatingGeo(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                // Simulating reverse-geocoding resolution pipeline
                setTimeout(() => {
                    setValue("addressLine", "Amaze Hub Operational Zone, Muzaffarpur", { shouldValidate: true });
                    setValue("pinCode", "842001", { shouldValidate: true });
                    setValue("state", "Bihar", { shouldValidate: true });
                    setValue("district", "Muzaffarpur", { shouldValidate: true });
                    setIsLocatingGeo(false);
                    toast.success("Current location synchronized successfully.");
                }, 1200);
            },
            () => {
                setIsLocatingGeo(false);
                toast.error("Location access denied by device permissions configuration.");
            }
        );
    };

    const onSubmit = async (data: AddressFormValues) => {
  setIsSubmitting(true);
  try {
    // 💡 सर्वर एक्शन ट्रिगर
    const response = await saveUserAddress(data);
    
    if (response.success) {
      toast.success("Address Saved Successfully");
      if (onSuccess) onSuccess();
      router.push(`${baseDashboardUrl}/manage-address`);
    } else {
      toast.error(response.error || "Failed to save address details.");
    }
  } catch (err) {
    toast.error("Network error executing data mutation.");
  } finally {
    setIsSubmitting(false);
  }
};

    return (
        <div className="w-full relative overflow-hidden select-none space-y-4">


            <BackButton label="Add New Address"/>

            <Form {...form} >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    {/* Quick GPS Location Autofill CTA */}
                    {/* <Button
                        type="button"
                        variant="outline"
                        disabled={isLocatingUser}
                        onClick={handleGPSLocationAutofill}
                        className="w-full h-12 rounded-xl border border-emerald-100 bg-emerald-50/30 hover:bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                    >
                        {isLocatingUser ? (
                            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                        ) : (
                            <Navigation className="h-4 w-4 text-emerald-600 stroke-[2.5]" />
                        )}
                        Use Current Location via GPS
                    </Button> */}

                    {/* <div className="flex items-center gap-3 select-none pointer-events-none my-1">
                        <div className="h-px flex-1 bg-zinc-100" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-300">Or enter manually</span>
                        <div className="h-px flex-1 bg-zinc-100" />
                    </div> */}

                    {/* Pincode Input Block Layer */}
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
                                <Input {...field} readOnly placeholder="State" className="h-12 rounded-xl bg-white text-xs font-bold text-zinc-400 cursor-not-allowed border-zinc-100" />
                            </FormItem>
                        )} />

                        <FormField control={control} name="district" render={({ field }) => (
                            <FormItem className="space-y-1 col-span-1">
                                <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">District</FormLabel>
                                <Input {...field} readOnly placeholder="District" className="h-12 rounded-xl bg-white text-xs font-bold text-zinc-400 cursor-not-allowed border-zinc-100" />
                            </FormItem>
                        )} />
                    </div>

                    {/* House / Flat details */}
                    <FormField control={control} name="addressLine" render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">House No. / Building / Locality *</FormLabel>
                            <textarea {...field} rows={2} placeholder="Flat/House number, Building name, Landmark parameters..." className="w-full rounded-xl border border-zinc-200/80 bg-zinc-50 p-3 text-xs font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/5 text-zinc-800 resize-none select-text" />
                            <FormMessage className="text-[10px] font-bold text-rose-500" />
                        </FormItem>
                    )} />
                    <FormField control={control} name="landmark" render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400">Landmark (Optional)</FormLabel>
                            <Input {...field} placeholder="Landmark" className="h-12 rounded-xl bg-white text-xs font-bold text-zinc-400 cursor-not-allowed border-zinc-100" />
                            <FormMessage className="text-[10px] font-bold text-rose-500" />
                        </FormItem>
                    )} />

                    {/* TYPE CHIPS: HOME, WORK, OTHER SELECTORS */}
                    <FormField control={control} name="addressType" render={({ field }) => (
                        <FormItem className="space-y-1.5 select-none">
                            <FormLabel className="text-[10px] font-black uppercase tracking-wider text-zinc-400 ml-0.5">Save Address As</FormLabel>
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
                                                isChecked
                                                    ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/30"
                                                    : "text-zinc-400 hover:text-zinc-600"
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
                    {/* Receiver Details */}
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

                    <FormField
  control={control}
  name="isDefault"
  render={({ field }) => (
    <FormItem className="flex flex-row items-center justify-between rounded-xl border p-4">
      <div className="space-y-1">
        <FormLabel className="font-semibold">
          Set as Default Address
        </FormLabel>
        <p className="text-xs text-muted-foreground">
          This address will be selected automatically during checkout.
        </p>
      </div>

      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
    </FormItem>
  )}
/>

                    {/* Submit Action Gate */}
                    <div className="pt-2 pb-20">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-12 rounded-xl font-black uppercase tracking-wider text-xs transition-all shadow-md bg-zinc-950 hover:bg-zinc-800 text-white min-h-[48px]"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck className="h-4 w-4 stroke-[2.5] mr-1.5" />
                                    Save Address
                                </>
                            )}
                        </Button>
                    </div>

                </form>
            </Form>
        </div>
    );
}