import { Internship, AppStatus } from '../types';
import { motion } from 'motion/react';

interface StatusListProps {
  internships: Internship[];
  trackedJobs: Record<string, AppStatus>;
  onCardClick: (internship: Internship) => void;
}

const STATUS_DISPLAY = {
  saved: { label: '📌 เล็งไว้', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  applied: { label: '📤 สมัครแล้ว', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  interviewing: { label: '💬 สัมภาษณ์', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  offered: { label: '🎉 ได้งาน!', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  rejected: { label: '❌ ไม่ผ่าน', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

export default function StatusList({ internships, trackedJobs, onCardClick }: StatusListProps) {
  const trackedInternships = internships.filter(job => trackedJobs[job.id]);

  if (trackedInternships.length === 0) {
    return null;
  }

  // Group by status
  const groupedByStatus = Object.entries(STATUS_DISPLAY).reduce((acc, [status]) => {
    acc[status as AppStatus] = trackedInternships.filter(job => trackedJobs[job.id] === status);
    return acc;
  }, {} as Record<AppStatus, Internship[]>);

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">📋 Status List</h2>

        <div className="space-y-6">
          {Object.entries(groupedByStatus).map(([statusKey, jobs]) => {
            if (jobs.length === 0) return null;

            const status = statusKey as AppStatus;
            const display = STATUS_DISPLAY[status];

            return (
              <div key={status}>
                <div className={`${display.bg} border ${display.border} rounded-xl p-3 mb-3`}>
                  <p className={`text-xs font-bold ${display.color} uppercase tracking-wide`}>
                    {display.label} ({jobs.length})
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {jobs.map((job, idx) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => onCardClick(job)}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                        display.bg
                      } ${display.border} hover:shadow-lg hover:-translate-y-0.5`}
                    >
                      <img
                        src={job.logoUrl}
                        alt={job.name}
                        className="w-10 h-10 rounded-lg object-cover bg-zinc-800"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23404040" width="100" height="100"/%3E%3C/svg%3E';
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-200 truncate">{job.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{job.location || 'ไม่ระบุสถานที่'}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
