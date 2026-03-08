// --- TYPES ---
export interface Member {
  id: string;
  name: string;
  rank: string;
  status: "Active" | "Inactive";
  totalTeam: number;
  weeklyBV: number;
  targetBV: number;
  level?: number;
  mobile?: string;
  children?: Member[];
}