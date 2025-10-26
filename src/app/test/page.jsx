"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import HTMLFlipBook from "react-pageflip";
import Image from "next/image";

import LoadingScreen from "@/components/LoadingScreen";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDarkMode } from "@/hooks/useDarkMode";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { DecorationElements } from "@/components/DecorationElements";
import { Header } from "@/components/Header";

import "./flipbook.css";

export default function TestFlipbook() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const bookRef = useRef();
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [isMobile, setIsMobile] = useState(false); // 💡 Tambahkan state untuk mendeteksi mobile

  useEffect(() => {
    if (typeof window === "undefined") return;
    const body = document.body;
    const originalStyle = body.style.overflow;
    if (pathname === "/test") body.style.overflow = "hidden";
    return () => (body.style.overflow = originalStyle);
  }, [pathname]);

  // 💡 useEffect untuk mendeteksi ukuran layar dan mengatur isMobile
  useEffect(() => {
    const checkMobile = () => {
      // Asumsi mobile jika window.innerWidth < 640px (sesuai breakpoint 'sm' Tailwind)
      // Anda bisa menyesuaikan angka ini
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile(); // Panggil saat mount
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  

  // 🔸 Pertanyaan & Mapping tetap sama
const questions = [
    // 1. R (Realistic): suka kegiatan praktis, teknis, lapangan
    { text: "Kamu merasa lebih menikmati aktivitas yang melibatkan keterampilan tangan atau pemecahan masalah logis?", optionA: "Keterampilan tangan", optionB: "Pemecahan masalah logis" }, // R vs I
    { text: "Kamu lebih suka memperbaiki sesuatu yang rusak atau mencari tahu penyebab kerusakannya?", optionA: "Memperbaiki", optionB: "Mencari tahu penyebabnya" }, // R vs I
    { text: "Kamu lebih nyaman bekerja di lingkungan terbuka atau di dalam ruangan dengan komputer?", optionA: "Lingkungan terbuka", optionB: "Di dalam ruangan", comment: "R vs C" }, // R vs C
    { text: "Kamu lebih tertarik bekerja dengan alat dan mesin atau dengan data dan informasi?", optionA: "Alat dan mesin", optionB: "Data dan informasi" }, // R vs C
    { text: "Kamu lebih suka pekerjaan yang membutuhkan aktivitas fisik atau analisis mendalam?", optionA: "Aktivitas fisik", optionB: "Analisis mendalam" }, // R vs I

    // 2. I (Investigative): analitis, penasaran, ilmiah
    { text: "Kamu lebih senang mencari pola dari data atau menciptakan sesuatu dari imajinasimu?", optionA: "Mencari pola", optionB: "Menciptakan sesuatu" }, // I vs A
    { text: "Kamu lebih suka mengamati fenomena dan menarik kesimpulan, atau mengekspresikan ide dengan cara unik?", optionA: "Mengamati dan menyimpulkan", optionB: "Mengekspresikan ide" }, // I vs A
    { text: "Kamu lebih tertarik melakukan riset untuk menemukan fakta baru atau membuat karya visual yang menarik?", optionA: "Melakukan riset", optionB: "Membuat karya visual" }, // I vs A
    { text: "Kamu lebih suka memahami cara kerja sesuatu atau mengajarkannya kepada orang lain?", optionA: "Memahami cara kerja", optionB: "Mengajarkan ke orang lain" }, // I vs S
    { text: "Kamu lebih senang bekerja dengan teori dan konsep atau dengan perasaan dan intuisi?", optionA: "Teori dan konsep", optionB: "Perasaan dan intuisi" }, // I vs A

    // 3. A (Artistic): kreatif, ekspresif, bebas
    { text: "Kamu merasa lebih nyaman bekerja tanpa aturan kaku atau dengan pedoman yang jelas?", optionA: "Tanpa aturan kaku", optionB: "Dengan pedoman jelas" }, // A vs C
    { text: "Kamu lebih senang menulis cerita atau memecahkan soal logika?", optionA: "Menulis cerita", optionB: "Memecahkan soal logika" }, // A vs I
    { text: "Kamu lebih suka menggambar sesuatu dari imajinasi atau mendesain berdasarkan kebutuhan klien?", optionA: "Dari imajinasi", optionB: "Berdasarkan kebutuhan klien" }, // A vs E
    { text: "Kamu lebih tertarik pada bidang seni dan ekspresi atau sistem dan struktur kerja?", optionA: "Seni dan ekspresi", optionB: "Sistem dan struktur" }, // A vs C
    { text: "Kamu lebih senang menciptakan ide baru atau menyempurnakan ide yang sudah ada?", optionA: "Menciptakan ide baru", optionB: "Menyempurnakan ide" }, // A vs C

    // 4. S (Social): suka membantu, mengajar, berhubungan dengan orang lain
    { text: "Kamu lebih suka membantu orang memahami sesuatu atau mengembangkan ide pribadi?", optionA: "Membantu orang memahami", optionB: "Mengembangkan ide pribadi" }, // S vs A
    { text: "Kamu lebih senang mendengarkan dan memberi nasihat atau memimpin dan mengambil keputusan?", optionA: "Mendengarkan dan memberi nasihat", optionB: "Memimpin dan mengambil keputusan" }, // S vs E
    { text: "Kamu merasa lebih bersemangat saat bekerja dengan banyak orang atau saat fokus bekerja sendiri?", optionA: "Dengan banyak orang", optionB: "Sendiri" }, // S vs I
    { text: "Kamu lebih suka berperan sebagai pengajar atau peneliti?", optionA: "Pengajar", optionB: "Peneliti" }, // S vs I
    { text: "Kamu lebih senang membantu orang mencapai tujuan mereka atau mencapai tujuan pribadimu?", optionA: "Membantu orang lain", optionB: "Tujuan pribadi" }, // S vs E

    // 5. E (Enterprising): memimpin, berani, bisnis
    { text: "Kamu lebih tertarik menyusun strategi atau menjalankan tugas yang sudah ditentukan?", optionA: "Menyusun strategi", optionB: "Menjalankan tugas" }, // E vs C
    { text: "Kamu lebih suka memotivasi orang lain atau menganalisis data untuk mengambil keputusan?", optionA: "Memotivasi orang lain", optionB: "Menganalisis data" }, // E vs I
    { text: "Kamu lebih senang menjual ide kepada orang lain atau mengerjakannya sendiri secara teknis?", optionA: "Menjual ide", optionB: "Mengerjakannya teknis" }, // E vs R
    { text: "Kamu lebih suka pekerjaan yang menantang dan kompetitif atau yang stabil dan teratur?", optionA: "Menantang dan kompetitif", optionB: "Stabil dan teratur" }, // E vs C
    { text: "Kamu lebih tertarik membangun relasi untuk peluang baru atau mendalami satu bidang secara spesifik?", optionA: "Membangun relasi", optionB: "Mendalami bidang" }, // E vs I

    // 6. C (Conventional): teratur, administratif, suka struktur
    { text: "Kamu lebih nyaman dengan pekerjaan yang memiliki aturan jelas atau yang memberi kebebasan penuh?", optionA: "Aturan jelas", optionB: "Kebebasan penuh" }, // C vs A
    { text: "Kamu lebih suka mengelola data dan dokumen atau membuat ide baru dari nol?", optionA: "Mengelola data", optionB: "Membuat ide baru" }, // C vs A
    { text: "Kamu lebih senang mengikuti prosedur yang sudah ada atau mencoba pendekatan baru?", optionA: "Mengikuti prosedur", optionB: "Pendekatan baru" }, // C vs A
    { text: "Kamu lebih suka menyusun jadwal kerja orang lain atau menjalankan jadwal yang dibuat orang lain?", optionA: "Menyusun jadwal", optionB: "Menjalankan jadwal" }, // C vs E
    { text: "Kamu lebih suka pekerjaan yang terorganisir dan rapi atau fleksibel dan berubah-ubah?", optionA: "Terorganisir dan rapi", optionB: "Fleksibel dan berubah-ubah" } // C vs E
  ];

  const questionsMap = [
    // 1..5 block R vs ...
    { A: "R", B: "I" },
    { A: "R", B: "I" },
    { A: "R", B: "C" },
    { A: "R", B: "C" },
    { A: "R", B: "I" },

    // 6..10 I vs ...
    { A: "I", B: "A" },
    { A: "I", B: "A" },
    { A: "I", B: "A" },
    { A: "I", B: "S" },
    { A: "I", B: "A" },

    // 11..15 A vs ...
    { A: "A", B: "C" },
    { A: "A", B: "I" },
    { A: "A", B: "E" },
    { A: "A", B: "C" },
    { A: "A", B: "C" },

    // 16..20 S vs ...
    { A: "S", B: "A" },
    { A: "S", B: "E" },
    { A: "S", B: "I" },
    { A: "S", B: "I" },
    { A: "S", B: "E" },

    // 21..25 E vs ...
    { A: "E", B: "C" },
    { A: "E", B: "I" },
    { A: "E", B: "R" },
    { A: "E", B: "C" },
    { A: "E", B: "I" },

    // 26..30 C vs ...
    { A: "C", B: "A" },
    { A: "C", B: "A" },
    { A: "C", B: "A" },
    { A: "C", B: "E" },
    { A: "C", B: "E" },
  ];


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

  const handleFlip = (e) => {
    // Pengecekan: Pastikan ref buku sudah terinisialisasi
    if (!bookRef.current || !bookRef.current.pageFlip) return; 

    const pageFlipInstance = bookRef.current.pageFlip();
    const currentPage = e.data;
    const totalPages = pageFlipInstance.getPageCount();

    if (currentPage === 0) {
      setIsBookOpen(false);
      setIsFinished(false);
    } else if (currentPage < totalPages - 1) {
      setIsBookOpen(true);
      setIsFinished(false);
    } else if (currentPage === totalPages - 1) {
      setIsBookOpen(false);
      setIsFinished(true);
    }
  };

  const handleAnswer = (index, choice) => {
    if (userAnswers.hasOwnProperty(index)) return;
    setUserAnswers((prev) => ({ ...prev, [index]: choice }));
    setProgress((prev) => Math.min(prev + 1, questions.length));
    
    // Pengecekan: Pastikan ref buku sudah terinisialisasi sebelum flip
    if (bookRef.current && bookRef.current.pageFlip) {
      bookRef.current.pageFlip().flipNext();
    }
  };

  const handleShowResult = () => {
    const totalAnswered = Object.keys(userAnswers).length;
    if (totalAnswered < questions.length) {
      alert(`Jawab semua pertanyaan terlebih dahulu (${totalAnswered}/${questions.length})`);
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

  // 💡 Logika untuk menghilangkan transisi sumbu X di mobile
  const flipbookStyle = {
    margin: "0 auto",
    transformOrigin: "center center",
    transition: "transform 0.8s ease-in-out",
  };

  if (!isMobile) {
    // Terapkan transisi sumbu X hanya di non-mobile
    flipbookStyle.transform = isBookOpen
      ? "translateX(0px)"
      : isFinished
      ? "translateX(190px)"
      : "translateX(-190px)";
  } else {
    // Di mobile, pastikan tidak ada translasi sumbu x
    flipbookStyle.transform = "translateX(0px)";
  }

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
      {isBookOpen && (
     <div className="relative w-[80%] sm:w-[65%] max-w-md mt-12 bg-black/80 dark:bg-zinc-800 rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row items-center gap-2 text-white">
  <div className="flex items-center justify-center bg-green-100 dark:bg-green-900 rounded-xl w-10 h-10 sm:w-12 sm:h-12">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="w-5 h-5 text-green-400"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3h18M9 3v18m6-18v18M4.5 9h15m-15 6h15"
      />
    </svg>
  </div>

  <div className="flex-1 w-full">
    <div className="flex justify-between text-[10px] sm:text-xs font-semibold mb-1 text-white">
      <span>Jawab {progress} / {questions.length}</span>
      <span>{Math.max(questions.length - progress, 0)} sisa</span>
    </div>

    <div className="w-full bg-gray-500/50 dark:bg-zinc-700 rounded-full h-2.5 sm:h-3 overflow-hidden">
      <motion.div
        className="h-full rounded-full bg-green-500"
        initial={{ width: 0 }}
        animate={{ width: `${(progress / questions.length) * 100}%` }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </div>
  </div>
</div>

      )}

      {/* Buku Flip */}
      <div className="relative z-10 w-full flex justify-center mt-8 sm:mt-12">
        <HTMLFlipBook
          width={380}
          height={520}
          minWidth={320}
          maxWidth={380}
          minHeight={480}
          maxHeight={520}
          size="fixed"
          showCover
          drawShadow
          flippingTime={1200}
          useMouseEvents
          startZIndex={10}
          mobileScrollSupport
          ref={bookRef}
          onFlip={handleFlip}
          style={flipbookStyle}
        >
{/* Sampul Depan */}
<div className="cover">
  <div className="chubby-container">
    <Image
      src="/images/character/Chubby1.png"
      alt="Chubby"
      width={160}
      height={160}
      className="drop-shadow-lg chubby-animate"
    />
  </div>
  <h1 className="text-3xl font-bold mt-4">Tes Minat Bakat</h1>
  <p className="mt-3 text-base sm:text-lg text-white/90">
    Balik/ketuk halaman untuk memulai tes!
  </p>
</div>



          {/* Halaman Pertanyaan */}
          {questions.flatMap((q, i) => {
            // 💡 LOGIKA BARU: Jika mobile, hanya tampilkan halaman pertanyaan (kanan).
            if (isMobile) {
              return (
                <div key={`right-${i}`} className="page-content flex flex-col justify-center items-center text-center">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <h2 className="text-lg sm:text-xl font-semibold mt-4 mb-6 px-4">{q.text}</h2>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                      {["A", "B"].map((opt) => (
                        <motion.button
                          key={opt}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          disabled={userAnswers.hasOwnProperty(i)}
                          onClick={() => handleAnswer(i, opt)}
                          className={`px-6 py-3 rounded-xl font-bold border-2 shadow-md transition-all text-sm sm:text-base ${
                            userAnswers.hasOwnProperty(i)
                              ? "bg-gray-300 border-gray-500 text-gray-700 cursor-not-allowed"
                              : "bg-orange-100 hover:bg-orange-200 border-black text-black"
                          }`}
                        >
                          {opt === "A" ? q.optionA : q.optionB}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              );
            }

            // LOGIKA LAMA (untuk Desktop/Tablet): Tampilkan Gambar (kiri) dan Pertanyaan (kanan)
            return [
              // Halaman kiri (Gambar - HANYA DESKTOP)
            // Halaman kiri (Gambar - HANYA DESKTOP)
<div key={`left-${i}`} className="left-page page-content hidden sm:flex">
  <div className="character-wrapper">
    <Image
      src={`/images/character/pose${i % 4}.png`}
      alt="Karakter"
      width={220}
      height={220}
      className="drop-shadow-lg chubby-animate"
    />
  </div>
</div>
,
              // Halaman kanan (Pertanyaan)
              <div key={`right-${i}`} className="page-content flex flex-col justify-center items-center text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                  <h2 className="text-lg sm:text-xl font-semibold mt-4 mb-6 px-4">{q.text}</h2>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                    {["A", "B"].map((opt) => (
                      <motion.button
                        key={opt}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={userAnswers.hasOwnProperty(i)}
                        onClick={() => handleAnswer(i, opt)}
                        className={`px-6 py-3 rounded-xl font-bold border-2 shadow-md transition-all text-sm sm:text-base ${
                          userAnswers.hasOwnProperty(i)
                            ? "bg-gray-300 border-gray-500 text-gray-700 cursor-not-allowed"
                            : "bg-orange-100 hover:bg-orange-200 border-black text-black"
                        }`}
                      >
                        {opt === "A" ? q.optionA : q.optionB}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </div>,
            ];
          })}

          {/* Halaman Akhir */}
          <div className="result-page">
            <Image src="/images/character/.png" alt="Karakter Akhir" width={160} height={160} className="drop-shadow-lg" />
            <h2 className="text-2xl font-bold mt-4 mb-2">🎉 Tes Selesai!</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShowResult}
              disabled={Object.keys(userAnswers).length < questions.length}
              className={`mt-4 px-6 py-3 rounded-xl font-bold shadow-lg transition-all ${
                Object.keys(userAnswers).length === questions.length
                  ? "bg-green-500 hover:bg-green-600 text-white"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              Lihat Hasil Minat & Bakat
            </motion.button>
            <p className="mt-3 text-sm text-white/90">Klik tombol di atas untuk melihat hasilnya.</p>
          </div>
        </HTMLFlipBook>
      </div>
    </main>
  );
}