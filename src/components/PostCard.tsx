import React from 'react';
import { motion } from 'framer-motion';

interface Post {
  id: number;
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
  const description = post.desc || post.description || '';
  
  return (
    <motion.div
      className="post-card-container glitch-border p-6 bg-black/80 border-2 border-red-900 rounded-sm"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="post-image-wrapper relative overflow-hidden mb-4 rounded-sm">
        <img
          src={post.image_url}
          alt={post.title}
          className="w-full h-auto object-cover glitch-hover"
        />
        <div className="scanline-overlay"></div>
      </div>

      <div className="post-content">
        <h2 className="post-title text-red-500 mb-3 text-xl">
          {post.title}
        </h2>

        {description && (
          <p className="post-description text-gray-300 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        <div className="post-date text-red-700 mt-4 text-sm">
          <div>Posted: {new Date(post.date_created).toLocaleDateString()}</div>
          {/* Show created_at if exists */}
          {post.created_at && (
            <div className="mt-1 opacity-70">
              Created: {new Date(post.created_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
