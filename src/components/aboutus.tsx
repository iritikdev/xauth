"use client";

import React from 'react';
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  Heart, 
  Zap, 
  ArrowRight, 
  CheckCircle,
  Leaf
} from "lucide-react";

const AboutUsPage = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const productFocus = [
    {
      title: "SlimExpert",
      icon: <Target className="w-6 h-6 text-emerald-600" />,
      description: "Smart, sustainable health and fitness. Making wellness simple and achievable for every body.",
      color: "bg-emerald-50"
    },
    {
      title: "Josh Vital",
      icon: <Zap className="w-6 h-6 text-amber-600" />,
      description: "Timeless Ayurvedic power for modern stamina, boosting energy and overall vitality daily.",
      color: "bg-amber-50"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-700 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div {...fadeIn} className="max-w-3xl space-y-6">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 px-4 py-1.5 text-sm uppercase tracking-widest">
              Our Legacy
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Growing with <span className="text-emerald-500">Purpose</span>.
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl">
              As one of India's fastest-growing direct selling companies, we help people chase their dreams and actually achieve them.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-slate-900 leading-tight">
              More Than Just a Company.<br/>
              <span className="text-emerald-600 italic">We are a Community.</span>
            </h2>
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                We’re a team of passionate leaders, dreamers, and doers who believe that everyone deserves a chance to succeed.
              </p>
              <p>
                From students and homemakers to professionals, we empower people from all walks of life to discover their strength and build their own businesses.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-4 text-slate-900 font-bold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-500 w-5 h-5" /> Confidence
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="text-emerald-500 w-5 h-5" /> Freedom
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-50 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl shadow-emerald-900/5"
          >
             <Heart className="absolute top-[-20px] right-[-20px] w-48 h-48 text-emerald-100 opacity-50" />
             <blockquote className="relative z-10">
               <p className="text-2xl md:text-3xl font-medium text-slate-800 leading-snug">
                 "It’s not just about money. It’s about rediscovering who you really are."
               </p>
               <footer className="mt-8 flex items-center gap-4">
                 <div className="w-12 h-1 px-0 bg-emerald-600 rounded-full" />
                 <span className="text-emerald-600 font-bold tracking-widest uppercase text-sm">Our Mission</span>
               </footer>
             </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Product Innovation Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-4 mb-16">
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4">Transformation Tools</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Innovation for Wellness</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">Launched to support our mission of making wellness simple, sustainable, and powerful.</p>
        </div>

        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {productFocus.map((product, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-none shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-10 space-y-6">
                  <div className={`${product.color} w-14 h-14 rounded-2xl flex items-center justify-center`}>
                    {product.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">{product.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {product.description}
                  </p>
                  <button className="flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Community CTA Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-emerald-600 rounded-[3rem] p-10 md:p-20 text-center text-white relative overflow-hidden">
            <Leaf className="absolute top-[-30px] left-[-30px] w-64 h-64 text-emerald-500/30 -rotate-45" />
            <motion.div {...fadeIn} className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                Rise Together with Amaze Ayurveda
              </h2>
              <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
                Join a community where people grow, support each other, and transform their health and wealth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <button className="bg-white text-emerald-700 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-colors shadow-xl">
                  Become a Partner
                </button>
                <button className="bg-emerald-700/50 backdrop-blur-sm border border-emerald-400/30 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700/80 transition-colors">
                  Contact Us
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;