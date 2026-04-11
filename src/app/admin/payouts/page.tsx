import { getTransactions } from "@/lib/actions/transaction";
import PayoutsClientContent from "./payouts-client-content";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  const allRes = await getTransactions();
  
  // Safe check: data array hai ya nahi
  const data = allRes.success ? allRes.data : [];

  return (
    <div className="px-4">
      {/* Pura logic yahan pass kar rahe hain */}
      <PayoutsClientContent initialData={data} />
    </div>
  );
}