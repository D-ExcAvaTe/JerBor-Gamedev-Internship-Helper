import { Search, SlidersHorizontal, Bookmark } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenFilter: () => void;
  activeFilterCount: number;
  showBookmarks: boolean;
  setShowBookmarks: (show: boolean) => void;
  bookmarkedCount: number;
}

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  onOpenFilter, 
  activeFilterCount,
  showBookmarks,
  setShowBookmarks,
  bookmarkedCount
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 pt-6 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
              <span className="text-purple-500">GameDev</span> Internship Hub 🎮
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5 tracking-wide">Gamedev Internship App Database</p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-zinc-800 rounded-xl leading-5 bg-zinc-900/50 text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all sm:text-sm"
              placeholder="Search by company name or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button
            onClick={() => setShowBookmarks(!showBookmarks)}
            className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl transition-colors relative shrink-0 ${
              showBookmarks 
                ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' 
                : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${showBookmarks ? 'fill-purple-500' : ''}`} />
            {bookmarkedCount > 0 && !showBookmarks && (
              <span className="absolute -top-1.5 -right-1.5 bg-zinc-700 text-zinc-100 text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-950">
                {bookmarkedCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenFilter}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-colors text-zinc-300 relative shrink-0"
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span className="hidden sm:inline font-medium text-sm">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-purple-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-zinc-950">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}