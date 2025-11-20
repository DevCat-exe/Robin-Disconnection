import React from 'react';
import { motion } from 'framer-motion';

interface Post {
  id: number;
  title: string;
  image_url: string;
  category?: string;
}

interface GalleryItemProps {
  post: Post;
  onItemClick: (category: string)
 => void;
}

const getRandomRotate = () => Math.floor(Math.random() * 17) - 8;
const getRandomSize = () => {
  const sizes = ['small', 'medium', 'large'];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

export function GalleryItem({ post, onItemClick }: GalleryItemProps) {
  const size = getRandomSize();
  const sizeClass =
    size === 'small' ? 'w-full' :
    size === 'large' ? 'w-full md:col-span-2' :
    'w-full';
  const rotate = getRandomRotate();

  return (
    <motion.div
      className="gallery-item-container"
      style={{
        zIndex: 40,
        marginLeft: `${Math.floor(Math.random() * 20)}px`,
        marginRight: `${Math.floor(Math.random() * 20)}px`,
        marginTop: `${Math.floor(Math.random() * 20)}px`,
        marginBottom: `${Math.floor(Math.random() * 20)}px`,
      }}
      initial={{ opacity: 0, y: 20, rotate }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{ duration: 0.6 }}
      whileHover={{
        rotate: rotate - 2,
        scale: 1.07,
        boxShadow: '0 0 40px #ff1a1a55',
      }}
    >
      <div
        onClick={() => onItemClick(post.category!)}
        className={`${sizeClass} gallery-item`}
      >
        <div className="glitch-overlay"></div>
        <div className="relative overflow-hidden rounded-md">
          <img
            src={post.image_url}
            alt={post.title}
            className="gallery-item-image"
          />
          <div className="scanline-overlay"></div>
          <div className="blood-drip-effect"></div>
        </div>
        <div className="gallery-item-content">
          <div className="noise-background"></div>
          <div className="gallery-item-category">
            [{post.category}]
          </div>
          <h3 className="gallery-item-title">
            {post.title}
          </h3>
          <div className="gallery-item-cta">
            {'>> CLICK TO VIEW'}
          </div>
        </div>
        <div className="corner-accent-top-right"></div>
        <div className="corner-accent-bottom-left"></div>
      </div>
    </motion.div>
  );
}
