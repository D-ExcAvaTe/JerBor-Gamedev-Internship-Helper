import { ConfigCategory } from '../types';
import { ChevronDown, ChevronUp, CheckSquare, Square } from 'lucide-react';
import { useState } from 'react';

interface FilterSectionProps {
  config: ConfigCategory[];
  selectedTags: string[];
  toggleTag: (tagId: string) => void;
  toggleCategory: (tagIds: string[]) => void;
}

export default function FilterSection({ config, selectedTags, toggleTag, toggleCategory }: FilterSectionProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className=\"py-6 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/50 bg-zinc-950\">
      <div className=\"max-w-5xl mx-auto flex flex-col gap-6\">
        <div className=\"flex items-center justify-between\">
          <h2 className=\"text-sm font-bold tracking-widest text-zinc-500 uppercase\">Categorized Filters</h2>
          <button 
            onClick={() => setExpanded(!expanded)}
            className=\"text-xs flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/5 px-3 py-1.5 rounded-lg border border-purple-500/20\"
          >
            {expanded ? (<>Hide Filters <ChevronUp className=\"w-3.5 h-3.5\" /></>) : (<>Show All Filters <ChevronDown className=\"w-3.5 h-3.5\" /></>)}
          </button>
        </div>

        <div className={`grid grid-cols-1 gap-8 transition-all duration-500 ${expanded ? 'opacity-100' : 'hidden opacity-0'}`}>
          {config.map((category) => {
            const tagIds = category.tags.map(t => t.id);
            const isAllSelected = tagIds.every(id => selectedTags.includes(id));

            return (
              <div key={category.id} className=\"flex flex-col gap-3 group\">
                <div className=\"flex items-center justify-between border-b border-zinc-900 pb-2\">
                  <h3 className=\"text-xs font-bold text-zinc-400 uppercase tracking-tight\">{category.label}</h3>
                  <button 
                    onClick={() => toggleCategory(tagIds)}
                    className=\"flex items-center gap-1.5 text-[10px] font-medium text-zinc-600 hover:text-purple-400 transition-colors\"
                  >
                    {isAllSelected ? <CheckSquare className=\"w-3 h-3\" /> : <Square className=\"w-3 h-3\" />}
                    {isAllSelected ? 'Deselect Group' : 'Select Group'}
                  </button>
                </div>
                <div className=\"flex flex-wrap gap-2\">
                  {category.tags.map((tag) => {
                    const isSelected = selectedTags.includes(tag.id);
                    return (
                      <button
                        key={tag.id}
                        onClick={() => toggleTag(tag.id)}
                        style={{ 
                          backgroundColor: isSelected ? `${tag.color}20` : 'transparent',
                          color: isSelected ? tag.color : '#71717a',
                          borderColor: isSelected ? `${tag.color}40` : '#27272a'
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 hover:border-zinc-700`}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}