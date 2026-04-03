import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { UserEditForm } from "@/components/admin/UserEditForm";

export default async function EditUserPage({ params }: { params: { username: string } }) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: { kycDocument: true },
  });

  if (!user) notFound();

  return (
    <div className="py-10">
      

      <UserEditForm user={user} />
    </div>
  );
}