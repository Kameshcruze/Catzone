import React from 'react';
import { Cat } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ArrowUpRight, Star } from 'lucide-react';
import { normalizeImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUtils';

interface CatCardProps {
  cat: Cat;
  onOpenDetails?: (cat: Cat) => void;
}

export const CatCard: React.FC<CatCardProps> = ({ cat, onOpenDetails }) => {
  const { navigate } = useStore();

  const handleCardClick = () => {
    if (onOpenDetails) {
      onOpenDetails(cat);
    } else {
      navigate('cat-detail', { catId: cat.id });
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-gradient-to-b from-white to-[#FAF8FF] rounded-[24px] p-4 border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
        cat.is_available
          ? 'border-purple-100/80 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1'
          : 'border-stone-200/50 opacity-80'
      }`}
    >
      {/* Image Container (Clean Studio Aesthetic) */}
      <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 mb-4">
        <img
          src={normalizeImageUrl(cat.main_image)}
          alt={`${cat.name} - ${cat.breed}`}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
          }}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            !cat.is_available ? 'grayscale-20 contrast-95' : ''
          }`}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-semibold uppercase bg-white/95 text-[#111111] backdrop-blur-xs border border-purple-100 shadow-xs">
            {cat.cat_id}
          </span>

          {/* Availability Status */}
          {cat.is_available ? (
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Available</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase bg-stone-100 text-stone-600 border border-stone-300">
              <span>Sold Out</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Info & Bottom Row */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-base text-[#111111] group-hover:text-[#7C3AED] transition-colors">
              {cat.name}
            </h3>
            <p className="text-[11px] text-stone-500 font-medium">
              {cat.breed} · {cat.age}
            </p>
          </div>

          {/* Circular Action Button with Diagonal Arrow ↗ */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111111] group-hover:bg-gradient-to-r group-hover:from-[#8B5CF6] group-hover:to-[#6D28D9] text-white flex items-center justify-center group-hover:scale-110 transition-all duration-200 shadow-xs shrink-0 ml-2 group-hover:shadow-purple-500/30"
            title={`View ${cat.name}`}
            aria-label={`View ${cat.name}`}
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Price & Rating */}
        <div className="flex items-center justify-between pt-1 border-t border-purple-100/60 text-xs">
          <span className="font-display font-bold text-[#111111] text-sm sm:text-base">
            ₹{cat.price.toLocaleString('en-IN')}
          </span>

          <div className="flex items-center space-x-1 text-amber-500 text-[10px]">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-stone-400 font-mono">5.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};
