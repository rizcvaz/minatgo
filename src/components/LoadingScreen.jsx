"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src="/images/character/Chubby1.png"
          alt="Loading Chubby"
          width={150}
          height={150}
          className="drop-shadow-lg"
        />
      </motion.div>

      <motion.h1
        className="mt-6 text-3xl font-bold"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        Memuat MinatGo...
      </motion.h1>

      <motion.div
        className="mt-6 w-64 h-2 bg-gray-700 rounded-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <motion.div
          className="h-full bg-yellow-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
