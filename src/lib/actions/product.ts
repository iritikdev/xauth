"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createProduct(formData: FormData): Promise<void> {
    console.log("Received form data:", Object.fromEntries(formData.entries())); // Debug log
  // Extract data
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const mrp = parseFloat(formData.get("mrp") as string);
  const bvAmount = parseFloat(formData.get("bvAmount") as string);
  const stock = parseInt(formData.get("stock") as string) || 0;
  const categoryId = formData.get("categoryId") as string;
  const image = (formData.get("image") as string) || "/p1.png";
    
  // Validation
  if (!name || !price || !bvAmount || !categoryId) {
    throw new Error("Please fill all required fields including BV points.");
  }

  try {
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        discount: Math.round(((mrp - price) / mrp) * 100),
        bvAmount,
        stock,
        image,
        categoryId,
      },
    });

    // Revalidate pages
    revalidatePath("/admin/products");
    revalidatePath("/shop");

  } catch (error) {
    console.error("CREATE_PRODUCT_ERROR:", error);
    throw new Error("Failed to create product. Check category.");
  }

  // Redirect after success
  redirect("/admin/products");
}