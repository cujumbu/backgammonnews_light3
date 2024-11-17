import React, { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search articles..."
          className="w-full px-4 py-3 pl-12 bg-white rounded-xl border border-gray-200/50 shadow-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all duration-300"
        />
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        <AnimatePresence>
          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-dark transition-colors duration-300"
            >
              Search
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
