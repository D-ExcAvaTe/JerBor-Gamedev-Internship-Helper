import { useEffect, useState } from 'react';
import { getAppData } from './services/googleSheetService';
import { Internship, ConfigCategory } from './types';
import Header from './components/Header';
import FilterSection from './components/FilterSection';
import InternshipCard from './components/InternshipCard';
import FeaturedSection from './components/FeaturedSection';
import DetailDrawer from './components/DetailDrawer';

export default function App() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [config, setConfig] = useState<ConfigCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedIntern, setSelectedIntern] = useState<Internship | null>(null);

  useEffect(() => {
    getAppData().then(({ internships, config }) => {
      setInternships(internships);
      setConfig(config);
      setLoading(false);
    });
  }, []);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const isFiltering = searchQuery.length > 0 || selectedTags.length > 0;

  const filteredData = internships.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const allItemTags = [...item.positions, ...item.workMode, item.stipend];
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => allItemTags.includes(tag));
    return matchesSearch && matchesTags;
  });

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-zinc-400 font-medium">
      Loading Database...
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FilterSection
        config={config}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
      />

      {/* Featured section — hide when actively filtering */}
      {!isFiltering && (
        <FeaturedSection
          internships={internships}
          config={config}
          onCardClick={setSelectedIntern}
        />
      )}

      {/* Divider + list header */}
      <div className="max-w-5xl mx-auto w-full px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {isFiltering ? `ผลลัพธ์ ${filteredData.length} รายการ` : `ทั้งหมด ${filteredData.length} บริษัท · เรียงตาม Deadline`}
          </span>
          <div className="flex-1 h-px bg-zinc-800" />
        </div>
      </div>

      <main className="max-w-5xl mx-auto w-full px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {filteredData.length > 0 ? (
          filteredData.map(item => (
            <InternshipCard
              key={item.id}
              internship={item}
              config={config}
              onClick={() => setSelectedIntern(item)}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-zinc-500">
            No internships found matching your filters.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 py-6 px-4 text-center">
        <p className="text-xs text-zinc-600">
          Created by{' '}
          <span className="text-zinc-400 font-medium">Thirawut Phuangbuppha</span>
        </p>
        <p className="text-xs text-zinc-700 mt-1">
          ⚠️ กรุณาตรวจเช็คความถูกต้องของข้อมูลอีกครั้ง เนื่องจากไม่ได้อัปเดตตลอดทุกลิสต์
        </p>
      </footer>

      <DetailDrawer
        internship={selectedIntern}
        config={config}
        onClose={() => setSelectedIntern(null)}
      />
    </div>
  );
}
