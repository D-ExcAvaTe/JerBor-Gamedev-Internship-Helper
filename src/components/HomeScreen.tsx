import { motion } from 'motion/react';
import { Code, Palette, Pen } from 'lucide-react';

interface HomeScreenProps {
  onSelectCategory: (category: 'programmer' | 'artist' | 'design' | 'other') => void;
}

export default function HomeScreen({ onSelectCategory }: HomeScreenProps) {
  const categories = [
    {
      id: 'programmer',
      label: 'Programmer',
      icon: Code,
      color: 'from-blue-600 to-blue-700',
      accent: 'bg-blue-500/20 border-blue-500/50',
      hoverAccent: 'hover:bg-blue-500/30 hover:border-blue-400/70',
    },
    {
      id: 'artist',
      label: 'Artist',
      icon: Palette,
      color: 'from-rose-600 to-rose-700',
      accent: 'bg-rose-500/20 border-rose-500/50',
      hoverAccent: 'hover:bg-rose-500/30 hover:border-rose-400/70',
    },
    {
      id: 'design',
      label: 'Designer',
      icon: Pen,
      color: 'from-purple-600 to-purple-700',
      accent: 'bg-purple-500/20 border-purple-500/50',
      hoverAccent: 'hover:bg-purple-500/30 hover:border-purple-400/70',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-8">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center mb-16"
      >
        <img
          src="/logo.png"
          alt="GameDev Hub"
          className="h-20 w-auto object-contain mb-4"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <h1 className="text-4xl font-bold tracking-tight text-zinc-100 flex items-center gap-3">
          <span className="text-purple-500">GameDev</span> Hub 🎮
        </h1>
        <p className="text-sm text-zinc-400 tracking-wide uppercase font-semibold mt-2">
          Internship Database
        </p>
      </motion.div>

      {/* Category Buttons */}
      <div className="max-w-2xl w-full flex flex-col gap-4 mb-8">
        {categories.map((category, idx) => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category.id as any)}
              initial={{ opacity: 0, rotateY: 90, y: 20 }}
              animate={{ opacity: 1, rotateY: 0, y: 0 }}
              transition={{
                duration: 0.5,
                ease: 'easeOut',
                delay: idx * 0.1,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative overflow-hidden group rounded-2xl border
                px-8 py-6 sm:py-8
                transition-all
                ${category.accent} ${category.hoverAccent}
              `}
              style={{
                perspective: '1000px',
              }}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative flex items-center gap-4 z-10">
                <div className="flex-shrink-0">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-inherit" />
                </div>
                <span className="text-2xl sm:text-3xl font-bold text-zinc-100 group-hover:text-white transition-colors">
                  {category.label}
                </span>
              </div>

              {/* Shine effect on hover */}
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform group-hover:-skew-x-12 group-hover:translate-x-full transition-all duration-500" />
            </motion.button>
          );
        })}
      </div>

      {/* Other Button */}
      <motion.button
        onClick={() => onSelectCategory('other')}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-6 py-2.5 rounded-full bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 text-sm font-semibold transition-all"
      >
        Other Positions
      </motion.button>

      {/* Footer hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-16 text-xs text-zinc-600 text-center max-w-md"
      >
        💡 Click on any category to explore internships, or use the search & filters in the header
      </motion.p>
    </div>
  );
}
