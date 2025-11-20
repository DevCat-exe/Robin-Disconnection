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
  id: number;
  title: string;
  desc?: string;
  description?: string;
  image_url: string;
  date_created: string;
  created_at?: string;
}

export function Category() {
  const { category } = useParams<{ category: string }>();
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
        .order('created_at', { ascending: false });

      if (error) {
        console.error(`Error fetching ${cat}:`, error);
        setPosts([]);
        setSelectedPost(null);
      } else {
        setPosts(data || []);
        setSelectedPost(data && data.length > 0 ? data[0] : null);
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

  const handleTabChange = (tab: string) => {
    if (tab === 'home') {
      navigate('/');
    } else {
      navigate(`/${tab}`);
    }
  };

  const handlePostSelect = (post: Post) => {
    setSelectedPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const suggestedPosts = posts.filter((post) => post.id !== selectedPost?.id).slice(0, 5);

  return (
    <div className="min-h-screen relative">
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

      <AnimatePresence mode="wait">
        {loading && !selectedPost ? (
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
            className={`transition-opacity duration-500 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}
          >
            <Navbar activeTab={category!} onTabChange={handleTabChange} />

            <main className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  {selectedPost ? (
                    <PostCard post={selectedPost} />
                  ) : (
                    <div className="glitch-border p-12 bg-black/80 border-2 border-red-900 rounded-sm text-center">
                      <div className="glitch-text text-red-600">
                        NO {category?.toUpperCase()} FOUND
                      </div>
                      <p className="text-gray-500 mt-4">
                        The database is empty or unreachable.
                      </p>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  {suggestedPosts.length > 0 && (
                    <Sidebar
                      posts={suggestedPosts}
                      category={category!}
                      onPostSelect={handlePostSelect}
                    />
                  )}
                </div>
              </div>
            </main>

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}