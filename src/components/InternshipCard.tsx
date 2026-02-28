import { Internship, ConfigCategory } from '../types';
import { getDeadlineText } from '../utils/dateUtils';
import { MapPin, Clock, Briefcase, CheckCircle2, XCircle } from 'lucide-react';

interface InternshipCardProps {
  internship: Internship;
  config: ConfigCategory[];
  onClick: () => void;
}

export default function InternshipCard({ internship, config, onClick }: InternshipCardProps) {
  // Helper to get tag details from config
  const getTagDetails = (tagId: string) => {
    for (const category of config) {
      const tag = category.tags.find((t) => t.id === tagId);
      if (tag) return tag;
    }
    return null;
  };

  const allTagIds = [...internship.positions, ...internship.workMode, internship.stipend];
  const tags = allTagIds.map(getTagDetails).filter(Boolean);

  const isOpen = internship.status === 'Open';

  return (
    <div 
      onClick={onClick}
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all cursor-pointer group flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src={internship.logoUrl} 
            alt={`${internship.name} logo`} 
            className="w-12 h-12 rounded-xl object-cover bg-zinc-800"
            referrerPolicy="no-referrer"
          />
          <div>
            <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-purple-400 transition-colors">
              {internship.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {internship.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {getDeadlineText(internship.deadline)}
              </span>
            </div>
          </div>
        </div>
        
        <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${
          isOpen 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {isOpen ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          {internship.status}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag) => tag && (
          <span 
            key={tag.id} 
            className={`px-2.5 py-1 rounded-md text-[10px] font-medium border ${tag.color}`}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );
}
