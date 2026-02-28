import { ConfigCategory, Tag } from '../types';
import { ChevronDown, ChevronUp, CheckSquare, Square, Plus } from 'lucide-react';
import { useState } from 'react';

interface FilterSectionProps {
  config: ConfigCategory[];
  selectedTags: string[];
  toggleTag: (tagId: string) => void;
  toggleCategory: (tagIds: string[]) => void;
}

export default function FilterSection({ config, selectedTags, toggleTag, toggleCategory }: FilterSectionProps) {
  const [expandedCats, setExpandedCats] = useState<string[]>([]);
  const POPULAR_LIMIT = 5; // โชว์แค่ 5 อันแรกที่คนใช้เยอะ

  const isExpanded = (id: string) => expandedCats.includes(id);
  const toggleExpand = (id: string) => {
    setExpandedCats(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/50 bg-zinc-950">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {config.map((category) => {
          const tagIds = category.tags.map(t => t.id);
          const isAllSelected = tagIds.length > 0 && tagIds.every(id => selectedTags.includes(id));
          const hasMore = category.tags.length > POPULAR_LIMIT;
          const displayTags = isExpanded(category.id) ? category.tags : category.tags.slice(0, POPULAR_LIMIT);

          return (
            <div key={category.id} className="flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{category.label}</h3>
                <button onClick={() => toggleCategory(tagIds)} className="text-[10px] flex items-center gap-1 text-zinc-600 hover:text-zinc-300">
                  {isAllSelected ? <CheckSquare className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                  {isAllSelected ? 'ล้างหมวดหมู่' : 'เลือกทั้งหมด'}
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {displayTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      style={{ 
                        // สีอ่อน (Opacity สูง) เมื่อ Select | สีเข้ม/ทึบ เมื่อ Deselect ตามที่ PM สั่ง
                        backgroundColor: isSelected ? `${tag.color}20` : '#18181b',
                        color: isSelected ? tag.color : '#52525b',
                        borderColor: isSelected ? `${tag.color}60` : '#27272a'
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200"
                    >
                      {tag.label} {tag.count > 1 && !isSelected && <span className="opacity-40 ml-1">({tag.count})</span>}
                    </button>
                  );
                })}
                {hasMore && (
                  <button 
                    onClick={() => toggleExpand(category.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-dashed border-zinc-800 text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
                  >
                    {isExpanded(category.id) ? <ChevronUp className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                    {isExpanded(category.id) ? 'Show Less' : `More (${category.tags.length - POPULAR_LIMIT})`}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}