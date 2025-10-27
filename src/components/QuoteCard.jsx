"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Variasi animasi kartu
const cardVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        rotate: direction > 0 ? 5 : -5,
        scale: 0.9,
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        rotate: 0,
        scale: 1,
        transition: { duration: 0.4, ease: "easeInOut" },
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        rotate: direction < 0 ? 5 : -5,
        scale: 0.9,
        transition: { duration: 0.4, ease: "easeInOut" },
    }),
};

// Komponen QuoteCard
export function QuoteCard({ quote, index, handleAnswer, darkMode, direction }) {
    const quotesData = [
        { text: "Bakat bukanlah titik awal, melainkan hasil dari eksplorasi yang tak kenal lelah terhadap apa yang membuatmu hidup.", by: "Penjelajah Karir", quoteIndex: 1 },
        { text: "Jangan mencari pekerjaan yang mudah, carilah pekerjaan yang selaras dengan kemampuan unikmu; di sana letak pertumbuhan.", by: "Pemandu Potensi", quoteIndex: 2 },
        { text: "Minat adalah kompas, dan bakat adalah peta. Gunakan keduanya untuk menavigasi jalur yang paling bermakna bagimu.", by: "Motivator Diri", quoteIndex: 3 },
    ];

    const currentQuoteIndex = (index / 8) - 1;
    const currentQuote = quotesData[currentQuoteIndex] || quote;

    const primaryColor = darkMode ? "text-indigo-400" : "text-orange-600";
    const buttonBg = darkMode
        ? "bg-indigo-600 hover:bg-indigo-700 border-indigo-800"
        : "bg-orange-500 hover:bg-orange-600 border-orange-700";

    return (
        <motion.div
            key={`quote-card-${index}`}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            custom={direction}
            className={`card-style p-6 sm:p-8 flex flex-col items-center text-center relative transition-all duration-500 overflow-hidden 
                shadow-2xl rounded-3xl backdrop-blur-md 
                ${darkMode ? "bg-zinc-900/80 border border-indigo-500/50" : "bg-white/90 border border-orange-500/50"}`}
        >
            <div className="flex flex-col justify-center items-center w-full gap-4">
                
                {/* ✅ Tambahkan Gambar Chubby di sini */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="w-24 h-24 relative"
                >
                    <Image
                        src="/images/character/Chubby1.png"
                        alt="Chubby Character"
                        fill
                        className="object-contain"
                        priority
                    />
                </motion.div>


                {/* Kutipan */}
                <blockquote className="text-lg sm:text-xl italic font-serif font-medium leading-relaxed my-4 relative px-4">
                    <span className={`absolute top-0 left-0 text-3xl opacity-30 ${primaryColor}`}>“</span>
                    {currentQuote.text}
                    <span className={`absolute bottom-0 right-0 text-3xl opacity-30 ${primaryColor}`}>”</span>
                </blockquote>

                {/* Penulis */}
                <p className={`text-xs sm:text-sm font-semibold italic ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    — {currentQuote.by}
                </p>
            </div>

            {/* Tombol Lanjut */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(index, "NEXT_FROM_QUOTE")}
                className={`mt-6 px-6 py-2 rounded-full font-extrabold text-base shadow-xl transition-all border-b-4 border-l-2 text-white ${buttonBg}`}
            >
                Lanjut
            </motion.button>
        </motion.div>
    );
}
