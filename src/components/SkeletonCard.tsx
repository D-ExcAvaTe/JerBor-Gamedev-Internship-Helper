export default function SkeletonCard() {
  return (
    <div className="bg-zinc-900/40 border border-zinc-800/40 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4 w-full">
          <div className="w-12 h-12 rounded-xl bg-zinc-800/80 flex-shrink-0" />
          <div className="flex flex-col gap-2 w-full">
            <div className="w-3/4 h-4 bg-zinc-800/80 rounded-md" />
            <div className="flex gap-2">
              <div className="w-16 h-3 bg-zinc-800/50 rounded-md" />
              <div className="w-20 h-3 bg-zinc-800/50 rounded-md" />
            </div>
          </div>
        </div>
        <div className="w-16 h-6 rounded-full bg-zinc-800/80 flex-shrink-0" />
      </div>
      <div className="flex gap-2">
        <div className="w-14 h-5 bg-zinc-800/60 rounded-md" />
        <div className="w-20 h-5 bg-zinc-800/60 rounded-md" />
        <div className="w-16 h-5 bg-zinc-800/60 rounded-md" />
      </div>
    </div>
  );
}