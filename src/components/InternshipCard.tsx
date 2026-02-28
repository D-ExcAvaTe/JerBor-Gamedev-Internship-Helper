import { Internship, ConfigCategory, Tag } from '../types';
import { MapPin, Clock, Bookmark } from 'lucide-react';
import { getDeadlineText } from '../utils/dateUtils';

interface InternshipCardProps {
  internship: Internship;
  config: ConfigCategory[];
  onClick: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
}

export default function InternshipCard({ internship, config, onClick, isBookmarked, onToggleBookmark }: InternshipCardProps) {
  const findTag = (id: string): Tag | null => {
    for (const cat of config) {
      const tag = cat.tags.find(t => t.id === id);
      if (tag) return tag;
      if (cat.subCategories) {
        for (const sub of cat.subCategories) {
          const t = sub.tags.find(t => t.id === id);
          if (t) return t;
        }
      }
    }
    return null;
  };

  const allTagIds = [...internship.positions, ...internship.workMode, internship.stipend];
  const tags = allTagIds.map(findTag).filter(Boolean) as Tag[];

  const daysLeft = internship.deadline
    ? Math.ceil((new Date(internship.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const isUrgent = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

  return (
    <div
      onClick={onClick}
      className={`
        bg-zinc-900 border rounded-2xl p-5 transition-all cursor-pointer group flex flex-col gap-4
        ${isUrgent ? 'border-red-500/30 hover:border-red-400/60' : 'border-zinc-800 hover:border-purple-500/50'}
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <img src={internship.logoUrl} className="w-12 h-12 rounded-xl object-cover bg-zinc-800 flex-shrink-0" alt="logo" />
          <div>
            <h3 className="text-base font-semibold text-zinc-100 group-hover:text-purple-400 transition-colors leading-snug">
              {internship.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1 flex-wrap">
              {internship.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {internship.location}
                </span>
              )}
              {internship.deadline && (
                <span className={`flex items-center gap-1 ${isUrgent ? 'text-red-400 font-semibold' : ''}`}>
                  <Clock className="w-3 h-3" /> {getDeadlineText(internship.deadline)}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleBookmark(internship.id); }}
            className="p-1.5 -mr-1.5 rounded-full hover:bg-zinc-800 transition-colors"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-purple-500 text-purple-500' : 'text-zinc-500 hover:text-purple-400'}`} />
          </button>
          <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
            internship.status === 'Open'
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}>
            {internship.status.toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {tags.map(tag => (
          <span
            key={tag.id}
            style={{ backgroundColor: `${tag.color}15`, color: tag.color, borderColor: `${tag.color}30` }}
            className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase"
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );
}