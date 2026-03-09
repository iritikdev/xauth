export const calculateStrength = (pass: string) => {
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  return score;
};

export const getStrengthColor = (score: number) => {
  if (score === 0) return "bg-slate-200";
  if (score <= 2) return "bg-red-500";
  if (score === 3) return "bg-orange-500";
  return "bg-emerald-500";
};

export const getStrengthLabel = (score: number) => {
  if (score === 0) return "Too Short";
  if (score <= 2) return "Weak";
  if (score === 3) return "Medium";
  return "Strong (Recommended)";
};