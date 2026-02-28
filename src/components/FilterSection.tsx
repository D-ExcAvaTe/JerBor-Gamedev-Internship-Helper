import { ConfigCategory } from '../types';

interface FilterSectionProps {
  config: ConfigCategory[];
  selectedTags: string[];
  toggleTag: (tagId: string) => void;
}

export default function FilterSection({ config, selectedTags, toggleTag }: FilterSectionProps) {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/50 bg-zinc-950">
      <div className="max-w-5xl mx-auto flex flex-col gap-8">
        {config.map((category) => (
          <div key={category.id} className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-2">
              {category.label}
            </h3>
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
                    {tag.count > 1 && (
                      <span className="opacity-40 ml-1">({tag.count})</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
