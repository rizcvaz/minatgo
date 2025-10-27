"use client";

import { useState } from "react";
import { Fredoka } from "next/font/google";
import { motion } from "framer-motion";

import { BackgroundPattern } from "@/components/BackgroundPattern";
import { Header } from "@/components/Header";
import { DecorationElements } from "@/components/DecorationElements";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDarkMode } from "@/hooks/useDarkMode";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "600"] });

const ContactPage = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulasi pengiriman pesan sukses
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div
      className={`relative min-h-screen mt-12 flex flex-col items-center pb-12 overflow-hidden transition-colors duration-500 ${fredoka.className} ${darkMode ? "bg-zinc-900 text-white" : "bg-gray-50 text-white"}`}
    >
      <BackgroundPattern darkMode={darkMode} />
      <DecorationElements darkMode={darkMode} />
      <Header darkMode={darkMode} />

      <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[999]">
        <ThemeToggle darkMode={darkMode} setDarkMode={toggleDarkMode} />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto p-4 pt-12">
        <motion.div
          className="p-6 rounded-xl shadow-lg backdrop-blur-md bg-white/95 dark:bg-zinc-800/95 border border-indigo-100 dark:border-zinc-700/50"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl font-extrabold mb-5 pb-3 border-b border-indigo-200 dark:border-zinc-700 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 dark:from-indigo-400 dark:to-purple-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Hubungi Kami
          </motion.h1>

          <motion.p
            className="text-zinc-600 dark:text-zinc-300 mb-6 text-base leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Punya pertanyaan, masukan, atau ingin bekerja sama dengan kami? Silakan isi formulir di bawah.
          </motion.p>

          {submitted && (
            <motion.div
              className="mb-4 p-3 bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-200 rounded-md text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Terima kasih! Pesan Anda telah dikirim.
            </motion.div>
          )}

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Nama
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </motion.div>

            <motion.div>
              <label className="block text-sm font-medium mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </motion.div>

            <motion.div>
              <label className="block text-sm font-medium mb-1" htmlFor="message">
                Pesan
              </label>
              <textarea
                name="message"
                id="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-indigo-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </motion.div>

            <motion.button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition duration-300 shadow-md shadow-indigo-500/50 text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Kirim Pesan
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactPage;
