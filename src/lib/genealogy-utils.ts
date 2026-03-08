import { Member } from "@/types";// Adjust path as needed

export const getLevelCounts = (node: Member | undefined) => {
  const counts: Record<number, number> = {};

  const traverse = (n: Member, level: number) => {
    if (level > 16) return;
    counts[level] = (counts[level] || 0) + 1;
    n.children?.forEach((child) => traverse(child, level + 1));
  };

  if (node) traverse(node, 0);
  return counts;
};