import { motion } from 'motion/react';
import { Code, Palette, Pen } from 'lucide-react';
import { useState } from 'react';

interface HomeScreenProps {
  onSelectRoles: (roles: ('programmer' | 'artist' | 'design' | 'other')[]) => void;
}

export default function HomeScreen({ onSelectRoles }: HomeScreenProps) {
  const [selectedRoles, setSelectedRoles] = useState<('programmer' | 'artist' | 'design' | 'other')[]>([]);

  const categories = [
    {
      id: 'programmer' as const,
      label: 'Programmer',
      icon: Code,
      color: 'from-blue-600 to-blue-700',
      accent: 'bg-blue-500/20 border-blue-500/50',
      hoverAccent: 'hover:bg-blue-500/30 hover:border-blue-400/70',
    },
    {
      id: 'artist' as const,
      label: 'Artist',
      icon: Palette,
      color: 'from-rose-600 to-rose-700',
      accent: 'bg-rose-500/20 border-rose-500/50',
      hoverAccent: 'hover:bg-rose-500/30 hover:border-rose-400/70',
    },
    {
      id: 'design' as const,
      label: 'Designer',
      icon: Pen,
      color: 'from-purple-600 to-purple-700',
      accent: 'bg-purple-500/20 border-purple-500/50',
      hoverAccent: 'hover:bg-purple-500/30 hover:border-purple-400/70',
    },
  ];

  const handleToggleRole = (role: 'programmer' | 'artist' | 'design' | 'other') => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  const handleApply = () => {
    if (selectedRoles.length === 0) return;
    onSelectRoles(selectedRoles);
  };

  const handleViewAll = () => {
    onSelectRoles([]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-xl w-full flex flex-col gap-5">
        <p className="text-center text-sm font-semibold text-zinc-400 mb-2">เลือกตำแหน่งงานที่สนใจ</p>
        {categories.map((category, idx) => {
          const Icon = category.icon;
          const isSelected = selectedRoles.includes(category.id);

          return (
            <motion.button
              key={category.id}
              onClick={() => handleToggleRole(category.id)}
              initial={{ opacity: 0, rotateY: 90, y: 10 }}
              animate={{ opacity: 1, rotateY: 0, y: 0 }}
              transition={{
                duration: 0.4,
                ease: 'easeOut',
                delay: idx * 0.08,
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative overflow-hidden group rounded-lg border
                px-4 py-3
                transition-all flex items-center gap-3
                ${isSelected 
                  ? `${category.accent} ring-2 ring-purple-500` 
                  : `${category.accent} ${category.hoverAccent}`
                }
              `}
              style={{
                perspective: '1000px',
              }}
            >
              <div className={`
                w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
                transition-all
                ${isSelected 
                  ? 'bg-purple-500 border-purple-400' 
                  : 'border-zinc-500 bg-transparent'
                }
              `}>
                {isSelected && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-white text-xs font-bold"
                  >
                    ✓
                  </motion.span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-1 text-left">
                <Icon className="w-5 h-5 text-inherit flex-shrink-0" />
                <span className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors">
                  {category.label}
                </span>
              </div>
            </motion.button>
          );
        })}

        <motion.button
          onClick={() => handleToggleRole('other')}
          initial={{ opacity: 0, rotateY: 90, y: 10 }}
          animate={{ opacity: 1, rotateY: 0, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className={`
            relative overflow-hidden group rounded-lg border
            px-4 py-3 transition-all flex items-center gap-3
            ${selectedRoles.includes('other')
              ? 'bg-zinc-700/30 border-zinc-600 ring-2 ring-purple-500'
              : 'bg-zinc-800/20 border-zinc-700 hover:bg-zinc-800/30 hover:border-zinc-600'
            }
          `}
        >
          <div className={`
            w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
            transition-all
            ${selectedRoles.includes('other')
              ? 'bg-purple-500 border-purple-400'
              : 'border-zinc-500 bg-transparent'
            }
          `}>
            {selectedRoles.includes('other') && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-white text-xs font-bold"
              >
                ✓
              </motion.span>
            )}
          </div>
          <span className="text-sm font-semibold text-zinc-300 group-hover:text-zinc-100 transition-colors">
            Other Positions
          </span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.32 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-4"
      >
        <motion.button
          onClick={handleViewAll}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-2.5 rounded-lg font-bold text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-all shadow-lg"
        >
          See All Internships
        </motion.button>

        <motion.button
          onClick={handleApply}
          disabled={selectedRoles.length === 0}
          whileHover={selectedRoles.length > 0 ? { scale: 1.05 } : {}}
          whileTap={selectedRoles.length > 0 ? { scale: 0.95 } : {}}
          className={`
            px-8 py-2.5 rounded-lg font-bold text-sm
            transition-all
            ${selectedRoles.length > 0
              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/30'
              : 'bg-zinc-800/50 text-zinc-500 cursor-not-allowed border border-zinc-800'
            }
          `}
        >
          Explore Now ({selectedRoles.length})
        </motion.button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-xs text-zinc-600 text-center max-w-md"
      >
        💡 Select one or more roles and click "Explore Now", or use "See All Internships" to see all available internships
      </motion.p>
    </div>
  );
}