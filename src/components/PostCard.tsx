import React from 'react';
import { motion } from 'framer-motion';
import pfp from '../public/nyahaha.png';

interface Post {
  id: string; // UUID from Supabase
  title: string;
  desc?: string;
  description?: string;
  image_url: string;
  date_created: string;
  created_at?: string;
}

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  // Try both desc and description fields
  const description = post.desc || post.description || "";

  return (
    <motion.div
      className="post-card-container p-6 bg-black/80 border-2 border-red-900 rounded-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="post-image-wrapper relative overflow-hidden mb-6 rounded-sm border border-red-900/30">
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-x-4 mb-6 border-b border-red-900/50 pb-4">
        <div className="w-16 h-16 rounded-full border border-red-500 overflow-hidden shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.3)]">
             <img src={pfp} alt="Profile" className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-red-500 font-bold text-lg leading-none mb-1">
            つなら･メイセンテリ
          </div>
          <div className="text-red-600 text-sm tracking-[0.3em] font-medium uppercase opacity-80">
            {new Date(post.date_created).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="post-content">
        <h2 className="post-title text-gray-200 mb-3 text-2xl font-bold">
          {post.title}
        </h2>

        {description && (
          <p className="post-description text-gray-400 mb-4 leading-relaxed whitespace-pre-wrap">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
}
