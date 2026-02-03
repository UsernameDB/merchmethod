"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  "Unlimited product designs",
  "Full cut & sew manufacturing",
  "Premium unboxing experience",
  "Global fulfillment network",
  "Priority 24/7 support",
  "Revenue share options",
  "Pop-up event support",
  "Dedicated account manager",
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Custom <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Every creator is different. We build a custom package tailored to
            your brand, audience, and goals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-violet-600/20 to-pink-500/20 border border-violet-500/30 rounded-2xl p-10 text-center"
        >
          <span className="inline-block text-xs uppercase tracking-widest font-semibold gradient-text mb-4">
            Tailored For You
          </span>
          <div className="mb-2">
            <span className="text-5xl md:text-6xl font-bold">Custom</span>
          </div>
          <p className="text-gray-400 mb-10">
            Pricing based on your specific needs and scale
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto mb-10">
            {features.map((feature) => (
              <div key={feature} className="flex items-start gap-3 text-sm">
                <Check
                  size={16}
                  className="text-violet-400 mt-0.5 shrink-0"
                />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          <a
            href="#contact"
            className="gradient-btn px-10 py-4 rounded-full font-semibold text-white inline-block"
          >
            Get a Quote
          </a>
        </motion.div>
      </div>
    </section>
  );
}
