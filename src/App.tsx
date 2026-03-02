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
  
  const [toastInfo, setToastInfo] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  useEffect(() => {
    getAppData().then(({ internships, config }) => {
      setInternships(internships);
      setConfig(config);
      setLoading(false);
    });

    const saved = localStorage.getItem('tracked_internships');
    if (saved) setTrackedJobs(JSON.parse(saved));
  }, []);

  const showToast = (message: string) => {
    setToastInfo({ visible: true, message });
    setTimeout(() => setToastInfo({ visible: false, message: '' }), 3000);
  };

  const updateTrackStatus = (id: string, status: AppStatus | null) => {
    const newTracked = { ...trackedJobs };
    if (status) {
      newTracked[id] = status;
      showToast(`อัปเดตสถานะเป็น: ${status}`);
    } else {
      delete newTracked[id];
      showToast('เลิกติดตามงานนี้แล้ว');
    }
    setTrackedJobs(newTracked);
    localStorage.setItem('tracked_internships', JSON.stringify(newTracked));
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTags([]);
  };

  // ✨ ฟังก์ชัน Reset App ใหม่สำหรับกดที่ Logo
  const resetApp = () => {
    clearFilters();
    setShowTracked(false);
    setSelectedIntern(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredData = internships.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const allItemTags = [...item.positions, ...item.workMode, item.stipend, item.location.toLowerCase().replace(/\s+/g, '_')];
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => allItemTags.includes(tag));
    const matchesTracked = !showTracked || !!trackedJobs[item.id];
    
    return matchesSearch && matchesTags && matchesTracked;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-purple-500/30">
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        onOpenFilter={() => setIsFilterOpen(true)}
        activeFilterCount={selectedTags.length}
        showTracked={showTracked}
        setShowTracked={setShowTracked}
        trackedCount={Object.keys(trackedJobs).length}
        onLogoClick={resetApp} // 🛠️ ส่ง Reset ไปที่นี่
      />

      <FilterSection
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        config={config}
        selectedTags={selectedTags}
        toggleTag={toggleTag}
        clearFilters={clearFilters}
      />
      
      <main className="max-w-5xl mx-auto p-6 flex flex-col gap-8">
        {!showTracked && !searchQuery && selectedTags.length === 0 && (
          <FeaturedSection 
            internships={internships} 
            config={config} 
            onCardClick={setSelectedIntern}
            trackedJobs={trackedJobs}
            updateTrackStatus={updateTrackStatus}
          />
        )}

        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight">
              {showTracked ? 'My Tracked Internships' : 'All Internships'}
            </h2>
            <span className="bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
              {filteredData.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredData.map((item, index) => (
              <InternshipCard 
                key={item.id} 
                internship={item} 
                config={config} 
                onClick={() => setSelectedIntern(item)}
                status={trackedJobs[item.id] || null}
                updateTrackStatus={updateTrackStatus}
                index={index}
              />
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800"
          >
            {showTracked ? <Inbox className="w-12 h-12 text-zinc-700 mb-4" /> : <SearchX className="w-12 h-12 text-zinc-700 mb-4" />}
            <p className="text-zinc-500 font-medium">
              {showTracked ? 'คุณยังไม่มีงานที่บันทึกไว้' : 'ไม่พบข้อมูลที่ตรงกับการค้นหา'}
            </p>
            {showTracked && (
              <button 
                onClick={() => setShowTracked(false)}
                className="mt-4 text-purple-400 text-sm font-bold hover:text-purple-300 transition-colors"
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

      <Toast message={toastInfo.message} isVisible={toastInfo.visible} />
    </div>
  );
}