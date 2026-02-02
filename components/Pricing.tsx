"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$2,500",
    description: "Perfect for your first merch drop",
    features: [
      "Up to 3 product designs",
      "Print-on-demand production",
      "Basic packaging",
      "US shipping",
      "Email support",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$5,000",
    description: "For creators ready to scale",
    features: [
      "Up to 10 product designs",
      "Cut & sew + print-on-demand",
      "Custom branded packaging",
      "Worldwide shipping",
      "Dedicated account manager",
      "Restock management",
    ],
    highlighted: true,
  },
  {
    name: "Scale",
    price: "Custom",
    description: "Enterprise-level merch operations",
    features: [
      "Unlimited product designs",
      "Full cut & sew manufacturing",
      "Premium unboxing experience",
      "Global fulfillment network",
      "Priority 24/7 support",
      "Revenue share options",
      "Pop-up event support",
    ],
    highlighted: false,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Transparent pricing that scales with your brand. No hidden fees.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start"
        >
          {tiers.map((tier) => (
            <motion.div
              key={tier.name}
              variants={cardVariants}
              className={`rounded-2xl p-8 transition-all duration-300 ${
                tier.highlighted
                  ? "bg-gradient-to-br from-violet-600/20 to-pink-500/20 border border-violet-500/30 scale-[1.02]"
                  : "glass-card"
              }`}
            >
              {tier.highlighted && (
                <span className="inline-block text-xs uppercase tracking-widest font-semibold gradient-text mb-4">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold mb-1">{tier.name}</h3>
              <p className="text-gray-400 text-sm mb-6">{tier.description}</p>
              <div className="mb-8">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.price !== "Custom" && (
                  <span className="text-gray-400 text-sm"> / drop</span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check
                      size={16}
                      className="text-violet-400 mt-0.5 shrink-0"
                    />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className={`block text-center py-3 rounded-full font-semibold transition-all ${
                  tier.highlighted
                    ? "gradient-btn text-white"
                    : "border border-white/20 text-white hover:bg-white/5"
                }`}
              >
                Get Started
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
