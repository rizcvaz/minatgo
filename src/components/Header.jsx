"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Menu } from "lucide-react";
import Link from "next/link";

export function Header({ showResults, resetForm, darkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Question", href: "/admin" },
    // { name: "About", href: "/about" },
    // { name: "Contact", href: "/contact" },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-[999] py-3 md:py-4 px-4 md:px-8 flex items-center justify-between ${
        darkMode
          ? "bg-zinc-900/90 backdrop-blur-sm"
          : "bg-gradient-to-r from-blue-300/80 to-blue-500/80 backdrop-blur-md border-b border-black/10 shadow-md"
      } transition-colors duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* 🔹 Kiri: Logo */}
      <Link href="/">
        <motion.div
          className="flex items-center gap-3 cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          <img
            src="/images/MinatGo (3).png"
            alt="MinatGo Logo"
            className="h-10 md:h-14 drop-shadow-lg"
          />
        </motion.div>
      </Link>

      {/* 🔹 Tengah: Navigasi */}
      <nav className="hidden md:flex gap-8 font-semibold text-sm md:text-base absolute left-1/2 -translate-x-1/2">
        {navLinks.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`transition-colors duration-200 ${
              darkMode
                ? "text-gray-200 hover:text-yellow-400"
                : "text-white hover:text-blue-900"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>

      {/* 🔹 Kanan: Tombol Reset (desktop) + Hamburger (mobile) */}
      <div className="flex items-center gap-3">
        {showResults && (
          <motion.button
            onClick={resetForm}
            className={`hidden md:flex ${
              darkMode
                ? "bg-red-500 text-white border-black"
                : "bg-blue-100 text-black border-blue-700"
            } font-bold px-3 py-1.5 md:px-4 md:py-2 border-3 md:border-4 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] text-sm md:text-base transition-all`}
          >
            <X className="w-4 h-4 mr-1" />
            Reset
          </motion.button>
        )}

        {/* Tombol Hamburger */}
        <button
          onClick={toggleMenu}
          className={`md:hidden p-2 rounded-full border-2 shadow-lg ${
            darkMode
              ? "text-yellow-400 border-yellow-400 bg-zinc-800 hover:bg-zinc-700"
              : "text-black border-black bg-blue hover:bg-gray-200"
          }`}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* 🔹 Popup Menu Mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className={`absolute top-full left-0 w-full shadow-lg z-[9998] ${
              darkMode
                ? "bg-zinc-900/95 text-gray-100"
                : "bg-blue-400/95 text-white"
            } backdrop-blur-lg border-t border-gray-300/40`}
          >
            <div className="flex flex-col items-center py-4 space-y-3">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block text-lg font-semibold transition-colors duration-200 ${
                    darkMode
                      ? "text-gray-200 hover:text-yellow-400"
                      : "text-white hover:text-yellow-200"
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {showResults && (
                <motion.button
                  onClick={() => {
                    resetForm();
                    setMenuOpen(false);
                  }}
                  className={`mt-2 ${
                    darkMode
                      ? "bg-red-500 text-white border-black"
                      : "bg-white text-blue-800 border-blue-700"
                  } font-bold px-6 py-2 border-2 rounded-md shadow-md text-base`}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
