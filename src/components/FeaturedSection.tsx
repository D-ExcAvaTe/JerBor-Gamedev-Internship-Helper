import { Internship, ConfigCategory, Tag, AppStatus } from '../types';
import { Clock, Flame, DollarSign, ChevronRight } from 'lucide-react';
import { getDeadlineText } from '../utils/dateUtils';

interface FeaturedSectionProps {
  internships: Internship[];
  config: ConfigCategory[];
  onCardClick: (internship: Internship) => void;
  trackedJobs: Record<string, AppStatus>;
  updateTrackStatus: (id: string, status: AppStatus | null) => void;
}

function getDaysLeft(deadline: string): number | null {
  if (!deadline) return null;
  const diff = new Date(deadline).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function FeaturedSection({ internships, config, onCardClick, trackedJobs, updateTrackStatus }: FeaturedSectionProps) {
  const open = internships.filter(i => i.status === 'Open');

  const closingSoon = open
    .filter(i => {
      const d = getDaysLeft(i.deadline);
      return d !== null && d >= 0 && d <= 14;
    })
    .sort((a, b) => getDaysLeft(a.deadline)! - getDaysLeft(b.deadline)!)
    .slice(0, 4);

  const featured = closingSoon.length > 0
    ? { items: closingSoon, mode: 'closing' as const }
    : {
        items: open.filter(i => i.stipend === 'paid').slice(0, 4),
        mode: 'stipend' as const,
      };

  if (featured.items.length === 0) return null;

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

  const isClosing = featured.mode === 'closing';

  return (
    <section className="px-4 sm:px-6 lg:px-8 pt-8 pb-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            {isClosing ? (
              <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 rounded-full px-3 py-1">
                <Flame className="w-3 h-3 text-red-400 animate-pulse" />
                <span className="text-xs font-bold text-red-400 uppercase tracking-wider">ใกล้ปิดรับสมัคร</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-3 py-1">
                <DollarSign className="w-3 h-3 text-yellow-400" />
                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">มีเบี้ยเลี้ยง</span>
              </div>
            )}
            <span className="text-xs text-zinc-500">
              {isClosing ? 'สมัครก่อนหมดเวลา!' : 'บริษัทที่มีเบี้ยเลี้ยง'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-zinc-600">
            <span>ดูทั้งหมด</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {featured.items.map((item, idx) => {
            const daysLeft = getDaysLeft(item.deadline);
            const isUrgent = daysLeft !== null && daysLeft <= 5;
            
            // ตอนนี้แค่เช็คว่ามีการ Track ไว้ไหมในส่วน Featured
            const isTracked = !!trackedJobs[item.id];

            const posTags = item.positions
              .map(findTag)
              .filter(Boolean)
              .slice(0, 2) as Tag[];

            return (
              <div
                key={item.id}
                onClick={() => onCardClick(item)}
                className={`
                  relative cursor-pointer rounded-2xl p-4 flex flex-col gap-3
                  border transition-all duration-200 group overflow-hidden
                  hover:-translate-y-0.5 hover:shadow-xl
                  ${isUrgent
                    ? 'bg-gradient-to-br from-red-950/40 to-zinc-900 border-red-500/30 hover:border-red-400/60 hover:shadow-red-500/10'
                    : isClosing
                      ? 'bg-gradient-to-br from-orange-950/20 to-zinc-900 border-orange-500/20 hover:border-orange-400/50 hover:shadow-orange-500/10'
                      : 'bg-gradient-to-br from-yellow-950/20 to-zinc-900 border-yellow-500/20 hover:border-yellow-400/50 hover:shadow-yellow-500/10'
                  }
                  ${isTracked ? 'ring-1 ring-purple-500/50' : ''}
                `}
              >
                <div className={`absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl ${
                  isUrgent ? 'bg-gradient-to-r from-transparent via-red-500 to-transparent' :
                  isClosing ? 'bg-gradient-to-r from-transparent via-orange-500 to-transparent' :
                  'bg-gradient-to-r from-transparent via-yellow-500 to-transparent'
                }`} />

                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold border ${
                    idx === 0
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                      : idx === 1
                        ? 'bg-zinc-400/10 text-zinc-400 border-zinc-600'
                        : 'bg-zinc-800 text-zinc-600 border-zinc-700'
                  }`}>
                    {idx + 1}
                  </div>
                </div>

                <div className="flex flex-col gap-2 pr-12">
                  <img
                    src={item.logoUrl}
                    alt={item.name}
                    className="w-11 h-11 rounded-xl object-cover bg-zinc-800 border border-zinc-700/50"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <h4 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors leading-tight line-clamp-2">
                    {item.name}
                  </h4>
                </div>

                {posTags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {posTags.map(tag => (
                      <span
                        key={tag.id}
                        style={{ backgroundColor: `${tag.color}18`, color: tag.color }}
                        className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide"
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-auto">
                  {item.deadline ? (
                    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      isUrgent
                        ? 'bg-red-500/15 text-red-400 border border-red-500/20'
                        : 'bg-orange-500/10 text-orange-400 border border-orange-500/15'
                    }`}>
                      <Clock className="w-2.5 h-2.5" />
                      {getDeadlineText(item.deadline)}
                    </div>
                  ) : item.stipend === 'paid' ? (
                    <div className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/15">
                      <DollarSign className="w-2.5 h-2.5" />
                      {item.stipendAmount !== '-' ? item.stipendAmount : 'มีเบี้ยเลี้ยง'}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}