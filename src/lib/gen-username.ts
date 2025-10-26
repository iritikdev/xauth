export function generateUsername(userId: number): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // "25"
  const month = String(now.getMonth() + 1).padStart(2, "0"); // "10"
  const paddedId = String(userId).padStart(5, "0"); // "00042"

  return `AMZ${year}${month}${paddedId}`; // e.g., "AMZ251000042"
}