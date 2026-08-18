import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from './AdminLayout';
import { Cat } from '../../types';
import { normalizeImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUtils';
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Filter,
  Check,
  Star,
  RotateCcw,
  AlertTriangle,
} from 'lucide-react';

export const AdminCatsList: React.FC = () => {
  const { cats, categories, deleteCat, toggleAvailability, toggleFeatured, navigate } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'available' | 'sold'>('all');
  const [catToDelete, setCatToDelete] = useState<Cat | null>(null);

  const filteredCats = useMemo(() => {
    return cats.filter((cat) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = cat.name.toLowerCase().includes(q);
        const matchBreed = cat.breed.toLowerCase().includes(q);
        const matchId = cat.cat_id.toLowerCase().includes(q);
        const matchColor = cat.color.toLowerCase().includes(q);
        if (!matchName && !matchBreed && !matchId && !matchColor) return false;
      }

      if (selectedCategory !== 'all' && cat.category_id !== selectedCategory) {
        return false;
      }

      if (availabilityFilter === 'available' && !cat.is_available) return false;
      if (availabilityFilter === 'sold' && cat.is_available) return false;

      return true;
    });
  }, [cats, searchQuery, selectedCategory, availabilityFilter]);

  const handleDeleteConfirm = () => {
    if (catToDelete) {
      deleteCat(catToDelete.id);
      setCatToDelete(null);
    }
  };

  return (
    <AdminLayout
      title="Pedigree Feline Inventory"
      subtitle="Manage cat profiles, health certifications, pedigree lineage, and instant public availability status."
      actionButton={
        <button
          onClick={() => navigate('admin-cat-new')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-luxury-gradient text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-md shadow-purple-500/20 hover:shadow-lg transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Cat</span>
        </button>
      }
    >
      <div className="space-y-6 max-w-7xl">
        
        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by cat name, breed, ID (e.g. CZ-101), or color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAF8FF] border border-purple-100 rounded-xl text-xs text-[#191816] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
            />
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-[#FAF8FF] border border-purple-100 rounded-xl text-xs font-semibold text-[#191816] focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="all">All Breeds ({cats.length})</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({cats.filter((item) => item.category_id === c.id).length})
                </option>
              ))}
            </select>

            {/* Availability Filter */}
            <select
              value={availabilityFilter}
              onChange={(e: any) => setAvailabilityFilter(e.target.value)}
              className="px-3 py-2 bg-[#FAF8FF] border border-purple-100 rounded-xl text-xs font-semibold text-[#191816] focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="all">All Statuses</option>
              <option value="available">Available in Cattery</option>
              <option value="sold">Sold Out / Adopted</option>
            </select>
          </div>
        </div>

        {/* Cats Table */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-purple-100 flex items-center justify-between">
            <p className="text-xs text-stone-500">
              Showing <strong className="text-[#191816]">{filteredCats.length}</strong> of{' '}
              <strong className="text-[#191816]">{cats.length}</strong> pedigree cats
            </p>
          </div>

          {filteredCats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8FF] border-b border-purple-100 text-stone-500 uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-6">Companion</th>
                    <th className="py-3 px-4">Category / Breed</th>
                    <th className="py-3 px-4">Gender & Age</th>
                    <th className="py-3 px-4">Fee (INR)</th>
                    <th className="py-3 px-4">Health & Shots</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4">Instant Availability</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  {filteredCats.map((cat) => {
                    const categoryObj = categories.find((c) => c.id === cat.category_id);
                    return (
                      <tr key={cat.id} className="hover:bg-purple-50/30 transition">
                        {/* Companion Column */}
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={normalizeImageUrl(cat.main_image)}
                              alt={cat.name}
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                              }}
                              className="w-12 h-12 rounded-xl object-cover border border-purple-100 shrink-0"
                            />
                            <div>
                              <p className="font-serif font-bold text-sm text-[#191816]">{cat.name}</p>
                              <p className="text-[10px] text-stone-500 font-mono">{cat.cat_id} · {cat.color}</p>
                            </div>
                          </div>
                        </td>

                        {/* Category Column */}
                        <td className="py-4 px-4">
                          <span className="font-semibold text-[#191816] block">{categoryObj?.name || cat.breed}</span>
                          <span className="text-[10px] text-stone-500">{cat.location}</span>
                        </td>

                        {/* Gender & Age */}
                        <td className="py-4 px-4 text-stone-600">
                          <span className="font-medium text-[#191816] block">{cat.gender}</span>
                          <span className="text-[11px]">{cat.age_months} Months</span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-4">
                          <span className="font-bold text-sm text-[#8B5CF6] font-serif">
                            ₹{cat.price.toLocaleString('en-IN')}
                          </span>
                        </td>

                        {/* Health Status */}
                        <td className="py-4 px-4">
                          <div className="space-y-1">
                            <span
                              className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                cat.vaccinated
                                  ? 'bg-emerald-50 text-emerald-800'
                                  : 'bg-amber-50 text-amber-800'
                              }`}
                            >
                              {cat.vaccinated ? 'Vaccinated' : 'Pending Shots'}
                            </span>
                            {cat.dewormed && (
                              <span className="block text-[9px] text-stone-500">Dewormed</span>
                            )}
                          </div>
                        </td>

                        {/* Featured Toggle */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => toggleFeatured(cat.id)}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                              cat.is_featured
                                ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                                : 'text-stone-300 hover:text-stone-500'
                            }`}
                            title="Toggle Homepage Featured"
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </td>

                        {/* INSTANT AVAILABILITY TOGGLE BUTTON */}
                        <td className="py-4 px-4">
                          <button
                            onClick={() => toggleAvailability(cat.id)}
                            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                              cat.is_available
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                                : 'bg-stone-100 text-stone-600 border border-stone-300 hover:bg-stone-200'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                cat.is_available ? 'bg-emerald-600 animate-pulse' : 'bg-stone-400'
                              }`}
                            />
                            <span>{cat.is_available ? 'AVAILABLE [ON]' : 'SOLD OUT [OFF]'}</span>
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => navigate('cat-detail', { catId: cat.id })}
                            className="p-2 text-stone-500 hover:text-[#8B5CF6] hover:bg-purple-50 rounded-lg transition"
                            title="Preview Public Page"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate('admin-cat-edit', { editCatId: cat.id })}
                            className="p-2 text-[#8B5CF6] hover:text-[#7C3AED] hover:bg-purple-50 rounded-lg transition"
                            title="Edit Cat Profile"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setCatToDelete(cat)}
                            className="p-2 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Cat"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm font-semibold text-[#191816]">No cats match your filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setAvailabilityFilter('all');
                }}
                className="text-xs text-[#8B5CF6] underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {catToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-purple-100 max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-serif font-bold text-[#191816]">
                Remove Feline Profile?
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently delete <strong>{catToDelete.name}</strong> ({catToDelete.cat_id}) from the database? This action cannot be undone.
            </p>

            <div className="flex items-center space-x-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setCatToDelete(null)}
                className="px-5 py-2.5 bg-purple-50 text-stone-700 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-purple-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold uppercase tracking-wider shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
