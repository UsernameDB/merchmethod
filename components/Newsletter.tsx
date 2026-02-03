"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function Newsletter() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [email, setEmail] = useState("");

  const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID || "YOUR_FORM_ID";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const data = new FormData();
    data.append("email", email);
    data.append("_subject", "New Newsletter Subscriber");

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="newsletter" className="py-24 px-6 relative">
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center mx-auto mb-8">
            <Mail size={28} className="text-white" />
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Stay in the <span className="gradient-text">Loop</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Get exclusive updates on merch trends, creator drops, and insider tips
            delivered straight to your inbox.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          onSubmit={handleSubmit}
          className="glass-card rounded-2xl p-8 max-w-lg mx-auto"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="gradient-btn px-8 py-3 rounded-full font-semibold text-white disabled:opacity-60 whitespace-nowrap"
            >
              {status === "submitting" ? "Subscribing..." : "Subscribe"}
            </button>
          </div>

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-green-400 text-sm justify-center mt-4"
            >
              <CheckCircle size={18} />
              You&apos;re in! Watch your inbox.
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-red-400 text-sm justify-center mt-4"
            >
              <AlertCircle size={18} />
              Something went wrong. Try again.
            </motion.div>
          )}

          <p className="text-gray-500 text-xs mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.form>
      </div>
    </section>
  );
}
