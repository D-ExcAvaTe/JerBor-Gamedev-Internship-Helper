import { Internship, ConfigCategory, Tag, AppStatus } from '../types';
import { getDeadlineText } from '../utils/dateUtils';
import { X, ExternalLink, MapPin, Clock, DollarSign, Briefcase, Link as LinkIcon, Mail, CalendarClock, Bookmark, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DetailDrawerProps {
  internship: Internship | null;
  config: ConfigCategory[];
  onClose: () => void;
  status: AppStatus | null;
  updateTrackStatus: (id: string, status: AppStatus | null) => void;
  showToast: (msg: string) => void;
}

const STATUS_OPTIONS: { id: AppStatus | 'none'; label: string; colorClass: string }[] = [
  { id: 'none', label: 'ไม่ติดตาม', colorClass: 'hover:bg-zinc-800 text-zinc-400 border-zinc-800' },
  { id: 'saved', label: '📌 เล็งไว้', colorClass: 'hover:bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'applied', label: '📤 ยื่นแล้ว', colorClass: 'hover:bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { id: 'interviewing', label: '💬 รอสัมภาษณ์', colorClass: 'hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  { id: 'offered', label: '🎉 ได้งาน!', colorClass: 'hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'rejected', label: '❌ ไม่ผ่าน', colorClass: 'hover:bg-red-500/20 text-red-400 border-red-500/30' },
];

export default function DetailDrawer({ internship, config, onClose, status, updateTrackStatus, showToast }: DetailDrawerProps) {
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

  const handleCopyInfo = () => {
    const text = `🎯 ${internship.name}\n📍 ${internship.location}\n💰 ${internship.stipendAmount}\n🔗 ${internship.jobPostUrl || internship.contactUrl}`;
    navigator.clipboard.writeText(text);
    showToast('คัดลอกข้อมูลลง Clipboard แล้ว!');
  };

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
          <div className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 p-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-zinc-100 uppercase tracking-tighter">Internship Details</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateTrackStatus(internship.id, status ? null : 'saved')}
                className="p-2 rounded-full hover:bg-zinc-800 transition-colors"
              >
                <Bookmark className={`w-5 h-5 ${status ? 'fill-purple-500 text-purple-500' : 'text-zinc-400 hover:text-purple-400'}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 flex-1 flex flex-col gap-8">
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

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                <Bookmark className="w-3.5 h-3.5" /> Application Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {STATUS_OPTIONS.map((opt) => {
                  const isActive = (status === null && opt.id === 'none') || status === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => updateTrackStatus(internship.id, opt.id === 'none' ? null : opt.id as AppStatus)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        isActive 
                          ? opt.id === 'none' 
                            ? 'bg-zinc-800 text-zinc-100 border-zinc-600' 
                            : opt.colorClass.replace('hover:', '')
                          : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

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

            {internship.workHours && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-1">
                <span className="text-xs text-zinc-500 flex items-center gap-1 mb-1">
                  <CalendarClock className="w-3 h-3 text-emerald-400" /> เวลาทำงาน (จันทร์–ศุกร์)
                </span>
                <span className="text-sm font-medium text-zinc-200">{internship.workHours}</span>
              </div>
            )}

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

            {internship.location && (
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-red-400" /> Location Map
                </h3>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-48 w-full relative">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(internship.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

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

            <div className="bg-purple-500/5 border border-purple-500/20 rounded-xl p-5 flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Senior's Note</h3>
              <p className="text-sm text-purple-200/80 italic leading-relaxed">
                {internship.notes ? `"${internship.notes}"` : 'No notes from seniors yet.'}
              </p>
            </div>
          </div>

          <div className="sticky bottom-0 bg-zinc-950/80 backdrop-blur-md border-t border-zinc-800 p-4 flex flex-col gap-2">
            <button
              onClick={handleCopyInfo}
              className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
            >
              <Copy className="w-4 h-4" /> COPY INFO TO SHARE
            </button>

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
              href={internship.email ? `https://mail.google.com/mail/?view=cm&fs=1&to=${internship.email}` : internship.contactUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => updateTrackStatus(internship.id, 'applied')}
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