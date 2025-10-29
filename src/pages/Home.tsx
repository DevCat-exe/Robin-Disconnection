import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { LoadingGlitch } from '../components/LoadingGlitch';
import { VHSOverlay } from '../components/VHSOverlay';
import { Navbar } from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

interface Post {
  id: number;
  title: string;
  desc?: string;
  description?: string;
  image_url: string;
  date_created: string;
  created_at?: string;
  category?: string;
}

export function Home() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
    // Use fixed background URL for now
    setBackgroundImage('https://gcxpgswjsjcoahbqtehh.supabase.co/storage/v1/object/public/backgrounds/blood-texture.png');
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
    } catch (error) {
      console.error('Error in fetchAllData:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate random rotation and scale for chaotic effect
  const getRandomRotate = (index: number) => {
    const rotations = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    const rotation = rotations[index % rotations.length];
    return rotation;
  };

  const getRandomSize = (index: number) => {
    const sizes = ['small', 'medium', 'large'];
    return sizes[index % sizes.length];
  };

  const handleItemClick = (category: string) => {
    navigate(`/${category}`);
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
              {allPosts.map((post, index) => {
                const size = getRandomSize(index);
                const sizeClass =
                  size === 'small' ? 'w-full' :
                  size === 'large' ? 'w-full md:col-span-2' :
                  'w-full';

                return (
                  <motion.div
                    key={`${post.category}-${post.id}`}
                    className="break-inside-avoid mb-6"
                    style={{
                      zIndex: 40,
                    }}
                    initial={{
                      opacity: 0,
                      y: 20,
                      rotate: getRandomRotate(index),
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotate: getRandomRotate(index),
                    }}
                    transition={{ duration: 0.6 }}
                    whileHover={{
                      rotate: getRandomRotate(index) - 2,
                      scale: 1.05,
                    }}
                  >
                    <div
                      onClick={() => handleItemClick(post.category!)}
                      className={`${sizeClass} cursor-pointer group relative bg-black border-2 border-red-900 hover:border-red-500 transition-all duration-300 hover:scale-105 hover:z-50`}
                      style={{
                        boxShadow: '0 0 20px rgba(139, 0, 0, 0.3)',
                      }}
                    >
                      {/* Glitch overlay */}
                      <div className="absolute inset-0 bg-red-900/0 group-hover:bg-red-900/20 transition-all duration-300 pointer-events-none z-10"></div>

                      {/* Image */}
                      <div className="relative overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-500"
                          style={{
                            filter: 'contrast(1.1) brightness(0.9)',
                          }}
                        />
                        <div className="scanline-overlay"></div>

                        {/* Blood drip effect on hover */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-red-900/0 group-hover:bg-red-900/80 transition-all duration-500 group-hover:h-8"></div>
                      </div>

                      {/* Content */}
                      <div className="p-4 bg-black/95 relative">
                        {/* Static noise background */}
                        <div
                          className="absolute inset-0 opacity-5 pointer-events-none"
                          style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                          }}
                        ></div>

                        <div className="text-xs text-red-700 mb-2 uppercase tracking-widest opacity-80">
                          [{post.category}]
                        </div>
                        <h3 className="text-gray-200 group-hover:text-red-400 transition-colors duration-300 leading-snug relative z-10">
                          {post.title}
                        </h3>

                        {/* Corrupted text effect */}
                        <div className="mt-2 text-xs text-red-900/50 group-hover:text-red-700/80 transition-colors duration-300">
                          {'>> CLICK TO VIEW'}
                        </div>
                      </div>

                      {/* Corner accent */}
                      <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-red-900/50 group-hover:border-red-500 transition-all duration-300"></div>
                      <div className="absolute bottom-0 left-0 w-0 h-0 border-b-8 border-l-8 border-red-900/50 group-hover:border-red-500 transition-all duration-300"></div>
                    </div>
                  </motion.div>
                );
              })}
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
