import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CatCard } from '../cats/CatCard';
import { CatDetailsModal } from '../cats/CatDetailsModal';
import { Cat } from '../../types';
import { ArrowUpRight } from 'lucide-react';

export const AvailableNowSection: React.FC = () => {
  const { cats, categories, navigate } = useStore();
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [filterBreed, setFilterBreed] = useState<string>('all');

  // Top cats to show on homepage: prioritize featured and available
  const displayCats = cats
    .filter((c) => {
      if (filterBreed === 'all') return true;
      return c.category_id === filterBreed || c.breed.toLowerCase().includes(filterBreed.toLowerCase());
    })
    .sort((a, b) => {
      if (a.is_available && !b.is_available) return -1;
      if (!a.is_available && b.is_available) return 1;
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
    })
    .slice(0, 8);

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Section Header (Exact Modulive Style) */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-[#111111] tracking-tight">
            Our Best Quality Companions
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-2">
            Hand-selected, DNA-tested kittens with complete pedigree documentation.
          </p>
        </div>

        {/* Centered Filter Pills (Exact Modulive Style: All, Chair, Cabinet, Sofa, Bed -> All, British Shorthair, Persian, etc.) */}
        <div
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
          className="flex items-center justify-start sm:justify-center space-x-2 overflow-x-auto pb-4 mb-10 scrollbar-none px-2 scroll-smooth"
        >
          <button
            onClick={() => setFilterBreed('all')}
            className={`px-5 py-2 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all duration-150 shrink-0 ${
              filterBreed === 'all'
                ? 'bg-[#111111] text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-300 hover:border-black hover:text-black'
            }`}
          >
            All
          </button>
          {categories.slice(0, 6).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterBreed(cat.id)}
              className={`px-5 py-2 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-150 shrink-0 ${
                filterBreed === cat.id
                  ? 'bg-[#111111] text-white shadow-sm font-semibold'
                  : 'bg-white text-stone-600 border border-stone-300 hover:border-black hover:text-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid (Rumpi Chair, Romp Toll, Almirah Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayCats.map((cat) => (
            <CatCard
              key={cat.id}
              cat={cat}
              onOpenDetails={(c) => setSelectedCat(c)}
            />
          ))}
        </div>

        {/* Bottom Centered CTA */}
        <div className="mt-14 text-center">
          <button
            onClick={() => navigate('cats')}
            className="inline-flex items-center space-x-2 px-7 py-3.5 bg-[#111111] hover:bg-black text-white text-xs font-semibold tracking-wide rounded-full shadow-md transition duration-200 hover:scale-105"
          >
            <span>Explore All {cats.length} Companions</span>
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>

      </div>

      {/* Cat Details Modal */}
      <CatDetailsModal
        cat={selectedCat}
        isOpen={!!selectedCat}
        onClose={() => setSelectedCat(null)}
      />
    </section>
  );
};

