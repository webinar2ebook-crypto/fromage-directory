import React, { useState } from 'react';
import { Cheese } from '../data/cheeses';
import { ArrowRight, Heart } from 'lucide-react';

interface CheeseCardProps {
  cheese: Cheese;
  onSelect: (cheese: Cheese) => void;
  isBookmarked: boolean;
  onToggleBookmark: (cheeseId: string) => void;
}

export const CheeseCard: React.FC<CheeseCardProps> = ({
  cheese,
  onSelect,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <article className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full">
      {/* Visual Slot: Product Image */}
      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onSelect(cheese)}>
        {!imageError ? (
          <img
            src={cheese.image}
            alt={`${cheese.name} cheese from ${cheese.country}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : null}

        {/* Resilient Fallback Container */}
        {(!imageLoaded || imageError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-200 text-stone-500 p-6 text-center">
            <span className="text-4xl mb-2">{cheese.flag}</span>
            <span className="font-serif text-stone-700 font-semibold">{cheese.name}</span>
            <span className="text-xs text-stone-500 mt-1">{cheese.region}</span>
          </div>
        )}

        {/* Favorite Bookmark Button */}
        <button
          type="button"
          aria-label={isBookmarked ? `Remove ${cheese.name} from saved` : `Save ${cheese.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(cheese.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-xs text-stone-700 hover:text-amber-700 hover:bg-white shadow-xs transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isBookmarked ? 'fill-rose-600 text-rose-600' : 'text-stone-600'
            }`}
          />
        </button>

        {/* Subtle Country Ribbon */}
        <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded font-medium flex items-center gap-1.5 shadow-xs">
          <span>{cheese.flag}</span>
          <span>{cheese.country}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-grow justify-between">
        <div>
          {/* Zero-Pill Unboxed Metadata Separators */}
          <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-2">
            <span>{cheese.region.split('(')[0].trim()}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span>{cheese.aging.split('(')[0].trim()}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(cheese)}
            className="font-serif text-2xl font-bold text-stone-900 mb-1 group-hover:text-amber-800 transition-colors cursor-pointer"
          >
            {cheese.name}
          </h3>

          <p className="text-xs italic text-stone-500 mb-3 font-serif">
            {cheese.moniker}
          </p>

          {/* Short Description */}
          <p className="text-sm text-stone-600 leading-relaxed line-clamp-3 mb-4">
            {cheese.shortDescription}
          </p>
        </div>

        {/* Card Footer Action */}
        <div className="pt-4 border-t border-stone-100 flex items-center justify-between mt-auto">
          <span className="text-xs text-stone-500 font-medium">
            {cheese.milk.split('(')[0].trim()}
          </span>

          <button
            onClick={() => onSelect(cheese)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 transition-colors cursor-pointer group/link"
          >
            <span>Explore Page</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};
