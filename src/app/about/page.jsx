"use client";

import { useState, useEffect } from "react";
import { Fredoka } from "next/font/google";
import { motion } from "framer-motion";
import Link from "next/link"; 

import { BackgroundPattern } from "@/components/BackgroundPattern";
import { Header } from "@/components/Header";
import { DecorationElements } from "@/components/DecorationElements";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDarkMode } from "@/hooks/useDarkMode";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "600"] });

const AboutPage = () => {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTeamMembers([
        { id: 1, name: "Moh. Rizki Risaleh", role: "Lead & Frontend Developer" },
        { id: 2, name: "Aditya Bangun Senjaya", role: "UX/UI Designer" },
        { id: 3, name: "Ahdi Tri Julianto", role: "Full Stack Engineer" },
        { id: 4, name: "Muhammad Ridwan", role: "Content Strategist" },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, when: "beforeChildren" }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <div className={`relative min-h-screen mt-12 flex flex-col items-center pb-12 overflow-hidden transition-colors duration-500 ${fredoka.className} ${darkMode ? "bg-zinc-900 text-white" : "bg-gray-50 text-zinc-900"}`}>
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            Mengenal MinatGO
          </motion.h1>

          <motion.p className="text-zinc-600 dark:text-zinc-300 mb-6 text-base leading-relaxed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            MinatGo merupakan sebuah platform tes minat dan bakat yang dikembangkan oleh team BlessCode, dengan harapan dapat membantu orang-orang mengenali minat, bakat, serta potensi yang mereka miliki
          </motion.p>
          
          <motion.h2 className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-8 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
           Blesscode Team
          </motion.h2>

          {isLoading ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 py-3 text-sm">Memuat anggota tim...</motion.p>
          ) : (
            <motion.ul 
              className="space-y-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {teamMembers.map((member) => (
    <motion.li
  key={member.id}
  className="p-3 flex flex-col sm:flex-row sm:justify-between sm:items-center rounded-lg transition-colors duration-300 cursor-pointer"
  variants={itemVariants}
  whileHover={{ 
   backgroundColor: darkMode ? "#525252" : "#d1d5db", // aman untuk teks
  }}
  transition={{ duration: 0.25 }}
>
  <span className="text-base font-semibold text-zinc-900 dark:text-white">{member.name}</span>
  <span className="text-sm text-indigo-700 dark:text-indigo-300 sm:text-right">{member.role}</span>
</motion.li>


              ))}
            </motion.ul>
          )}

          <motion.div className="mt-8 pt-4 border-t border-indigo-200 dark:border-zinc-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <Link href="/contact">
              <motion.button
                className="w-full sm:w-auto flex items-center justify-center px-6 py-2 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition duration-300 shadow-md shadow-indigo-500/50 text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Hubungi Kami &rarr;
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
