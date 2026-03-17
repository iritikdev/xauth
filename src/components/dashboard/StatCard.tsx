import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "../ui/card";

export const StatCard = ({ stat, index }: { stat: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
  >
    <Card className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all group cursor-pointer">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
            <stat.icon className="h-6 w-6" />
          </div>
          <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
        </div>
        <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
        <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
      </CardContent>
    </Card>
  </motion.div>
);