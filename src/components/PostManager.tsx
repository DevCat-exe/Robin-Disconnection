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
    const [editModal, setEditModal] = useState<{ isOpen: boolean; post: Post | null }>({
        isOpen: false,
        post: null,
    });
    const [editForm, setEditForm] = useState({ title: '', date_created: '' });
    const [deleting, setDeleting] = useState(false);
    const [updating, setUpdating] = useState(false);

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
                    .order('created_at', { ascending: true });

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

    const openEditModal = (post: Post) => {
        setEditModal({ isOpen: true, post });
        setEditForm({
            title: post.title,
            date_created: post.date_created ? new Date(post.date_created).toISOString().split('T')[0] : ''
        });
    };

    const handleUpdate = async () => {
        if (!editModal.post) return;
        setUpdating(true);
        const loadingToast = toast.loading('Updating post...');

        try {
            const { error } = await supabase
                .from(editModal.post.category)
                .update({
                    title: editForm.title,
                    date_created: editForm.date_created
                })
                .eq('id', editModal.post.id);

            toast.dismiss(loadingToast);

            if (error) throw error;

            toast.success('Post updated!');
            setEditModal({ isOpen: false, post: null });
            fetchPosts();
        } catch (error: any) {
            toast.error('Update failed: ' + error.message);
        } finally {
            setUpdating(false);
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
                <span className="ml-4 text-red-600 tracking-widest" style={{  fontSize: '1.2rem' }}>
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
                    <label className="block text-red-700 text-xs mb-2 tracking-widest font-bold uppercase" >
                        Filter by Category
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full bg-black/70 border-2 border-red-900 rounded-sm px-5 py-3 text-gray-200 focus:border-red-600 focus:outline-none transition-all duration-300 appearance-none cursor-pointer hover:border-red-700"
                        style={{  fontSize: '1.1rem' }}
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
                    <label className="block text-red-700 text-xs mb-2 tracking-widest font-bold uppercase" >
                        Search by Title
                    </label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/70 border-2 border-red-900 rounded-sm px-5 py-3 text-gray-200 placeholder-red-800/50 focus:border-red-600 focus:outline-none transition-all duration-300 hover:border-red-700"
                        style={{  fontSize: '1.1rem' }}
                        placeholder="Type to search..."
                    />
                </div>

                {/* Results Count */}
                <div className="text-red-700 text-sm tracking-widest" >
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
                    <div className="text-red-600 text-xl tracking-widest glitch-text" >
                        NO POSTS FOUND
                    </div>
                    <div className="text-red-800 text-sm mt-2" >
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
                                        <span className="text-red-600 text-xs font-bold tracking-widest uppercase" >
                                            {post.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="text-gray-200 font-bold mb-2 line-clamp-2 group-hover:text-red-400 transition-colors" style={{  fontSize: '1.2rem' }}>
                                        {post.title}
                                    </h3>
                                    {post.description && (
                                        <p className="text-gray-500 text-sm mb-3 line-clamp-2" >
                                            {post.description}
                                        </p>
                                    )}
                                    <div className="text-red-800 text-xs mb-4" >
                                        {post.date_created}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={() => openEditModal(post)}
                                            className="flex-1 py-2 border-2 border-red-900/50 text-red-400 font-bold tracking-wider hover:bg-red-900/20 hover:border-red-500 transition-all text-sm uppercase"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => setDeleteModal({ isOpen: true, post })}
                                            className="flex-1 btn-horror-danger py-2 text-sm!"
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
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

            {/* Edit Modal */}
            <AnimatePresence>
                {editModal.isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-black border-2 border-red-600 w-full max-w-md p-6 relative shadow-[0_0_50px_rgba(220,38,38,0.3)]"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse" />
                            <h2 className="text-2xl text-red-500 font-bold mb-6 tracking-widest text-center border-b border-red-900/50 pb-4">
                                📝 EDIT POST
                            </h2>
                            
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-red-700 text-xs mb-2 tracking-widest font-bold uppercase">Title</label>
                                    <input 
                                        type="text" 
                                        value={editForm.title}
                                        onChange={e => setEditForm({...editForm, title: e.target.value})}
                                        className="w-full bg-black/50 border border-red-900 p-3 text-red-100 focus:border-red-500 outline-none transition-colors"
                                        placeholder="Post Title..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-red-700 text-xs mb-2 tracking-widest font-bold uppercase">Date Created</label>
                                    <input 
                                        type="date" 
                                        value={editForm.date_created}
                                        onChange={e => setEditForm({...editForm, date_created: e.target.value})}
                                        className="w-full bg-black/50 border border-red-900 p-3 text-red-100 focus:border-red-500 outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-8">
                                <button 
                                    onClick={() => setEditModal({ isOpen: false, post: null })}
                                    className="flex-1 py-3 border border-red-900/50 text-red-700 hover:bg-red-900/10 hover:text-red-500 transition-colors tracking-widest uppercase font-bold text-sm"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleUpdate}
                                    disabled={updating}
                                    className="flex-1 py-3 bg-red-900 hover:bg-red-700 text-white font-bold tracking-widest uppercase text-sm shadow-[0_0_15px_rgba(220,38,38,0.4)] transition-all"
                                >
                                    {updating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}