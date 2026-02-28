import { Internship, ConfigCategory, Tag } from '../types';
import { getDeadlineText } from '../utils/dateUtils';
import { X, ExternalLink, MapPin, Clock, DollarSign, Briefcase, Link as LinkIcon, Mail, CalendarClock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DetailDrawerProps {
  internship: Internship | null;
  config: ConfigCategory[];
  onClose: () => void;
}

export default function DetailDrawer({ internship, config, onClose }: DetailDrawerProps) {
  if (!internship) return null;

  const getTagDetails = (tagId: string): Tag | null => {
    for (const category of config) {
      const tag = category.tags.find((t) => t.id === tagId);
      if (tag) return tag;
      if ((category as any).subCategories) {
        for (const sub of (category as any).subCategories) {
          const t = sub.tags.find((t: any) => t.id === tagId);
          if (t) return t;
        }
      }
    }
    return null;
  };

  const allTagIds = [...internship.positions, ...internship.workMode, internship.stipend];
  const tags = allTagIds.map(getTagDetails).filter(Boolean) as Tag[];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full overflow-y-auto shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 p-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-tighter">Internship Details</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 flex-1 flex flex-col gap-8">
            {/* Header Info */}
            <div className="flex items-start gap-4">
              <img
                src={internship.logoUrl}
                alt={`${internship.name} logo`}
                className="w-16 h-16 rounded-2xl object-cover bg-zinc-800 shadow-lg"
              />
              <div>
                <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">{internship.name}</h1>
                <div className="flex items-center gap-2 mt-2 text-sm text-zinc-400">
                  <MapPin className="w-4 h-4 text-red-500" />
                  {internship.location.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    backgroundColor: `${tag.color}15`,
                    color: tag.color,
                    borderColor: `${tag.color}30`,
                  }}
                  className="px-3 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider"
                >
                  {tag.label}
                </span>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-yellow-500" /> Stipend
                </span>
                <span className="text-sm font-medium text-zinc-200">{internship.stipendAmount}</span>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xs text-zinc-500 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-purple-400" /> Deadline
                </span>
                <span className="text-sm font-medium text-zinc-200">{getDeadlineText(internship.deadline)}</span>
              </div>
            </div>

            {/* Work Hours */}
            {internship.workHours && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xs text-zinc-500 flex items-center gap-1 mb-1">
                  <CalendarClock className="w-3 h-3 text-emerald-400" /> เวลาทำงาน (จันทร์–ศุกร์)
                </span>
                <span className="text-sm font-medium text-zinc-200">{internship.workHours}</span>
              </div>
            )}

            {/* Email Contact */}
            {internship.email && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xs text-zinc-500 flex items-center gap-1 mb-1">
                  <Mail className="w-3 h-3 text-blue-400" /> อีเมลติดต่อ
                </span>
                <a
                  href={`mailto:${internship.email}`}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors break-all"
                >
                  {internship.email}
                </a>
              </div>
            )}

            {/* Job Post Link */}
            {internship.jobPostUrl && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-blue-400" /> Original Post
                </h3>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-xs text-zinc-500 mb-2">โพสต์ประกาศรับสมัครงานต้นฉบับ:</p>
                  <a
                    href={internship.jobPostUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-300 underline break-all flex items-center gap-1"
                  >
                    View Original Post <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-purple-400" /> Requirements
              </h3>
              <ul className="list-disc list-inside text-sm text-zinc-400 space-y-2">
                {internship.requirements.length > 0 ? (
                  internship.requirements.map((req, i) => <li key={i}>{req}</li>)
                ) : (
                  <li className="list-none italic text-zinc-600">No specific requirements listed.</li>
                )}
              </ul>
            </div>

            {/* Senior's Note */}
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5 flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Senior's Note</h3>
              <p className="text-sm text-purple-200/80 italic leading-relaxed">
                {internship.notes ? `"${internship.notes}"` : 'No notes from seniors yet.'}
              </p>
            </div>
          </div>

          {/* Action Footer */}
          <div className="sticky bottom-0 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800 p-4 flex flex-col gap-2">
            {internship.jobPostUrl && (
              <a
                href={internship.jobPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
              >
                VIEW JOB POST <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <a
              href={internship.contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
            >
              APPLY FOR INTERNSHIP <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
