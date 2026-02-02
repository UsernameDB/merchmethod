"use client";

import { motion } from "framer-motion";
import { MessageCircle, Palette, Rocket } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "Connect",
    description:
      "Tell us about your brand, audience, and vision. We'll hop on a call to understand exactly what you need.",
  },
  {
    number: "02",
    icon: Palette,
    title: "Design",
    description:
      "Our team creates custom mockups and samples. You review, tweak, and approve until it's perfect.",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Launch",
    description:
      "We produce, package, and ship your merch. You announce the drop and watch it sell out.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.2 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HowItWorks() {
  return (
    <section id="process" className="py-24 px-6 relative">
      <div className="absolute inset-0 radial-glow opacity-50" />
      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Three simple steps from idea to merch drop.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={stepVariants}
              className="glass-card rounded-2xl p-8 text-center relative transition-all duration-300"
            >
              <span className="text-6xl font-bold text-white/5 absolute top-4 right-6">
                {step.number}
              </span>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center mx-auto mb-6">
                <step.icon size={26} className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
