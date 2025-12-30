import React from "react";

export function Footer() {
  return (
    <footer className="border-t-2 border-red-900 bg-black/90 backdrop-blur-sm p-6 text-center relative z-20">
      <div className="text-red-700 text-xs tracking-widest opacity-70 glitch-text crt-flicker mb-2">
        ▓▓▓ DISCONNECTION © 2025 ▓▓▓
      </div>
      <div className="text-red-900 text-xs mt-2 opacity-50 mb-4">
        ALL RIGHTS CORRUPTED
      </div>

      <div className="flex justify-center items-center space-x-6 text-red-600 font-bold relative z-50">
        <a
          href="https://www.instagram.com/tsunara.m?igsh=MWk3dmpod3pzanU0eQ=="
          className="hover:text-white hover:underline transition-colors uppercase text-xs tracking-widest flex items-center gap-2"
        >
          <span>Instagram</span>
        </a>
        <span className="text-red-800">|</span>
        <a
          href="https://youtube.com/@tsunaram?si=6oAfzA-OHLP1gt_y"
          className="hover:text-white hover:underline transition-colors uppercase text-xs tracking-widest flex items-center gap-2"
        >
          <span>YouTube</span>
        </a>
      </div>
    </footer>
  );
}
