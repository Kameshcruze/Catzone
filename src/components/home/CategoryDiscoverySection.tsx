import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Compass } from 'lucide-react';

export const CategoryDiscoverySection: React.FC = () => {
  const { categories, getAvailableCountByCategory, navigate } = useStore();

  const activeCategories = categories.filter((c) => c.is_active);

  return (
    <section className="py-20 bg-gradient-to-b from-[#FAF8FF] to-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#7C3AED] font-semibold mb-2 flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>BREED DISCOVERY</span>
            </p>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#111111] tracking-tight">
              Explore by Pedigree Breed
            </h2>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-xl">
              From gentle giant Maine Coons to serene British Shorthairs and athletic Bengals — find the ideal match for your home atmosphere.
            </p>
          </div>

          <button
            onClick={() => navigate('categories')}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-[#7C3AED] hover:text-[#5B21B6] transition"
          >
            <span>All 10 Pedigree Breeds</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {activeCategories.map((cat, idx) => {
            const availableCount = getAvailableCountByCategory(cat.id);
            // Highlight the first two as larger featured cards
            const isLarge = idx === 0 || idx === 1;

            return (
              <div
                key={cat.id}
                onClick={() => navigate('category-detail', { categorySlug: cat.slug })}
                className={`group relative bg-white rounded-3xl overflow-hidden border border-purple-100/80 cursor-pointer shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between ${
                  isLarge ? 'md:col-span-1 lg:col-span-2' : ''
                }`}
              >
                {/* Image Wrap */}
                <div className={`relative w-full overflow-hidden bg-stone-100 ${isLarge ? 'aspect-16/9 sm:aspect-2/1' : 'aspect-4/3'}`}>
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F071D]/80 via-black/20 to-transparent" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/95 text-[#111111] backdrop-blur-xs shadow-xs">
                      {availableCount > 0 ? `${availableCount} Available` : 'Upcoming Litter'}
                    </span>
                  </div>

                  {/* Title on Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-2xl sm:text-3xl font-display font-bold">
                      {cat.name}
                    </h3>
                  </div>
                </div>

                {/* Card Content Footer */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-[#FAF8FF]">
                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
                    {cat.description}
                  </p>

                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#7C3AED] pt-3 border-t border-purple-100/60 group-hover:translate-x-0.5 transition-transform">
                    <span>Explore {cat.name} Cats</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
