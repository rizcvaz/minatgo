"use client";

import { useState, useEffect } from "react";
import { Fredoka } from "next/font/google";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

// Komponen tambahan (diasumsikan sudah ada)
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { Header } from "@/components/Header";
import { DecorationElements } from "@/components/DecorationElements";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useDarkMode } from "@/hooks/useDarkMode";

const fredoka = Fredoka({ subsets: ["latin"], weight: ["400", "500", "700"] });

export default function AdminQuestionsPage() {
    const router = useRouter();
    const [darkMode, toggleDarkMode] = useDarkMode();
    const [questions, setQuestions] = useState([]);
    const [form, setForm] = useState({ text: "", optiona: "", optionb: "", type: "" });
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAuthChecking, setIsAuthChecking] = useState(true);
    
    // Dropdown per item
    const [openMenuId, setOpenMenuId] = useState(null);
    
    // Logika Pagination Dihapus.

    useEffect(() => {
        const loggedIn = localStorage.getItem("isAdmin");
        if (!loggedIn) {
            // Jika tidak ada status 'isAdmin', arahkan ke halaman login
            router.push("/admin"); // ✅ Perbaikan rute login
        } else {
            setIsAuthChecking(false); // Otentikasi berhasil
            fetchQuestions(); // Ambil data hanya jika sudah login
        }
    }, [router]);

    async function fetchQuestions() {
        const { data, error } = await supabase
            .from("questions")
            .select("*")
            .order("id", { ascending: true });
        if (error) console.error("Gagal ambil data:", error);
        else setQuestions(data);
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.text.trim() || !form.optiona.trim() || !form.optionb.trim() || !form.type.trim())
            return;
        setLoading(true);

        if (editId) {
            // Update data
            const { error } = await supabase
                .from("questions")
                .update(form)
                .eq("id", editId);
            if (error) alert("Gagal update pertanyaan");
            else {
                setEditId(null);
                await fetchQuestions();
            }
        } else {
            // Tambah data baru
            const { error } = await supabase.from("questions").insert([form]);
            if (error) alert("Gagal menambah pertanyaan");
            else await fetchQuestions();
        }

        setForm({ text: "", optiona: "", optionb: "", type: "" });
        setLoading(false);
    };

    const handleEdit = (q) => {
        setForm({ text: q.text, optiona: q.optiona, optionb: q.optionb, type: q.type });
        setEditId(q.id);
        setOpenMenuId(null);
    };

    const handleDelete = async (id) => {
        if (confirm("Yakin ingin menghapus pertanyaan ini?")) {
            const { error } = await supabase.from("questions").delete().eq("id", id);
            if (error) alert("Gagal hapus data");
            else {
                // Panggil ulang data setelah hapus
                await fetchQuestions(); 
            }
        }
        setOpenMenuId(null);
    };

    const handleLogout = () => {
        localStorage.removeItem("isAdmin"); // Hapus status login
        router.push("/admin"); // ✅ Perbaikan rute logout
    }

    const riasecTypes = [
        { value: "R", label: "Realistic (R)" },
        { value: "I", label: "Investigative (I)" },
        { value: "A", label: "Artistic (A)" },
        { value: "S", label: "Social (S)" },
        // Perhatikan 'value' ganda di 'Enterprising', saya perbaiki menjadi 'label'
        { value: "E", label: "Enterprising (E)" }, 
        { value: "C", label: "Conventional (C)" },
    ];


    // Tampilkan loading/null saat sedang cek otentikasi
    if (isAuthChecking) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-xl dark:text-white">Memeriksa otentikasi...</p>
            </div>
        );
    }

    return (
        <main
            className={`relative min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50 dark:bg-zinc-900 text-gray-800 dark:text-white ${fredoka.className}`}
        >
            <BackgroundPattern darkMode={darkMode} />
            <DecorationElements darkMode={darkMode} />
            <Header darkMode={darkMode} />
            <ThemeToggle darkMode={darkMode} setDarkMode={toggleDarkMode} />

            {/* Tombol Logout */}
            <button
                onClick={handleLogout}
                className="absolute top-6 right-28 sm:right-32 bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded-lg transition z-50"
            >
                Keluar
            </button>

            <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl font-bold mb-6 mt-24 text-center"
            >
                🧠 Admin - Kelola Pertanyaan Tes Minat Bakat
            </motion.h1>

            {/* Form Tambah/Edit Pertanyaan */}
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md shadow-xl rounded-2xl p-6 w-full max-w-2xl mb-10"
            >
                <div className="mb-4">
                    <label className="font-semibold text-sm">Pertanyaan</label>
                    <textarea
                        name="text"
                        value={form.text}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent"
                        placeholder="Tulis pertanyaan di sini..."
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="font-semibold text-sm">Opsi A</label>
                        <input
                            name="optiona"
                            value={form.optiona}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent"
                            placeholder="Jawaban A"
                        />
                    </div>
                    <div>
                        <label className="font-semibold text-sm">Opsi B</label>
                        <input
                            name="optionb"
                            value={form.optionb}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent"
                            placeholder="Jawaban B"
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label className="font-semibold text-sm">Tipe Pertanyaan (RIASEC)</label>
                    <select
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        className="w-full mt-1 p-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-transparent text-black dark:text-gray-200 dark:bg-zinc-800"
                    >
                        <option value="" className="text-black bg-white dark:bg-zinc-800 dark:text-gray-400">
                            -- Pilih Tipe --
                        </option>
                        {riasecTypes.map((t) => (
                            <option key={t.value} value={t.value} className="text-black bg-white dark:bg-zinc-800 dark:text-gray-200">
                                {t.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mt-6 flex gap-3">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition disabled:opacity-50"
                    >
                        {loading
                            ? "⏳ Menyimpan..."
                            : editId
                                ? "💾 Update Pertanyaan"
                                : "➕ Tambah Pertanyaan"}
                    </button>
                    {editId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditId(null);
                                setForm({ text: "", optiona: "", optionb: "", type: "" });
                            }}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-5 py-2 rounded-lg transition"
                        >
                            Batalkan Edit
                        </button>
                    )}
                </div>
            </motion.form>

            {/* Daftar Pertanyaan */}
            <section className="w-full max-w-3xl mb-20">
                <h2 className="text-xl font-semibold mb-3 text-center">
                    📋 Daftar Pertanyaan ({questions.length})
                </h2>
                {questions.length === 0 ? (
                    <p className="text-gray-500 text-center">Belum ada pertanyaan tersimpan.</p>
                ) : (
                    <ul className="space-y-4">
                        {/* ✅ PERUBAHAN: Iterasi langsung menggunakan 'questions' */}
                        {questions.map((q, index) => (
                            <motion.li
                                key={q.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md shadow-lg rounded-xl p-4 flex justify-between items-start border border-gray-100 dark:border-zinc-700"
                            >
                                <div>
                                    <p className="font-medium">
                                        <span className="text-indigo-600 dark:text-indigo-400 font-bold mr-1">
                                            {/* ✅ PERUBAHAN: Menghitung nomor urut tanpa startIdx */}
                                            {(index + 1)}.
                                        </span>
                                        {q.text}
                                    </p>
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2 flex gap-4">
                                        <span className="py-1 px-2 border-r border-gray-300 dark:border-zinc-600">
                                            A: {q.optiona}
                                        </span>
                                        <span className="py-1 px-2">
                                            B: {q.optionb}
                                        </span>
                                    </div>
                                    <p className="text-xs mt-2 italic text-indigo-700 dark:text-indigo-300 bg-indigo-100/50 dark:bg-indigo-900/50 py-1 px-2 rounded-full inline-block">
                                        🧩 Tipe: {riasecTypes.find(t => t.value === q.type)?.label || "Belum ditentukan"}
                                    </p>
                                </div>

                                {/* Dropdown titik tiga */}
                                <div className="relative z-10">
                                    <button
                                        onClick={() =>
                                            setOpenMenuId(openMenuId === q.id ? null : q.id)
                                        }
                                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                                    >
                                        <MoreVertical />
                                    </button>

                                    {openMenuId === q.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-lg shadow-xl overflow-hidden origin-top-right"
                                        >
                                            <button
                                                onClick={() => handleEdit(q)}
                                                className="block w-full text-left px-4 py-2 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(q.id)}
                                                className="block w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-800 text-red-600 dark:text-red-400 transition"
                                            >
                                                ❌ Hapus
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                )}

                {/* Elemen Pagination Dihapus */}
            </section>
        </main>
    );
}