"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Save, FileText, Settings } from "lucide-react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createBlogPost } from "@/lib/actions/blog";



// 1. Dynamic Import Fix: Ensure the path points to your MDX Editor component
const MdxEditor = dynamic(() => import("@/app/(dashboard)/admin/blog/create/RichEditor"), { 
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-slate-50 animate-pulse rounded-[2rem] border border-dashed border-slate-200" />
});

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

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      published: false,
      content: "", // Initializing with empty string for MDX
      image: "https://images.unsplash.com/photo-1512036666432-2181c1f26420?q=80&w=2000",
    },
  });

  const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    form.setValue("slug", slug, { shouldValidate: true });
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
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight uppercase italic">
            Create <span className="text-emerald-600">New Article</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Swadeshi Knowledge Portal</p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <FileText size={12} /> Article Title
              </label>
              <Input
                {...form.register("title")}
                placeholder="e.g. Benefits of Ashwagandha in Daily Life"
                onChange={(e) => {
                  form.register("title").onChange(e);
                  generateSlug(e.target.value);
                }}
                className="h-14 rounded-2xl font-bold text-lg border-slate-100 focus:border-emerald-500/20 bg-slate-50/30"
              />
              {form.formState.errors.title && <p className="text-red-500 text-[9px] font-bold uppercase ml-1">{form.formState.errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Slug (URL)</label>
                    <Input {...form.register("slug")} className="h-12 rounded-xl bg-slate-50 font-mono text-xs italic border-none" readOnly />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                    <Select onValueChange={(val) => form.setValue("category", val, { shouldValidate: true })}>
                        <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-none font-bold">
                            <SelectValue placeholder="Choose Category" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-slate-100">
                            <SelectItem value="Network Marketing">Network Marketing</SelectItem>
                            <SelectItem value="Ayurveda">Ayurveda</SelectItem>
                            <SelectItem value="Business Tips">Business Tips</SelectItem>
                            <SelectItem value="Success Stories">Success Stories</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Short Excerpt</label>
              <Textarea
                {...form.register("excerpt")}
                placeholder="Write a short summary for search results..."
                className="rounded-2xl min-h-[100px] bg-slate-50/30 border-slate-100 focus:border-emerald-500/20"
              />
            </div>

            {/* MDX EDITOR INTEGRATION */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Content (MDX Supported)
              </label>
              <MdxEditor 
                markdown={form.watch("content")} 
                onChange={(markdown) => {
                  form.setValue("content", markdown);
                  if (form.formState.errors.content) form.trigger("content");
                }} 
              />
              {form.formState.errors.content && (
                <p className="text-red-500 text-[10px] font-bold mt-1 ml-1 uppercase tracking-wider">
                  {form.formState.errors.content.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8 sticky top-24">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <Settings size={12} /> Post Settings
              </label>
              
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-1">Featured Image</label>
                    <div className="aspect-video rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
                        <img src={form.watch("image")} className="w-full h-full object-cover" alt="preview" />
                    </div>
                    <Input {...form.register("image")} className="h-10 rounded-xl text-xs" placeholder="https://..." />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-900">Publish Now</p>
                    <p className="text-[8px] text-slate-400 font-bold uppercase">Visibility: Public</p>
                  </div>
                  <Switch
                    checked={form.watch("published")}
                    onCheckedChange={(val) => form.setValue("published", val)}
                  />
                </div>
              </div>
            </div>

            <Button
              disabled={loading}
              className="w-full h-16 rounded-2xl bg-slate-900 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-95"
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Create Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}