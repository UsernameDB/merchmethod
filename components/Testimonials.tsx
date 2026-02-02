"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Jess Rivera",
    handle: "@jessrivera",
    followers: "2.1M followers",
    quote:
      "MerchMethod turned my brand vision into reality. My first drop sold out in 48 hours — the quality blew my audience away.",
  },
  {
    name: "Marcus Chen",
    handle: "@marcuschen",
    followers: "850K followers",
    quote:
      "I tried doing merch on my own and it was a nightmare. These guys handled everything and the results were insane.",
  },
  {
    name: "Ayla Thompson",
    handle: "@aylathompson",
    followers: "3.4M followers",
    quote:
      "The packaging alone gets more comments than some of my posts. MerchMethod understands the creator economy like no one else.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 relative">
      <div className="absolute inset-0 radial-glow opacity-30" />
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What Creators <span className="gradient-text">Say</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Don&apos;t take our word for it — hear from the influencers we&apos;ve worked with.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={cardVariants}
              className="glass-card rounded-2xl p-8 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-gray-400">
                  {t.handle} &middot; {t.followers}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
