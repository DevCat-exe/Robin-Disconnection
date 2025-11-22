import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { LoadingGlitch } from '../components/LoadingGlitch';
import { VHSOverlay } from '../components/VHSOverlay';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { GalleryItem } from '../components/GalleryItem';

// Update interface for GalleryItem
export interface GalleryItemPost extends Post {
  category: string;
}

interface Post {
  id: string; // UUID from Supabase
  title: string;
  desc?: string;
  description?: string;
  image_url: string;
  date_created: string;
  created_at?: string;
  category?: string;
}

// Update interface for GalleryItem
export interface GalleryItemPost extends Post {
  category: string;
}

export function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
    // Use fixed background URL for now
    setBackgroundImage('https://gcxpgswjsjcoahbqtehh.supabase.co/storage/v1/object/public/backgrounds/image.png');
  }, []);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchAllData = async () => {
    try {
      const categories = ['arts', 'gifs', 'sketches', 'animes'];
      const allData: Post[] = [];

      for (const category of categories) {
        const { data, error } = await supabase
          .from(category)
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error(`Error fetching ${category}:`, error);
        } else if (data) {
          const postsWithCategory = data.map((post) => ({
            ...post,
            category: category,
          }));
          allData.push(...postsWithCategory);
        }
      }

      const shuffledData = shuffleArray(allData);
      setAllPosts(shuffledData);

      // Preload images
      const imageUrls = shuffledData.map(post => post.image_url);
      await Promise.all(imageUrls.map(url => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = reject;
        });
      }));

    } catch (error) {
      console.error('Error in fetchAllData:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (category: string, postId?: number) => {
    if (postId) {
      navigate(`/${category}/${postId}`);
    } else {
      navigate(`/${category}`);
    }
  };

  if (loading) {
    return <LoadingGlitch />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          filter: 'blur(0px) brightness(0.6)',
          zIndex: -1,
        }}
      />

      {/* Fallback Background */}
      <div
        className="fixed inset-0 bg-gradient-to-b from-black via-red-950/20 to-black"
        style={{ zIndex: -2 }}
      />

      <VHSOverlay />

      {/* Navbar */}
      <Navbar activeTab="home" onTabChange={(tab) => {
        if (tab !== 'home') {
          handleItemClick(tab);
        }
      }} />

      {/* Chaotic Gallery */}
      <main className="container mx-auto px-4 py-12">
        {allPosts.length === 0 ? (
          <div className="glitch-border p-12 bg-black/80 border-2 border-red-900 rounded-sm text-center">
            <div className="glitch-text text-red-600">
              GALLERY EMPTY
            </div>
            <p className="text-gray-500 mt-4">
              No content available in the database.
            </p>
          </div>
        ) : (
          <div className="relative min-h-screen">
            {/* Chaotic scattered layout */}
            <motion.div
              className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 1 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
            >
              {allPosts.map((post) => (
                <GalleryItem key={`${post.category}-${post.id}`} post={post} onItemClick={handleItemClick} />
              ))}
            </motion.div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-red-900 bg-black/90 backdrop-blur-sm p-6 text-center mt-16 relative z-20">
        <div className="text-red-700 text-xs tracking-widest opacity-70">
          ▓▓▓ DISCONNECTION © 2025 ▓▓▓
        </div>
        <div className="text-red-900 text-xs mt-2 opacity-50">
          ALL RIGHTS CORRUPTED
        </div>
      </footer>
    </div>
  );
}
