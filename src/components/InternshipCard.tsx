import { Internship, ConfigCategory, Tag } from '../types';
import { MapPin, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { getDeadlineText } from '../utils/dateUtils';

interface InternshipCardProps {
  internship: Internship;
  config: ConfigCategory[];
  onClick: () => void;
}

export default function InternshipCard({ internship, config, onClick }: InternshipCardProps) {
  const findTag = (id: string): Tag | null => {
    for (const cat of config) {
      const tag = cat.tags.find(t => t.id === id);
      if (tag) return tag;
    }
    return null;
  };

  // รวม Tag ทุกประเภทมาแสดงใต้ Card
  const allTagIds = [...internship.positions, ...internship.workMode, internship.stipend, internship.location];
  const tags = allTagIds.map(findTag).filter(Boolean) as Tag[];

  return (
    <div onClick={onClick} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-purple-500/50 transition-all cursor-pointer group flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <img src={internship.logoUrl} className="w-12 h-12 rounded-xl object-cover bg-zinc-800" alt="logo" />
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-purple-400 transition-colors">{internship.name}</h3>
            <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {internship.location.toUpperCase()}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {getDeadlineText(internship.deadline)}</span>
            </div>
          </div>
        </div>
        <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${internship.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          {internship.status.toUpperCase()}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
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