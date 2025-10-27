"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { QuestionCard } from "@/components/QuestionCard";
import { QuoteCard } from "@/components/QuoteCard";

import LoadingScreen from "@/components/LoadingScreen";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDarkMode } from "@/hooks/useDarkMode";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { DecorationElements } from "@/components/DecorationElements";
import { Header } from "@/components/Header";

// Catatan: Asumsi struktur data dari Supabase:
// { text: string, optiona: string, optionb: string, type: string (misalnya "R-I") }

export default function TestCard() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true); // Mulai dengan loading saat mengambil data
  const [darkMode, toggleDarkMode] = useDarkMode();

  // STATE UNTUK DATA PERTANYAAN DARI SUPABASE
  const [questions, setQuestions] = useState([]);
  const [questionsMap, setQuestionsMap] = useState([]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [direction, setDirection] = useState(0); // 0: initial, 1: next, -1: prev
  const [isQuoteVisible, setIsQuoteVisible] = useState(false);

  const totalQuestions = questions.length; // Total pertanyaan dihitung dari data yang diambil
  const [progress, setProgress] = useState(0); // Jumlah jawaban
  const [userAnswers, setUserAnswers] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // --- FUNGSI PENGAMBILAN DATA DARI SUPABASE ---
  const fetchQuestions = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("questions") // 🎯 Ganti dengan nama tabel pertanyaan Anda jika berbeda
      .select("text, optiona, optionb, type") // 🎯 Ambil kolom yang dibutuhkan
      .order("id", { ascending: true }); // Urutkan berdasarkan ID

    if (error) {
      console.error("Gagal mengambil pertanyaan:", error);
      alert("Gagal mengambil data pertanyaan dari database.");
      setIsLoading(false);
      return;
    }

    // Pemetaan data pertanyaan
    const mappedQuestions = data.map(q => ({
      text: q.text,
      optionA: q.optiona,
      optionB: q.optionb
    }));
    setQuestions(mappedQuestions);

    // Membuat questionsMap untuk logika RIASEC
    const mapData = data.map(q => {
      // Membersihkan string 'type' untuk mendapatkan dua karakter RIASEC (misalnya dari "R-I" menjadi ["R", "I"])
      const types = q.type.trim().replace(/[^A-Z]/g, '').split(''); 
      return {
        A: types[0] || 'X', // 'X'/'Y' sebagai fallback jika data type tidak valid
        B: types[1] || 'Y'
      };
    });
    setQuestionsMap(mapData);
    setIsLoading(false);
  };

  // --- EFFECT HOOKS ---

  useEffect(() => {
    fetchQuestions(); // Panggil fungsi ambil data saat pertama kali komponen dimuat
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const body = document.body;
    const originalStyle = body.style.overflow;
    if (pathname === "/test") body.style.overflow = "hidden";
    return () => (body.style.overflow = originalStyle);
  }, [pathname]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- LOGIC FUNCTIONS ---

  const calculateResult = (answers) => {
    const types = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    Object.entries(answers).forEach(([idxStr, choice]) => {
      const idx = Number(idxStr);
      const map = questionsMap[idx];
      if (!map) return;
      const chosenType = choice === "A" ? map.A : map.B;
      if (chosenType && types.hasOwnProperty(chosenType)) types[chosenType]++;
    });
    return { counts: types };
  };

  const quotesData = [
    { text: "Jalan menuju keberhasilan dimulai saat kamu memilih jalur yang sesuai dengan hatimu.", by: "Penasihat Karir", quoteIndex: 1 },
    { text: "Mengenali dirimu hari ini adalah kunci untuk merencanakan dirimu di masa depan.", by: "Mentor Pengembangan Diri", quoteIndex: 2 },
    { text: "Jangan takut akan lambatnya kemajuan, takutlah jika kamu tidak bergerak sama sekali.", by: "Motivator", quoteIndex: 3 },
  ];

  const handleAnswer = (index, choice) => {
    if (isLoading || totalQuestions === 0) return;

    // START TEST (dari Cover)
    if (index === -1 && choice === "START") {
      setDirection(1); // Maju
      setCurrentQuestionIndex(0);
      return;
    }
    // FINISH TEST (dari Result Page)
    if (index === totalQuestions && choice === "FINISH") {
      handleShowResult();
      return;
    }

    // NAVIGASI SETELAH QUOTE
    if (isQuoteVisible && choice === "NEXT_FROM_QUOTE") {
      setIsQuoteVisible(false);
      setDirection(1);
      setCurrentQuestionIndex(index + 1);
      return;
    }

    // JAWAB PERTANYAAN
    if (index >= 0 && index < totalQuestions && !userAnswers.hasOwnProperty(index)) {
      setUserAnswers((prev) => ({ ...prev, [index]: choice }));
      const newProgress = progress + 1;
      setProgress(newProgress);

      const nextIndex = index + 1;
      
      // LOGIKA MUNCULKAN QUOTE setelah pertanyaan ke-8, ke-16, ke-24
      if (nextIndex === 8 || nextIndex === 16 || nextIndex === 24) {
          setIsQuoteVisible(true); 
          setDirection(1); 
      } else if (nextIndex <= totalQuestions) {
          setDirection(1); 
          setCurrentQuestionIndex(nextIndex);
      }
      return;
    }

    // NAVIGASI: Pindah ke pertanyaan berikutnya (jika sudah dijawab)
    if (index >= 0 && index < totalQuestions && userAnswers.hasOwnProperty(index)) {
      const nextIndex = index + 1;
      
      // LOGIKA MUNCULKAN QUOTE setelah pertanyaan ke-8, ke-16, ke-24
      if (nextIndex === 8 || nextIndex === 16 || nextIndex === 24) {
          setIsQuoteVisible(true); 
          setDirection(1); 
      } else if (nextIndex <= totalQuestions) {
          setDirection(1); 
          setCurrentQuestionIndex(nextIndex);
      }
    }
  };

  const goToPrev = () => {
    if (currentQuestionIndex > -1) {
      if (isQuoteVisible) {
          // Dari Quote, mundur ke pertanyaan sebelumnya
          setIsQuoteVisible(false);
          setDirection(-1); 
      } else {
          // Dari Pertanyaan, mundur ke pertanyaan sebelumnya
          setDirection(-1);
          setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    }
  };

  const handleShowResult = () => {
    const totalAnswered = Object.keys(userAnswers).length;
    if (totalAnswered < questions.length) {
      console.error(`Jawab semua pertanyaan terlebih dahulu (${totalAnswered}/${questions.length})`);
      return;
    }
    const finalResults = calculateResult(userAnswers);
    localStorage.setItem(
      "riasec_test_results",
      JSON.stringify({
        answers: userAnswers,
        questionsMap,
        results: finalResults,
        darkMode,
      })
    );
    setIsLoading(true);
    setTimeout(() => router.push("/result"), 1200);
  };


  // --- RENDER LOGIC ---

  // Tampilkan Loading Screen jika data belum dimuat
  if (isLoading || totalQuestions === 0) {
    return <LoadingScreen />;
  }
  
  // Tentukan konten Card yang akan ditampilkan 
  let cardComponent;
  let keyCard;
  
  if (isQuoteVisible) {
    const quoteIndex = Math.floor(currentQuestionIndex / 8); 
    const quote = quotesData[quoteIndex - 1] || quotesData[0];

    cardComponent = (
        <QuoteCard
            key={`quote-${quoteIndex}`}
            quote={quote}
            index={currentQuestionIndex}
            handleAnswer={handleAnswer}
            darkMode={darkMode}
            direction={direction}
        />
    );
    keyCard = `quote-${quoteIndex}`;
  } 
  else {
    let CardContent;

    if (currentQuestionIndex === -1) {
      CardContent = questions[0]; 
      keyCard = "cover";
    } else if (currentQuestionIndex < totalQuestions) {
      CardContent = questions[currentQuestionIndex];
      keyCard = `q-${currentQuestionIndex}`;
    } else {
      CardContent = questions[totalQuestions - 1]; 
      keyCard = "result";
    }

    cardComponent = (
      <QuestionCard
          key={keyCard}
          question={CardContent}
          index={currentQuestionIndex}
          totalQuestions={totalQuestions}
          userAnswers={userAnswers}
          handleAnswer={handleAnswer}
          isMobile={isMobile}
          darkMode={darkMode}
          direction={direction}
      />
    );
  }


  // Tentukan apakah progress bar perlu ditampilkan
  const showProgressBar = currentQuestionIndex >= 0 && currentQuestionIndex < totalQuestions && !isQuoteVisible;

  // Tentukan apakah navigasi perlu ditampilkan
  const showNavigation = (currentQuestionIndex > 0 && currentQuestionIndex <= totalQuestions) && !isQuoteVisible;
  
  return (
    <main
      className={`relative min-h-screen flex flex-col items-center justify-center transition-colors duration-500 overflow-hidden ${
        darkMode ? "bg-black text-white" : "bg-orange-300 text-black"
      }`}
    >
      {isLoading && <LoadingScreen />}
      <BackgroundPattern darkMode={darkMode} />
      <DecorationElements darkMode={darkMode} />
      <ThemeToggle darkMode={darkMode} setDarkMode={toggleDarkMode} />
      <Header darkMode={darkMode} />

      {/* Progress Bar */}
{showProgressBar && (
    <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="fixed top-25 z-20 w-[85%] sm:w-[50%] max-w-md bg-black/80 dark:bg-zinc-800 backdrop-blur-sm rounded-2xl shadow-2xl p-3 flex items-center gap-3 text-white"
    >
        <div className="flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-lg w-8 h-8 sm:w-10 sm:h-10">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-green-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18M9 3v18m6-18v18M4.5 9h15m-15 6h15"/>
            </svg>
        </div>

        <div className="flex-1 w-full">
            <div className="flex justify-between text-[10px] sm:text-xs font-bold mb-1 text-white">
                <span>Jawab {progress} / {totalQuestions}</span>
                <span>{Math.max(totalQuestions - progress, 0)} sisa</span>
            </div>

            <div className="w-full bg-gray-500/50 dark:bg-zinc-700 rounded-full h-2.5 overflow-hidden">
                <motion.div
                    className="h-full rounded-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(progress / totalQuestions) * 100}%` }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                />
            </div>
        </div>
    </motion.div>
)}

{/* Card Container Utama */}
<div 
    className="relative z-10 flex flex-col items-center justify-center w-full h-full min-h-screen pt-48 pb-20 sm:pt-36 sm:pb-12"
>
    <div 
        className="relative w-[85%] sm:w-[450px] h-[500px] max-w-md mx-auto flex items-center justify-center"
    >

        {/* AnimatePresence untuk Transisi Card */}
        <AnimatePresence initial={false} custom={direction}>
            {cardComponent}
        </AnimatePresence>

        {/* Navigasi Card (Hanya saat pertanyaan/hasil, tidak saat Quote) */}
        {showNavigation && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5, duration: 0.3 }}
                className="absolute inset-y-0 w-full flex justify-between items-center px-4 pointer-events-none"
            >
                {/* Tombol Sebelumnya */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={goToPrev}
                    className={`p-3 rounded-full shadow-xl bg-white/70 backdrop-blur-sm pointer-events-auto transition-colors ${
                        darkMode ? "text-black hover:bg-white" : "text-black hover:bg-gray-100"
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </motion.button>

                {/* Tombol Selanjutnya (Hanya muncul jika sudah dijawab) */}
                {(userAnswers.hasOwnProperty(currentQuestionIndex) || currentQuestionIndex === totalQuestions) && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleAnswer(currentQuestionIndex, "NEXT")}
                        className={`p-3 rounded-full shadow-xl pointer-events-auto transition-colors ${
                            darkMode ? "bg-indigo-600/90 text-white hover:bg-indigo-700" : "bg-orange-500/90 text-white hover:bg-orange-600"
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </motion.button>
                )}
            </motion.div>
        )}
    </div>
</div>
    </main>
  );
}