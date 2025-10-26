import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import GlobalLoading from "@/components/GlobalLoader"; // ✅ Tambah ini

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MinatGo",
  description: "Tes Minat Bakat Interaktif",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <GlobalLoading />  {/* ✅ Tambahkan di sini */}
        {children}
      </body>
    </html>
  );
}
