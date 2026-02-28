import { ConfigCategory } from '../types';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FilterSectionProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfigCategory[];
  selectedTags: string[];
  toggleTag: (tagId: string) => void;
  clearFilters: () => void;
}

export default function FilterSection({ isOpen, onClose, config, selectedTags, toggleTag, clearFilters }: FilterSectionProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-sm bg-zinc-950 border-l border-zinc-800 h-full overflow-y-auto shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 p-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-zinc-100 uppercase tracking-wider">Filters</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 flex-1 flex flex-col gap-8">
            {config.map((category) => (
              <div key={category.id} className="flex flex-col gap-3">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
                  {category.label}
                </h3>

                {category.subCategories && category.subCategories.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {category.subCategories.map((sub) => (
                      <div key={sub.id}>
                        <p className="text-[10px] font-semibold mb-2 tracking-wider uppercase" style={{ color: sub.color }}>
                          {sub.label}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {sub.tags.map((tag) => {
                            const isSelected = selectedTags.includes(tag.id);
                            return (
                              <button
                                key={tag.id}
                                onClick={() => toggleTag(tag.id)}
                                style={{
                                  backgroundColor: isSelected ? `${tag.color}20` : '#18181b',
                                  color: isSelected ? tag.color : '#52525b',
                                  borderColor: isSelected ? `${tag.color}60` : '#27272a',
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200"
                              >
                                {tag.label}
                                <span className="opacity-40 ml-1">({tag.count})</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {category.tags.map((tag) => {
                      const isSelected = selectedTags.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          style={{
                            backgroundColor: isSelected ? `${tag.color}20` : '#18181b',
                            color: isSelected ? tag.color : '#52525b',
                            borderColor: isSelected ? `${tag.color}60` : '#27272a',
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200"
                        >
                          {tag.label}
                          <span className="opacity-40 ml-1">({tag.count})</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800 p-4 flex gap-3">
            <button
              onClick={clearFilters}
              className="flex-1 py-3 rounded-xl border border-zinc-700 text-zinc-300 text-sm font-semibold hover:bg-zinc-800 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
            >
              Show Results
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}