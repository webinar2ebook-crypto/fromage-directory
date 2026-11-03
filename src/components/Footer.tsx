import React from 'react';

interface FooterProps {
  onGoHome: () => void;
  onOpenGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onGoHome, onOpenGuide }) => {
  return (
    <footer className="mt-24 border-t border-stone-200 bg-stone-100/60 text-stone-600 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <button
              onClick={onGoHome}
              className="font-serif text-lg font-bold text-stone-900 hover:text-amber-800 transition-colors cursor-pointer"
            >
              The Fromage Directory
            </button>
            <p className="text-stone-500 mt-1 max-w-sm">
              A curated educational practice directory celebrating the artisanal cheese traditions of Italy, France, and the Netherlands.
            </p>
          </div>

          <div className="flex items-center gap-6 font-medium text-stone-600">
            <button onClick={onGoHome} className="hover:text-stone-900 transition-colors cursor-pointer">
              Directory Home
            </button>
            <button onClick={onOpenGuide} className="hover:text-stone-900 transition-colors cursor-pointer">
              How It Works
            </button>
            <a
              href="#origins"
              onClick={onGoHome}
              className="hover:text-stone-900 transition-colors cursor-pointer"
            >
              Regions
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between text-stone-400 gap-2">
          <span>&copy; {new Date().getFullYear()} The Fromage Practice Directory. Built with clean, modern web standards.</span>
          <span>Designed for learners and cheese lovers worldwide.</span>
        </div>
      </div>
    </footer>
  );
};
