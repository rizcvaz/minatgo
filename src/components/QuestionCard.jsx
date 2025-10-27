"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Varian Framer Motion untuk transisi Card yang elegan
export const cardVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.9,
    filter: "blur(4px)",
    transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 }
    },
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
    },
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.9,
    filter: "blur(4px)",
    transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        opacity: { duration: 0.2 }
    },
  }),
};

/**
 * Komponen Card Pertanyaan
 * Menggantikan setiap halaman buku dengan satu card yang elegan dan mobile-friendly
 */
export function QuestionCard({
  question,
  index,
  totalQuestions,
  userAnswers,
  handleAnswer,
  isMobile,
  darkMode,
  direction, // Digunakan untuk menentukan arah transisi (mundur/maju)
}) {
  const isAnswered = userAnswers.hasOwnProperty(index);
  const isCover = index === -1;
  const isResultPage = index === totalQuestions;
  
  // Logika untuk memilih gambar karakter (pose0.png sampai pose4.png)
  const poseIndex = index % 5;
  const characterImage = `/images/character/pose${poseIndex}.png`;


  // Render Sampul Depan
  if (isCover) {
    return (
      <motion.div
        key="cover"
        variants={cardVariants}
        initial="enter"
        animate="center"
        exit="exit"
        custom={direction}
        className={`card-style flex flex-col justify-center items-center text-center p-6 transition-colors duration-500`}
        onClick={() => handleAnswer(index, "START")} // Mulai tes saat klik
      >
        <Image
          src="/images/character/Chubby1.png"
          alt="Chubby"
          width={isMobile ? 120 : 160}
          height={isMobile ? 120 : 160}
          className="drop-shadow-xl animate-bounce-slow"
        />
        <h1 className="text-3xl font-extrabold mt-6">Tes Minat Bakat</h1>
        <p className={`mt-3 text-base text-center ${darkMode ? 'text-black' : 'text-gray-600'}`}>
          Tidak ada jawaban benar atau salah dalam pertanyaan ini, jawablah secara objektif
        </p>
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.stopPropagation(); handleAnswer(index, "START"); }}
            className={`mt-8 px-8 py-3 rounded-full font-bold shadow-2xl transition-all border-b-4 border-l-2 ${
                darkMode ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-800" : "bg-orange-500 hover:bg-orange-600 text-white border-orange-700"
            }`}
        >
            Mulai Tes Sekarang
        </motion.button>
      </motion.div>
    );
  }

  // Render Halaman Akhir
  if (isResultPage) {
    return (
      <motion.div
        key="result"
        variants={cardVariants}
        initial="enter"
        animate="center"
        exit="exit"
        custom={direction}
        className={`card-style flex flex-col justify-center items-center text-center p-6 transition-colors duration-500`}
      >
        <Image src="/images/character/Chubby1.png" alt="Karakter Akhir" width={160} height={160} className="drop-shadow-xl animate-spin-bounce-slow" />
        <h2 className="text-2xl font-extrabold mt-6 mb-3">🎉 Tes Selesai!</h2>
        <p className={`mb-6 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Terima kasih telah menjawab semua pertanyaan.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleAnswer(index, "FINISH")} // Panggil handleShowResult
          disabled={Object.keys(userAnswers).length < totalQuestions}
          className={`px-8 py-3 rounded-full font-bold shadow-2xl transition-all border-b-4 border-l-2 ${
            Object.keys(userAnswers).length === totalQuestions
              ? "bg-green-600 hover:bg-green-700 text-white border-green-800"
              : "bg-gray-400 text-gray-700 cursor-not-allowed border-gray-600"
          }`}
        >
          Lihat Hasil Minat & Bakat
        </motion.button>
        <p className="mt-3 text-sm italic text-gray-500">Klik tombol di atas untuk melihat hasilnya.</p>
      </motion.div>
    );
  }

  // Render Halaman Pertanyaan
  return (
    <motion.div
      key={`question-${index}`}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      custom={direction}
      // Peningkatan desain: border yang lebih menonjol, padding lebih fleksibel
      className={`card-style p-4 sm:p-8 flex flex-col justify-between items-center text-center relative transition-all duration-500 overflow-hidden ${
        isAnswered ? "opacity-90 scale-[0.98] border-dashed border-2" : "opacity-100 scale-100"
      }`}
    >
        {/* Nomor Pertanyaan (Diposisikan di atas, lebih stylish) */}
        <div className={`absolute top-0 left-0 p-3 px-4 rounded-br-2xl text-sm font-extrabold z-10 ${
            darkMode ? 'bg-indigo-600 text-white' : 'bg-orange-500 text-white'
        }`}>
            {index + 1} / {totalQuestions}
        </div>
        
        {/* Konten Utama Card */}
        <div className="flex-1 flex flex-col items-center w-full pt-2">
            
            {/* 🖼️ Gambar Karakter (BARU) */}
            <motion.div
                key={`img-${index}`} // Penting untuk reset animasi saat index berubah
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: "spring" }}
                className="mb-2"
            >
                <Image
                    src={characterImage}
                    alt={`Karakter Pose ${poseIndex}`}
                    width={isMobile ? 120 : 140}
                    height={isMobile ? 120 : 140}
                    className="drop-shadow-xl"
                />
            </motion.div>

            {/* Area Teks Pertanyaan */}
            <div className={`mb-2 w-full ${isMobile ? 'pt-0' : 'pt-2'}`}>
                {/* <span className={`text-xs sm:text-sm font-bold block mb-2 ${darkMode ? 'text-indigo-400' : 'text-orange-600'}`}>
                    Pilih Opsi yang Paling Sesuai
                </span> */}
                <h2 className="text-lg sm:text-xl font-extrabold px-1 leading-normal">
                    {question.text}
                </h2>
            </div>
        </div>

        {/* Area Tombol Jawaban */}
        <div className={`w-full mb-1 max-w-sm ${isMobile ? 'pb-2' : 'pb-0'}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-col gap-4"
            >
                {["A", "B"].map((opt) => (
                    <motion.button
                        key={opt}
                        whileHover={{ scale: isAnswered ? 1 : 1.02, boxShadow: isAnswered ? 'none' : '0 6px 15px -3px rgba(249, 115, 22, 0.4)' }}
                        whileTap={{ scale: isAnswered ? 0.99 : 0.97 }}
                        disabled={isAnswered}
                        onClick={() => handleAnswer(index, opt)}
                        // Peningkatan desain tombol
                        className={`w-full px-5 py-3 rounded-xl font-bold border-2 shadow-lg transition-all text-sm sm:text-base text-center ${
                            isAnswered
                              ? userAnswers[index] === opt // Opsi yang dipilih setelah dijawab
                                ? "bg-green-500 border-green-700 text-white shadow-green-500/50"
                                : "bg-gray-200 dark:bg-zinc-700 border-gray-400 dark:border-zinc-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                              : darkMode // Opsi aktif
                                ? "bg-zinc-700 hover:bg-zinc-600 border-indigo-500 text-white"
                                : "bg-white hover:bg-orange-50 border-orange-500 text-black shadow-orange-300/50"
                        }`}
                    >
                        {opt === "A" ? question.optionA : question.optionB}
                    </motion.button>
                ))}
            </motion.div>
        </div>
    </motion.div>
  );
}