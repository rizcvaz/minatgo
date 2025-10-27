"use client";

import { useState, useEffect } from "react";
import { Fredoka } from "next/font/google";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { BackgroundPattern } from "@/components/BackgroundPattern";
import { Header } from "@/components/Header";
import { DecorationElements } from "@/components/DecorationElements";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDarkMode } from "@/hooks/useDarkMode";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "600"] });

export default function AdminLoginPage() {
  const { darkMode, setDarkMode } = useDarkMode();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    // Simulasi login sederhana
    if (username === "admin" && password === "12345") {
      localStorage.setItem("isAdmin", "true");
      router.push("/admin/question");
    } else {
      setError("Username atau password salah!");
    }
  };

  useEffect(() => {
    // Cek jika sudah login sebelumnya
    const loggedIn = localStorage.getItem("isAdmin");
    if (loggedIn) {
      router.push("/admin/question");
    }
  }, [router]);

  return (
    <div
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden transition-colors duration-500 ${
        darkMode ? "bg-zinc-900 text-white" : "bg-blue-50 text-zinc-900"
      }`}
    >
      <BackgroundPattern />
      <DecorationElements darkMode={darkMode} />
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />

      <Header darkMode={darkMode} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-20 text-center mt-8"
      >
        <h1
          className={`${fredoka.className} text-2xl md:text-3xl font-semibold mb-4`}
        >
          Masuk sebagai admin untuk mengelola soal tes minat bakat
        </h1>

        <form
          onSubmit={handleLogin}
          className="mt-6 bg-white/10 dark:bg-zinc-800/70 backdrop-blur-md p-6 rounded-2xl shadow-lg max-w-sm mx-auto flex flex-col gap-4 border border-zinc-200/30"
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded-lg bg-white dark:bg-zinc-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-white dark:bg-zinc-700 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />

          {error && (
            <p className="text-red-500 text-sm font-medium mt-1">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="bg-purple-600 text-white py-2 px-4 rounded-lg font-semibold shadow-md hover:bg-purple-700 transition-colors"
          >
            Login
          </motion.button>
        </form>

        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Gunakan username: <b>admin</b> & password: <b>12345</b> untuk demo.
        </p>
      </motion.div>
    </div>
  );
}
