import { useEffect, useState } from 'react';
import { getAppData } from './services/googleSheetService';
import { Internship, ConfigCategory } from './types';
import Header from './components/Header';
import FilterSection from './components/FilterSection';
import InternshipCard from './components/InternshipCard';
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

  const filteredData = internships.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const allItemTags = [...item.positions, ...item.workMode, item.stipend];
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => allItemTags.includes(tag));
    return matchesSearch && matchesTags;
  });

  if (loading) return <div className="h-screen flex items-center justify-center text-zinc-400">Loading Internships...</div>;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FilterSection config={config} selectedTags={selectedTags} toggleTag={toggleTag} />
      
      <main className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredData.map(item => (
          <InternshipCard 
            key={item.id} 
            internship={item} 
            config={config} 
            onClick={() => setSelectedIntern(item)} 
          />
        ))}
      </main>

      <DetailDrawer 
        internship={selectedIntern} 
        config={config} 
        onClose={() => setSelectedIntern(null)} 
      />
    </div>
  );
}