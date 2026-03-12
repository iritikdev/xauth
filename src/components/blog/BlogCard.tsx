// components/blog/BlogCard.tsx
"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";

export const BlogCard = ({ post }: { post: any }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all"
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="relative h-56 w-full overflow-hidden">
          {/* <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          /> */}
          <Badge className="absolute top-4 left-4 bg-emerald-500/90 hover:bg-emerald-600 backdrop-blur-md border-none">
            {post.category}
          </Badge>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="flex items-center gap-1"><Calendar size={12}/> Feb 24, 2026</span>
            <span className="flex items-center gap-1"><Clock size={12}/> {post.readTime}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white leading-tight group-hover:text-emerald-600 transition-colors">
            {post.title}
          </h3>
          <p className="text-slate-500 line-clamp-2 text-sm leading-relaxed">
            {post.excerpt}
          </p>
          <div className="pt-4 flex items-center gap-2">
             <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
                RK
             </div>
             <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{post.authorName}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};