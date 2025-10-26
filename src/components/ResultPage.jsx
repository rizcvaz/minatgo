"use client";

import React, { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useRouter } from 'next/navigation';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
// Fungsi Komponen Utama
export default function ResultPage({ answers = {}, questionsMap = [], onRetake }) {
  // >> INISIALISASI ROUTER
  const router = useRouter();
  const [darkMode, toggleDarkMode] = useDarkMode();

  const resultRef = useRef(null);

  // --- Logic perhitungan totals, percent, dan dominant (Dipertahankan) ---
  const totals = useMemo(() => {
    const types = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    const totalAnswered = Object.keys(answers).length;

    Object.entries(answers).forEach(([idxStr, choice]) => {
      const idx = Number(idxStr);
      const map = questionsMap[idx];
      if (!map) return;
      const chosenType = choice === "A" ? map.A : map.B;
      if (chosenType && types.hasOwnProperty(chosenType)) types[chosenType] += 1;
    });

    return { counts: types, totalAnswered };
  }, [answers, questionsMap]);

  const percent = useMemo(() => {
    const p = {};
    const answered = Math.max(totals.totalAnswered, 1);
    Object.entries(totals.counts).forEach(([k, v]) => {
      p[k] = Math.round((v / answered) * 100);
    });
    return p;
  }, [totals]);

  const dominant = useMemo(() => {
    const entries = Object.entries(totals.counts);
    const max = Math.max(...entries.map(([, v]) => v));
    if (max <= 0) return [];
    return entries.filter(([, v]) => v === max).map(([k]) => k);
  }, [totals]);

  // --- Definisi Konstan ---
  const TYPE_LABEL = {
    R: "Realistic (Praktis / Teknis)",
    I: "Investigative (Analitis / Riset)",
    A: "Artistic (Kreatif / Ekspresif)",
    S: "Social (Sosial / Membantu)",
    E: "Enterprising (Memimpin / Bisnis)",
    C: "Conventional (Terstruktur / Administratif)",
  };
  
  // Menggunakan skema warna untuk Dark Mode, meniru style MinatGo
  const TYPE_COLORS = {
    R: 'bg-red-500', I: 'bg-green-500', A: 'bg-yellow-500', 
    S: 'bg-indigo-500', E: 'bg-purple-500', C: 'bg-cyan-500',
  };

  const RECOMMENDATIONS = {
    R: {
      majors: ["Teknik Mesin", "Teknik Elektro", "Teknik Sipil", "Teknik Otomotif", "Agronomi"],
      jobs: ["Teknisi", "Insinyur Lapangan", "Montir Spesialis", "Surveyor", "Operator Mesin"],
      activities: ["Workshop teknik", "Klub robotik", "magang bengkel", "proyek DIY"],
    },
    I: {
      majors: ["Matematika", "Fisika", "Biologi", "Statistika", "Ilmu Komputer (riset)"],
      jobs: ["Peneliti", "Data Analyst", "Lab Tech", "Analis R&D"],
      activities: ["Proyek riset", "kompetisi sains", "kelas coding / statistik"],
    },
    A: {
      majors: ["Desain Grafis", "DKV", "Seni Rupa", "Sastra", "Arsitektur"],
      jobs: ["Desainer Grafis", "Ilustrator", "Penulis Kreatif", "Animator"],
      activities: ["studio seni", "kelas menggambar", "pameran", "proyek portofolio"],
    },
    S: {
      majors: ["Psikologi", "Pendidikan", "Keperawatan", "Kesehatan Masyarakat", "Sosial"],
      jobs: ["Guru", "Konselor", "Perawat", "Pekerja Sosial"],
      activities: ["volunteer", "mentoring", "workshop komunikasi", "kelas public speaking"],
    },
    E: {
      majors: ["Manajemen", "Administrasi Bisnis", "Ekonomi", "Ilmu Komunikasi"],
      jobs: ["Marketing", "Sales Manager", "Entrepreneur", "Business Developer"],
      activities: ["kampus entrepreneurship", "kompetisi bisnis", "magang sales"],
    },
    C: {
      majors: ["Akuntansi", "Administrasi Perkantoran", "Sistem Informasi", "Ilmu Perpajakan"],
      jobs: ["Akuntan", "Admin", "Analis Data", "Operator Sistem"],
      activities: ["kursus excel/administrasi", "magang di kantor", "pelatihan sistem"],
    },
  };
  // ------------------------------------

  // Tipe dominan yang akan ditampilkan sebagai fokus
  const dominantType = dominant.length > 0 ? dominant[0] : null;
  const dominantLabel = dominant.length > 0 ? TYPE_LABEL[dominant[0]] : null;
  
  // Helper untuk mendapatkan warna teks dari warna background
  const getTextColor = (key) => TYPE_COLORS[key] ? TYPE_COLORS[key].replace('bg', 'text') : 'text-white';
  const getBgColor = (key) => TYPE_COLORS[key] || 'bg-gray-500';

  // >> FUNGSI BARU UNTUK NAVIGASI
  const handleRetake = () => {
    // 1. Panggil prop onRetake (Jika digunakan untuk mereset state di parent)
    if (onRetake) {
        onRetake();
    }
    // 2. Navigasi ke halaman /test
    router.push('/test'); 
  };
  // ------------------------------

const handleSavePDF = () => {
  const pdf = new jsPDF();

  // --- Judul ---
  pdf.setFontSize(16);
  pdf.text("Hasil Tes Minat & Bakat RIASEC", 105, 15, { align: "center" });

  // --- Tabel Semua Tipe RIASEC dengan Label & Persentase ---
  const tableData = Object.keys(percent).map((k) => [
    k,
    TYPE_LABEL[k],    // menampilkan keterangan tipe
    percent[k] + '%'
  ]);

  autoTable(pdf, {
    startY: 25,
    head: [['Tipe', 'Keterangan', 'Persentase']],
    body: tableData,
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    styles: { fontSize: 10 },
  });

  // --- Tipe Dominan & Rekomendasi ---
  if (dominantType) {
    const startY = pdf.lastAutoTable.finalY + 10 || 60;
    pdf.setFontSize(14);
    pdf.text(`Tipe Dominan: ${dominantLabel}`, 14, startY);

    const recommendationData = [
      ["Jurusan Kuliah", RECOMMENDATIONS[dominantType].majors.join(", ")],
      ["Profesi yang Cocok", RECOMMENDATIONS[dominantType].jobs.join(", ")],
      ["Kegiatan Penunjang", RECOMMENDATIONS[dominantType].activities.join(", ")],
    ];

    autoTable(pdf, {
      startY: startY + 5,
      head: [["Kategori", "Rekomendasi"]],
      body: recommendationData,
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { cellWidth: 'wrap', fontSize: 10 },
    });
  }

  // --- Simpan PDF ---
  pdf.save("hasil-tes.pdf");
};




  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // Kontainer disesuaikan untuk Dark Mode dengan lebar yang cukup
      className="result-container p-6 rounded-2xl mt-5 bg-zinc-800 text-white shadow-[0_15px_60px_rgba(0,0,0,0.5)] w-full max-w-2xl mx-auto border border-zinc-700"
    >
      
      {/* HEADER UTAMA */}
      <h2 className="text-2xl font-extrabold mb-1 text-center text-green-400">
        🔬 Hasil Tes Minat & Bakat RIASEC
      </h2>
      <p className="text-xs text-center text-gray-400 mb-6">
        Berdasarkan jawabanmu ({totals.totalAnswered} dari 30 pertanyaan dijawab).
      </p>

      {/* BAGIAN ATAS: GRID 2 KOLOM (Tipe Dominan 1: Persentase Tipe 2) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        
        {/* Kolom Kiri (2/5): Tipe Dominan */}
        <div className="md:col-span-2 p-3 rounded-xl bg-zinc-700/50 shadow-md flex flex-col justify-center border border-zinc-600">
          <h3 className="text-sm font-bold mb-3 text-orange-300">Tipe Dominan Anda</h3>
          {dominantType ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-3 rounded-lg ${getBgColor(dominantType).replace('bg', 'bg-opacity-20')} font-bold text-center border-2 ${getBgColor(dominantType).replace('bg', 'border')}`}
            >
              <p className={`text-4xl ${getTextColor(dominantType)}`}>{dominantType}</p>
              <p className="text-sm mt-1 text-white">{dominantLabel?.split('(')[0].trim()}</p>
              <p className="text-xs text-gray-300">({dominantLabel?.split('(')[1].replace(')', '').trim()})</p>
            </motion.div>
          ) : (
            <p className="text-xs italic text-gray-400 text-center">Belum ada hasil.</p>
          )}
        </div>

        {/* Kolom Kanan (3/5): Persentase Tipe */}
        <div className="md:col-span-3 p-3 rounded-xl bg-zinc-700/50 shadow-md border border-zinc-600">
          <h3 className="text-sm font-bold mb-3 text-orange-300">Persentase Tiap Tipe</h3>
          <div className="space-y-2">
            {Object.keys(totals.counts).map((k) => (
              <div key={k}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className={`font-medium ${dominant.includes(k) ? getTextColor(k) : 'text-gray-300'}`}>
                    **{k}** — {TYPE_LABEL[k].split('(')[0].trim()}
                  </span>
                  <span className="font-bold">{percent[k]}%</span>
                </div>
                <div className="w-full bg-zinc-600 rounded-full h-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent[k]}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className={`h-1.5 ${getBgColor(k)} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <hr className="my-6 border-zinc-700" />

      {/* BAGIAN BAWAH: REKOMENDASI (Satu Kolom Penuh) */}
      <div className="mb-6">
        <h3 className="text-xl font-bold mb-4 text-center text-yellow-400">
          ✨ Rekomendasi Karir & Kegiatan
        </h3>
        
        {dominantType ? (
          <motion.div 
            key={dominantType}
            ref={resultRef} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-4 rounded-xl bg-zinc-700/50 shadow-inner border border-zinc-600"
          >
            {/* Fokus Tipe Header */}
            <h4 className="text-base font-extrabold mb-4 text-white">
              Fokus Tipe: <span className={`${getTextColor(dominantType)} text-lg`}>{dominantLabel}</span>
            </h4>

            {/* Rekomendasi 3 Kolom di dalam blok rekomendasi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              
              {/* Jurusan */}
              <div className="p-3 bg-zinc-800 rounded-lg border-t-2 border-t-blue-500">
                <div className="font-bold text-sm mb-2 text-blue-300">🎓 Jurusan Kuliah:</div>
                <ul className="list-disc ml-4 space-y-0.5 text-gray-300">
                  {RECOMMENDATIONS[dominantType].majors.map((m) => (
                    <li key={m}>{m}</li>
                  ))}
                </ul>
              </div>

              {/* Profesi */}
              <div className="p-3 bg-zinc-800 rounded-lg border-t-2 border-t-green-500">
                <div className="font-bold text-sm mb-2 text-green-300">💼 Profesi yang Cocok:</div>
                <ul className="list-disc ml-4 space-y-0.5 text-gray-300">
                  {RECOMMENDATIONS[dominantType].jobs.map((j) => (
                    <li key={j}>{j}</li>
                  ))}
                </ul>
              </div>

              {/* Kegiatan */}
              <div className="p-3 bg-zinc-800 rounded-lg border-t-2 border-t-orange-500">
                <div className="font-bold text-sm mb-2 text-orange-300">💡 Kegiatan Penunjang:</div>
                <ul className="list-disc ml-4 space-y-0.5 text-gray-300">
                  {RECOMMENDATIONS[dominantType].activities.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ) : (
          <p className="text-center italic text-gray-400">Jawab lebih banyak pertanyaan untuk melihat rekomendasi yang akurat.</p>
        )}
      </div>
      
      <hr className="my-6 border-zinc-700" />

      {/* Bagian Aksi */}
      <div className="flex justify-center gap-4">
        {/* MODIFIKASI: Menggunakan handleRetake untuk navigasi */}
        <button
          onClick={handleRetake}
          className="px-5 py-2 rounded-xl border border-gray-600 text-gray-300 hover:bg-zinc-700 transition duration-300 text-sm font-semibold"
        >
          🔄 Coba Lagi
        </button>
        {/* End MODIFIKASI */}

     <button
  onClick={handleSavePDF}
  className="px-5 py-2 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 transition duration-300 shadow-md text-sm"
>
  💾 Simpan hasil
</button>


      </div>
    </motion.div>
  );
}