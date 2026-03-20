import { getDashboardData } from "@/lib/actions/user";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const userData = await getDashboardData();

  if (!userData) return <div>Access Denied</div>;

  const firstName = userData.name?.split(" ")[0] ?? "Associate";

  // Icons ko yahan define NA karein, sirf identifiers rakhein
  const stats = [
    { label: "Total Team",   value: userData.totalTeam,   accent: "#1c6634", iconName: "Users" },
    { label: "Active Team",  value: userData.activeTeam,  accent: "#e8a020", iconName: "UserCheck" },
    { label: "Total Payout", value: `₹${userData.Wallet?.balance}`, accent: "#c8860a", iconName: "Wallet" },
    { label: "Rank",         value:  "Associate", accent: "#1c3320", iconName: "Trophy" },
  ];

  return (
    <DashboardClient userData={userData} stats={stats} firstName={firstName} />
  );
}