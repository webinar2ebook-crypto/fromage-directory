import React from 'react';

interface NavbarProps {
  onGoHome: () => void;
  onOpenGuide: () => void;
  onRandomCheese: () => void;
  onOpenAddCheese?: () => void;
  activeCheeseId?: string | null;
  dbConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGoHome,
  onOpenGuide,
  onRandomCheese,
  onOpenAddCheese,
  activeCheeseId,
  dbConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single element wordmark */}
        <button
          onClick={onGoHome}
          className="text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-sm"
        >
          <span className="font-serif text-2xl font-bold tracking-tight text-stone-900 group-hover:text-amber-800 transition-colors whitespace-nowrap shrink-0">
            Fromage<span className="text-amber-700">.</span>
          </span>
        </button>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <button
            onClick={onGoHome}
            className={`cursor-pointer transition-colors whitespace-nowrap shrink-0 hover:text-stone-900 ${
              !activeCheeseId ? 'text-amber-800 font-semibold' : ''
            }`}
          >
            Cheese Directory
          </button>
          <a
            href="#comparison"
            onClick={(e) => {
              if (activeCheeseId) {
                e.preventDefault();
                onGoHome();
                setTimeout(() => {
                  document.getElementById('comparison')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="cursor-pointer hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            Quick Comparison
          </a>
          <a
            href="#origins"
            onClick={(e) => {
              if (activeCheeseId) {
                e.preventDefault();
                onGoHome();
                setTimeout(() => {
                  document.getElementById('origins')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="cursor-pointer hover:text-stone-900 transition-colors whitespace-nowrap shrink-0"
          >
            European Origins
          </a>
          <button
            onClick={onOpenGuide}
            className="cursor-pointer text-stone-600 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            Practice Guide
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenAddCheese && (
            <button
              onClick={onOpenAddCheese}
              className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-md transition-all shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 whitespace-nowrap"
            >
              + Add Cheese
            </button>
          )}
          <button
            onClick={onRandomCheese}
            className="px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white bg-amber-800 hover:bg-amber-900 active:scale-95 rounded-md transition-all shadow-sm whitespace-nowrap shrink-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            Explore Cheese
          </button>
        </div>
      </div>
    </header>
  );
};
