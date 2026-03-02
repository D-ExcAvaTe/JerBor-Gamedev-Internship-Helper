import { Internship, ConfigCategory, Tag, AppStatus } from '../types';
import { MapPin, Clock, Bookmark } from 'lucide-react';
import { getDeadlineText } from '../utils/dateUtils';
import { motion } from 'motion/react';

interface InternshipCardProps {
  internship: Internship;
  config: ConfigCategory[];
  onClick: () => void;
  status: AppStatus | null;
  updateTrackStatus: (id: string, status: AppStatus | null) => void;
  index: number;
}

const STATUS_CONFIG = {
  saved: { label: '📌 เล็งไว้', bg: 'bg-purple-500/20', text: 'text-purple-400' },
  applied: { label: '📤 สมัครแล้ว', bg: 'bg-blue-500/20', text: 'text-blue-400' },
  interviewing: { label: '💬 สัมภาษณ์', bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  offered: { label: '🎉 ได้งาน!', bg: 'bg-emerald-500/20', text: 'text-emerald-400' },
  rejected: { label: '❌ ไม่ผ่าน', bg: 'bg-red-500/20', text: 'text-red-400' },
};

export default function InternshipCard({ internship, config, onClick, status, updateTrackStatus, index }: InternshipCardProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, ease: "easeOut", duration: 0.3 }}
      onClick={onClick}
      className={`
        bg-zinc-900 border rounded-2xl p-5 transition-all cursor-pointer group flex flex-col gap-4 relative overflow-hidden
        ${isUrgent ? 'border-red-500/30 hover:border-red-400/60' : 'border-zinc-800 hover:border-purple-500/50'}
      `}
    >
      {status && (
        <div className={`absolute top-0 left-0 right-0 h-1 ${STATUS_CONFIG[status].bg}`} />
      )}

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
          {status ? (
             <span className={`px-2 py-1 rounded text-[10px] font-bold ${STATUS_CONFIG[status].bg} ${STATUS_CONFIG[status].text}`}>
               {STATUS_CONFIG[status].label}
             </span>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); updateTrackStatus(internship.id, 'saved'); }}
              className="p-1.5 -mr-1.5 rounded-full text-zinc-500 hover:text-purple-400 hover:bg-zinc-800 transition-colors"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          )}
          
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
    </motion.div>
  );
}