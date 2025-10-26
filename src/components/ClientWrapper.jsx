"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen"; // animasi kerenmu 😎

export default function ClientWrapper({ children }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // durasi loading 2.5 detik
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? <LoadingScreen /> : children}
    </>
  );
}
