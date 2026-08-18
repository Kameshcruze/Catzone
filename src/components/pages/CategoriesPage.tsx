import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Compass } from 'lucide-react';

export const CategoriesPage: React.FC = () => {
  const { categories, getAvailableCountByCategory, getTotalCountByCategory, navigate } = useStore();

  return (
    <div className="bg-[#FAF8FF] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#7C3AED] text-xs font-semibold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>PEDIGREE BREEDS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-[#191816] tracking-tight">
            Explore All Feline Breeds
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-3 leading-relaxed">
            Discover the unique personalities, coat textures, and royal heritages of each certified breed in our cattery network.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat) => {
            const availableCount = getAvailableCountByCategory(cat.id);
            const totalCount = getTotalCountByCategory(cat.id);

            return (
              <div
                key={cat.id}
                onClick={() => navigate('category-detail', { categorySlug: cat.slug })}
                className="group bg-white rounded-3xl overflow-hidden border border-purple-100/70 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-stone-200">
                  <img
                    src={cat.image_url}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/90 text-[#191816] backdrop-blur-xs shadow-xs">
                      {availableCount > 0 ? `${availableCount} Available Now` : 'Waitlist / Litter Planning'}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="text-2xl sm:text-3xl font-display font-bold">
                      {cat.name}
                    </h2>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {cat.description}
                  </p>

                  <div className="pt-4 border-t border-purple-100/60 flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-medium">
                      {totalCount} registered {totalCount === 1 ? 'companion' : 'companions'}
                    </span>
                    <div className="inline-flex items-center space-x-1 text-xs font-semibold uppercase tracking-wider text-[#8B5CF6] group-hover:text-[#7C3AED] group-hover:translate-x-0.5 transition-transform">
                      <span>View {cat.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
