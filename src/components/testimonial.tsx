"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    rank: "Diamond Member",
    image: "/api/placeholder/100/100",
    text: "Joining Amaze Ayurveda changed my life. Within 6 months, I grew a team of 200+ and achieved financial independence while promoting wellness.",
    rating: 5
  },
  {
    name: "Priya Sharma",
    rank: "Star Diamond",
    image: "/api/placeholder/100/100",
    text: "The 15-level plan is truly revolutionary. The transparency in payouts and the quality of Ayurvedic products make it so easy to share with others.",
    rating: 5
  },
  {
    name: "Amit Patel",
    rank: "Super Star",
    image: "/api/placeholder/100/100",
    text: "I started with just a ₹499 purchase. Today, my passive income covers all my monthly expenses. The support system here is incredible.",
    rating: 5
  }
];

const SuccessStories = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-4 py-1">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              Real Stories, <span className="text-emerald-600">Real Success</span>
            </h2>
          </div>
          
          <div className="flex gap-3">
            <button onClick={prev} className="p-4 rounded-full border border-slate-200 hover:bg-slate-50 transition-all">
              <ChevronLeft className="w-6 h-6 text-slate-600" />
            </button>
            <button onClick={next} className="p-4 rounded-full bg-slate-900 hover:bg-emerald-600 transition-all group">
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        <div className="relative h-[400px] md:h-[300px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Card className="h-full border-none shadow-[0_20px_50px_rgba(0,0,0,0.05)] bg-slate-50/50 rounded-3xl">
                <CardContent className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center h-full">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                      <AvatarImage src={testimonials[index].image} />
                      <AvatarFallback className="bg-emerald-500 text-white text-2xl">
                        {testimonials[index].name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg">
                      <Quote className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 text-center md:text-left">
                    <div className="flex justify-center md:justify-start gap-1">
                      {[...Array(testimonials[index].rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-xl md:text-2xl text-slate-700 italic font-medium leading-relaxed">
                      "{testimonials[index].text}"
                    </p>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{testimonials[index].name}</h4>
                      <p className="text-emerald-600 font-semibold tracking-wide uppercase text-sm">
                        {testimonials[index].rank}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;