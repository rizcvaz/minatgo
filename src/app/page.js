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
  ArrowRight,
} from "lucide-react";

// ✅ Import font di luar komponen
const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-fredoka",
});

// --- KOMPONEN: BenefitsSection (Dipercantik & Diperbaiki) ---

// ✅ Terima prop isMounted
const BenefitsSection = ({ darkMode, isMounted }) => { 
  const benefits = [
    {
      icon: Target,
      title: "Pilih Jurusan Tepat",
      description: "Hindari salah pilih jurusan yang bisa menghabiskan waktu dan biaya kuliahmu.",
      color: "text-blue-500",
      bgColorLight: "bg-blue-100 hover:bg-blue-200",
      shadow: "shadow-blue-300/50 dark:shadow-blue-500/30",
    },
    {
      icon: BookOpen,
      title: "Kenali Potensi Diri",
      description: "Temukan kekuatan dan kelemahanmu untuk dikembangkan secara maksimal.",
      color: "text-green-500",
      bgColorLight: "bg-green-100 hover:bg-green-200",
      shadow: "shadow-green-300/50 dark:shadow-green-500/30",
    },
    {
      icon: Zap,
      title: "Karir Lebih Fokus",
      description: "Dapatkan rekomendasi karir yang selaras dengan minat dan bakat alami.",
      color: "text-yellow-500",
      bgColorLight: "bg-yellow-100 hover:bg-yellow-200",
      shadow: "shadow-yellow-300/50 dark:shadow-yellow-500/30",
    },
    {
      icon: Users,
      title: "Meningkatkan Rasa Percaya Diri",
      description: "Langkah pasti dalam hidup karena sudah tahu kemana arah yang dituju.",
      color: "text-red-500",
      bgColorLight: "bg-red-100 hover:bg-red-200",
      shadow: "shadow-red-300/50 dark:shadow-red-500/30",
    },
  ];

  const [scrollY, setScrollY] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
          const offset = window.innerHeight - rect.top;
          setScrollY(offset);
        }
      }
    };

    if (typeof window !== 'undefined') {
        window.addEventListener("scroll", handleScroll);
    }
    
    return () => {
        if (typeof window !== 'undefined') {
            window.removeEventListener("scroll", handleScroll);
        }
    };
  }, []);

  // Varian Framer Motion (Tidak Berubah)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };
  const itemVariants = {
    hidden: { y: 50, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };
  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { delay: 0.5, type: "spring", stiffness: 200, damping: 10 },
    },
  };

  // Logika kelas untuk kartu dan ikon
  const cardClassesDark = "bg-zinc-800 border-zinc-700/50";
  const iconBgClasses = darkMode ? "bg-white/10" : "bg-white shadow-lg"; 
  const buttonClasses = darkMode
    ? "bg-yellow-400 text-black hover:bg-yellow-300"
    : "bg-black text-yellow-400 hover:bg-gray-800";

  const parallaxY = scrollY * 0.15; 

  // ✅ SOLUSI UNTUK HYDRATION/MOTION BUG:
  // Jangan render konten ini di server (atau saat initial client pass)
  // jika state belum ter-mount dan stabil.
  if (!isMounted) return <div className="py-20 md:py-32" id="benefits" />; // Render placeholder agar layout tidak bergeser

  return (
    <motion.section
      className={`py-20 md:py-32 px-4 w-full ${
        darkMode ? "bg-zinc-950 text-white" : "bg-gradient-to-br from-orange-50 to-orange-100 text-black"
      }`}
      id="benefits"
      ref={sectionRef}
    >
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section dengan Parallax */}
        <div className="text-center mb-16 overflow-hidden">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ y: -parallaxY }} 
            className={`text-4xl md:text-6xl font-extrabold mb-4 relative ${darkMode ? 'text-white' : 'text-zinc-900'}`}
          >
            Mengapa Perlu Ikut <span className="text-orange-500 dark:text-yellow-400">Tes Minat Bakat</span>?
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            style={{ y: parallaxY * 0.5 }} 
            className="text-lg md:text-xl opacity-80 max-w-3xl mx-auto"
          >
            Tes ini bukan sekadar kuis, tapi kompas pribadimu. Temukan jawaban atas kebingunganmu dalam memilih jalan hidup dan karir.
          </motion.p>
        </div>
        
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
              whileHover={{ 
                scale: 1.05, 
                rotate: index % 2 === 0 ? 1 : -1, 
                y: -5,
                boxShadow: darkMode 
                  ? `0 20px 40px -10px ${benefit.color.replace('text-blue-500', 'rgba(59, 130, 246, 0.5)').replace('text-green-500', 'rgba(34, 197, 94, 0.5)').replace('text-yellow-500', 'rgba(234, 179, 8, 0.5)').replace('text-red-500', 'rgba(239, 68, 68, 0.5)')} ` 
                  : `0 15px 30px -5px rgba(0,0,0,0.15), 0 5px 10px -5px ${benefit.color.replace('text-blue-500', 'rgba(59, 130, 246, 0.3)').replace('text-green-500', 'rgba(34, 197, 94, 0.3)').replace('text-yellow-500', 'rgba(234, 179, 8, 0.3)').replace('text-red-500', 'rgba(239, 68, 68, 0.3)')}`, 
              }}
              whileTap={{ scale: 0.98, rotate: 0 }}
              className={`p-6 rounded-3xl transition-all duration-300 transform cursor-pointer border-2 ${
                darkMode ? cardClassesDark : `${benefit.bgColorLight} border-transparent`
              } hover:border-orange-500 dark:hover:border-yellow-400 shadow-xl ${benefit.shadow}`}
              style={{ perspective: 1000 }} 
            >
              <motion.div
                className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-6 p-2 ${iconBgClasses} ${benefit.color} border-2 border-transparent`}
                variants={iconVariants} 
                whileHover={{ rotate: 360, scale: 1.1 }} 
              >
                <benefit.icon className="w-8 h-8 md:w-9 md:h-9" />
              </motion.div>
              <h3 className="text-xl md:text-2xl font-extrabold mb-3 leading-snug">{benefit.title}</h3>
              <p className="opacity-90 text-sm md:text-base">{benefit.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button - Perbaikan Agresif untuk Visibilitas */}
        <motion.div
            // ✅ KEMBALIKAN initial, TAPI PAKSA OPACITY=0 AGAR ANIMASI BERJALAN DARI AWAL
            // Jika Anda ingin tombol ini SELALU terlihat sampai di-scroll:
            initial={{ scale: 0.9, opacity: 0 }} 
            
            // ✅ Ubah nilai whileInView ke nilai akhir yang diinginkan (terlihat)
            whileInView={{ scale: 1, opacity: 1 }}
            
            transition={{ duration: 0.5, delay: 0.6 }}
            
            // ✅ Biarkan viewport seperti ini
            viewport={{ once: true, amount: 0.5 }} 
            
            // ✅ TAMBAHKAN KELAS CSS DEFAULT VISIBILITY JIKA FRAMER MOTION GAGAL
            className="mt-20 text-center opacity-0" 
            
        >
            <a href="#hero" className={`inline-flex items-center justify-center px-12 py-4 text-xl font-extrabold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${buttonClasses} ring-4 ring-offset-4 ${darkMode ? 'ring-yellow-400/30 ring-offset-zinc-950' : 'ring-orange-500/30 ring-offset-orange-100'}`}>
                Siap Ambil Langkah Pertama? <ArrowRight className="w-6 h-6 ml-3" />
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
  const [isMounted, setIsMounted] = useState(false); // ✅ State untuk mengatasi Hydration Error
  const router = useRouter();

  // Scroll ref untuk Hero Section
  const heroRef = useRef(null);

  useEffect(() => {
    // ✅ PENTING: Set isMounted menjadi true setelah komponen mount di client
    setIsMounted(true); 
    
    // Scroll to Hero Section saat pertama kali dimuat
    if (heroRef.current) {
      heroRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);


  const handleStartClick = () => setShowIntro(true);

  const handleContinue = () => {
    setShowIntro(false);
    setIsTransitioning(true);
    setTimeout(() => {
      router.push("/test");
    }, 1000); 
  };

  // ✅ PENTING: Tunda render elemen utama yang bergantung pada state client (darkMode)
  if (!isMounted) {
    return (
        <div 
            className={`min-h-screen flex items-center justify-center ${fredoka.variable} bg-gray-100 dark:bg-zinc-950`}
        >
            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
  }

  return (
    <main
      className={`relative min-h-screen flex flex-col items-center justify-start transition-colors duration-500 ${fredoka.variable} ${
        // Kelas ini kini hanya dirender setelah isMounted=true
        darkMode ? "bg-black text-white" : "bg-orange-500 text-black"
      }`}
    >
      {/* Background & Dekorasi */}
      {/* Komponen-komponen ini juga hanya dirender setelah isMounted=true */}
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
        {/* ✅ Kirim prop isMounted ke BenefitsSection */}
        <BenefitsSection darkMode={darkMode} isMounted={isMounted} /> 
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
        } rounded-2xl shadow-2xl max-w-sm w-[85%] p-5 text-center`}
      >
        <div className="flex justify-center mb-4">
          <Image
            src="/images/character/Chubby1.png"
            alt="Chubby"
            width={100}
            height={100}
            className="drop-shadow-xl"
          />
        </div>

        <div
          className={`relative mx-auto mb-6 rounded-xl p-4 border-l-4 ${
            darkMode
              ? "bg-zinc-800 border-yellow-400"
              : "bg-yellow-100 border-orange-500"
          } shadow-md`}
        >
          <p className="text-base font-medium leading-relaxed">
            Anda akan dialihkan ke halaman tes, mohon untuk tidak merefresh halaman selama tes berlangsung.
          </p>
        </div>

        <button
          onClick={handleContinue}
          className={`px-6 py-2.5 text-base rounded-xl font-bold shadow-lg transition-transform duration-300 hover:scale-105 active:scale-95 ${
            darkMode
              ? "bg-yellow-400 text-black hover:bg-yellow-300"
              : "bg-black text-yellow-400 hover:bg-gray-800"
          }`}
        >
          Lanjutkan <ArrowRight className="w-4 h-4 ml-1 inline-block" />
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
            transition={{ duration: 1.5, ease: [0.8, 0.05, 0, 1] }} 
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