import React, { useState } from 'react';
import { Cheese } from '../data/cheeses';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Share2,
  Check,
  MapPin,
  Clock,
  Sparkles,
  UtensilsCrossed,
  Info,
} from 'lucide-react';

interface CheeseDetailPageProps {
  cheese: Cheese;
  allCheeses: Cheese[];
  onBack: () => void;
  onSelectCheese: (cheese: Cheese) => void;
  isBookmarked: boolean;
  onToggleBookmark: (cheeseId: string) => void;
}

export const CheeseDetailPage: React.FC<CheeseDetailPageProps> = ({
  cheese,
  allCheeses,
  onBack,
  onSelectCheese,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Find index for previous / next navigation
  const currentIndex = allCheeses.findIndex((c) => c.id === cheese.id);
  const prevCheese =
    currentIndex > 0 ? allCheeses[currentIndex - 1] : allCheeses[allCheeses.length - 1];
  const nextCheese =
    currentIndex < allCheeses.length - 1 ? allCheeses[currentIndex + 1] : allCheeses[0];

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}?cheese=${cheese.slug}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      }
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fade-in">
      {/* Top Navigation Bar & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 rounded px-1"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All Cheeses</span>
        </button>

        {/* Action affordances: Bookmark & Share */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleBookmark(cheese.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all cursor-pointer ${
              isBookmarked
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-800 text-amber-800' : ''}`} />
            <span>{isBookmarked ? 'Saved to Favorites' : 'Bookmark'}</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white rounded-md border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Big Editorial Image & Fast Spec Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative aspect-4/3 sm:aspect-1/1 lg:aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm">
            <img
              src={cheese.image}
              alt={`${cheese.name} photo`}
              referrerPolicy="no-referrer"
              onLoad={() => setImageLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-stone-400">
                <span className="text-sm font-medium">Loading photograph...</span>
              </div>
            )}
            <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1.5">
              <span>{cheese.flag}</span>
              <span>Authentic {cheese.country} Specimen</span>
            </div>
          </div>

          {/* Clean Quick Specs Box (Single elevation, zero-pill text) */}
          <div className="bg-white rounded-xl p-6 border border-stone-200/90 shadow-xs space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
              Classification & Origin
            </h4>

            <div className="grid grid-cols-1 gap-3.5 text-sm">
              <div className="flex items-start justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" /> Country of Origin
                </span>
                <span className="font-semibold text-stone-900 text-right">
                  {cheese.flag} {cheese.country}
                </span>
              </div>

              <div className="flex items-start justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">Region</span>
                <span className="font-medium text-stone-800 text-right max-w-[60%]">
                  {cheese.region}
                </span>
              </div>

              <div className="flex items-start justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500">Milk Type</span>
                <span className="font-medium text-stone-800 text-right">
                  {cheese.milk}
                </span>
              </div>

              <div className="flex items-start justify-between border-b border-stone-100 pb-2">
                <span className="text-stone-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400" /> Aging Period
                </span>
                <span className="font-medium text-stone-800 text-right">
                  {cheese.aging}
                </span>
              </div>

              <div className="flex items-start justify-between">
                <span className="text-stone-500">Texture</span>
                <span className="font-medium text-stone-800 text-right max-w-[60%]">
                  {cheese.texture}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Title, Short Description, Full Story, Notes, Pairings (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            {/* Country and Moniker text separator */}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 tracking-wide uppercase mb-2">
              <span>{cheese.country}</span>
              <span aria-hidden="true">·</span>
              <span>{cheese.moniker}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight mb-3">
              {cheese.name}
            </h1>

            {/* Core Short Description requested by user */}
            <div className="text-lg text-stone-700 leading-relaxed font-serif italic border-l-2 border-amber-700/60 pl-4 py-1 my-4 bg-amber-50/40 rounded-r">
              "{cheese.shortDescription}"
            </div>
          </div>

          {/* In-depth Craftsmanship & History */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Heritage & Production
            </h2>
            <p className="text-stone-700 text-base leading-relaxed">
              {cheese.fullDescription}
            </p>
          </div>

          {/* Flavor Notes (Unboxed typographic display) */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-3">
              Tasting Profile & Flavor Notes
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {cheese.flavorNotes.map((note) => (
                <div
                  key={note}
                  className="bg-white border border-stone-200/90 rounded-lg p-3 text-center"
                >
                  <span className="text-xs font-semibold text-stone-800 block">
                    {note}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Pairings */}
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-3 flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-amber-700" />
              Traditional Culinary Pairings
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {cheese.pairings.map((pairing) => (
                <li
                  key={pairing}
                  className="bg-stone-100/80 rounded-lg px-3.5 py-2.5 text-xs text-stone-800 font-medium flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-700 shrink-0" />
                  <span>{pairing}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Sommelier Serving Tip */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-1.5 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-800" />
              Master Cheesemonger Serving Tip
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed">
              {cheese.servingTip}
            </p>
          </div>

          {/* Historic Fun Fact */}
          <div className="bg-white border border-stone-200 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Historical Trivia
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {cheese.funFact}
            </p>
          </div>
        </div>
      </div>

      {/* Pagination: Previous & Next Cheese Navigation */}
      <div className="mt-16 pt-8 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => onSelectCheese(prevCheese)}
          className="group p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-700/50 hover:shadow-xs transition-all text-left cursor-pointer flex items-center gap-4"
        >
          <div className="p-2 rounded-full bg-stone-100 group-hover:bg-amber-100 text-stone-600 group-hover:text-amber-900 transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <span className="text-xs text-stone-400 font-medium block">Previous Cheese</span>
            <span className="font-serif font-bold text-stone-900 truncate block group-hover:text-amber-800 transition-colors">
              {prevCheese.name} ({prevCheese.country})
            </span>
          </div>
        </button>

        <button
          onClick={() => onSelectCheese(nextCheese)}
          className="group p-4 bg-white rounded-xl border border-stone-200 hover:border-amber-700/50 hover:shadow-xs transition-all text-right cursor-pointer flex items-center justify-end gap-4"
        >
          <div className="min-w-0">
            <span className="text-xs text-stone-400 font-medium block">Next Cheese</span>
            <span className="font-serif font-bold text-stone-900 truncate block group-hover:text-amber-800 transition-colors">
              {nextCheese.name} ({nextCheese.country})
            </span>
          </div>
          <div className="p-2 rounded-full bg-stone-100 group-hover:bg-amber-100 text-stone-600 group-hover:text-amber-900 transition-colors shrink-0">
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  );
};
