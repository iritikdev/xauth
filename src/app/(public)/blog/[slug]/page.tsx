import { getPostBySlug } from "@/lib/actions/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { FadeInUp } from "../BlogAnimations";

interface PostPageProps {
  params: { slug: string };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <article className="min-h-screen bg-white dark:bg-black">
      {/* Header Section with Hero Image */}
      <header className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {/* <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          className="object-cover brightness-[0.8]"
        /> */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="container absolute bottom-0 left-1/2 -translate-x-1/2 pb-12 px-4">
          <FadeInUp>
            <h1 className="text-4xl md:text-6xl font-black text-white">
              {post.title}
            </h1>
          </FadeInUp>
        </div>
      </header>

      {/* Article Content Layout */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 space-y-10">
              {/* Author Info */}
              <div className="space-y-4 border-l-2 border-emerald-500 pl-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Written By</p>
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white text-lg">{post.authorName}</p>
                  <p className="text-sm text-slate-500">Amaze Ayurveda Mentor</p>
                </div>
              </div>

              {/* Share Actions */}
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Share Article</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-all">
                    <Share2 size={18} />
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-7">
            <div 
              className="prose prose-slate lg:prose-xl dark:prose-invert 
              prose-headings:font-black prose-headings:tracking-tight 
              prose-a:text-emerald-600 prose-img:rounded-3xl prose-img:shadow-2xl
              max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />
            
            {/* Footer Tag */}
            <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800">
              <p className="text-sm text-slate-500 italic">
                Was this helpful? Join our associate network for more exclusive training materials.
              </p>
            </div>
          </main>

        </div>
      </div>
    </article>
  );
}