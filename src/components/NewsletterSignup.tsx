import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/50">
      <h3 className="text-xl font-display font-semibold mb-2">Stay Updated</h3>
      <p className="text-gray-600 mb-4">Get the latest backgammon news delivered to your inbox.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
          required
        />
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={status === 'loading'}
          className="w-full px-6 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-dark transition-colors duration-300 disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </motion.button>
      </form>

      {status === 'success' && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-600 mt-4 text-sm"
        >
          Thanks for subscribing! Check your email to confirm.
        </motion.p>
      )}
    </div>
  );
}
