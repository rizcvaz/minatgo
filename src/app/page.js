"use client";

import { useState, useRef, useEffect } from "react";
import { Fredoka } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
// Asumsi path import komponen sudah benar
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { Header } from "@/components/Header";
import { DecorationElements } from "@/components/DecorationElements";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Zap,
  Target,
  Users,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// ✅ Import font di luar komponen
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-fredoka",
});

// --- KOMPONEN: BenefitsSection ---
const BenefitsSection = ({ darkMode }) => {
  const benefits = [
    {
      icon: Target,
      title: "Pilih Jurusan Tepat",
      description: "Hindari salah pilih jurusan yang bisa menghabiskan waktu dan biaya kuliahmu.",
      color: "text-blue-500",
      // Warna Latar Belakang Baru untuk Light Mode
      bgColorLight: "bg-blue-100 hover:bg-blue-200",
    },
    {
      icon: BookOpen,
      title: "Kenali Potensi Diri",
      description: "Temukan kekuatan dan kelemahanmu untuk dikembangkan secara maksimal.",
      color: "text-green-500",
      // Warna Latar Belakang Baru untuk Light Mode
      bgColorLight: "bg-green-100 hover:bg-green-200",
    },
    {
      icon: Zap,
      title: "Karir Lebih Fokus",
      description: "Dapatkan rekomendasi karir yang selaras dengan minat dan bakat alami.",
      color: "text-yellow-500",
      // Warna Latar Belakang Baru untuk Light Mode
      bgColorLight: "bg-yellow-100 hover:bg-yellow-200",
    },
    {
      icon: Users,
      title: "Meningkatkan Rasa Percaya Diri",
      description: "Langkah pasti dalam hidup karena sudah tahu kemana arah yang dituju.",
      color: "text-red-500",
      // Warna Latar Belakang Baru untuk Light Mode
      bgColorLight: "bg-red-100 hover:bg-red-200",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Logika kelas untuk kartu dan ikon (Dark Mode tetap konsisten)
  const cardClassesDark = "bg-zinc-800 hover:bg-zinc-700";

  const iconBgClasses = darkMode
    ? "bg-white/10"
    : "bg-gray-200";

  const buttonClasses = darkMode
    ? "bg-yellow-400 text-black hover:bg-yellow-300"
    : "bg-black text-yellow-400 hover:bg-gray-800";


  return (
    <motion.section
      className={`py-16 md:py-24 px-4 w-full ${
        darkMode ? "bg-zinc-950 text-white" : "bg-orange-100 text-black"
      }`}
      id="benefits"
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-extrabold text-center mb-4 relative"
        >
          Mengapa Perlu Ikut <span className="text-orange-500">Tes Minat Bakat</span>?
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-center opacity-70 mb-12 max-w-2xl mx-auto"
        >
          Temukan jawaban atas kebingunganmu dalam memilih jalan hidup dan karir.
        </motion.p>
        
        {/* Benefit Cards Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              // ✅ MODIFIKASI: Menggunakan warna dinamis di Light Mode, warna gelap konsisten di Dark Mode
              className={`p-6 rounded-3xl shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl ${
                darkMode ? cardClassesDark : benefit.bgColorLight
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${iconBgClasses} ${benefit.color} p-2`}
              >
                <benefit.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
              <p className="opacity-80 text-base">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
        >
            <a href="#hero" className={`inline-flex items-center justify-center px-8 py-3 text-lg font-semibold rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${buttonClasses}`}>
                Siap Mulai Tes? <ArrowRight className="w-5 h-5 ml-2" />
            </a>
        </motion.div>
      </div>
    </motion.section>
  );
};

// ------------------------------------

export default function Home() {
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [showIntro, setShowIntro] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  // Scroll ref untuk Hero Section
  const heroRef = useRef(null);

  // Scroll to Hero Section saat pertama kali dimuat
  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);


  const handleStartClick = () => setShowIntro(true);

  const handleContinue = () => {
    setShowIntro(false);
    setIsTransitioning(true);
    // Transisi 1.6 detik
    setTimeout(() => {
      // Setengah durasi transisi, navigasi dimulai
      router.push("/test");
    }, 1000); // Tunda navigasi, berikan waktu untuk animasi transisi keluar.
  };

  return (
    <main
      className={`relative min-h-screen flex flex-col items-center justify-start transition-colors duration-500 ${fredoka.variable} ${
        darkMode ? "bg-black text-white" : "bg-orange-500 text-black"
      }`}
    >
      {/* Background & Dekorasi */}
      <BackgroundPattern darkMode={darkMode} />
      <DecorationElements darkMode={darkMode} />
      <ThemeToggle darkMode={darkMode} setDarkMode={toggleDarkMode} />
      <Header darkMode={darkMode} />

      {/* Konten utama: Hero Section */}
      <section id="hero" ref={heroRef} className="relative z-10 w-full flex flex-col items-center justify-center pt-24 pb-16 md:pt-32 md:pb-20 min-h-[calc(100vh-64px)]">
        <div className="text-center max-w-3xl px-4">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold drop-shadow-lg mb-4"
          >
            Selamat Datang di <span className="text-yellow-400">MinatGo</span>
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
            className="text-xl md:text-2xl opacity-90 mb-10 max-w-xl mx-auto"
          >
            Kenali Dirimu, Tentukan Arahmu! Pilihan karir terbaik dimulai dari sini.
          </motion.p>

          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
            onClick={handleStartClick}
            className={`inline-flex items-center justify-center px-10 py-4 text-xl font-extrabold rounded-3xl shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
              darkMode
                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                : "bg-black text-yellow-400 hover:bg-gray-800"
            }`}
          >
            Mulai Tes!
          </motion.button>
        </div>

        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-10"
        >
            <a href="#benefits" className={`inline-flex flex-col items-center opacity-70 transition-opacity hover:opacity-100 ${darkMode ? 'text-white' : 'text-black'}`}>
                <span className="text-sm font-medium mb-1">Cari Tahu Lebih Lanjut</span>
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                >
                    <ArrowRight className="w-6 h-6 rotate-90" />
                </motion.div>
            </a>
        </motion.div>

      </section>

      {/* Section Manfaat */}
      <div id="benefits" className="w-full">
        <BenefitsSection darkMode={darkMode} />
      </div>

      {/* Popup Intro (Simbol dibersihkan) */}
      <AnimatePresence>
        {showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`relative ${
                darkMode ? "bg-zinc-900 text-white" : "bg-white text-black"
              } rounded-3xl shadow-2xl max-w-md w-[90%] p-8 text-center`}
            >
              <div className="flex justify-center mb-6">
                <Image
                  src="/images/character/Chubby1.png"
                  alt="Chubby"
                  width={140}
                  height={140}
                  className="drop-shadow-xl"
                />
              </div>

              <div
                className={`relative mx-auto mb-8 rounded-2xl p-5 border-l-4 ${
                  darkMode
                    ? "bg-zinc-800 border-yellow-400"
                    : "bg-yellow-100 border-orange-500"
                } shadow-md`}
              >
                <p className="text-lg font-medium leading-relaxed">
                  Hei, tahukah kamu? <br />
                  <b className="text-orange-500 dark:text-yellow-400">Lebih dari 60% mahasiswa</b> merasa mereka salah memilih
                  jurusan. Tes ini membantumu menemukan{" "}
                  <b>arah yang sesuai</b> dengan kepribadian dan potensimu!
                </p>
              </div>

              <button
                onClick={handleContinue}
                className={`px-8 py-3 text-lg rounded-2xl font-bold shadow-xl transition-transform duration-300 hover:scale-105 active:scale-95 ${
                  darkMode
                    ? "bg-yellow-400 text-black hover:bg-yellow-300"
                    : "bg-black text-yellow-400 hover:bg-gray-800"
                }`}
              >
                Saya Siap! Lanjutkan Tes <ArrowRight className="w-5 h-5 ml-2 inline-block" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌟 Transition Loading BARU - Lebih Keren! */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="page-transition"
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(150% at 50% 50%)" }}
            exit={{ clipPath: "circle(0% at 50% 50%)" }}
            transition={{ duration: 1.5, ease: [0.8, 0.05, 0, 1] }} // Transisi custom yang unik
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-800 via-purple-700 to-fuchsia-600 text-white"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-white border-t-yellow-400 rounded-full mb-6 shadow-lg"
            />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-3xl font-extrabold tracking-widest uppercase"
            >
              Menyiapkan Tes Terbaik...
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-lg mt-2"
            >
              Mohon tunggu sebentar ya!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}