"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ResultPage from "@/components/ResultPage";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BackgroundPattern } from "@/components/BackgroundPattern";
import { DecorationElements } from "@/components/DecorationElements";
import { Header } from "@/components/Header";
import { useDarkMode } from "@/hooks/useDarkMode"; // ✅ gunakan hook global

const initialData = {
  answers: {},
  questionsMap: [],
  results: null,
};

export default function ResultPageContainer() {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, toggleDarkMode] = useDarkMode(); // ✅ panggil hook global

  useEffect(() => {
    const storedData = localStorage.getItem("riasec_test_results");

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setData(parsedData);
      } catch (error) {
        console.error("Gagal memparsing hasil tes:", error);
        localStorage.removeItem("riasec_test_results");
        router.push("/");
      }
    } else {
      router.push("/");
    }

    setIsLoading(false);
  }, [router]);

  const handleRetake = () => {
    localStorage.removeItem("riasec_test_results");
    router.push("/");
  };

  if (isLoading || !data.results) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-orange-300 dark:bg-black text-black dark:text-white">
        <p>Memuat hasil...</p>
      </main>
    );
  }

  const { answers, questionsMap } = data;

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center p-8 transition-colors duration-500 ${
        darkMode ? "bg-black text-white" : "bg-orange-300 text-black"
      }`}
    >
      <BackgroundPattern darkMode={darkMode} />
      <DecorationElements darkMode={darkMode} />

      {/* ✅ Toggle Theme terhubung ke hook global */}
      <ThemeToggle darkMode={darkMode} setDarkMode={toggleDarkMode} />
      <Header darkMode={darkMode} />

      <div className="relative z-10 w-full max-w-4xl mt-12 mb-12">
        <ResultPage
          answers={answers}
          questionsMap={questionsMap}
          onRetake={handleRetake}
        />
      </div>
    </main>
  );
}
