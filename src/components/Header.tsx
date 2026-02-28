import { Search } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/50 pt-6 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <span className="text-purple-500">Internship</span> Hub 🛠️
          </h1>
        </div>
        
        <div className="relative group">
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
      </div>
    </header>
  );
}
