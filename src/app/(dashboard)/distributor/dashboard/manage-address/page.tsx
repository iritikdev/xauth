"use client";

import React, { useEffect, useState } from "react";
import { Plus, MapPin, Edit3, Trash2, Home, Briefcase, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { baseDashboardUrl } from "@/lib/constants";
import { getUserAddresses, UserAddressData } from "./fetchAddresses";
import { deleteUserAddress } from "./add/address-action";

export default function ManageAddressesDashboard() {
    const [addresses, setAddresses] = useState<UserAddressData[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // 💡 डेटाबेस से लाइव एड्रेस फ़ेच करने का फंक्शन
    const fetchLiveAddresses = async () => {
        setLoading(true);
        try {
            const response = await getUserAddresses();
            if (response.success && response.data) {
                setAddresses(response.data);
            } else {
                toast.error(response.error || "Failed to load addresses.");
            }
        } catch (error) {
            toast.error("Network configuration error.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveAddresses();
    }, []);

    const handleDelete = async (id: string) => {
        if (deletingId) return; // एक समय में एक ही डिलीट प्रोग्रेस अलाउ करें

        // 1. ऑप्टिमिस्टिक रोलबैक के लिए करंट स्टेट सेव करें
        const previousAddresses = [...addresses];
        setDeletingId(id);

        // 2. तुरंत यूआई से पते को फ़िल्टर करें (Optimistic Update)
        setAddresses((prev) => prev.filter((item) => item.id !== id));

        try {
            // 3. बैकएंड म्यूटेशन ट्रिगर करें
            const response = await deleteUserAddress(id);

            if (response.success) {
                toast.success("Address Removed", {
                    description: "Your address has been removed successfully.",
                });

                const targetWasDefault = previousAddresses.find(a => a.id === id)?.isDefault;
                if (targetWasDefault) {
                    fetchLiveAddresses();
                }
            } else {
                setAddresses(previousAddresses);
                toast.error(response.error || "Failed to delete address.");
            }
        } catch (error) {
            setAddresses(previousAddresses);
            toast.error("Network error executing mutation.");
        } finally {
            setDeletingId(null);
        }
    }

    const getLabelIcon = (type: UserAddressData["addressType"]) => {
        switch (type) {
            case "HOME": return <Home className="h-4 w-4 text-zinc-600" />;
            case "WORK": return <Briefcase className="h-4 w-4 text-zinc-600" />;
            default: return <MapPin className="h-4 w-4 text-zinc-600" />;
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-zinc-50/30">
                <Loader2 className="h-7 w-7 animate-spin text-zinc-950" />
            </div>
        );
    }

    return (
        <div className="w-full  min-h-screen text-zinc-900 font-sans select-none pb-12">

            {/* ─── PREMIUM STICKY HEADER ─── */}
            <div className="sticky top-0 border-zinc-100 z-30 px-4 h-14 flex items-center gap-3">
                <Link href={`${baseDashboardUrl}/profile`}>
                    <Button variant="ghost" size="sm" className="h-9 w-9 p-0 rounded-xl hover:bg-zinc-100">
                        <ArrowLeft className="h-4 w-4 stroke-[2.5]" />
                    </Button>
                </Link>
                <h1 className="text-base font-black tracking-tight text-zinc-900">Manage addresses</h1>
            </div>

            <div className="p-4 space-y-5">

                {/* ─── ADD NEW ADDRESS TRIGGER BUTTON ─── */}
                <Link href={`${baseDashboardUrl}/manage-address/add`} className="block">
                    <Button
                        variant="outline"
                        className="w-full h-14 rounded-2xl border-2 border-dashed border-zinc-200 bg-white hover:bg-zinc-50/80 hover:border-zinc-300 text-zinc-900 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all group"
                    >
                        <Plus className="h-4 w-4 stroke-[3] text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                        Add New Address
                    </Button>
                </Link>

                {/* ─── SAVED ADDRESSES SECTION ─── */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Saved address</span>
                        <span className="text-[10px] font-bold text-zinc-400 font-mono">{addresses.length} Total</span>
                    </div>

                    {addresses.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-zinc-200 rounded-2xl bg-white p-6">
                            <MapPin className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
                            <p className="text-xs font-bold text-zinc-400">No saved addresses found.</p>
                        </div>
                    ) : (
                        addresses.map((item) => (
                            <Card key={item.id} className="rounded-2xl border border-zinc-200/80 bg-white shadow-sm hover:shadow-md/5 transition-all overflow-hidden">
                                <CardContent className="p-4 sm:p-5 space-y-4">

                                    {/* Card Title Header Block */}
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                                                {getLabelIcon(item.addressType)}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-black text-zinc-900 flex items-center gap-2 capitalize">
                                                    {item.addressType.toLowerCase()}
                                                    <span className="text-xs font-bold text-zinc-400 font-mono">({item.pinCode})</span>
                                                </h3>
                                            </div>
                                        </div>

                                        {item.isDefault && (
                                            <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200/30 flex items-center gap-1">
                                                <CheckCircle2 className="h-2.5 w-2.5 fill-emerald-700 text-white" /> Default
                                            </span>
                                        )}
                                    </div>

                                    {/* Core Address Metadata Layout Row */}
                                    <div className="space-y-1.5 pl-10 select-text">
                                        <div className="text-xs font-black text-zinc-800 flex flex-wrap items-center gap-1.5 leading-none">
                                            <span>{item.receiverName}</span>
                                            <span className="h-3 w-px bg-zinc-200" />
                                            <span className="font-mono text-zinc-500 font-bold">{item.receiverMobile}</span>
                                        </div>

                                        <p className="text-xs font-medium leading-relaxed text-zinc-500 max-w-xs uppercase tracking-tight">
                                            {item.addressLine}
                                            {item.landmark && <span className="text-zinc-400 block text-[11px] font-bold mt-0.5">Landmark: {item.landmark}</span>}
                                            <span className="block text-zinc-600 mt-0.5">{item.district}, {item.state}</span>
                                        </p>
                                    </div>

                                    {/* Bottom Interactive Action Toolbar */}
                                    <div className="flex items-center gap-2 border-t border-zinc-50 pt-3.5 pl-10">
                                        <Link href={`${baseDashboardUrl}/manage-address/edit/${item.id}`}>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 rounded-lg text-[10px] font-black uppercase tracking-wider text-zinc-600 hover:bg-zinc-100 flex items-center gap-1 px-2.5"
                                            >
                                                <Edit3 className="h-3.5 w-3.5 text-zinc-400 stroke-[2.5]" />
                                                Edit
                                            </Button>
                                        </Link>

                                        <div className="h-3 w-px bg-zinc-100" />

                                        {/* 💡 Delete Button with Progress Context Sync */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={deletingId !== null}
                                            onClick={() => handleDelete(item.id)}
                                            className="h-8 rounded-lg text-[10px] font-black uppercase tracking-wider text-rose-600 hover:bg-rose-50 hover:text-rose-700 flex items-center gap-1 px-2.5 min-w-[70px]"
                                        >
                                            {deletingId === item.id ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-500 mx-auto" />
                                            ) : (
                                                <>
                                                    <Trash2 className="h-3.5 w-3.5 text-rose-400/80 stroke-[2.5]" />
                                                    Delete
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}