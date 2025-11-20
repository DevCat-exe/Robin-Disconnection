import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { VHSOverlay } from '../components/VHSOverlay';

export function NotFound() {
  return (
    <div className="min-h-screen relative flex items-center justify-center text-center overflow-hidden">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://gcxpgswjsjcoahbqtehh.supabase.co/storage/v1/object/public/backgrounds/image.png")',
          filter: 'blur(0px) brightness(0.4)',
          zIndex: -1,
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black via-red-950/50 to-black" style={{ zIndex: -2 }} />
      <VHSOverlay />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h1
          className="text-9xl font-bold text-red-600 glitch-text"
          data-text="404"
          style={{
            fontFamily: 'VT323, monospace',
            textShadow: '0 0 10px #ff1a1a, 0 0 20px #ff1a1a, 0 0 40px #ff1a1a',
          }}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          404
        </motion.h1>

        <motion.p
          className="text-2xl text-gray-300 mt-4 mb-8"
          style={{ fontFamily: 'VT323, monospace' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
        >
          PAGE NOT FOUND // CONNECTION LOST
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          <Link
            to="/"
            className="btn-horror-danger px-10 py-4 text-lg tracking-widest"
          >
            RETURN TO SAFETY
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
