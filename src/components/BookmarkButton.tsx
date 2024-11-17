import React from 'react';
import { BookmarkIcon as BookmarkOutline } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolid } from '@heroicons/react/24/solid';
import { useBookmarkStore } from '../store/bookmarkStore';
import { motion } from 'framer-motion';

interface BookmarkButtonProps {
  articleId: string;
  title: string;
}

export default function BookmarkButton({ articleId, title }: BookmarkButtonProps) {
  const { bookmarks, toggleBookmark } = useBookmarkStore();
  const isBookmarked = bookmarks.includes(articleId);

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => toggleBookmark(articleId)}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {isBookmarked ? (
        <BookmarkSolid className="w-5 h-5 text-accent" />
      ) : (
        <BookmarkOutline className="w-5 h-5 text-gray-500 hover:text-accent" />
      )}
    </motion.button>
  );
}
