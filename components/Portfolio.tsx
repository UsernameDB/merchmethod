"use client";

import { motion } from "framer-motion";

const items = [
  { title: "Streetwear Collection", category: "Apparel", color: "from-violet-600 to-indigo-600" },
  { title: "Creator Essentials Pack", category: "Accessories", color: "from-pink-500 to-rose-600" },
  { title: "Limited Edition Hoodie", category: "Apparel", color: "from-purple-600 to-violet-600" },
  { title: "Branded Phone Case", category: "Accessories", color: "from-fuchsia-500 to-pink-600" },
  { title: "Premium Jogger Set", category: "Apparel", color: "from-indigo-500 to-purple-600" },
  { title: "Unboxing Experience Kit", category: "Packaging", color: "from-violet-500 to-fuchsia-500" },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
};

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="gradient-text">Work</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            A glimpse at merch lines we&apos;ve brought to life for creators.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {items.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
            >
              {/* Gradient placeholder */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-60 group-hover:opacity-80 transition-opacity duration-300`}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <span className="text-xs uppercase tracking-widest text-white/70 mb-2">
                  {item.category}
                </span>
                <h3 className="text-xl font-bold text-white group-hover:scale-105 transition-transform duration-300">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
