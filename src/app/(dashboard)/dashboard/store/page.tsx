import prisma from "@/lib/prisma";
import { StoreClient } from "./store-client";

export const dynamic = "force-dynamic";

export default async function BrowseStorePage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        stock: { gt: 0 },
        category: {
          is: {
            id: { not: undefined },
          },
        },
      },
      include: { category: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <StoreClient
      initialProducts={products.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        discount: p.discount,
        bvAmount: p.bvAmount,
        image: p.image,
        stock: p.stock,
        categoryId: p.categoryId ?? "",
        categoryName: p.category?.name ?? "Uncategorized",
      }))}
      categories={categories.map((c) => ({
        id: c.id,
        name: c.name,
        count: c._count.products,
      }))}
    />
  );
}
