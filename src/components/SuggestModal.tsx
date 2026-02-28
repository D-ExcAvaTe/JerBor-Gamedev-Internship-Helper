import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SuggestModal({ isOpen, onClose }: SuggestModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-100">Suggest a Company</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form className="p-6 flex flex-col gap-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
            <div className="flex flex-col gap-2">
              <label htmlFor="companyName" className="text-sm font-medium text-zinc-300">Company Name</label>
              <input 
                type="text" 
                id="companyName" 
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="e.g. PixelForge Studios"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contactUrl" className="text-sm font-medium text-zinc-300">Link to Job Posting</label>
              <input 
                type="url" 
                id="contactUrl" 
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                placeholder="https://..."
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="notes" className="text-sm font-medium text-zinc-300">Senior's Note (Optional)</label>
              <textarea 
                id="notes" 
                rows={3}
                className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none"
                placeholder="Any tips or inside info?"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button 
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                Submit Suggestion
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
