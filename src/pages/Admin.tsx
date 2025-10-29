import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { VHSOverlay } from '../components/VHSOverlay';
import { LoadingGlitch } from '../components/LoadingGlitch';

const IMG_BB_API_KEY = import.meta.env.VITE_IMG_BB_API_KEY; // You need to get this from imgbb.com

export function Admin() {
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('arts');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

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
        const base64Data = base64String.split(',')[1]; // Remove data:image/jpeg;base64,

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

      // Prepare post data
      const postData = {
        title,
        description: description,
        image_url: imageUrl,
        date_created: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

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
        <div className="flex justify-between items-center mb-8">
          <motion.h1
            className="glitch-text text-red-600 text-4xl"
            initial={{ skewX: 0 }}
            animate={{ skewX: [-1, 1, 0] }}
            transition={{ duration: 0.5 }}
          >
            ADMIN PANEL
          </motion.h1>
          <motion.button
            onClick={handleLogout}
            className="bg-red-900/20 hover:bg-red-900/40 border-2 border-red-600 text-red-400 hover:text-red-300 py-2 px-4 rounded-sm transition-all duration-300 relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 tracking-widest text-sm">LOGOUT</span>
            <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-all duration-300"></div>
          </motion.button>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: '550px', minHeight: '650px' }}
          className="mx-auto"
        >
          <div className="glitch-border bg-black/90 border-2 border-red-900 rounded-sm p-10">
            {/* Static noise */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none rounded-sm"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
              }}
            />

            <form onSubmit={handleSubmit} className="relative space-y-6">
              {/* Category */}
              <div>
                <label className="block text-red-700 text-sm mb-2 tracking-widest">CATEGORY</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/50 border-2 border-red-900 rounded-sm px-6 py-3 text-gray-200 focus:border-red-600 focus:outline-none transition-colors"
                >
                  <option value="arts">Arts</option>
                  <option value="gifs">Gifs</option>
                  <option value="sketches">Sketches</option>
                  <option value="animes">Animes</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-red-700 text-sm mb-2 tracking-widest">TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/50 border-2 border-red-900 rounded-sm px-6 py-3 text-gray-200 placeholder-red-800/50 focus:border-red-600 focus:outline-none transition-colors"
                  placeholder="Enter post title..."
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-red-700 text-sm mb-2 tracking-widest">DESCRIPTION</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/50 border-2 border-red-900 rounded-sm px-6 py-3 text-gray-200 placeholder-red-800/50 focus:border-red-600 focus:outline-none transition-colors"
                  rows={4}
                  placeholder="Enter post description..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-red-700 text-sm mb-2 tracking-widest">IMAGE</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-black/50 border-2 border-red-900 rounded-sm px-6 py-3 text-gray-200 file:bg-red-900 file:border-0 file:rounded-sm file:px-4 file:py-1 file:text-gray-100 file:mr-4 file:hover:bg-red-800 transition-colors"
                  required={!imageFile}
                />
                {!IMG_BB_API_KEY && (
                  <div className="mt-2 text-red-400 text-sm">
                    Warning: IMG_BB_API_KEY not set. Upload will fail.
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading || uploading}
                className="w-full bg-red-900/20 hover:bg-red-900/40 border-2 border-red-600 text-red-400 hover:text-red-300 py-3 px-4 rounded-sm transition-all duration-300 group disabled:opacity-50 relative overflow-hidden"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 tracking-widest text-sm">
                  {loading ? 'CREATING...' : uploading ? 'UPLOADING...' : 'CREATE POST'}
                </span>
                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/10 transition-all duration-300"></div>
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
