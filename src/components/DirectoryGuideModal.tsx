import React from 'react';
import { X, Code2, Database, Layout, Sparkles, BookOpen } from 'lucide-react';

interface DirectoryGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectoryGuideModal: React.FC<DirectoryGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-xl border border-stone-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2 text-amber-800">
          <BookOpen className="w-5 h-5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            Practice Directory Architecture
          </span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
          How This Directory Website Works
        </h2>
        <p className="text-sm text-stone-600 mb-6 leading-relaxed">
          You mentioned that you don't know how to code yet. Directory websites are one of the most useful web patterns in the world! Here is how this site is constructed under the hood:
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg shrink-0 mt-0.5">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  1. Live Database (<code className="font-mono text-xs bg-stone-200 px-1 py-0.5 rounded">Neon PostgreSQL</code>)
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  Your website is now connected to Neon PostgreSQL! It automatically creates the <code className="font-mono text-xs bg-stone-200 px-1 py-0.5 rounded">cheeses</code> table with columns for name, country of origin, region, milk type, aging, and description.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-900 rounded-lg shrink-0 mt-0.5">
                <Layout className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  2. Two Core Views (Homepage & Detail Page)
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  The homepage loops through the 3 cheeses to display clean summary cards. When you click any cheese, the view updates seamlessly to that cheese's dedicated page without needing a full browser reload.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/80">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-100 text-amber-900 rounded-lg shrink-0 mt-0.5">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  3. Browser URL & Shareable Links
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  When you visit a cheese page, the URL automatically updates with <code className="font-mono text-xs bg-stone-200 px-1 py-0.5 rounded">?cheese=parmigiano-reggiano</code>. You can copy the link, send it to a friend, or hit the browser back/forward buttons, and it takes you straight to that cheese!
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-200 text-amber-900 rounded-lg shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">
                  Try Adding a 4th Cheese Anytime!
                </h3>
                <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                  Want to practice expanding your directory? Simply open <code className="font-mono text-xs bg-amber-100 px-1 py-0.5 rounded">src/data/cheeses.ts</code> and add an entry for Spanish Manchego or English Cheddar—the homepage cards, comparison table, and detail page will all update automatically!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
          >
            Got It, Back to Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
