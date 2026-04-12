import prisma from "@/lib/prisma";
import NewProductForm from "./NewProductForm";

export default async function NewProductPageContainer() {
  // Fetch real categories from MongoDB
  const categories = await prisma.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: 'asc' }
  });

  return <NewProductForm categories={categories} />;
}