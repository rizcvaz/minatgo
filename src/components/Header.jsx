"use client";

import { motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link"; // ✅ Import Link dari next/link

export function Header({ showResults, resetForm, darkMode }) {
  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-[999] py-3 md:py-4 px-4 md:px-6 ${
        darkMode
          ? "bg-zinc-900/90 backdrop-blur-sm"
          : "bg-gradient-to-r from-blue-300/80 to-blue-500/80 backdrop-blur-md border-b border-black/10 shadow-md"
      } transition-colors duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo - Dibungkus dengan Link yang mengarah ke root "/" */}
        <Link href="/">
          <motion.div
            // Hapus onClick={resetForm} karena Link sudah menangani navigasi ke Home
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="images/MinatGo (3).png"
              alt="MinatGo Logo - Kembali ke Beranda"
              className="h-12 w:auto md:h-15 drop-shadow-lg"
            />
          </motion.div>
        </Link>

        {/* Tombol Reset */}
        {showResults && (
          <motion.button
            onClick={resetForm}
            className={`${
              darkMode
                ? "bg-red-500 text-white border-black"
                : "bg-blue-100 text-black border-blue-700"
            } font-bold px-3 py-1.5 md:px-4 md:py-2 border-3 md:border-4 rounded-md shadow-[3px_3px_0px_0px_rgba(0,0,0,0.7)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.7)] flex items-center gap-1 md:gap-2 text-sm md:text-base mr-14 transition-all`}
            whileHover={{
              x: -2,
              y: -2,
              boxShadow: "5px 5px 0px 0px rgba(0,0,0,0.8)",
            }}
            whileTap={{
              x: 0,
              y: 0,
              boxShadow: "3px 3px 0px 0px rgba(0,0,0,0.8)",
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <X className="w-3.5 h-3.5 md:w-4 md:h-4" />
            Reset
          </motion.button>
        )}
      </div>
    </motion.header>
  );
}