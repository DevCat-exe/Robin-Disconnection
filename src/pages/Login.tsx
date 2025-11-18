import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { VHSOverlay } from '../components/VHSOverlay';
import { LoadingGlitch } from '../components/LoadingGlitch';

// Utility for random button transform (chaotic/tilted look)
const getRandomButtonTransform = () => {
  const rotate = Math.floor(Math.random() * 7) - 3; // -3 to +3 deg
  const skew = Math.floor(Math.random() * 5) - 2; // -2 to +2 deg
  return `rotate(${rotate}deg) skewX(${skew}deg)`;
};

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // State for chaotic button transforms
  const [submitTransform] = useState(getRandomButtonTransform());
  const [returnTransform] = useState(getRandomButtonTransform());

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const loadingToast = toast.loading('Initiating connection...');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      toast.dismiss(loadingToast);

      if (signInError) {
        setError(signInError.message);
        toast.error(signInError.message);
      } else {
        toast.success("Access Granted");
        navigate('/admin');
      }
    } catch (error: any) {
      toast.dismiss(loadingToast);
      const msg = 'An unexpected error occurred. Please try again.';
      setError(msg);
      toast.error(msg);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://gcxpgswjsjcoahbqtehh.supabase.co/storage/v1/object/public/backgrounds/blood-texture.png")',
          filter: 'blur(6px) brightness(0.6)',
          zIndex: -1,
        }}
      />

      {/* Fallback Background */}
      <div
        className="fixed inset-0 bg-gradient-to-b from-black via-red-950/20 to-black"
        style={{ zIndex: -2 }}
      />

      <VHSOverlay />

      {loading ? (
        <LoadingGlitch />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 30, scaleX: 0.8 }}
          animate={{ opacity: 1, y: 0, scaleX: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
          style={{ width: '400px', maxWidth: '100%' }}
          className="mx-auto"
        >
          {/* Enhanced Login Container */}
          <motion.div
            className="glitch-border bg-black/95 border-2 border-red-900 rounded-lg p-12 shadow-2xl backdrop-blur-sm relative"
            initial={{ boxShadow: "0 0 0 rgba(255,26,26,0)" }}
            animate={{ boxShadow: "0 0 30px rgba(255,26,26,0.1)" }}
            transition={{ delay: 0.4, duration: 1.5 }}
          >
            {/* Static noise background */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none rounded-lg"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
              }}
            />

            {/* Enhanced Header */}
            <motion.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h1
                className="glitch-text text-red-600 text-5xl mb-4 font-bold rgb-split"
                style={{ fontFamily: 'VT323, monospace' }}
                initial={{ skewX: 0 }}
                animate={{ skewX: [-2, 2, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
              >
                ACCESS
              </motion.h1>
              <div className="text-red-700 text-lg tracking-widest opacity-70" style={{ fontFamily: 'VT323, monospace' }}>
                ▓▓▓ ADMIN GATEWAY ▓▓▓
              </div>
              <div className="w-16 h-0.5 bg-red-900 mx-auto mt-4"></div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 bg-red-900/30 border border-red-700 rounded-sm backdrop-blur-sm"
              >
                <div className="text-red-400 text-sm font-bold text-center" style={{ fontFamily: 'VT323, monospace', fontSize: '1rem' }}>
                  ⚠️ {error}
                </div>
              </motion.div>
            )}

            {/* Enhanced Login Form */}
            <motion.form
              onSubmit={handleLogin}
              className="space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <label className="block text-red-700 text-sm mb-3 tracking-widest font-bold uppercase" style={{ fontFamily: 'VT323, monospace' }}>
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/70 border-2 border-red-900 rounded-sm px-6 py-4 text-gray-200 placeholder-red-800/50 focus:border-red-600 focus:outline-none transition-all duration-300 hover:border-red-700 text-lg"
                    placeholder="admin@disconnection.exe"
                    required
                  />
                  <div className="absolute inset-0 border-2 border-red-900/0 hover:border-red-700/50 rounded-sm transition-colors pointer-events-none" />
                </div>
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-red-700 text-sm mb-3 tracking-widest font-bold uppercase" style={{ fontFamily: 'VT323, monospace' }}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/70 border-2 border-red-900 rounded-sm px-6 py-4 text-gray-200 placeholder-red-800/50 focus:border-red-600 focus:outline-none transition-all duration-300 hover:border-red-700 text-lg"
                    placeholder="••••••••••••"
                    required
                  />
                  <div className="absolute inset-0 border-2 border-red-900/0 hover:border-red-700/50 rounded-sm transition-colors pointer-events-none" />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                className="py-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <button
                  type="submit"
                  className="w-full px-12 py-6 bg-black border-2 border-red-900 hover:border-red-500 text-red-400 font-bold text-lg tracking-widest glitch-text relative overflow-hidden cursor-pointer shadow-lg transition-all duration-300 hover:scale-105 hover:z-50 rounded-none flex items-center justify-center group"
                  style={{
                    boxShadow: '0 0 30px #ff1a1a55',
                    letterSpacing: '0.08em',
                    borderRadius: '0',
                    transform: submitTransform,
                    fontFamily: 'VT323, monospace',
                  }}
                >
                  {/* VHS static overlay */}
                  <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                    }}
                  />
                  {/* Blood drip effect on hover */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-red-900/0 group-hover:bg-red-900/80 transition-all duration-500 group-hover:h-8" />
                  <span className="tracking-widest text-sm relative z-10 font-bold">
                    {loading ? 'CONNECTING...' : 'INITIATE ACCESS'}
                  </span>

                  {/* Corner accents */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-red-900/50 group-hover:border-red-500 transition-all duration-300" />
                  <div className="absolute bottom-0 left-0 w-0 h-0 border-b-8 border-l-8 border-red-900/50 group-hover:border-red-500 transition-all duration-300" />
                </button>
              </motion.div>

              {/* Divider */}
              <motion.div
                className="flex items-center py-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex-1 h-px bg-red-900"></div>
                <div className="px-4 text-red-700 text-sm tracking-widest" style={{ fontFamily: 'VT323, monospace' }}>OR</div>
                <div className="flex-1 h-px bg-red-900"></div>
              </motion.div>

              {/* Back to Gallery Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full px-8 py-4 bg-black/50 border-2 border-red-900/50 hover:border-red-700 text-red-500 font-bold text-base tracking-widest relative overflow-hidden cursor-pointer shadow-lg transition-all duration-300 hover:scale-105 rounded-none flex items-center justify-center"
                  style={{
                    letterSpacing: '0.08em',
                    borderRadius: '0',
                    transform: returnTransform,
                    fontFamily: 'VT323, monospace',
                  }}
                >
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                  }} />
                  <span className="tracking-widest text-sm relative z-10 font-bold">
                    RETURN TO GALLERY
                  </span>
                </button>
              </motion.div>
            </motion.form>

            {/* Footer Text */}
            <motion.div
              className="text-center mt-8 pt-6 border-t border-red-900/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0 }}
            >
              <div className="text-red-800 text-xs tracking-widest opacity-60" style={{ fontFamily: 'VT323, monospace' }}>
                UNAUTHORIZED ACCESS PROHIBITED
              </div>
            </motion.div>

            {/* Corner accents */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-red-900/50 -mt-2 -mr-2" />
            <div className="absolute bottom-0 left-0 w-0 h-0 border-b-8 border-l-8 border-red-900/50 -mb-2 -ml-2" />
          </motion.div>

        </motion.div>
      )}
    </div>
  );
}
