import { Internship } from '../types';

interface Props {
  data: Internship;
}

export default function InternshipCard({ data }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3">

      <div className="flex items-center gap-3">
        <img
          src={data.logoUrl}
          className="w-12 h-12 rounded-lg object-contain bg-white"
        />

        <div>
          <h3 className="text-zinc-100 font-semibold">
            {data.name}
          </h3>

          <p className="text-xs text-zinc-400">
            {data.location}
          </p>
        </div>
      </div>

      {/* positions (no color) */}
      <div className="flex flex-wrap gap-2">
        {data.positions.map((p) => (
          <span
            key={p}
            className="text-xs px-2 py-1 rounded-md bg-zinc-800 text-zinc-300"
          >
            {p}
          </span>
        ))}
      </div>

      {/* work mode */}
      <div className="flex flex-wrap gap-2">
        {data.workMode.map((m) => (
          <span
            key={m}
            className="text-xs px-2 py-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
          >
            {m}
          </span>
        ))}
      </div>

      {/* stipend */}
      <div>
        <span className="text-xs px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
          {data.stipend === 'paid'
            ? 'มีเบี้ยเลี้ยง'
            : 'ไม่มีเบี้ยเลี้ยง'}
        </span>
      </div>

      <div className="text-xs text-zinc-400">
        Deadline: {data.deadlineLabel}
      </div>

      <div className="text-xs text-zinc-400">
        Remaining: {data.daysLeft}
      </div>
    </div>
  );
}