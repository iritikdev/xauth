"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateBlogPost } from "@/lib/actions/blog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(10),
  slug: z.string().min(5),
  excerpt: z.string().min(20),
  content: z.string().min(50),
  category: z.string().min(1),
  image: z.string().url(),
  published: z.boolean(),
});

type BlogFormValues = z.infer<typeof formSchema>;

export default function EditBlogForm({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title,
      slug: initialData.slug,
      excerpt: initialData.excerpt,
      content: initialData.content,
      category: initialData.category,
      image: initialData.image,
      published: initialData.published,
    },
  });

  const onSubmit = async (values: BlogFormValues) => {
    setLoading(true);
    const res = await updateBlogPost(initialData.id, values);
    
    if (res.success) {
      toast.success("Blog updated!");
      router.push("/admin/blog");
      router.refresh();
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-4xl mx-auto space-y-6">
       <h1 className="text-2xl font-bold">Edit Post: <span className="text-emerald-600">{initialData.title}</span></h1>
       
       <div className="space-y-4 bg-white p-6 rounded-2xl border shadow-sm">
         <Input {...form.register("title")} placeholder="Title" />
         <Input {...form.register("slug")} placeholder="Slug" />
         <Textarea {...form.register("excerpt")} placeholder="Excerpt" />
         <Textarea {...form.register("content")} placeholder="Content" className="min-h-[300px]" />
         <Input {...form.register("image")} placeholder="Image URL" />
         
         <Button type="submit" disabled={loading} className="w-full bg-emerald-600">
           {loading ? "Updating..." : "Update Post"}
         </Button>
       </div>
    </form>
  );
}