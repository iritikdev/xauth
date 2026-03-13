"use server"

import { v2 as cloudinary } from 'cloudinary';
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Configure Cloudinary (Move these to .env)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function createProduct(prevState: any,formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const discount = parseFloat(formData.get("discount") as string) || 0;
  const bvAmount = parseFloat(formData.get("bvAmount") as string) || 0;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const categoryId = formData.get("categoryId") as string;
  
  // 1. Get the Base64 image string from the form
  const imageBase64 = formData.get("image") as string;

  try {
    let imageUrl = "/products/default.png";

    // 2. Upload to Cloudinary if an image exists
    if (imageBase64 && imageBase64.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(imageBase64, {
        folder: "amaze_ayurveda/products",
      });
      imageUrl = uploadResponse.secure_url;
    }

    // 3. Save Product to MongoDB
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        discount,
        bvAmount,
        stock,
        image: imageUrl,
        categoryId,
      }
    });
  } catch (error) {
    console.error("Cloudinary/Prisma Error:", error);
    return { error: "Failed to publish product. Please check your connection." };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: string) {
  try {
    // 1. Fetch the product to get the Cloudinary image URL
    const product = await prisma.product.findUnique({
      where: { id },
      select: { image: true }
    });

    if (!product) return { error: "Product not found." };

    // 2. Extract Public ID from Cloudinary URL and delete image
    // Example URL: https://res.cloudinary.com/demo/image/upload/v1234/folder/image_name.jpg
    if (product.image && product.image.includes("cloudinary")) {
      const parts = product.image.split('/');
      const fileName = parts.pop()?.split('.')[0]; // Get 'image_name'
      const folder = parts.pop(); // Get 'folder'
      const publicId = `${folder}/${fileName}`;
      
      await cloudinary.uploader.destroy(publicId);
    }

    // 3. Delete from Database
    await prisma.product.delete({
      where: { id }
    });

    revalidatePath("/admin/products");
    return { success: "Product purged from inventory." };
  } catch (error) {
    console.error("Delete Error:", error);
    return { error: "Failed to remove product." };
  }
}


export async function getRecommendedProducts(currentProductId?: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        // Exclude the current product if we are on a detail page
        NOT: currentProductId ? { id: currentProductId } : undefined,
        stock: { gt: 0 }, // Only show items available for purchase
      },
      include: {
        category: true, // Required for the category badge in ProductCard
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    });

    // Safely serialize for Client Components
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("DATABASE_ERROR:", error);
    return [];
  }
}

export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true, // category property missing error yahan se fix hoga
      },
    });
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}

export async function getProductById(id: string) {
  return await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });
}