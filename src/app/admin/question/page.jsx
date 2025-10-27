"use client";

import { useState, useEffect, useMemo, useCallback } from "react"; // Tambahkan useMemo, useCallback
import { Fredoka } from "next/font/google";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MoreVertical, Edit, Trash2, PlusCircle, Save, XCircle, LogOut, ChevronLeft, ChevronRight } from "lucide-react"; // Import ikon baru
import { supabase } from "@/lib/supabaseClient";

// Komponen tambahan (diasumsikan sudah ada)
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { Header } from "@/components/Header";
import { DecorationElements } from "@/components/DecorationElements";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDarkMode } from "@/hooks/useDarkMode";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "500", "700"] });

// --- KONSTANTA PAGINATION ---
const ITEMS_PER_PAGE = 10; // Jumlah item per halaman

export default function AdminQuestionsPage() {
    const router = useRouter();
    const [darkMode, toggleDarkMode] = useDarkMode();
    const [questions, setQuestions] = useState([]);
    const [form, setForm] = useState({ text: "", optiona: "", optionb: "", type: "" });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    
    // --- STATE PAGINATION BARU ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalQuestions, setTotalQuestions] = useState(0);
    // ----------------------------
    
    // Dropdown per item
    const [openMenuId, setOpenMenuId] = useState(null);
    
    // Hitung total halaman
    const totalPages = useMemo(() => {
        return Math.ceil(totalQuestions / ITEMS_PER_PAGE);
    }, [totalQuestions]);

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIdx = startIdx + ITEMS_PER_PAGE - 1;

        // Ambil data dengan range dan hitung total data
        const { data, error, count } = await supabase
            .from("questions")
            .select("*", { count: 'exact' }) // Minta total count
            .order("id", { ascending: true })
            .range(startIdx, endIdx); // Ambil data sesuai halaman

        if (error) {
            console.error("Gagal ambil data:", error);
        } else {
            setQuestions(data || []);
            setTotalQuestions(count || 0);
        }
        setLoading(false);
    }, [currentPage]); // Dependensi currentPage agar dipanggil ulang saat halaman berubah

    useEffect(() => {
        const loggedIn = typeof window !== 'undefined' ? localStorage.getItem("isAdmin") : null;
        if (!loggedIn) {
            router.push("/admin"); 
        } else {
            setIsAuthChecking(false); 
        }
    }, [router]);
    
    // Panggil fetchQuestions saat komponen pertama kali dimuat atau currentPage berubah
    useEffect(() => {
        if (!isAuthChecking) {
            fetchQuestions();
        }
    }, [isAuthChecking, currentPage, fetchQuestions]);

    // Jika halaman saat ini kosong setelah fetch, dan bukan halaman 1, kembali ke halaman sebelumnya
    useEffect(() => {
        if (!loading && questions.length === 0 && currentPage > 1) {
            setCurrentPage(prev => prev - 1);
        }
    }, [loading, questions.length, currentPage]);


    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.text.trim() || !form.optiona.trim() || !form.optionb.trim() || !form.type.trim())
            return alert("Semua kolom harus diisi!");
        setLoading(true);

        if (editId) {
            const { error } = await supabase
                .from("questions")
                .update(form)
                .eq("id", editId);
            if (error) alert("Gagal update pertanyaan");
            else setEditId(null);
        } else {
            const { error } = await supabase.from("questions").insert([form]);
            if (error) alert("Gagal menambah pertanyaan");
            // Setelah menambah, pindah ke halaman terakhir untuk melihat item baru
            if (!error && totalPages < Math.ceil((totalQuestions + 1) / ITEMS_PER_PAGE)) {
                setCurrentPage(totalPages + 1);
            }
        }

        setForm({ text: "", optiona: "", optionb: "", type: "" });
        await fetchQuestions(); // Fetch ulang data untuk refresh daftar
        setLoading(false);
    };

    const handleEdit = (q) => {
        setForm({ text: q.text, optiona: q.optiona, optionb: q.optionb, type: q.type });
        setEditId(q.id);
        setOpenMenuId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        setOpenMenuId(null);
        if (confirm("Yakin ingin menghapus pertanyaan ini? Tindakan ini tidak dapat dibatalkan.")) {
            const { error } = await supabase.from("questions").delete().eq("id", id);
            if (error) alert("Gagal hapus data");
            else {
                // Atur ulang halaman jika item terakhir di halaman dihapus
                if (questions.length === 1 && currentPage > 1) {
                    setCurrentPage(prev => prev - 1);
                } else {
                    await fetchQuestions(); 
                }
            }
        }
    };

    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem("isAdmin");
        }
        router.push("/admin");
    }

    const riasecTypes = [
        { value: "R", label: "Realistic (R)" },
        { value: "I", label: "Investigative (I)" },
        { value: "A", label: "Artistic (A)" },
        { value: "S", label: "Social (S)" },
        { value: "E", label: "Enterprising (E)" }, 
        { value: "C", label: "Conventional (C)" },
    ];

    // Tampilkan loading/null saat sedang cek otentikasi
    if (isAuthChecking) {
        return (
            <div className={`flex justify-center items-center min-h-screen bg-gray-50 dark:bg-zinc-900 ${fredoka.className}`}>
                <p className="text-xl dark:text-white">Memeriksa otentikasi... ⚙️</p>
            </div>
        );
    }
    
    // --- KOMPONEN KONTROL PAGINATION ---
    const PaginationControls = () => {
        if (totalPages <= 1) return null;

        const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
        const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalQuestions);

        return (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-8 p-4 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md rounded-xl shadow-inner border border-gray-200 dark:border-zinc-700">
                <div className="text-sm text-gray-700 dark:text-gray-300 mb-3 sm:mb-0">
                    Menampilkan **{startItem}** hingga **{endItem}** dari total **{totalQuestions}** pertanyaan
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1 || loading}
                        className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
                        aria-label="Halaman Sebelumnya"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className="flex items-center justify-center font-bold text-lg px-4 py-1 rounded-full bg-indigo-600 text-white shadow-md">
                        {currentPage} / {totalPages}
                    </span>
                    
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages || loading}
                        className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-200 dark:hover:bg-indigo-800 transition"
                        aria-label="Halaman Selanjutnya"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        );
    };
    // ----------------------------------

    return (
        <main
            className={`relative min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 bg-gray-50 dark:bg-zinc-900 text-gray-800 dark:text-white ${fredoka.className}`}
        >
            <BackgroundPattern darkMode={darkMode} />
            <DecorationElements darkMode={darkMode} />
            <Header darkMode={darkMode} />
            <ThemeToggle darkMode={darkMode} setDarkMode={toggleDarkMode} />

            <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl sm:text-4xl font-extrabold mb-8 mt-24 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500"
            >
                🧠 Admin - Kelola Soal MinatGo
            </motion.h1>

            {/* Form Tambah/Edit Pertanyaan */}
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-lg shadow-2xl border border-indigo-200/50 dark:border-zinc-700/50 rounded-2xl p-6 sm:p-8 w-full max-w-2xl mb-12"
            >
                <h2 className="text-xl font-bold mb-5 text-indigo-600 dark:text-indigo-400">
                    {editId ? '📝 Edit Pertanyaan' : '➕ Tambah Pertanyaan Baru'}
                </h2>
                
                <div className="mb-4">
                    <label className="font-semibold text-sm mb-1 block dark:text-gray-300">
                        Isi Pertanyaan
                    </label>
                    <textarea
                        name="text"
                        value={form.text}
                        onChange={handleChange}
                        rows={3}
                        className="w-full p-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
                        placeholder="Contoh: Kamu merasa lebih menikmati aktivitas yang melibatkan keterampilan tangan atau pemecahan masalah logis?"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="font-semibold text-sm mb-1 block dark:text-gray-300">
                            Pilihan Jawaban A
                        </label>
                        <input
                            name="optiona"
                            value={form.optiona}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Jawaban A (Contoh: Keterampilan tangan)"
                        />
                    </div>
                    <div>
                        <label className="font-semibold text-sm mb-1 block dark:text-gray-300">
                            Pilihan Jawaban B
                        </label>
                        <input
                            name="optionb"
                            value={form.optionb}
                            onChange={handleChange}
                            className="w-full p-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Jawaban B (Contoh: Pemecahan masalah logis)"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="font-semibold text-sm mb-1 block dark:text-gray-300">
                        Tipe RIASEC (Skor akan ditambahkan ke tipe ini)
                    </label>
                    <div className="relative">
                        <select
                            name="type"
                            value={form.type}
                            onChange={handleChange}
                            className="appearance-none w-full p-3 rounded-xl border border-gray-300 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-10"
                        >
                            <option value="" disabled className="text-gray-400 bg-white dark:bg-zinc-800">
                                -- Pilih Tipe RIASEC --
                            </option>
                            {riasecTypes.map((t) => (
                                <option 
                                    key={t.value} 
                                    value={t.value} 
                                    className="text-gray-800 bg-white dark:bg-zinc-800 dark:text-gray-200"
                                >
                                    {t.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-full transition duration-300 disabled:opacity-50 shadow-md shadow-indigo-500/50 flex-grow"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                ⏳ Menyimpan...
                            </span>
                        ) : editId ? (
                            <span className="flex items-center">
                                <Save className="w-5 h-5 mr-2" />
                                Update Pertanyaan
                            </span>
                        ) : (
                            <span className="flex items-center">
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Tambah Pertanyaan
                            </span>
                        )}
                    </button>
                    {editId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditId(null);
                                setForm({ text: "", optiona: "", optionb: "", type: "" });
                            }}
                            className="flex items-center justify-center bg-gray-400 hover:bg-gray-500 text-white font-medium px-6 py-3 rounded-full transition duration-300"
                        >
                            <XCircle className="w-5 h-5 mr-2" />
                            Batalkan Edit
                        </button>
                    )}
                </div>
            </motion.form>

            {/* Daftar Pertanyaan */}
            <section className="w-full max-w-3xl mb-20">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-700 dark:text-gray-200">
                    📋 Daftar Pertanyaan (Total: {totalQuestions})
                </h2>
                {loading && questions.length === 0 ? (
                    <div className="text-center p-6 text-xl dark:text-white">Memuat data...</div>
                ) : questions.length === 0 ? (
                    <div className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md shadow-lg rounded-xl p-6 text-center">
                        <p className="text-gray-500 dark:text-gray-400">Belum ada pertanyaan tersimpan. Yuk, tambahkan yang pertama! ✨</p>
                    </div>
                ) : (
                    <ul className="space-y-4">
                        {questions.map((q, index) => (
                            <motion.li
                                key={q.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-lg shadow-lg hover:shadow-xl transition rounded-xl p-4 sm:p-5 flex justify-between items-start border border-gray-100 dark:border-zinc-700"
                            >
                                <div className="pr-10 flex-grow">
                                    <p className="font-bold text-lg mb-2">
                                        <span className="text-indigo-600 dark:text-indigo-400 mr-2">
                                            {/* Hitung nomor urut yang benar */}
                                            {((currentPage - 1) * ITEMS_PER_PAGE + index + 1)}.
                                        </span>
                                        {q.text}
                                    </p>
                                    <div className="text-sm text-gray-600 dark:text-gray-300 grid grid-cols-1 sm:grid-cols-2 gap-2 border-l-4 border-indigo-400 pl-3 py-1">
                                        <div className="flex items-center">
                                            <span className="font-semibold text-indigo-500 mr-2">A:</span> 
                                            {q.optiona}
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-semibold text-indigo-500 mr-2">B:</span>
                                            {q.optionb}
                                        </div>
                                    </div>
                                    <p className="text-xs mt-3 font-medium text-indigo-700 dark:text-indigo-200 bg-indigo-100/70 dark:bg-indigo-900/70 py-1 px-3 rounded-full inline-block">
                                        <span className="font-extrabold mr-1">TIPE:</span>
                                        {riasecTypes.find(t => t.value === q.type)?.label || "Belum ditentukan"}
                                    </p>
                                </div>

                                {/* Dropdown titik tiga */}
                                <div className="relative z-10">
                                    <button
                                        onClick={() =>
                                            setOpenMenuId(openMenuId === q.id ? null : q.id)
                                        }
                                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        aria-label="Opsi pertanyaan"
                                    >
                                        <MoreVertical className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    </button>

                                    {openMenuId === q.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.2 }}
                                            className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-lg shadow-xl overflow-hidden origin-top-right text-sm"
                                        >
                                            <button
                                                onClick={() => handleEdit(q)}
                                                className="flex items-center w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-indigo-800 transition text-indigo-600 dark:text-indigo-300"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit Soal
                                            </button>
                                            <button
                                                onClick={() => handleDelete(q.id)}
                                                className="flex items-center w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-800 text-red-600 dark:text-red-400 transition border-t border-gray-100 dark:border-zinc-600"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Hapus Soal
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                )}
                
                {/* --- KONTROL PAGINATION BARU --- */}
                <PaginationControls />
                {/* ---------------------------------- */}

            </section>
        </main>
    );
}