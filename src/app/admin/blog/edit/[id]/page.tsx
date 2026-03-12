import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditBlogForm from "./edit-form";// We will create this next

export default async function EditPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="p-6">
      <EditBlogForm initialData={post} />
    </div>
  );
}