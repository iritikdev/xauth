"use client"
import { cn } from "@/lib/utils"
import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
  FileText, 
  Download, 
  Image as ImageIcon, 
  Video, 
  Share2, 
  Search,
  CheckCircle2,
  FileDown,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

const resources = [
  {
    id: 1,
    title: "Official Business Plan 2026",
    category: "PDF",
    size: "4.2 MB",
    icon: FileText,
    description: "Full breakdown of 15-level commissions and BV rewards.",
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    id: 2,
    title: "Product Catalog (Full)",
    category: "PDF",
    size: "12.8 MB",
    icon: FileText,
    description: "Complete list of Ayurvedic products with MRP and DP.",
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    id: 3,
    title: "WhatsApp Status Banner - SlimExpert",
    category: "Image",
    size: "1.5 MB",
    icon: ImageIcon,
    description: "High-quality vertical banner for social media marketing.",
    color: "text-orange-600",
    bg: "bg-orange-50"
  },
  {
    id: 4,
    title: "Business Opportunity Video",
    category: "Video",
    size: "45 MB",
    icon: Video,
    description: "2-minute cinematic intro for new prospects.",
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    id: 5,
    title: "Brand Logo Assets",
    category: "ZIP",
    size: "8 MB",
    icon: FileDown,
    description: "PNG/SVG logos for your personal marketing materials.",
    color: "text-slate-600",
    bg: "bg-slate-50"
  }
]

export default function MarketingKitPage() {
  const [downloading, setDownloading] = useState<number | null>(null)
  const [filter, setFilter] = useState("all")

  const handleDownload = (id: number, title: string) => {
    setDownloading(id)
    // Simulating download delay
    setTimeout(() => {
      setDownloading(null)
      toast.success(`${title} downloaded!`)
    }, 2000)
  }

  const filteredResources = resources.filter(res => 
    filter === "all" || res.category.toLowerCase() === filter.toLowerCase()
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Marketing Kit</h1>
          <p className="text-slate-500 font-medium mt-1">Professional tools to scale your Swadeshi business.</p>
        </div>
        <Button className="h-12 px-6 rounded-2xl bg-[#059669] hover:bg-[#047857] shadow-lg shadow-emerald-200 gap-2">
          <Share2 className="w-4 h-4" /> Share Referral Link
        </Button>
      </header>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setFilter}>
          <TabsList className="bg-slate-100 rounded-2xl p-1 h-12">
            <TabsTrigger value="all" className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest">All</TabsTrigger>
            <TabsTrigger value="pdf" className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest">Documents</TabsTrigger>
            <TabsTrigger value="image" className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest">Graphics</TabsTrigger>
            <TabsTrigger value="video" className="rounded-xl px-6 font-bold text-xs uppercase tracking-widest">Media</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <Input placeholder="Search resources..." className="pl-12 h-12 rounded-2xl border-slate-200 bg-slate-50/50" />
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => (
          <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={res.id}
          >
            <Card className="rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-white">
              <CardContent className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center shadow-inner", res.bg, res.color)}>
                    <res.icon className="w-7 h-7" />
                  </div>
                  <Badge variant="outline" className="rounded-lg font-black text-[10px] tracking-widest uppercase border-slate-200">
                    {res.size}
                  </Badge>
                </div>

                <h3 className="text-lg font-black text-slate-900 leading-tight mb-2 group-hover:text-[#059669] transition-colors">
                  {res.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium mb-8 line-clamp-2">
                  {res.description}
                </p>

                <div className="flex items-center gap-3">
                  <Button 
                    onClick={() => handleDownload(res.id, res.title)}
                    disabled={downloading === res.id}
                    className={cn(
                      "flex-1 h-12 rounded-xl font-bold gap-2 transition-all",
                      downloading === res.id ? "bg-slate-100 text-slate-400" : "bg-slate-900 text-white hover:bg-[#059669]"
                    )}
                  >
                    {downloading === res.id ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                        Downloading...
                      </div>
                    ) : (
                      <>
                        <Download className="w-4 h-4" /> Download {res.category}
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-slate-200 hover:bg-slate-50">
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Training Banner */}
      <Card className="rounded-[3rem] border-none bg-gradient-to-br from-[#0f172a] to-[#1e293b] p-10 text-white relative overflow-hidden mt-12">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <h2 className="text-3xl font-black tracking-tight leading-tight">Master the Marketing Strategy</h2>
            <p className="text-slate-400 font-medium">Join our weekly webinar to learn how to use these assets to convert prospects into active Swadeshi associates.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1.5 rounded-full font-bold">Next Session: Sunday @ 8 PM</Badge>
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 px-4 py-1.5 rounded-full font-bold">Level: All Partners</Badge>
            </div>
          </div>
          <Button className="h-16 px-10 rounded-2xl bg-white text-[#0f172a] hover:bg-emerald-50 font-black text-lg transition-all shadow-2xl shrink-0">
            Register for Webinar
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -mr-48 -mt-48" />
      </Card>
    </div>
  )
}