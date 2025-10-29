import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="footer-container border-t-2 border-red-900 bg-black/90 backdrop-blur-sm p-6 text-center relative">
      <div className="glitch-text text-red-700 text-sm crt-flicker">
        © DISCONNECTION 2025
      </div>
      <div className="absolute bottom-2 right-4">
        <Link
          to="/login"
          className="text-red-900/50 text-xs hover:text-red-700 transition-colors tracking-widest opacity-70"
        >
          ADMIN
        </Link>
      </div>
    </footer>
  );
}
