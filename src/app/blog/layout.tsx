import React from "react";
import { Metadata } from "next";
import { ReadingProgress } from "@/components/blog/ReadingProgress";

export const metadata: Metadata = {
  title: "Amaze Ayurveda Blog | Network Marketing & Wellness Insights",
  description: "Learn how to grow your business and improve your health with the Amaze Ayurveda official blog.",
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-slate-50/50 dark:bg-black">
      <ReadingProgress />
      {/* Background Decorative Gradients */}
      <div className="pointer-events-none absolute left-0 top-0 -z-10 h-[500px] w-full bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.05),transparent_50%)]" />
      
      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Newsletter Section - Critical for MLM Lead Gen */}
      <section className="border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-950">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Join the <span className="text-emerald-600">Circle of Success</span>
          </h2>
          <p className="mb-10 text-slate-500">
            Get exclusive marketing strategies and Ayurvedic health tips delivered to your inbox every week.
          </p>
          <form className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="email"
              placeholder="Enter your email address"
              className="h-14 flex-1 rounded-2xl border-2 border-slate-100 bg-slate-50 px-6 font-bold outline-none transition-all focus:border-emerald-500/20 focus:bg-white focus:ring-4 focus:ring-emerald-500/5"
              required
            />
            <button
              type="submit"
              className="h-14 rounded-2xl bg-[#0f172a] px-10 text-xs font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-emerald-600 active:scale-95"
            >
              Subscribe Now
            </button>
          </form>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            No Spam. Just Growth. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
}