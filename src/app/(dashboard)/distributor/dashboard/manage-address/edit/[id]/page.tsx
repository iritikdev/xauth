import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import EditAddressForm from "@/app/(dashboard)/distributor/dashboard/manage-address/edit/EditAddressForm"

interface EditPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditAddressPage({ params }: EditPageProps) {
    const resolvedParams = await params;
    const addressId = resolvedParams.id;
    const session = await auth()
    if (!session?.user?.id) redirect("/login")

    // डेटाबेस से डायरेक्ट करंट एड्रेस का रिकॉर्ड निकालें
    const addressRecord = await prisma.address.findFirst({
        where: { id: addressId, userId: session.user.id }
    })

    if (!addressRecord) {
        return <div className="p-8 text-center text-xs font-bold text-zinc-400">Address node not found.</div>
    }

    // ज़ोड स्कीमा आर्किटेक्चर के अनुसार पेलोड फॉर्मेट मैप करें
    const initialDataPayload = {
        receiverName: addressRecord.receiverName,
        receiverMobile: addressRecord.receiverMobile,
        addressLine: addressRecord.addressLine,
        landmark: addressRecord.landmark || "",
        pinCode: addressRecord.pinCode,
        state: addressRecord.state,
        district: addressRecord.district,
        addressType: addressRecord.addressType as "HOME" | "WORK" | "OTHER",
        isDefault: addressRecord.isDefault,
    }

    return (
        <div className="min-h-screen bg-zinc-50/40 py-10 px-4">
            <EditAddressForm
                addressId={addressId}
                initialData={initialDataPayload}
            />
        </div>
    )
}