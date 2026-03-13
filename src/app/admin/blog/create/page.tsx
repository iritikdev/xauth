"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Upload, Save } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createBlogPost } from "@/lib/actions/blog";
import RichEditor from "@/components/admin/RichEditor";

// Schema Validation
const formSchema = z.object({
  title: z.string().min(10, "Title is too short"),
  slug: z.string().min(5, "Slug is required"),
  excerpt: z.string().min(20, "Excerpt should be descriptive"),
  content: z.string().min(50, "Content is too short"),
  category: z.string().min(1, "Select a category"),
  image: z.string().url("Valid image URL is required"),
  published: z.boolean(),
});
type BlogFormValues = z.infer<typeof formSchema>;

export default function CreateBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      published: false,
      image: "https://images.unsplash.com/photo-1512036666432-2181c1f26420?q=80&w=2000",
    },
  });

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    form.setValue("slug", slug);
  };

 const onSubmit = async (values: BlogFormValues) => {
  setLoading(true);
  try {
    const res = await createBlogPost(values);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Article created successfully!");
      router.push("/admin/blog");
    }
  } catch (error) {
    toast.error("An unexpected error occurred");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          
          <h1 className="text-3xl font-black tracking-tight">Create <span className="text-emerald-600">New Article</span></h1>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Article Title</label>
              <Input 
                {...form.register("title")} 
                placeholder="e.g. How to grow your network marketing business"
                onChange={(e) => {
                  form.register("title").onChange(e);
                  generateSlug(e.target.value);
                }}
                className="h-14 rounded-2xl font-bold text-lg focus:border-emerald-500/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Slug (URL)</label>
              <Input {...form.register("slug")} className="h-12 rounded-xl bg-slate-50 font-mono text-xs italic" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Short Excerpt</label>
              <Textarea {...form.register("excerpt")} placeholder="A brief summary for the blog card..." className="rounded-2xl min-h-[100px]" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Content (HTML/Rich Text)</label>

              <RichEditor 
                content={form.watch("content")} 
                onChange={(content) => form.setValue("content", content)} 
              />  
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
              <Select onValueChange={(val) => form.setValue("category", val)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Network Marketing">Network Marketing</SelectItem>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Business Tips">Business Tips</SelectItem>
                  <SelectItem value="Success Stories">Success Stories</SelectItem>
                  <SelectItem value="Motivation">Motivation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Featured Image URL</label>
              <Input {...form.register("image")} className="h-12 rounded-xl" />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="space-y-0.5">
                <p className="text-xs font-black uppercase tracking-wider">Publish Post</p>
                <p className="text-[10px] text-slate-400 font-bold">Make it visible to everyone</p>
              </div>
              <Switch 
                checked={form.watch("published")}
                onCheckedChange={(val) => form.setValue("published", val)} 
              />
            </div>

            <Button disabled={loading} className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-black uppercase tracking-widest text-xs">
              {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
              Save Article
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}