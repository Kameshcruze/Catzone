import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowUpRight, Star } from 'lucide-react';
import { normalizeImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUtils';

export const HeroSection: React.FC = () => {
  const { navigate, cats } = useStore();

  // The 'cats' array is already sorted newest-first by the StoreContext
  // So we just take the first 2 available cats
  const displayCats = cats.filter(c => c.is_available).slice(0, 2);

  const availableCount = cats.filter((c) => c.is_available).length;

  return (
    <section className="relative bg-gradient-to-b from-[#FAF8FF] via-white to-white pt-8 pb-16 lg:pt-12 lg:pb-20 border-b border-stone-200/80 overflow-hidden">
      {/* Subtle purple radiant background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#8B5CF6]/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Headline with Inline Image Pills */}
        <div className="text-center max-w-4xl mx-auto mb-10 sm:mb-14">
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[68px] font-display font-bold text-[#111111] tracking-tight leading-[1.12]">
            Find Your Perfect,{' '}
            <span className="inline-flex items-center align-middle mx-1 sm:mx-2 p-0.5 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-indigo-400 h-8 sm:h-12 w-14 sm:w-20 overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=200&q=80"
                alt="Cat icon"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </span>{' '}
            <br className="hidden sm:inline" />
            Purebred Companion{' '}
            <span className="inline-flex items-center align-middle mx-1 sm:mx-2 p-0.5 rounded-full bg-gradient-to-tr from-purple-400 to-[#8B5CF6] h-8 sm:h-12 w-14 sm:w-22 overflow-hidden shadow-sm">
              <img
                src="https://drive.google.com/file/d/1dxjSXeDFRF14pnHgxEsqOtaCc8tkmrHh/view?usp=drivesdk"                
                alt="Kitten icon"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full"
              />
            </span>{' '}
            Today
          </h1>
        </div>

        {/* Reviews Pill Floating Above Visuals */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-purple-100 shadow-xs">
            {/* Overlapping Avatars */}
            <div className="flex -space-x-2 overflow-hidden shrink-0">
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                alt="Buyer"
              />
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80"
                alt="Buyer"
              />
              <img
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                alt="Buyer"
              />
              <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-[9px] font-bold text-white ring-2 ring-white">
                +1.2k
              </div>
            </div>

            <div className="text-left">
              <p className="text-[11px] font-semibold text-[#111111] leading-tight">Check reviews</p>
              <div className="flex items-center space-x-1.5 text-amber-500 text-[10px]">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-stone-500 font-medium whitespace-nowrap">(4.9/5 from 1,200+ buyers)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Grid (Main Card Left + 2 Stacked Cards Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Wide Card (8 cols) */}
          <div className="lg:col-span-8 relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-[#130D24] border border-purple-100 shadow-sm min-h-[380px] sm:min-h-[440px] flex flex-col justify-between group">
            <img
              src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1400&q=85"
              alt="CatZone Royal British Shorthair"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
            />
            
            {/* Gradient Scrim for high legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0612]/95 via-black/40 to-black/20 pointer-events-none" />

            {/* Top Badge */}
            <div className="relative p-5 sm:p-7 z-10 flex items-center justify-between">
              <span className="inline-flex items-center text-[10px] sm:text-[11px] uppercase tracking-widest font-bold bg-black/40 backdrop-blur-md text-purple-200 px-3.5 py-1.5 rounded-full border border-purple-400/30">
                Featured Champion Lineage
              </span>
            </div>

            {/* Bottom Content & 'Purchase Now ↗' Button */}
            <div className="relative p-5 sm:p-8 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="text-white max-w-lg">
                <p className="text-xs uppercase tracking-wider text-purple-300 font-semibold mb-1">Pedigree Showcase</p>
                <h3 className="text-2xl sm:text-3xl font-display font-bold leading-tight text-white drop-shadow-md">
                  Meet Your New Best Friend
                </h3>
              </div>

              <button
                onClick={() => navigate('cats')}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 shadow-xl shadow-purple-900/40 hover:scale-105 active:scale-95 shrink-0"
              >
                <span>Purchase Now</span>
                <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </button>
            </div>
          </div>

          {/* Stacked Product Cards (4 cols) */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
            {displayCats.map((cat, idx) => (
              <div
                key={cat.id || idx}
                onClick={() => navigate('cat-detail', { catId: cat.id })}
                className="bg-gradient-to-b from-white to-[#F7F5FF] rounded-[24px] p-4 border border-purple-100/80 shadow-xs flex flex-col justify-between hover:shadow-md transition-all duration-200 cursor-pointer group"
              >
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-white mb-3">
                  <img
                    src={normalizeImageUrl(cat.main_image)}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Trait Color Dots (Decorative) */}
                  <div className="absolute top-2.5 left-2.5 flex items-center space-x-1 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="w-2 h-2 rounded-full bg-stone-300" />
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-sm text-[#111111] group-hover:text-[#7C3AED] transition-colors truncate pr-2">
                      {cat.name}
                    </h4>
                    <span className="font-display font-bold text-sm text-[#111111] whitespace-nowrap">
                      ₹{cat.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center space-x-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400 shrink-0" />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider font-medium truncate ml-2">
                      {cat.breed}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="mt-14 pt-8 border-t border-stone-200/80 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center text-center">
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#111111] block tracking-tight">
              1000+
            </span>
            <p className="text-xs text-stone-500 mt-1 max-w-[220px] mx-auto text-center">
              Happy and loyal buyers who welcomed our kittens
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#111111] block tracking-tight">
              200+
            </span>
            <p className="text-xs text-stone-500 mt-1 max-w-[220px] mx-auto text-center">
              Pedigree bloodlines and champions registered
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <span className="font-display text-4xl sm:text-5xl font-extrabold text-[#111111] block tracking-tight">
              95%
            </span>
            <p className="text-xs text-stone-500 mt-1 max-w-[220px] mx-auto text-center">
              Health clearance and 5-star concierge satisfaction
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

