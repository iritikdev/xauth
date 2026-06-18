"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Image as ImageIcon,
  Video,
  Share2,
  FileDown,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const resources = [
  {
    id: 1,
    title: "Official Business Plan 2026",
    category: "PDF",
    size: "0.6 MB",
    icon: FileText,
    description: "Full breakdown of 15-level commissions and BV rewards.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    filePath: "/amz-business-plan.pdf",
  },
  // {
  //   id: 2,
  //   title: "Product Catalog (Full)",
  //   category: "PDF",
  //   size: "12.8 MB",
  //   icon: FileText,
  //   description: "Complete list of Ayurvedic products with MRP and DP.",
  //   color: "text-emerald-600",
  //   bg: "bg-emerald-50",
  // },
  // {
  //   id: 3,
  //   title: "WhatsApp Status Banner - SlimExpert",
  //   category: "Image",
  //   size: "1.5 MB",
  //   icon: ImageIcon,
  //   description: "High-quality vertical banner for social media marketing.",
  //   color: "text-orange-600",
  //   bg: "bg-orange-50",
  // },
  // {
  //   id: 4,
  //   title: "Business Opportunity Video",
  //   category: "Video",
  //   size: "45 MB",
  //   icon: Video,
  //   description: "2-minute cinematic intro for new prospects.",
  //   color: "text-purple-600",
  //   bg: "bg-purple-50",
  // },
  // {
  //   id: 5,
  //   title: "Brand Logo Assets",
  //   category: "ZIP",
  //   size: "8 MB",
  //   icon: FileDown,
  //   description: "PNG/SVG logos for your personal marketing materials.",
  //   color: "text-slate-600",
  //   bg: "bg-slate-50",
  // },
];

export default function MarketingKitPage() {
  const [downloading, setDownloading] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");

  const handleDownload = (id: number, title: string) => {
    setDownloading(id);

    // Find the resource to get the filePath
    const resource = resources.find((r) => r.id === id);

    setTimeout(() => {
      if (resource?.filePath) {
        // Create a hidden link and trigger click
        const link = document.createElement("a");
        link.href = resource.filePath;
        link.download = `${title}.pdf`; // Optional: forces the name of the saved file
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success(`${title} download started!`);
      } else {
        // For items without files yet (Graphics, Video, etc.)
        toast.info(`Coming Soon: ${title}`);
      }
      setDownloading(null);
    }, 1000); // Reduced delay for a snappier feel
  };

  const filteredResources = resources.filter(
    (res) =>
      filter === "all" || res.category.toLowerCase() === filter.toLowerCase(),
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-10">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Marketing Kit
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium italic">
            Professional tools to scale your Swadeshi business.
          </p>
        </div>
        {/* <Button className="w-full md:w-auto h-12 px-6 rounded-2xl bg-[#059669] hover:bg-[#047857] shadow-lg shadow-emerald-200/50 gap-2 font-bold">
          <Share2 className="w-4 h-4" /> Share Referral Link
        </Button> */}
      </header>

      {/* Control Bar - Mobile Optimized */}
      <div className="flex items-center justify-center md:justify-start bg-white p-2 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <TabsList className="bg-transparent w-full flex overflow-x-auto no-scrollbar justify-start md:justify-start p-0 gap-1 md:gap-2">
            <TabsTrigger
              value="all"
              className="rounded-xl px-4 md:px-8 font-black text-[10px] md:text-xs uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white"
            >
              All
            </TabsTrigger>
            <TabsTrigger
              value="pdf"
              className="rounded-xl px-4 md:px-8 font-black text-[10px] md:text-xs uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger
              value="image"
              className="rounded-xl px-4 md:px-8 font-black text-[10px] md:text-xs uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white"
            >
              Graphics
            </TabsTrigger>
            <TabsTrigger
              value="video"
              className="rounded-xl px-4 md:px-8 font-black text-[10px] md:text-xs uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white"
            >
              Media
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredResources.map((res) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={res.id}
          >
            <Card className="rounded-[2rem] md:rounded-[2.5rem] border-none shadow-sm hover:shadow-2xl transition-all duration-300 group overflow-hidden bg-white h-full flex flex-col">
              <CardContent className="p-6 md:p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={cn(
                      "h-12 w-12 md:h-14 md:w-14 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:rotate-6",
                      res.bg,
                      res.color,
                    )}
                  >
                    <res.icon className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <Badge
                    variant="outline"
                    className="rounded-lg font-black text-[9px] md:text-[10px] tracking-widest uppercase border-slate-100 bg-slate-50/50 px-2 py-1"
                  >
                    {res.size}
                  </Badge>
                </div>

                <h3 className="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-[#059669] transition-colors">
                  {res.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium mb-8 flex-grow line-clamp-2">
                  {res.description}
                </p>

                <div className="flex items-center gap-2 md:gap-3">
                  <Button
                    onClick={() => handleDownload(res.id, res.title)}
                    disabled={downloading === res.id}
                    className={cn(
                      "flex-1 h-12 rounded-xl font-black text-[10px] md:text-xs uppercase tracking-wider gap-2 transition-all",
                      downloading === res.id
                        ? "bg-slate-100 text-slate-400"
                        : "bg-slate-900 text-white hover:bg-[#059669] hover:shadow-lg hover:shadow-emerald-100",
                    )}
                  >
                    {downloading === res.id ? (
                      <>
                        <div className="h-3 w-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                        Wait...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" /> Get {res.category}
                      </>
                    )}
                  </Button>
                  
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      
    </div>
  );
}
