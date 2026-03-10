"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string || name.toLowerCase().replace(/ /g, "-");
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
    
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    return { error: "Failed to create category. Slug might already exist." };
  }
}