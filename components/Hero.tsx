"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import FluidBackground from "./FluidBackground";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <FluidBackground />
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-sm uppercase tracking-widest text-gray-400 mb-6"
        >
          Premium Influencer Merch Production
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-5xl md:text-7xl font-bold leading-tight mb-6"
        >
          We Turn Influence
          <br />
          <span className="gradient-text">Into Merch</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
        >
          From concept to doorstep — we design, produce, and ship custom
          merchandise so you can focus on creating content.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <a
            href="#contact"
            className="gradient-btn px-8 py-4 rounded-full text-lg font-semibold text-white inline-flex items-center justify-center gap-2"
          >
            Start Your Line
            <ArrowRight size={20} />
          </a>
          <a
            href="#services"
            className="px-8 py-4 rounded-full text-lg font-semibold text-white border border-white/20 hover:bg-white/5 transition-colors inline-flex items-center justify-center"
          >
            Learn More
          </a>
        </motion.div>
      </div>
    </section>
  );
}
