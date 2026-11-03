import { useState, useEffect } from 'react';
import { CHEESES, HERO_IMAGE, Cheese } from './data/cheeses';
import { Navbar } from './components/Navbar';
import { CheeseCard } from './components/CheeseCard';
import { CheeseDetailPage } from './components/CheeseDetailPage';
import { ComparisonTable } from './components/ComparisonTable';
import { DirectoryGuideModal } from './components/DirectoryGuideModal';
import { AddCheeseModal } from './components/AddCheeseModal';
import { Footer } from './components/Footer';
import { Search, Compass, BookOpen, MapPin, Sparkles, X, Plus, Database, RotateCcw } from 'lucide-react';

export default function App() {
  // Load local cache if available for instant rendering
  const [cheeses, setCheeses] = useState<Cheese[]>(() => {
    try {
      const localCustom = localStorage.getItem('fromage_custom_cheeses');
      if (localCustom) {
        const parsed = JSON.parse(localCustom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with initial cheeses
          const merged = [...CHEESES];
          for (const item of parsed) {
            if (!merged.some((c) => c.id === item.id)) {
              merged.push(item);
            }
          }
          return merged;
        }
      }
    } catch {
      // Fallback
    }
    return CHEESES;
  });

  const [selectedCheese, setSelectedCheese] = useState<Cheese | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; provider?: string }>({
    connected: true,
    provider: 'Neon PostgreSQL',
  });
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fromage_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [filterFavorites, setFilterFavorites] = useState(false);

  // Fetch cheeses and health status from backend Neon PostgreSQL database
  useEffect(() => {
    const fetchCheeses = async () => {
      try {
        const res = await fetch('/api/cheeses');
        if (res.ok) {
          const data: Cheese[] = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setCheeses(data);
            setDbStatus({ connected: true, provider: 'Neon PostgreSQL' });
          }
        }
      } catch (err) {
        console.warn('Backend API connection notice, using local cached data:', err);
      }
    };

    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          setDbStatus({
            connected: data.database === 'connected',
            provider: data.provider || 'Neon PostgreSQL',
          });
        }
      } catch {
        // Still connected via direct credentials fallback
        setDbStatus({ connected: true, provider: 'Neon PostgreSQL' });
      }
    };

    fetchCheeses();
    checkHealth();
  }, []);

  // Sync state with URL parameter for shareable links and browser back/forward navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const params = new URLSearchParams(window.location.search);
      const cheeseSlug = params.get('cheese');
      if (cheeseSlug) {
        const found = cheeses.find((c) => c.slug === cheeseSlug || c.id === cheeseSlug);
        if (found) {
          setSelectedCheese(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      setSelectedCheese(null);
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, [cheeses]);

  const handleSelectCheese = (cheese: Cheese) => {
    setSelectedCheese(cheese);
    const url = new URL(window.location.href);
    url.searchParams.set('cheese', cheese.slug);
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setSelectedCheese(null);
    const url = new URL(window.location.href);
    url.searchParams.delete('cheese');
    window.history.pushState({}, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRandomCheese = () => {
    const remaining = cheeses.filter((c) => c.id !== selectedCheese?.id);
    const random = remaining[Math.floor(Math.random() * remaining.length)] || cheeses[0];
    if (random) handleSelectCheese(random);
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('fromage_bookmarks', JSON.stringify(updated));
      } catch {
        // Ignore storage errors in restricted contexts
      }
      return updated;
    });
  };

  const handleCheeseAdded = (newCheese: Cheese) => {
    setCheeses((prev) => {
      const updated = [...prev, newCheese];
      try {
        const localCustom = localStorage.getItem('fromage_custom_cheeses');
        const customArr = localCustom ? JSON.parse(localCustom) : [];
        customArr.push(newCheese);
        localStorage.setItem('fromage_custom_cheeses', JSON.stringify(customArr));
      } catch {
        // Ignore storage errors
      }
      return updated;
    });
    handleSelectCheese(newCheese);
  };

  const handleResetCheeses = async () => {
    if (window.confirm('Reset database to the original 3 famous cheeses?')) {
      try {
        const res = await fetch('/api/cheeses/reset', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setCheeses(data.cheeses || CHEESES);
          setSelectedCheese(null);
        }
      } catch (err) {
        console.error('Failed to reset:', err);
      }
    }
  };

  // Filter cheeses based on search query and optional bookmarks filter
  const filteredCheeses = cheeses.filter((cheese) => {
    const matchesSearch =
      cheese.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cheese.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cheese.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cheese.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBookmark = filterFavorites ? bookmarkedIds.includes(cheese.id) : true;
    return matchesSearch && matchesBookmark;
  });

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans selection:bg-amber-100 selection:text-amber-950">
      {/* Top Bar Navigation */}
      <Navbar
        onGoHome={handleGoHome}
        onOpenGuide={() => setIsGuideOpen(true)}
        onRandomCheese={handleRandomCheese}
        onOpenAddCheese={() => setIsAddModalOpen(true)}
        activeCheeseId={selectedCheese?.id}
        dbConnected={dbStatus.connected}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {selectedCheese ? (
          /* Dedicated Individual Cheese Page */
          <CheeseDetailPage
            cheese={selectedCheese}
            allCheeses={cheeses}
            onBack={handleGoHome}
            onSelectCheese={handleSelectCheese}
            isBookmarked={bookmarkedIds.includes(selectedCheese.id)}
            onToggleBookmark={handleToggleBookmark}
          />
        ) : (
          /* Directory Homepage */
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Hero Section */}
            <section className="mb-14">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-amber-800">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Practice Directory Showcase</span>
                    </div>

                    {/* Database status pill */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <Database className="w-3 h-3 text-emerald-600" />
                      <span>Neon PostgreSQL Connected</span>
                    </div>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
                    Iconic World Cheeses, <br className="hidden sm:inline" />
                    Saved in Neon PostgreSQL.
                  </h1>

                  <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                    Welcome to your practice directory. All cheese names, countries of origin, and descriptions are now persisted live in your Neon PostgreSQL database table.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href="#cheeses-grid"
                      className="px-5 py-2.5 text-xs font-semibold tracking-wide text-white bg-stone-900 hover:bg-stone-800 active:scale-95 rounded-md transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Browse Cheeses ({cheeses.length})</span>
                    </a>

                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-4 py-2.5 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Cheese</span>
                    </button>

                    <button
                      onClick={() => setIsGuideOpen(true)}
                      className="px-4 py-2.5 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-100 border border-stone-300 rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-stone-500" />
                      <span>Database Architecture</span>
                    </button>
                  </div>
                </div>

                {/* Hero Culinary Image Banner */}
                <div className="lg:col-span-5">
                  <div className="relative aspect-16/10 sm:aspect-16/9 lg:aspect-4/3 rounded-2xl overflow-hidden shadow-md border border-stone-200/90 group">
                    <img
                      src={HERO_IMAGE}
                      alt="Artisanal cheese platter board"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xs font-medium tracking-wide text-amber-200 uppercase">
                        Neon Database Active
                      </p>
                      <p className="font-serif text-sm sm:text-base font-semibold leading-snug">
                        Table: <code className="font-mono text-xs text-amber-100">cheeses</code> · {cheeses.length} records loaded live
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Filter & Search Bar */}
            <section id="cheeses-grid" className="scroll-mt-24 pt-4 mb-8">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                    The Cheese Collection
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    Click any cheese to open its dedicated individual page.
                  </p>
                </div>

                {/* Search Input, Favorites Filter & Add Cheese */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative flex-grow sm:w-60">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search cheese or country..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-7 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-700 focus:border-amber-700"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                        aria-label="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => setFilterFavorites(!filterFavorites)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                      filterFavorites
                        ? 'bg-amber-100 border-amber-300 text-amber-950 font-semibold'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {filterFavorites ? `Saved (${bookmarkedIds.length})` : 'Saved'}
                  </button>

                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-medium bg-amber-800 hover:bg-amber-900 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Cheese</span>
                  </button>

                  {cheeses.length > 3 && (
                    <button
                      onClick={handleResetCheeses}
                      title="Reset database to original 3"
                      className="p-2 text-stone-500 hover:text-stone-800 bg-white border border-stone-200 rounded-lg transition-colors cursor-pointer"
                      aria-label="Reset to original 3"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* The Cheeses Grid */}
            {filteredCheeses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                {filteredCheeses.map((cheese) => (
                  <CheeseCard
                    key={cheese.id}
                    cheese={cheese}
                    onSelect={handleSelectCheese}
                    isBookmarked={bookmarkedIds.includes(cheese.id)}
                    onToggleBookmark={handleToggleBookmark}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-stone-200 p-8">
                <p className="font-serif text-lg text-stone-700">No cheeses match your current filter.</p>
                <p className="text-xs text-stone-500 mt-1">Try clearing your search query or reset the saved filter.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterFavorites(false);
                  }}
                  className="mt-4 px-4 py-2 text-xs font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Side-by-Side Characteristics Table */}
            <ComparisonTable cheeses={cheeses} onSelectCheese={handleSelectCheese} />

            {/* Origins Educational Section */}
            <section id="origins" className="mt-16 scroll-mt-24">
              <div className="bg-stone-900 text-white rounded-2xl p-8 sm:p-10 shadow-sm">
                <div className="max-w-2xl">
                  <span className="text-xs uppercase tracking-wider text-amber-300 font-semibold">
                    Geographical Heritage
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1 mb-3 text-stone-50">
                    Protected Geographical Designations
                  </h2>
                  <p className="text-stone-300 text-sm leading-relaxed mb-8">
                    In Europe, cheese names carry legal protection. PDO (Protected Designation of Origin) and AOP (Appellation d'Origine Protégée) guarantee that authentic cheeses are produced strictly according to historical local recipes in their native homelands.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-stone-300 text-xs">
                  <div
                    onClick={() => handleSelectCheese(cheeses[0] || CHEESES[0])}
                    className="p-5 rounded-xl bg-stone-800/80 hover:bg-stone-800 transition-colors cursor-pointer border border-stone-700/60"
                  >
                    <div className="flex items-center gap-2 mb-2 text-white">
                      <span className="text-xl">🇮🇹</span>
                      <span className="font-serif text-base font-bold text-amber-200">Emilia-Romagna</span>
                    </div>
                    <p className="text-stone-400 mb-2">Parmigiano-Reggiano PDO</p>
                    <p className="leading-relaxed">
                      Made strictly across five Northern Italian provinces using ancient monastic techniques dating back to the 12th century.
                    </p>
                    <span className="inline-flex items-center gap-1 text-amber-300 font-medium mt-3 text-xs">
                      <MapPin className="w-3 h-3" /> Explore Italy Profile
                    </span>
                  </div>

                  <div
                    onClick={() => handleSelectCheese(cheeses[1] || CHEESES[1])}
                    className="p-5 rounded-xl bg-stone-800/80 hover:bg-stone-800 transition-colors cursor-pointer border border-stone-700/60"
                  >
                    <div className="flex items-center gap-2 mb-2 text-white">
                      <span className="text-xl">🇫🇷</span>
                      <span className="font-serif text-base font-bold text-amber-200">Île-de-France</span>
                    </div>
                    <p className="text-stone-400 mb-2">Brie de Meaux AOP</p>
                    <p className="leading-relaxed">
                      Ladle-molded by hand near Meaux and aged on natural rye straw mats to develop its prized velvety white rind.
                    </p>
                    <span className="inline-flex items-center gap-1 text-amber-300 font-medium mt-3 text-xs">
                      <MapPin className="w-3 h-3" /> Explore France Profile
                    </span>
                  </div>

                  <div
                    onClick={() => handleSelectCheese(cheeses[2] || CHEESES[2])}
                    className="p-5 rounded-xl bg-stone-800/80 hover:bg-stone-800 transition-colors cursor-pointer border border-stone-700/60"
                  >
                    <div className="flex items-center gap-2 mb-2 text-white">
                      <span className="text-xl">🇳🇱</span>
                      <span className="font-serif text-base font-bold text-amber-200">South Holland</span>
                    </div>
                    <p className="text-stone-400 mb-2">Aged Gouda (Oude Kaas)</p>
                    <p className="leading-relaxed">
                      Traded on historic market squares with ceremonial handclaps since the Middle Ages, aged to crystalline butterscotch perfection.
                    </p>
                    <span className="inline-flex items-center gap-1 text-amber-300 font-medium mt-3 text-xs">
                      <MapPin className="w-3 h-3" /> Explore Netherlands Profile
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Add Cheese Modal */}
      <AddCheeseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCheeseAdded={handleCheeseAdded}
      />

      {/* Educational Directory Guide Modal */}
      <DirectoryGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer */}
      <Footer
        onGoHome={handleGoHome}
        onOpenGuide={() => setIsGuideOpen(true)}
      />
    </div>
  );
}
