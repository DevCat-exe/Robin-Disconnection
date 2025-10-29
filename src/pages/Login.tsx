import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { VHSOverlay } from '../components/VHSOverlay';
import { LoadingGlitch } from '../components/LoadingGlitch';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="min-h-screen relative flex items-center justify-center">
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ width: '550px', height: '650px' }}
          className="relative z-10 mr-4 ml-4"
        >
          {/* Glitchy Border */}
          <div className="glitch-border bg-black/90 border-2 border-red-900 rounded-sm p-12">
            {/* Static noise background */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none rounded-sm"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
              }}
            ></div>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.h1
                className="glitch-text text-red-600 text-4xl mb-2"
                initial={{ skewX: 0 }}
                animate={{ skewX: [-2, 2, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                ADMIN ACCESS
              </motion.h1>
              <div className="text-red-700 text-sm tracking-widest opacity-70">
                ▓▓▓ CORRUPTED LOGIN ▓▓▓
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-sm"
              >
                <div className="text-red-400 text-sm">{error}</div>
              </motion.div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="block text-red-700 text-sm mb-2 tracking-widest">
                  EMAIL
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/50 border-2 border-red-900 rounded-sm px-6 py-3 text-gray-200 placeholder-red-800/50 focus:border-red-600 focus:outline-none transition-colors"
                    placeholder="your.email@devcat.exe"
                    required
                  />
                  <div className="absolute inset-0 border-2 border-red-900/0 hover:border-red-900/50 rounded-sm transition-colors pointer-events-none"></div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-red-700 text-sm mb-2 tracking-widest">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/50 border-2 border-red-900 rounded-sm px-6 py-3 text-gray-200 placeholder-red-800/50 focus:border-red-600 focus:outline-none transition-colors"
                    placeholder="********"
                    required
                  />
                  <div className="absolute inset-0 border-2 border-red-900/0 hover:border-red-900/50 rounded-sm transition-colors pointer-events-none"></div>
                </div>
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                className="w-full bg-red-900 hover:bg-red-700 text-white py-3 px-4 rounded-sm transition-all duration-300 relative group"
                whileHover={{ scale: 1.02, backgroundColor: '#dc2626' }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="tracking-widest text-sm">
                  INITIATE CONNECTION
                </span>
              </motion.button>
            </form>

            {/* Back Button */}
            <motion.button
              onClick={() => navigate('/')}
              className="mt-6 w-full bg-transparent border-2 border-gray-700 text-gray-500 hover:text-gray-400 py-2 px-4 rounded-sm transition-all duration-300"
              whileHover={{ scale: 1.01 }}
            >
              <span className="text-xs tracking-widest">
                BACK TO GALLERY
              </span>
            </motion.button>
          </div>

          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-red-900/50 -mt-2 -mr-2"></div>
          <div className="absolute bottom-0 left-0 w-0 h-0 border-b-8 border-l-8 border-red-900/50 -mb-2 -ml-2"></div>
        </motion.div>
      )}
    </div>
  );
}
