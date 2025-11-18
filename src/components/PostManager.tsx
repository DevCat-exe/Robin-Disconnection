import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import toast from 'react-hot-toast';
import { DeleteModal } from './DeleteModal';

interface Post {
    id: number;
    title: string;
    description?: string;
    image_url: string;
    date_created: string;
    created_at?: string;
    category: string;
}

export function PostManager() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; post: Post | null }>({
        isOpen: false,
        post: null,
    });
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
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

            setPosts(allData);
        } catch (error) {
            console.error('Error in fetchPosts:', error);
            toast.error('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.post) return;

        setDeleting(true);
        const loadingToast = toast.loading('Deleting post...');

        try {
            const { error } = await supabase
                .from(deleteModal.post.category)
                .delete()
                .eq('id', deleteModal.post.id);

            toast.dismiss(loadingToast);

            if (error) {
                throw error;
            }

            toast.success('Post deleted successfully!');
            setDeleteModal({ isOpen: false, post: null });
            fetchPosts(); // Refresh the list
        } catch (error: any) {
            toast.error('Error: ' + error.message);
            console.error('Delete error:', error);
        } finally {
            setDeleting(false);
        }
    };

    // Filter posts
    const filteredPosts = posts.filter((post) => {
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                </div>
                <span className="ml-4 text-red-600 tracking-widest" style={{ fontFamily: 'VT323, monospace', fontSize: '1.2rem' }}>
                    LOADING POSTS...
                </span>
            </div>
        );
    }

    return (
        <div>
            {/* Filters */}
            <motion.div
                className="mb-8 space-y-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Category Filter */}
                <div>
                    <label className="block text-red-700 text-xs mb-2 tracking-widest font-bold uppercase" style={{ fontFamily: 'VT323, monospace' }}>
                        Filter by Category
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-black/70 border-2 border-red-900 rounded-sm px-5 py-3 text-gray-200 focus:border-red-600 focus:outline-none transition-all duration-300 appearance-none cursor-pointer hover:border-red-700"
                        style={{ fontFamily: 'VT323, monospace', fontSize: '1.1rem' }}
                    >
                        <option value="all">🌐 All Categories</option>
                        <option value="arts">🎨 Arts</option>
                        <option value="gifs">🎬 Gifs</option>
                        <option value="sketches">✏️ Sketches</option>
                        <option value="animes">🌸 Animes</option>
                    </select>
                </div>

                {/* Search */}
                <div>
                    <label className="block text-red-700 text-xs mb-2 tracking-widest font-bold uppercase" style={{ fontFamily: 'VT323, monospace' }}>
                        Search by Title
                    </label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/70 border-2 border-red-900 rounded-sm px-5 py-3 text-gray-200 placeholder-red-800/50 focus:border-red-600 focus:outline-none transition-all duration-300 hover:border-red-700"
                        style={{ fontFamily: 'VT323, monospace', fontSize: '1.1rem' }}
                        placeholder="Type to search..."
                    />
                </div>

                {/* Results Count */}
                <div className="text-red-700 text-sm tracking-widest" style={{ fontFamily: 'VT323, monospace' }}>
                    SHOWING {filteredPosts.length} OF {posts.length} POSTS
                </div>
            </motion.div>

            {/* Posts Grid */}
            {filteredPosts.length === 0 ? (
                <motion.div
                    className="text-center py-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="text-6xl mb-4">📭</div>
                    <div className="text-red-600 text-xl tracking-widest glitch-text" style={{ fontFamily: 'VT323, monospace' }}>
                        NO POSTS FOUND
                    </div>
                    <div className="text-red-800 text-sm mt-2" style={{ fontFamily: 'VT323, monospace' }}>
                        Try adjusting your filters
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                >
                    <AnimatePresence>
                        {filteredPosts.map((post) => (
                            <motion.div
                                key={`${post.category}-${post.id}`}
                                className="bg-black/95 border-2 border-red-900 rounded-lg overflow-hidden shadow-lg hover:border-red-500 transition-all duration-300 hover:scale-105 group"
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ boxShadow: '0 0 30px rgba(255, 26, 26, 0.4)' }}
                            >
                                {/* Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={post.image_url}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        style={{ filter: 'contrast(1.1) brightness(0.9)' }}
                                    />
                                    <div className="scanline-overlay"></div>
                                    {/* Category Badge */}
                                    <div className="absolute top-2 left-2 bg-black/80 border border-red-900 px-3 py-1 rounded-sm">
                                        <span className="text-red-600 text-xs font-bold tracking-widest uppercase" style={{ fontFamily: 'VT323, monospace' }}>
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="text-gray-200 font-bold mb-2 line-clamp-2 group-hover:text-red-400 transition-colors" style={{ fontFamily: 'VT323, monospace', fontSize: '1.2rem' }}>
                                        {post.title}
                                    </h3>
                                    {post.description && (
                                        <p className="text-gray-500 text-sm mb-3 line-clamp-2" style={{ fontFamily: 'VT323, monospace' }}>
                                            {post.description}
                                        </p>
                                    )}
                                    <div className="text-red-800 text-xs mb-4" style={{ fontFamily: 'VT323, monospace' }}>
                                        {post.date_created}
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => setDeleteModal({ isOpen: true, post })}
                                        className="w-full btn-horror-danger px-4 py-2 rounded-sm text-sm"
                                        style={{ fontFamily: 'VT323, monospace' }}
                                    >
                                        🗑️ DELETE POST
                                    </button>
                                </div>

                                {/* Corner accents */}
                                <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-red-900/50 group-hover:border-red-500 transition-all duration-300" />
                                <div className="absolute bottom-0 left-0 w-0 h-0 border-b-8 border-l-8 border-red-900/50 group-hover:border-red-500 transition-all duration-300" />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Delete Modal */}
            <DeleteModal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, post: null })}
                onConfirm={handleDelete}
                title="DELETE POST?"
                message={`Are you sure you want to delete "${deleteModal.post?.title}"? This action cannot be undone.`}
                loading={deleting}
            />
        </div>
    );
}
