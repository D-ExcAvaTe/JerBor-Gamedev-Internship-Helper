import { useEffect, useState, useRef } from 'react';
import { getAppData } from './services/googleSheetService';
import { Internship, ConfigCategory, AppStatus } from './types';
import Header from './components/Header';
import FilterSection from './components/FilterSection';
import InternshipCard from './components/InternshipCard';
import FeaturedSection from './components/FeaturedSection';
import DetailDrawer from './components/DetailDrawer';
import SkeletonCard from './components/SkeletonCard';
import Toast from './components/Toast';
import SuggestModal from './components/SuggestModal';
import { SearchX, Inbox } from 'lucide-react';
import { motion } from 'motion/react';

type SortOption = 'deadline' | 'stipend' | 'status';

export default function App() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [config, setConfig] = useState<ConfigCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedIntern, setSelectedIntern] = useState<Internship | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const [trackedJobs, setTrackedJobs] = useState<Record<string, AppStatus>>({});
  const [showTracked, setShowTracked] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('deadline');
  
  const [toastInfo, setToastInfo] = useState({ show: false, message: '' });
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    getAppData().then(({ internships, config }) => {
      setInternships(internships);
      setConfig(config);
      setLoading(false);
    });

    const savedTracker = localStorage.getItem('trackedInternships');
    if (savedTracker) {
      try {
        setTrackedJobs(JSON.parse(savedTracker));
      } catch (e) {}
    }
  }, []);

  const showToast = (message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastInfo({ show: true, message });
    toastTimeoutRef.current = setTimeout(() => {
      setToastInfo({ show: false, message: '' });
    }, 3000);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const updateTrackStatus = (id: string, status: AppStatus | null) => {
    setTrackedJobs(prev => {
      const next = { ...prev };
      if (status === null) {
        delete next[id];
        showToast('ยกเลิกการติดตามแล้ว');
      } else {
        next[id] = status;
        showToast('อัปเดตสถานะเรียบร้อยแล้ว');
      }
      localStorage.setItem('trackedInternships', JSON.stringify(next));
      return next;
    });
  };

  const isFiltering = searchQuery.length > 0 || selectedTags.length > 0 || showTracked;

  const filteredData = internships.filter(item => {
    if (showTracked && !trackedJobs[item.id]) return false;

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

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOption === 'status') {
      const aStatus = trackedJobs[a.id] ? 1 : 0;
      const bStatus = trackedJobs[b.id] ? 1 : 0;
      if (aStatus !== bStatus) return bStatus - aStatus;
    }
    if (sortOption === 'stipend') {
      const parseMoney = (amt: string) => {
        const num = parseInt(amt.replace(/[^0-9]/g, ''));
        return isNaN(num) ? 0 : num;
      };
      const aMoney = parseMoney(a.stipendAmount);
      const bMoney = parseMoney(b.stipendAmount);
      if (aMoney !== bMoney) return bMoney - aMoney;
      if (a.stipend !== b.stipend) return a.stipend === 'paid' ? -1 : 1;
    }
    
    const aTime = a.deadline ? new Date(a.deadline).getTime() : Infinity;
    const bTime = b.deadline ? new Date(b.deadline).getTime() : Infinity;
    return aTime - bTime;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onOpenFilter={() => setIsFilterOpen(true)}
        activeFilterCount={selectedTags.length}
        showTracked={showTracked}
        setShowTracked={setShowTracked}
        trackedCount={Object.keys(trackedJobs).length}
      />
      
      <FilterSection
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        config={config}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        clearFilters={() => setSelectedTags([])}
      />

      {!isFiltering && !loading && (
        <FeaturedSection
          internships={internships}
          config={config}
          onCardClick={setSelectedIntern}
          trackedJobs={trackedJobs}
          updateTrackStatus={updateTrackStatus}
        />
      )}

      <div className="max-w-5xl mx-auto w-full px-6 pt-6 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest shrink-0">
              {loading 
                ? 'กำลังโหลดข้อมูล...' 
                : showTracked 
                  ? `ติดตามอยู่ ${sortedData.length} รายการ` 
                  : isFiltering 
                    ? `ผลลัพธ์ ${sortedData.length} รายการ` 
                    : `ทั้งหมด ${sortedData.length} บริษัท`}
            </span>
            <div className="flex-1 h-px bg-zinc-800 hidden sm:block" />
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors w-full sm:w-auto cursor-pointer"
          >
            <option value="deadline">⏳ เรียงตาม Deadline</option>
            <option value="stipend">💰 เรียงตามเบี้ยเลี้ยง</option>
            <option value="status">📌 เรียงตามสถานะการติดตาม</option>
          </select>
        </div>
      </div>

      <main className="max-w-5xl mx-auto w-full px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : sortedData.length > 0 ? (
          sortedData.map((item, index) => (
            <InternshipCard
              key={item.id}
              internship={item}
              config={config}
              onClick={() => setSelectedIntern(item)}
              status={trackedJobs[item.id] || null}
              updateTrackStatus={updateTrackStatus}
              index={index}
            />
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="col-span-full py-24 flex flex-col items-center justify-center text-center gap-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-2 shadow-inner">
              {showTracked ? <Inbox className="w-8 h-8 text-zinc-600" /> : <SearchX className="w-8 h-8 text-zinc-600" />}
            </div>
            <div>
              <p className="text-lg font-bold text-zinc-300">
                {showTracked ? "ยังไม่มีบริษัทที่เล็งไว้" : "ไม่พบประกาศรับสมัคร"}
              </p>
              <p className="text-sm text-zinc-500 mt-1 max-w-sm">
                {showTracked 
                  ? "ลองกลับไปหน้าแรก แล้วกดไอคอน 📌 ที่การ์ดบริษัทเพื่อบันทึกงานที่สนใจดูสิ" 
                  : "ลองเปลี่ยนคำค้นหา หรือเอาตัวกรองบางอันออก เพื่อให้เห็นตัวเลือกที่มากขึ้นนะ"}
              </p>
            </div>
            {showTracked && (
              <button 
                onClick={() => setShowTracked(false)}
                className="mt-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-semibold rounded-xl transition-colors"
              >
                ดูงานทั้งหมด
              </button>
            )}
          </motion.div>
        )}
      </main>

      <footer className="border-t border-zinc-800/50 py-8 px-4 flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="text-xs text-zinc-600">
            Created by <span className="text-zinc-400 font-medium">Thirawut Phuangbuppha และ นกน้อย</span>
          </p>
          <p className="text-xs text-zinc-700 mt-1">
            ⚠️ กรุณาตรวจเช็คความถูกต้องของข้อมูลอีกครั้ง เนื่องจากไม่ได้อัปเดตตลอดทุกลิสต์
          </p>
        </div>
        
        <button 
          onClick={() => setIsSuggestOpen(true)}
          className="px-4 py-2 bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-800 text-purple-400 text-xs font-bold rounded-full transition-all flex items-center gap-2"
        >
          💡 แนะนำบริษัทเพิ่มเติม
        </button>
      </footer>

      <DetailDrawer
        internship={selectedIntern}
        config={config}
        onClose={() => setSelectedIntern(null)}
        status={selectedIntern ? (trackedJobs[selectedIntern.id] || null) : null}
        updateTrackStatus={updateTrackStatus}
        showToast={showToast}
      />
      
      <SuggestModal 
        isOpen={isSuggestOpen} 
        onClose={() => setIsSuggestOpen(false)} 
        showToast={showToast} 
      />

      <Toast message={toastInfo.message} isVisible={toastInfo.show} />
    </div>
  );
}