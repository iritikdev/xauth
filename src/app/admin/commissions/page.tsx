import { getTransactions } from "@/lib/actions/transaction";
import CommissionDetailsPage from "./CommissionDetailsPage"; 

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CommissionsPage() {
  const res = await getTransactions({ type: "CREDIT" }); 
  
  // Safe check for data
  const data = res.success ? res.data.map((t: any) => ({
    ...t,
    user: {
      ...t.user,
      name: t.user?.name || "Anonymous Associate", // Null handle ho gaya
      username: t.user?.username || "unknown",
      photoUrl: t.user?.photoUrl || null
    }
  })) : [];

  return (
    <div className="py-6">
      {/* Humne client logic ko alag file mein rakha hai for better performance */}
      <CommissionDetailsPage initialData={data} />
    </div>
  );
}