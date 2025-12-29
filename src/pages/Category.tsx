import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from '../components/Navbar';
import { PostCard } from '../components/PostCard';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
import { VHSOverlay } from '../components/VHSOverlay';
import { LoadingGlitch } from '../components/LoadingGlitch';
import { supabase } from '../lib/supabaseClient';

interface Post {
  id: string; // UUID from Supabase
  title: string;
  desc?: string;
  description?: string;
  image_url: string;
  date_created: string;
  created_at?: string;
}

export function Category() {
  const { category, postId } = useParams<{ category: string; postId?: string }>();
  const navigate = useNavigate();

  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');
  const [prevBackgroundImage, setPrevBackgroundImage] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Fetch background on mount
  useEffect(() => {
    // Use fixed background URL for now
    setBackgroundImage('https://gcxpgswjsjcoahbqtehh.supabase.co/storage/v1/object/public/backgrounds/image.png');
  }, []);

  // Fetch posts when component mounts or category changes
  useEffect(() => {
    if (category) {
      fetchPosts(category);
    }
  }, [category]);

  const fetchPosts = async (cat: string) => {
    setIsTransitioning(true);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from(cat)
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error(`Error fetching ${cat}:`, error);
        setPosts([]);
        setSelectedPost(null);
      } else {
        setPosts(data || []);
        // Initial selection handled by separate effect now
      }
    } catch (error) {
      console.error(`Error in fetchPosts for ${cat}:`, error);
      setPosts([]);
      setSelectedPost(null);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setIsTransitioning(false);
      }, 500);
    }
  };

  // Effect to handle direct navigation/clicking on suggested items
  useEffect(() => {
    if (posts.length > 0) {
      if (postId) {
        const targetPost = posts.find(post => post.id === postId);
        setSelectedPost(targetPost || null);
        // Scroll to top when post changes
        window.scrollTo(0, 0);
      } else {
        setSelectedPost(null);
      }
    }
  }, [postId, posts]);

  const handleTabChange = (tab: string) => {
    if (tab === 'home') {
      navigate('/');
    } else {
      navigate(`/${tab}`);
    }
  };

  const onItemClick = (cat: string, pId: string) => {
      navigate(`/${cat}/${pId}`);
  };

  const handlePostSelect = (post: Post) => {
    navigate(`/${category}/${post.id}`);
  };

  const suggestedPosts = selectedPost 
    ? posts.filter((post) => post.id !== selectedPost.id).slice(0, 5) 
    : [];

  // Generate random rotation and scale for chaotic effect
  const getRandomRotate = (index: number) => {
    const rotations = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];
    return rotations[index % rotations.length];
  };

  const getRandomSize = (index: number) => {
    const sizes = ['small', 'medium', 'large'];
    return sizes[index % sizes.length];
  };

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
          filter: 'blur(0px) brightness(0.6)',
          zIndex: -1,
        }}
      />

      <div
        className="fixed inset-0 bg-gradient-to-b from-black via-red-950/20 to-black"
        style={{ zIndex: -2 }}
      />

      <VHSOverlay />

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen flex items-center justify-center"
          >
            <LoadingGlitch />
          </motion.div>
        ) : (
          <motion.div
            key={category}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-50' : 'opacity-100'} flex flex-col min-h-screen`}
          >
            <Navbar activeTab={category!} onTabChange={handleTabChange} />

            <main className="container mx-auto px-4 py-8 flex-grow">
              {!postId ? (
                  // GALLERY VIEW
                   <>
                   {posts.length === 0 ? (
                    <div className="glitch-border p-12 bg-black/80 border-2 border-red-900 rounded-sm text-center">
                        <div className="glitch-text text-red-600">
                        NO {category?.toUpperCase()} FOUND
                        </div>
                    </div>
                   ) : (
                    /* Chaotic scattered layout matching Homepage */
                    <div className="relative min-h-screen">
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
                            {posts.map((post, index) => {
                                const size = getRandomSize(index);
                                const sizeClass = 
                                size === 'small' ? 'w-full' : 
                                size === 'large' ? 'w-full md:col-span-2' : 
                                'w-full';
                                
                                return (
                                    <motion.div
                                        key={post.id}
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
                                    >
                                        <div 
                                            onClick={() => onItemClick(category!, post.id)}
                                            className={`${sizeClass} cursor-pointer group relative bg-black border-2 border-red-900 hover:border-red-500 transition-all duration-300`}
                                        >
                                            <div className="relative overflow-hidden">
                                                <img
                                                src={post.image_url}
                                                alt={post.title}
                                                className="w-full h-auto object-cover"
                                                />
                                            </div>
                                            
                                            <div className="p-4 bg-black/95 relative">
                                                {/* Static noise background */}
                                                <div 
                                                className="absolute inset-0 opacity-5 pointer-events-none"
                                                style={{
                                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")',
                                                }}
                                                ></div>
                                                
                                                <div className="text-xs text-red-700 mb-2 uppercase tracking-widest opacity-80">
                                                [{category}]
                                                </div>
                                                <h3 className="text-gray-200 group-hover:text-red-400 transition-colors duration-300 leading-snug relative z-10">
                                                    {post.title}
                                                </h3>
                                                
                                                <div className="mt-2 text-xs text-red-900/50 group-hover:text-red-700/80 transition-colors duration-300">
                                                    {'>> CLICK TO VIEW'}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                   )}
                   </>
              ) : (
                  // SINGLE POST VIEW
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        {selectedPost ? (
                            <PostCard post={selectedPost} />
                        ) : (
                            <div className="p-12 text-center text-red-600">POST NOT FOUND</div>
                        )}
                    </div>
                    <div className="lg:col-span-1">
                        <Sidebar
                            posts={suggestedPosts}
                            category={category!}
                            onPostSelect={handlePostSelect}
                        />
                    </div>
                  </div>
              )}
            </main>

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
