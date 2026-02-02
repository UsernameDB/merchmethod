"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

const followerOptions = [
  "Under 10K",
  "10K – 50K",
  "50K – 100K",
  "100K – 500K",
  "500K – 1M",
  "1M+",
];

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID || "YOUR_FORM_ID";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-24 px-6 relative">
      <div className="absolute inset-0 radial-glow opacity-40" />
      <div className="relative max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Let&apos;s <span className="gradient-text">Talk</span>
          </h2>
          <p className="text-gray-400 text-lg">
            Ready to launch your merch? Fill out the form and we&apos;ll get back to
            you within 24 hours.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl p-8 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="instagram" className="block text-sm font-medium mb-2">
                Instagram Handle
              </label>
              <input
                type="text"
                id="instagram"
                name="instagram"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                placeholder="@yourhandle"
              />
            </div>
            <div>
              <label htmlFor="followers" className="block text-sm font-medium mb-2">
                Follower Count
              </label>
              <select
                id="followers"
                name="followers"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
              >
                <option value="" className="bg-gray-900">Select range</option>
                {followerOptions.map((opt) => (
                  <option key={opt} value={opt} className="bg-gray-900">
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
              placeholder="Tell us about your brand and what you're looking for..."
            />
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full gradient-btn py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {status === "submitting" ? (
              "Sending..."
            ) : (
              <>
                Send Inquiry <Send size={18} />
              </>
            )}
          </button>

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-green-400 text-sm justify-center"
            >
              <CheckCircle size={18} />
              Message sent! We&apos;ll be in touch soon.
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 text-sm justify-center"
            >
              <AlertCircle size={18} />
              Something went wrong. Please try again.
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
}
