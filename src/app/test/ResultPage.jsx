"use client";

import React, { useMemo } from "react";

export default function ResultPage({ answers = {}, questionsMap = [], onRetake }) {
  // Logic perhitungan totals, percent, dan dominant tetap dipertahankan
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

  const TYPE_LABEL = {
    R: "Realistic (Praktis / Teknis)",
    I: "Investigative (Analitis / Riset)",
    A: "Artistic (Kreatif / Ekspresif)",
    S: "Social (Sosial / Membantu)",
    E: "Enterprising (Memimpin / Bisnis)",
    C: "Conventional (Terstruktur / Administratif)",
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
      majors: ["Desain Grafis", "Desain Komunikasi Visual", "Seni Rupa", "Sastra", "Arsitektur"],
      jobs: ["Desainer Grafis", "Ilustrator", "Penulis Kreatif", "Animator"],
      activities: ["studio seni", "kelas menggambar/ilustrasi", "pameran", "proyek portofolio"],
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

  // ----------------------------------------------------------------------
  // Perubahan Tampilan Utama
  // ----------------------------------------------------------------------

  return (
    <div className="result-container p-6 rounded-2xl bg-white/95 dark:bg-zinc-800 text-black dark:text-white shadow-2xl w-full max-w-4xl mx-auto">
      
      <h2 className="text-3xl font-extrabold mb-2 text-center text-green-600 dark:text-green-400">
        🔬 Hasil Tes Minat & Bakat RIASEC
      </h2>
      <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
        Berdasarkan jawabanmu ({totals.totalAnswered} dari 30 pertanyaan dijawab).
      </p>

      {/* Bagian 1: Tipe Dominan dan Persentase (Grid 1:2) */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        
        {/* Kolom 1: Tipe Dominan (Dominant Type) */}
        <div className="md:col-span-1 p-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-700/50 shadow-inner">
          <h3 className="text-xl font-bold mb-3 text-orange-600 dark:text-orange-300">Tipe Dominan Anda</h3>
          {dominant.length === 0 ? (
            <p className="text-sm italic">Belum ada jawaban yang cukup.</p>
          ) : (
            <div className="space-y-3">
              {dominant.map((t) => (
                <div
                  key={t}
                  className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold shadow-md"
                >
                  <span className="text-lg mr-1">{t}</span> — {TYPE_LABEL[t]}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Kolom 2 & 3: Persentase Tipe (Percentage Breakdown) */}
        <div className="md:col-span-2 p-4 rounded-xl border border-gray-200 dark:border-zinc-700">
          <h3 className="text-xl font-bold mb-3 text-orange-600 dark:text-orange-300">Persentase Tiap Tipe</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {Object.keys(totals.counts).map((k) => (
              <div key={k}>
                <div className="flex justify-between text-sm mb-1">
                  <span className={`font-medium ${dominant.includes(k) ? 'text-green-600 dark:text-green-400 font-bold' : ''}`}>{k} — {TYPE_LABEL[k]}</span>
                  <span className="font-bold">{percent[k]}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-zinc-600 rounded-full h-3 overflow-hidden">
                  <div
                    style={{ width: `${percent[k]}%` }}
                    className={`h-3 ${dominant.includes(k) ? 'bg-green-500' : 'bg-orange-400'} rounded-full transition-all duration-500`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <hr className="my-6 border-gray-200 dark:border-zinc-700" />
      
      {/* Bagian 2: Rekomendasi (Grid 3 Kolom) */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-4 text-center text-orange-600 dark:text-orange-300">
          ✨ Rekomendasi Karir & Kegiatan
        </h3>
        
        {dominant.length === 0 ? (
          <p className="text-center italic">Jawab lebih banyak pertanyaan untuk melihat rekomendasi yang akurat.</p>
        ) : (
          dominant.map((t) => (
            <div key={t} className="mb-8 p-4 rounded-xl bg-green-50 dark:bg-zinc-700/30 border border-green-200 dark:border-green-800">
              <h4 className="text-xl font-bold mb-3 text-green-700 dark:text-green-400">
                Fokus Tipe: {TYPE_LABEL[t]}
              </h4>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                
                {/* Jurusan */}
                <div>
                  <div className="font-bold text-base mb-1 text-gray-700 dark:text-gray-300">🎓 Jurusan Kuliah:</div>
                  <ul className="list-disc ml-5 space-y-0.5 text-gray-600 dark:text-gray-400">
                    {RECOMMENDATIONS[t].majors.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>

                {/* Profesi */}
                <div>
                  <div className="font-bold text-base mb-1 text-gray-700 dark:text-gray-300">💼 Profesi yang Cocok:</div>
                  <ul className="list-disc ml-5 space-y-0.5 text-gray-600 dark:text-gray-400">
                    {RECOMMENDATIONS[t].jobs.map((j) => (
                      <li key={j}>{j}</li>
                    ))}
                  </ul>
                </div>

                {/* Kegiatan */}
                <div>
                  <div className="font-bold text-base mb-1 text-gray-700 dark:text-gray-300">💡 Kegiatan Penunjang:</div>
                  <ul className="list-disc ml-5 space-y-0.5 text-gray-600 dark:text-gray-400">
                    {RECOMMENDATIONS[t].activities.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <hr className="my-6 border-gray-200 dark:border-zinc-700" />

      {/* Bagian 3: Aksi */}
      <div className="flex justify-center gap-4 mt-6">
        {onRetake && (
          <button
            onClick={onRetake}
            className="px-6 py-3 rounded-xl border border-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-white transition duration-300"
          >
            🔄 Coba Lagi
          </button>
        )}
        <button
          onClick={() => alert("Fungsi simpan/bagikan belum diimplementasikan, tapi Anda bisa screenshot halaman ini!")}
          className="px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition duration-300"
        >
          💾 Simpan / Bagikan Hasil
        </button>
      </div>
    </div>
  );
}