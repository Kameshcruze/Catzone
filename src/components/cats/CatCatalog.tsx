import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Cat, Category } from '../../types';
import { CatCard } from './CatCard';
import { CatDetailsModal } from './CatDetailsModal';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  Filter,
  Check,
  RotateCcw,
  Tag,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export const CatCatalog: React.FC = () => {
  const { cats, categories, navParams } = useStore();

  // Selected cat for modal
  const [selectedCat, setSelectedCat] = useState<Cat | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(navParams.selectedCategory || 'all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Male' | 'Female'>('all');
  const [vaccinationFilter, setVaccinationFilter] = useState<'all' | 'vaccinated'>('all');
  const [priceRange, setPriceRange] = useState<number>(150000);
  const [sortBy, setSortBy] = useState<
    'available-first' | 'price-low' | 'price-high' | 'newest' | 'featured'
  >('available-first');

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Drag to scroll ref & states for desktop swipe
  const pillContainerRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!pillContainerRef.current) return;
    setIsMouseDown(true);
    setHasDragged(false);
    setStartX(e.pageX - pillContainerRef.current.offsetLeft);
    setScrollLeftState(pillContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsMouseDown(false);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !pillContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - pillContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    if (Math.abs(x - startX) > 4) {
      setHasDragged(true);
    }
    pillContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!pillContainerRef.current) return;
    if (e.deltaY !== 0) {
      pillContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  const scrollPills = (direction: 'left' | 'right') => {
    if (!pillContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -260 : 260;
    pillContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  // Sync category param from navigation
  useEffect(() => {
    if (navParams.selectedCategory) {
      setSelectedCategory(navParams.selectedCategory);
    }
  }, [navParams.selectedCategory]);

  const activeCategoryObj = categories.find((c) => c.id === selectedCategory || c.slug === selectedCategory);

  // Filter and Sort Cats
  const filteredCats = useMemo(() => {
    return cats
      .filter((cat) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = cat.name.toLowerCase().includes(q);
          const matchBreed = cat.breed.toLowerCase().includes(q);
          const matchColor = cat.color.toLowerCase().includes(q);
          const matchId = cat.cat_id.toLowerCase().includes(q);
          const matchLocation = cat.location.toLowerCase().includes(q);
          if (!matchName && !matchBreed && !matchColor && !matchId && !matchLocation) {
            return false;
          }
        }

        // Category
        if (selectedCategory !== 'all') {
          const catCategory = categories.find((c) => c.id === cat.category_id);
          const matchById = cat.category_id === selectedCategory;
          const matchBySlug = catCategory?.slug === selectedCategory;
          if (!matchById && !matchBySlug) {
            return false;
          }
        }

        // Availability
        if (availabilityFilter === 'available' && !cat.is_available) return false;
        if (availabilityFilter === 'sold' && cat.is_available) return false;

        // Gender
        if (genderFilter !== 'all' && cat.gender !== genderFilter) return false;

        // Vaccination
        if (vaccinationFilter === 'vaccinated' && !cat.vaccinated) return false;

        // Price
        if (cat.price > priceRange) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'available-first') {
          if (a.is_available && !b.is_available) return -1;
          if (!a.is_available && b.is_available) return 1;
          return b.is_featured ? 1 : -1;
        }
        if (sortBy === 'featured') {
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
        }
        if (sortBy === 'price-low') {
          return a.price - b.price;
        }
        if (sortBy === 'price-high') {
          return b.price - a.price;
        }
        if (sortBy === 'newest') {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
      });
  }, [
    cats,
    categories,
    searchQuery,
    selectedCategory,
    availabilityFilter,
    genderFilter,
    vaccinationFilter,
    priceRange,
    sortBy,
  ]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setAvailabilityFilter('all');
    setGenderFilter('all');
    setVaccinationFilter('all');
    setPriceRange(150000);
    setSortBy('available-first');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    availabilityFilter !== 'all' ||
    genderFilter !== 'all' ||
    vaccinationFilter !== 'all' ||
    priceRange < 150000;

  return (
    <div className="bg-[#FAF8FF] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#7C3AED] text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Curated Pedigree Inventory</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-[#191816] tracking-tight">
            Discover Your Companion
          </h1>
          <p className="text-sm text-stone-600 mt-3 leading-relaxed">
            Browse our verified pedigree kittens and cats. Each companion is clinically vet-checked, microchipped, and nurtured in cage-free nursery suites.
          </p>
        </div>

        {/* Search & Top Controls */}
        <div className="bg-white rounded-2xl border border-purple-100 p-4 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, breed, color, location or ID (e.g. Luna, British, CZ-101)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm text-[#191816] placeholder:text-stone-400 focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#191816]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 w-full md:w-auto shrink-0 justify-between md:justify-start">
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4 text-stone-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="px-3 py-2 bg-[#FAF8FF] border border-purple-100 rounded-xl text-xs font-semibold text-[#191816] focus:outline-none focus:border-[#8B5CF6]"
                >
                  <option value="available-first">Available First</option>
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Additions</option>
                </select>
              </div>

              {/* Mobile Filter Trigger */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="md:hidden inline-flex items-center space-x-1.5 px-3 py-2 bg-purple-50 text-purple-900 rounded-xl text-xs font-semibold border border-purple-100"
              >
                <Filter className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Filters {hasActiveFilters && '•'}</span>
              </button>
            </div>
          </div>

          {/* Quick Categories Filter Pills with Desktop Swiping, Drag-to-Scroll & Arrows */}
          <div className="relative group/pills pt-4 mt-3 border-t border-purple-100/60">
            {/* Desktop Left Scroll Button */}
            <button
              type="button"
              onClick={() => scrollPills('left')}
              aria-label="Scroll left"
              className="hidden md:flex absolute -left-2 top-1/2 mt-1 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 border border-purple-200 text-stone-700 hover:text-[#8B5CF6] hover:border-[#8B5CF6] items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={pillContainerRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
              onWheel={handleWheel}
              className={`flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none select-none scroll-smooth ${
                isMouseDown ? 'cursor-grabbing' : 'cursor-grab md:cursor-pointer'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  if (!hasDragged) setSelectedCategory('all');
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-500/25 ring-2 ring-[#8B5CF6]/30'
                    : 'bg-white border border-purple-100 text-stone-700 hover:text-[#8B5CF6] hover:border-purple-300'
                }`}
              >
                All Breeds ({cats.length})
              </button>
              {categories.map((cat) => {
                const count = cats.filter((c) => c.category_id === cat.id).length;
                const isSelected = selectedCategory === cat.id || selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      if (!hasDragged) setSelectedCategory(cat.id);
                    }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-200 shrink-0 ${
                      isSelected
                        ? 'bg-[#8B5CF6] text-white shadow-md shadow-purple-500/25 ring-2 ring-[#8B5CF6]/30'
                        : 'bg-white border border-purple-100 text-stone-700 hover:text-[#8B5CF6] hover:border-purple-300'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Desktop Right Scroll Button */}
            <button
              type="button"
              onClick={() => scrollPills('right')}
              aria-label="Scroll right"
              className="hidden md:flex absolute -right-2 top-1/2 mt-1 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 border border-purple-200 text-stone-700 hover:text-[#8B5CF6] hover:border-[#8B5CF6] items-center justify-center shadow-md transition-all opacity-80 hover:opacity-100 hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Grid with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 bg-white rounded-2xl border border-purple-100 p-6 space-y-6 sticky top-24 shadow-sm">
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div className="flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-[#8B5CF6]" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#191816]">
                  Refine Search
                </h3>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="text-[11px] font-semibold text-[#8B5CF6] hover:underline flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2.5">
                Availability Status
              </label>
              <div className="space-y-1.5">
                {[
                  { value: 'all', label: 'All Companions' },
                  { value: 'available', label: 'Available Only (In Cattery)' },
                  { value: 'sold', label: 'Sold Out' },
                ].map((item) => (
                  <label
                    key={item.value}
                    className="flex items-center space-x-2.5 text-xs text-[#191816] cursor-pointer hover:text-[#8B5CF6] transition py-0.5"
                  >
                    <input
                      type="radio"
                      name="availability"
                      checked={availabilityFilter === item.value}
                      onChange={() => setAvailabilityFilter(item.value as any)}
                      className="text-[#8B5CF6] focus:ring-[#8B5CF6]"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2.5">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['all', 'Male', 'Female'].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setGenderFilter(gender as any)}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border transition ${
                      genderFilter === gender
                        ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-xs'
                        : 'bg-[#FAF8FF] text-stone-700 border-purple-100 hover:text-[#191816]'
                    }`}
                  >
                    {gender === 'all' ? 'All' : gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                <span>Max Fee</span>
                <span className="text-[#8B5CF6] font-bold">₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={6000}
                max={150000}
                step={1000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#8B5CF6] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-1 font-mono">
                <span>₹6,000</span>
                <span>₹1,50,000</span>
              </div>
            </div>

            {/* Vaccination */}
            <div>
              <label className="flex items-center space-x-2.5 text-xs text-[#191816] cursor-pointer">
                <input
                  type="checkbox"
                  checked={vaccinationFilter === 'vaccinated'}
                  onChange={(e) => setVaccinationFilter(e.target.checked ? 'vaccinated' : 'all')}
                  className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
                <span className="font-semibold">Fully Vaccinated Only</span>
              </label>
            </div>
          </aside>

          {/* Results Grid (9 cols) */}
          <main className="lg:col-span-9 space-y-6">
            {/* Active Filters Bar & Count */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
              <p>
                Showing <strong className="text-[#191816]">{filteredCats.length}</strong> of{' '}
                <strong className="text-[#191816]">{cats.length}</strong> pedigree companions
              </p>

              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-50 text-[#191816] text-[11px] font-medium border border-purple-100">
                      <span>Breed: {activeCategoryObj?.name || selectedCategory}</span>
                      <button onClick={() => setSelectedCategory('all')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {availabilityFilter !== 'all' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-50 text-[#191816] text-[11px] font-medium border border-purple-100">
                      <span>{availabilityFilter === 'available' ? 'Available' : 'Sold Out'}</span>
                      <button onClick={() => setAvailabilityFilter('all')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {genderFilter !== 'all' && (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-50 text-[#191816] text-[11px] font-medium border border-purple-100">
                      <span>{genderFilter}</span>
                      <button onClick={() => setGenderFilter('all')}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={resetAllFilters}
                    className="text-[11px] font-semibold text-[#8B5CF6] hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {/* Cards Grid */}
            {filteredCats.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCats.map((cat) => (
                  <CatCard
                    key={cat.id}
                    cat={cat}
                    onOpenDetails={(c) => setSelectedCat(c)}
                  />
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="bg-white rounded-3xl border border-purple-100 p-12 text-center space-y-4 shadow-sm">
                <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 mx-auto flex items-center justify-center border border-purple-100">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display font-bold text-[#191816]">
                  No Companions Match Your Criteria
                </h3>
                <p className="text-sm text-stone-600 max-w-md mx-auto">
                  Try clearing some filters or searching with different keywords such as breed name, color, or city.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg shadow-purple-500/25 transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 space-y-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <h3 className="text-base font-display font-bold text-[#191816]">
                Filter Companions
              </h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-stone-500 hover:text-[#191816]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Availability
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'all', label: 'All' },
                  { value: 'available', label: 'Available' },
                  { value: 'sold', label: 'Sold Out' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setAvailabilityFilter(item.value as any)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition ${
                      availabilityFilter === item.value
                        ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-xs'
                        : 'bg-[#FAF8FF] text-stone-700 border-purple-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                Gender
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['all', 'Male', 'Female'].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => setGenderFilter(gender as any)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition ${
                      genderFilter === gender
                        ? 'bg-[#8B5CF6] text-white border-[#8B5CF6] shadow-xs'
                        : 'bg-[#FAF8FF] text-stone-700 border-purple-100'
                    }`}
                  >
                    {gender === 'all' ? 'All' : gender}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Fee */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                <span>Max Fee</span>
                <span className="text-[#8B5CF6] font-bold">₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={6000}
                max={150000}
                step={1000}
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#8B5CF6]"
              />
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={resetAllFilters}
                className="flex-1 py-3 bg-purple-50 text-[#191816] rounded-xl text-xs font-semibold uppercase tracking-wider border border-purple-100 hover:bg-purple-100 transition"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-md shadow-purple-500/20 transition"
              >
                Show Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cat Details Modal */}
      <CatDetailsModal
        cat={selectedCat}
        isOpen={!!selectedCat}
        onClose={() => setSelectedCat(null)}
      />
    </div>
  );
};
