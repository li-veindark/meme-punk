import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ open, onClose, children }) {
  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
          className="relative bg-gradient-to-br from-[#101014] via-[#1a1a2e] to-[#101014] border-2 border-[#00ffea] rounded-3xl px-8 py-10 w-[90vw] max-w-4xl overflow-hidden"
        >
          {/* Glowing bars */}
          <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-[#00ffea] via-[#ff00ea] to-[#00ffea] blur-md animate-pulse" />
          <div className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-[#00ffea] via-[#ff00ea] to-[#00ffea] blur-md animate-pulse" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-pink-400 text-3xl font-bold z-20"
            aria-label="Close modal"
          >
            &times;
          </button>

          {/* Content */}
          <div className="flex flex-col md:flex-row items-center gap-10 pt-6 px-4">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
