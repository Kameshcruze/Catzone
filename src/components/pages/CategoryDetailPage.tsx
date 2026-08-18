import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CatCard } from '../cats/CatCard';
import { CatDetailsModal } from '../cats/CatDetailsModal';
import { Cat } from '../../types';
import { ArrowLeft, AlertCircle, ShieldCheck, Heart } from 'lucide-react';

export const CategoryDetailPage: React.FC = () => {
  const { navParams, navigate, categories, cats, getAvailableCountByCategory } = useStore();
  const slug = navParams.categorySlug;

  const category = categories.find(
    (c) => c.slug.toLowerCase() === slug?.toLowerCase() || c.id === slug
  );

  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center mb-4 border border-purple-100">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-display font-bold text-[#191816] mb-3">
          Breed Category Not Found
        </h2>
        <p className="text-stone-600 text-sm mb-6">
          The breed you selected is not currently cataloged.
        </p>
        <button
          onClick={() => navigate('categories')}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg shadow-purple-500/25 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Breeds</span>
        </button>
      </div>
    );
  }

  const categoryCats = cats.filter((c) => c.category_id === category.id || c.breed.toLowerCase() === category.name.toLowerCase());
  const availableCount = getAvailableCountByCategory(category.id);

  const displayedCats = filterAvailableOnly
    ? categoryCats.filter((c) => c.is_available)
    : categoryCats;

  return (
    <div className="bg-[#FAF8FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <div className="mb-6">
          <button
            onClick={() => navigate('categories')}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-stone-600 hover:text-[#8B5CF6] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Breeds</span>
          </button>
        </div>

        {/* Breed Hero Header Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white mb-12 shadow-xl border border-purple-900/30">
          <div className="relative aspect-16/7 sm:aspect-21/9 w-full overflow-hidden">
            <img
              src={category.image_url}
              alt={category.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent" />

            <div className="absolute inset-0 p-6 sm:p-12 flex flex-col justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-white/20 backdrop-blur-md">
                  Pedigree Category
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/30 text-emerald-300 border border-emerald-500/40">
                  {availableCount} Available Now
                </span>
              </div>

              <div className="max-w-2xl">
                <h1 className="text-4xl sm:text-6xl font-display font-bold text-white mb-3 tracking-tight">
                  {category.name}
                </h1>
                <p className="text-sm sm:text-base text-stone-200 leading-relaxed">
                  {category.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-5 rounded-2xl border border-purple-100 shadow-sm">
          <div>
            <h3 className="text-lg font-display font-bold text-[#191816]">
              {category.name} Companions ({displayedCats.length})
            </h3>
            <p className="text-xs text-stone-500">
              Showing pedigree cats registered under {category.name}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 text-xs font-semibold text-[#191816] cursor-pointer">
              <input
                type="checkbox"
                checked={filterAvailableOnly}
                onChange={(e) => setFilterAvailableOnly(e.target.checked)}
                className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]"
              />
              <span>Available Only</span>
            </label>
          </div>
        </div>

        {/* Cats Grid */}
        {displayedCats.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedCats.map((cat) => (
              <CatCard
                key={cat.id}
                cat={cat}
                onOpenDetails={(c) => setSelectedCat(c)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-purple-100 p-12 text-center space-y-4 shadow-sm">
            <h3 className="text-2xl font-display font-bold text-[#191816]">
              No Companions Available Under This Filter
            </h3>
            <p className="text-xs text-stone-600">
              All current {category.name} kittens may be temporarily reserved. Please contact our concierge to get notified of the next litter.
            </p>
            <button
              onClick={() => setFilterAvailableOnly(false)}
              className="px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs uppercase tracking-wider font-semibold rounded-full shadow-lg shadow-purple-500/25 transition"
            >
              Show All {category.name} Cats
            </button>
          </div>
        )}

      </div>

      <CatDetailsModal
        cat={selectedCat}
        isOpen={!!selectedCat}
        onClose={() => setSelectedCat(null)}
      />
    </div>
  );
};
