// app/dashboard/kyc/page.tsx
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import KycForm from "./KycForm";

export default async function Page() {
  const session = await auth();
  const kyc = await prisma.kycDocument.findUnique({
    where: { userId: session?.user?.id }
  });

  return <KycForm initialKyc={kyc} />;
}