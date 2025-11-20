/// <reference types="vite/client" />

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { VHSOverlay } from '../components/VHSOverlay';
import { LoadingGlitch } from '../components/LoadingGlitch';
import { PostManager } from '../components/PostManager';
import { useDropzone } from 'react-dropzone';

const IMG_BB_API_KEY = import.meta.env.VITE_IMG_BB_API_KEY;

// Utility for random button transform (chaotic/tilted look)
const getRandomButtonTransform = () => {
  const rotate = Math.floor(Math.random() * 7) - 3; // -3 to +3 deg
  const skew = Math.floor(Math.random() * 5) - 2; // -2 to +2 deg
  return `rotate(${rotate}deg) skewX(${skew}deg)`;
};

export function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [createdAtDate, setCreatedAtDate] = useState('');
  const [category, setCategory] = useState('arts');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  // State for chaotic button transforms
  const [logoutTransform] = useState(getRandomButtonTransform());
  const [submitTransform] = useState(getRandomButtonTransform());

  useEffect(() => {
    setCreatedAtDate(new Date().toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    checkUser();
  }, []);

  // Update image preview when file changes
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(imageFile);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/login');
    } else {
      setUser(user);
    }
  };

  const uploadToImgBB = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];

        const formData = new FormData();
        formData.append('image', base64Data);

        const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMG_BB_API_KEY}`, {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();
        if (data.success) {
          resolve(data.data.url);
        } else {
          reject(new Error(data.error?.message || 'Upload failed'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loadingToast = toast.loading(uploading ? 'Uploading image...' : 'Creating post...');

    try {
      let imageUrl = '';

      if (imageFile) {
        setUploading(true);
        toast.dismiss(loadingToast);
        const uploadToast = toast.loading('Uploading image...');
        imageUrl = await uploadToImgBB(imageFile);
        toast.dismiss(uploadToast);
        setUploading(false);
      }

      const now = new Date();
      const createdTimestamp = new Date(createdAtDate + 'T' + now.toTimeString().split(' ')[0]);
      const postData = {
        title,
        description: description,
        image_url: imageUrl,
        date_created: new Date().toISOString().split('T')[0],
        created_at: createdTimestamp.toISOString(),
      };

      toast.dismiss(loadingToast);
      const createToast = toast.loading('Creating post...');

      const { error } = await supabase
        .from(category)
        .insert([postData]);

      toast.dismiss(createToast);

      if (error) {
        throw error;
      }

      toast.success('Post added successfully!');
      // Reset form
      setTitle('');
      setDescription('');
      setImageFile(null);
      setImagePreview(null);
    } catch (error: any) {
      toast.error('Error: ' + error.message);
      console.error('Submission error:', error);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    toast.success('Logged out successfully');
    await supabase.auth.signOut();
    navigate('/');
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImageFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
    multiple: false,
  });

  if (!user) {
    return <LoadingGlitch />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://gcxpgswjsjcoahbqtehh.supabase.co/storage/v1/object/public/backgrounds/blood-texture.png")',
          filter: 'blur(6px) brightness(0.6)',
          zIndex: -1,
        }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-black via-red-950/20 to-black" style={{ zIndex: -2 }} />
      <VHSOverlay />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-red-600 text-6xl mb-4 font-bold rgb-split"

          >
            ADMIN INTERFACE
          </motion.h1>
          <div className="text-red-700 text-lg tracking-widest opacity-70" >
            ▓▓▓ MASTER CONTROL PANEL ▓▓▓
          </div>
        </motion.div>

        {/* Logout Button - Positioned above tabs */}
        <div className="flex justify-end mb-6" style={{ maxWidth: '800px', margin: '0 auto 1.5rem auto' }}>
          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-black/70 border-2 border-red-900/70 hover:border-red-600 text-red-500 font-bold text-base tracking-widest transition-all duration-300 hover:scale-105 rounded-sm shadow-lg"
            style={{

              transform: logoutTransform,
              boxShadow: '0 0 20px rgba(255,26,26,0.2)',
            }}
          >
            ◀ LOGOUT
          </button>
        </div>

        {/* Tabbed Interface */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.3 }}
          style={{ maxWidth: '800px' }}
          className="mx-auto"
        >
          {/* Tabs */}
          <div className="horror-tabs" >
            <button
              className={`horror-tab ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => setActiveTab('create')}
              style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
            >
              ✚ CREATE POST
            </button>
            <button
              className={`horror-tab ${activeTab === 'manage' ? 'active' : ''}`}
              onClick={() => setActiveTab('manage')}
              style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}
            >
              📋 MANAGE POSTS
            </button>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'create' ? (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="glitch-border bg-black/95 border-2 border-red-900 rounded-lg p-8 shadow-2xl backdrop-blur-sm relative"
                style={{ boxShadow: "0 0 40px rgba(255,26,26,0.15)" }}
              >
                {/* Static noise background */}
                <div
                  className="absolute inset-0 opacity-5 pointer-events-none rounded-lg"
                  style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                  }}
                />



                {/* Warning if no API key */}
                {!IMG_BB_API_KEY && (
                  <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-sm">
                    <div className="flex items-center gap-3">
                      <div className="text-red-400 text-2xl pulse-warning">⚠️</div>
                      <div className="text-red-400 text-sm" >
                        <strong>WARNING:</strong> IMG_BB_API_KEY not set. Image uploads will fail.
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  {/* Title Field */}
                  <div>
                    <label className="block text-red-700 text-sm mb-2 tracking-widest font-bold uppercase" >
                      Title {title.length > 0 && <span className="text-red-500">({title.length}/100)</span>}
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                      className="w-full bg-black/70 border-2 border-red-900 rounded-sm px-4 py-3 text-gray-200 placeholder-red-800/50 focus:border-red-600 focus:outline-none transition-colors"
                      style={{  fontSize: '1.1rem' }}
                      placeholder="Enter post title..."
                      required
                      maxLength={100}
                    />
                  </div>

                  {/* Description Field */}
                  <div>
                    <label className="block text-red-700 text-sm mb-2 tracking-widest font-bold uppercase" >
                      Description {description.length > 0 && <span className="text-red-500">({description.length}/500)</span>}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                      className="w-full bg-black/70 border-2 border-red-900 rounded-sm px-4 py-3 text-gray-200 placeholder-red-800/50 focus:border-red-600 focus:outline-none transition-colors resize-none"
                      style={{  fontSize: '1.1rem' }}
                      placeholder="Enter description..."
                      rows={4}
                      maxLength={500}
                    />
                  </div>

                  {/* Category Field */}
                  <div>
                    <label className="block text-red-700 text-sm mb-2 tracking-widest font-bold uppercase" >
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-black/70 border-2 border-red-900 rounded-sm px-4 py-3 text-gray-200 focus:border-red-600 focus:outline-none transition-colors cursor-pointer"
                      style={{  fontSize: '1.1rem' }}
                    >
                      <option value="arts">🎨 Arts</option>
                      <option value="gifs">🎬 Gifs</option>
                      <option value="sketches">✏️ Sketches</option>
                      <option value="animes">📺 Animes</option>
                    </select>
                  </div>

                  {/* Date Field */}
                  <div>
                    <label className="block text-red-700 text-sm mb-2 tracking-widest font-bold uppercase" >
                      Created Date
                    </label>
                    <input
                      type="date"
                      value={createdAtDate}
                      onChange={(e) => setCreatedAtDate(e.target.value)}
                      className="w-full bg-black/70 border-2 border-red-900 rounded-sm px-4 py-3 text-gray-200 focus:border-red-600 focus:outline-none transition-colors"
                      style={{  fontSize: '1.1rem' }}
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-red-700 text-sm mb-2 tracking-widest font-bold uppercase" >
                      Image Upload
                    </label>
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all duration-300 ${isDragActive
                        ? 'border-red-500 bg-red-900/20'
                        : 'border-red-900 bg-black/50 hover:border-red-700 hover:bg-red-900/10'
                        }`}
                    >
                      <input {...getInputProps()} />
                      <div className="text-red-600 text-4xl mb-3">📁</div>
                      <div className="text-red-400 text-sm" >
                        {isDragActive ? (
                          <p>Drop the image here...</p>
                        ) : (
                          <p>Drag & drop an image here, or click to select</p>
                        )}
                      </div>
                      {imageFile && (
                        <div className="mt-3 text-red-500 text-sm font-bold" >
                          ✓ {imageFile.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="image-preview-polaroid"
                    >
                      <img src={imagePreview} alt="Preview" className="w-full h-auto" />
                      <div className="text-center mt-2 text-red-400 text-sm" >
                        Image Preview
                      </div>
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={loading || uploading}
                      className="w-full px-10 py-5 bg-black border-2 border-red-900 hover:border-red-500 text-red-400 font-bold text-lg tracking-widest relative overflow-hidden cursor-pointer shadow-lg transition-all duration-300 hover:scale-105 rounded-sm group disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        boxShadow: '0 0 30px rgba(255, 26, 26, 0.3)',
                        letterSpacing: '0.08em',

                        transform: submitTransform,
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
                      <div className="absolute top-0 left-0 w-full h-2 bg-red-900/0 group-hover:bg-red-900/80 transition-all duration-500 group-hover:h-10" />
                      <span className="relative z-10 text-xl">
                        {loading ? (
                          <div className="typing-indicator inline-flex">
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                            <span className="typing-dot"></span>
                          </div>
                        ) : (
                          '▶ CREATE POST'
                        )}
                      </span>
                      {/* Corner accents */}
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-red-900/50 group-hover:border-red-500 transition-all duration-300" />
                      <div className="absolute bottom-0 left-0 w-0 h-0 border-b-8 border-l-8 border-red-900/50 group-hover:border-red-500 transition-all duration-300" />
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="manage"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <PostManager />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}