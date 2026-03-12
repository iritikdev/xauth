"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/dist/server/web/spec-extension/revalidate";
import { cache } from "react";
import { auth } from "../auth";

// Using cache() ensures that if multiple components 
// ask for the same post, Prisma only queries once.
export const getPostBySlug = cache(async (slug: string) => {
  const post = await prisma.post.findUnique({
    where: { 
      slug: slug,
      published: true // Only show published posts to users
    },
  });

  return post;
});

export async function deletePost(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });
    revalidatePath("/admin/blog"); // UI refresh karne ke liye
    return { success: true };
  } catch (error) {
    return { error: "Failed to delete post" };
  }
}

// Helper to get all posts for the listing page
export async function getAllPosts() {
  return await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' }
  });
  
}



export async function createBlogPost(values: any) {
  try {
   

    const { title, slug, excerpt, content, image, category, published } = values;

    // 2. Database Entry
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        category,
        published,
        authorName: "Amaze Ayurveda Admin",
        readTime: `${Math.ceil(content.split(" ").length / 200)} min read`,
      },
    });

    // 3. Cache Purge (Important: Taki blog page par naya post turant dikhe)
    revalidatePath("/blog");
    revalidatePath("/admin/blog");

    return { success: true, post };
  } catch (error: any) {
    console.error("[BLOG_CREATE_ERROR]", error);
    return { error: "Failed to create article" };
  }
}



export async function updateBlogPost(id: string, values: any) {
  try {
    const { title, slug, excerpt, content, image, category, published } = values;

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        category,
        published,
        readTime: `${Math.ceil(content.split(" ").length / 200)} min read`,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);
    revalidatePath("/admin/blog");

    return { success: true, post };
  } catch (error: any) {
    console.error("[BLOG_UPDATE_ERROR]", error);
    return { error: "Failed to update article" };
  }
}