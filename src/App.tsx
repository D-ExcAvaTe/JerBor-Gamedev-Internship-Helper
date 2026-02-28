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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);

  useEffect(() => {
    getAppData().then(({ internships, config }) => {
      setInternships(internships);
      setConfig(config);
      setLoading(false);
    });

    const savedBookmarks = localStorage.getItem('bookmarkedInternships');
    if (savedBookmarks) {
      try {
        setBookmarkedIds(JSON.parse(savedBookmarks));
      } catch (e) {}
    }
  }, []);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => {
      const newBookmarks = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      localStorage.setItem('bookmarkedInternships', JSON.stringify(newBookmarks));
      return newBookmarks;
    });
  };

  const isFiltering = searchQuery.length > 0 || selectedTags.length > 0 || showBookmarks;

  const filteredData = internships.filter(item => {
    if (showBookmarks && !bookmarkedIds.includes(item.id)) return false;

    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (selectedTags.length === 0) return true;

    const selectedByCategory: Record<string, string[]> = {};
    
    selectedTags.forEach(tagId => {
      let categoryId = '';
      for (const cat of config) {
        if (cat.tags.some(t => t.id === tagId)) {
          categoryId = cat.id;
          break;
        }
        if (cat.subCategories && cat.subCategories.some(sub => sub.tags.some(t => t.id === tagId))) {
          categoryId = cat.id;
          break;
        }
      }
      
      if (categoryId) {
        if (!selectedByCategory[categoryId]) selectedByCategory[categoryId] = [];
        selectedByCategory[categoryId].push(tagId);
      }
    });

    const matchesTags = Object.keys(selectedByCategory).every(categoryId => {
      const tagsInCat = selectedByCategory[categoryId];
      
      if (categoryId === 'position') {
        return tagsInCat.some(tag => item.positions.includes(tag));
      }
      if (categoryId === 'workMode') {
        return tagsInCat.some(tag => item.workMode.includes(tag));
      }
      if (categoryId === 'stipend') {
        return tagsInCat.includes(item.stipend);
      }
      return false;
    });

    return matchesTags;
  });

  if (loading) return (
    <div className="h-screen flex items-center justify-center text-zinc-400 font-medium">
      Loading Database...
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onOpenFilter={() => setIsFilterOpen(true)}
        activeFilterCount={selectedTags.length}
        showBookmarks={showBookmarks}
        setShowBookmarks={setShowBookmarks}
        bookmarkedCount={bookmarkedIds.length}
      />
      
      <FilterSection
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        config={config}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        clearFilters={() => setSelectedTags([])}
      />

      {!isFiltering && (
        <FeaturedSection
          internships={internships}
          config={config}
          onCardClick={setSelectedIntern}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={toggleBookmark}
        />
      )}

      <div className="max-w-5xl mx-auto w-full px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
            {showBookmarks 
              ? `ที่บันทึกไว้ ${filteredData.length} รายการ` 
              : isFiltering 
                ? `ผลลัพธ์ ${filteredData.length} รายการ` 
                : `ทั้งหมด ${filteredData.length} บริษัท · เรียงตาม Deadline`}
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
              isBookmarked={bookmarkedIds.includes(item.id)}
              onToggleBookmark={toggleBookmark}
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-zinc-500">
            {showBookmarks ? "You haven't bookmarked any internships yet." : "No internships found matching your filters."}
          </div>
        )}
      </main>

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
        isBookmarked={selectedIntern ? bookmarkedIds.includes(selectedIntern.id) : false}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
}