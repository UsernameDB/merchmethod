"use client";

import { motion } from "framer-motion";
import { Shirt, Watch, Package, Truck } from "lucide-react";

const services = [
  {
    icon: Shirt,
    title: "Custom Apparel",
    description:
      "Premium hoodies, tees, joggers, and more — cut & sew or print-on-demand, tailored to your brand.",
  },
  {
    icon: Watch,
    title: "Accessories",
    description:
      "Phone cases, hats, bags, jewelry, and other accessories that your audience will love.",
  },
  {
    icon: Package,
    title: "Packaging & Branding",
    description:
      "Custom boxes, tissue paper, stickers, and thank-you cards that make unboxing an experience.",
  },
  {
    icon: Truck,
    title: "Fulfillment",
    description:
      "We handle warehousing, packing, and shipping worldwide so you never touch a box.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Services() {
  return (
    <section id="services" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What We <span className="gradient-text">Do</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to launch and scale your merch line, handled
            end-to-end.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {services.map((service) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              className="glass-card rounded-2xl p-8 transition-all duration-300 cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center mb-6">
                <service.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
