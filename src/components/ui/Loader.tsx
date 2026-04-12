"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Leaf, ShieldCheck } from "lucide-react";

export default function AppLoader({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => {
            // Add a slight delay for a smoother transition
            setTimeout(() => setLoading(false), 800);
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);

    return (
        <>
            <AnimatePresence>
                {loading && (
                    <motion.div 
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
                        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden"
                    >
                        {/* Patriotic Background Glows */}
                        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-50 rounded-full blur-[120px] opacity-60" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-50 rounded-full blur-[120px] opacity-60" />

                        <div className="relative flex flex-col items-center gap-8">
                            {/* Logo with Breathing Animation */}
                            <motion.div
                                animate={{ 
                                    scale: [1, 1.05, 1],
                                    opacity: [0.8, 1, 0.8] 
                                }}
                                transition={{ 
                                    duration: 2, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                                className="relative w-32 h-32 md:w-40 md:h-40"
                            >
                                <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" />
                                <Image
                                    src="/amaze-logo.png"
                                    alt="Amaze Ayurveda Logo"
                                    fill
                                    className="object-contain relative z-10"
                                    priority
                                />
                            </motion.div>

                            {/* Brand Text & Loading Text */}
                            <div className="text-center space-y-3 z-10">
                                <motion.h2 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-2xl font-black text-slate-900 tracking-tight"
                                >
                                    Amaze <span className="text-emerald-600">Ayurveda</span>
                                </motion.h2>
                                
                                <div className="flex flex-col items-center gap-4">
                                    {/* Progress bar line */}
                                    <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                                        <motion.div 
                                            initial={{ x: "-100%" }}
                                            animate={{ x: "100%" }}
                                            transition={{ 
                                                duration: 1.5, 
                                                repeat: Infinity, 
                                                ease: "linear" 
                                            }}
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                                        />
                                    </div>
                                    
                                    {/* Swadeshi Tag */}
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 text-white shadow-xl"
                                    >
                                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                                            Vocal for Local
                                        </span>
                                    </motion.div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Background Icon */}
                        <Leaf className="absolute -bottom-10 -left-10 w-64 h-64 text-emerald-500/5 -rotate-12" />
                    </motion.div>
                )}
            </AnimatePresence>
            {!loading && children}
        </>
    );
}