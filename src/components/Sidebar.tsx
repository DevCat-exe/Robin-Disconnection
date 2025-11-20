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

interface SidebarProps {
  posts: Post[];
  category: string;
  onPostSelect: (post: Post) => void;
}

export function Sidebar({ posts, category, onPostSelect }: SidebarProps) {
  const getRandomRotate = (index: number) => {
    const rotations = [-3, -2, -1, 0, 1, 2, 3];
    return rotations[index % rotations.length];
  };

  return (
    <aside className="sidebar-container p-4 bg-black/60 border-l-2 border-red-900">
      <h3 className="sidebar-title text-red-600 mb-6 pb-2 border-b border-red-900">
        SUGGESTED {category.toUpperCase()}
      </h3>

      <motion.div
        className="suggested-posts space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            onClick={() => onPostSelect(post)}
            className="suggested-post-item cursor-pointer p-3 bg-black/80 border border-red-900/50 rounded-sm transition-all duration-300"
            initial={{
              opacity: 0,
              y: 15,
              rotate: getRandomRotate(index),
            }}
            animate={{
              opacity: 1,
              y: 0,
              rotate: getRandomRotate(index),
            }}
            transition={{ duration: 0.6 }}
            whileHover={{
              rotate: getRandomRotate(index) - 1,
              scale: 1.02,
              boxShadow: '0 0 20px rgba(139, 0, 0, 0.6)',
            }}
          >
            <div className="suggested-thumbnail mb-2 overflow-hidden rounded-sm">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-24 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="suggested-title text-sm text-gray-300 mb-1">
              {post.title}
            </div>

            <div className="suggested-date text-xs text-red-800 space-y-1">
              <div>Posted: {new Date(post.date_created).toLocaleDateString()}</div>
              {post.created_at && <div>Created: {new Date(post.created_at).toLocaleDateString()}</div>}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </aside>
  );
}