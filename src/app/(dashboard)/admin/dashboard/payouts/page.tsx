import { getTransactions } from "@/lib/actions/transaction";
import PayoutsClientContent from "./payouts-client-content";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  const allRes = await getTransactions({ type: "DEBIT" }); // Sirf DEBIT transactions fetch kar rahe hain
  
  const data = allRes.success ? allRes.data : [];

  return (
    <div className="px-4">
      
      <PayoutsClientContent initialData={data} />
    </div>
  );
}