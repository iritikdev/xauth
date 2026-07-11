"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { baseAdminUrl } from "../constants";

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug =
    (formData.get("slug") as string) || name.toLowerCase().replace(/ /g, "-");
  const description = formData.get("description") as string;
  const parentId = formData.get("parentId") as string;

  if (!name) return { error: "Name is required" };

  try {
    await prisma.category.create({
      data: {
        name,
        slug,
        description,
      },
    });

    revalidatePath(`${baseAdminUrl}/categories`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to create category. Slug might already exist." };
  }
}

export async function deleteCategory(id: string) {
  try {
    // Check if category has products
    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (category?._count.products && category._count.products > 0) {
      return { error: "Cannot delete category containing products." };
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath(`${baseAdminUrl}/categories`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete category." };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  try {
    await prisma.category.update({
      where: { id },
      data: { name, description },
    });
    revalidatePath(`${baseAdminUrl}/categories`);
    return { success: true };
  } catch (error) {
    return { error: "Update failed." };
  }
}

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}
