import { ConfigCategory } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface FilterSectionProps {
  config: ConfigCategory[];
  selectedTags: string[];
  toggleTag: (tagId: string) => void;
}

export default function FilterSection({ config, selectedTags, toggleTag }: FilterSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/50 bg-zinc-950">
      <div className="max-w-5xl mx-auto flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">Filters</h2>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
          >
            {expanded ? (
              <>Show Less <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>Show More <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        </div>

        <div className={`flex flex-col gap-6 transition-all duration-300 ${expanded ? '' : 'max-h-[200px] overflow-hidden'}`}>
          {config.map((category) => (
            <div key={category.id} className="flex flex-col gap-3">
              <h3 className="text-xs font-medium text-zinc-500">{category.label}</h3>
              <div className="flex flex-wrap gap-2">
                {category.tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id);
                  // Extract base colors from the config string
                  // e.g., 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  const baseClasses = tag.color;
                  
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                        ${isSelected 
                          ? `${baseClasses} ring-1 ring-current shadow-[0_0_10px_rgba(168,85,247,0.2)]` 
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'}
                      `}
                    >
                      {tag.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
