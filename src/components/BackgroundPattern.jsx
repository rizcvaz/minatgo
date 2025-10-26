"use client";

export function BackgroundPattern({ darkMode }) {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      {/* Background Gradient */}
      <div
        className={`absolute inset-0 transition-colors duration-300 ease-in-out ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 to-black"
            : "bg-gradient-to-br from-blue-200 to-blue-500"
        }`}
      ></div>

      {/* Transparent Shapes - behind grid */}
      <div className="absolute inset-0 hidden md:block z-10">
   {!darkMode ? ( 
  <>
    <div className="absolute top-[10%] left-[5%] w-40 h-40 bg-[#93C5FD]/70 rotate-12"></div> {/* biru muda */}
    <div className="absolute bottom-[15%] right-[8%] w-60 h-60 bg-[#A5B4FC]/60 -rotate-12"></div> {/* biru keunguan */}
    <div className="absolute top-[40%] right-[15%] w-32 h-32 bg-[#BFDBFE]/70 rotate-45"></div> {/* biru pucat */}
    <div className="absolute bottom-[10%] left-[10%] w-48 h-48 bg-[#60A5FA]/60 -rotate-6"></div> {/* biru sedang */}
  </>
) : (
  <>
    <div className="absolute top-[10%] left-[5%] w-40 h-40 bg-[#93C5FD]/30 rotate-12"></div>
    <div className="absolute bottom-[15%] right-[8%] w-60 h-60 bg-cyan-500/15 -rotate-12"></div>
    <div className="absolute top-[40%] right-[15%] w-32 h-32 bg-yellow-500/15 rotate-45"></div>
    <div className="absolute bottom-[10%] left-[10%] w-48 h-48 bg-pink-500/15 -rotate-6"></div>
  </>
)}

      </div>

      {/* Grid Pattern (di atas shapes) */}
      <div
        className={`absolute inset-0 z-20 transition-opacity duration-300 ease-in-out ${
          darkMode ? "opacity-15" : "opacity-20"
        }`}
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, ${
            darkMode ? "#ffffff" : "#000000"
          } 0, ${
            darkMode ? "#ffffff" : "#000000"
          } 1px, transparent 1px, transparent 80px),
                          repeating-linear-gradient(90deg, ${
                            darkMode ? "#ffffff" : "#000000"
                          } 0, ${
            darkMode ? "#ffffff" : "#000000"
          } 1px, transparent 1px, transparent 80px)`,
          backgroundSize: "80px 80px",
        }}
      ></div>

      {/* Diagonal Stripes */}
      <div
        className={`absolute inset-0 z-30 transition-opacity duration-300 ease-in-out ${
          darkMode ? "opacity-10" : "opacity-10"
        }`}
        style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${
            darkMode ? "#ffffff" : "#000000"
          } 0, ${
            darkMode ? "#ffffff" : "#000000"
          } 1px, transparent 0, transparent 30px)`,
          backgroundSize: "30px 30px",
        }}
      ></div>
    </div>
  );
}
