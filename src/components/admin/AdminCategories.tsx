import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from './AdminLayout';
import { Category } from '../../types';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const {
    categories,
    cats,
    addCategory,
    updateCategory,
    deleteCategory,
    getAvailableCountByCategory,
    getTotalCountByCategory,
  } = useStore();

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
    is_active: true,
  });

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image_url: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=1000&q=80',
      is_active: true,
    });
    setIsCreating(true);
    setEditingCategory(null);
  };

  const handleOpenEdit = (cat: Category) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image_url: cat.image_url,
      is_active: cat.is_active,
    });
    setEditingCategory(cat);
    setIsCreating(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const slug =
      formData.slug.trim() ||
      formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: formData.name,
          slug,
          description: formData.description,
          image_url: formData.image_url,
          is_active: formData.is_active,
        });
        setEditingCategory(null);
      } else {
        await addCategory({
          name: formData.name,
          slug,
          description: formData.description,
          image_url: formData.image_url,
          is_active: formData.is_active,
        });
        setIsCreating(false);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save category.');
    }
  };

  return (
    <AdminLayout
      title="Pedigree Breed Categories"
      subtitle="Manage registered breed classifications, cover photography, and public taxonomy."
      actionButton={
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-luxury-gradient text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-md shadow-purple-500/20 hover:shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Breed</span>
        </button>
      }
    >
      <div className="space-y-6 max-w-7xl">
        
        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const available = getAvailableCountByCategory(cat.id);
            const total = getTotalCountByCategory(cat.id);

            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl overflow-hidden border border-purple-100 shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="relative aspect-16/9 w-full bg-stone-200 overflow-hidden">
                    <img
                      src={cat.image_url}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 flex items-center space-x-2">
                      <span className="px-2.5 py-1 bg-white/90 backdrop-blur-xs text-[#191816] rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {available} Available / {total} Total
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-serif font-bold text-[#191816]">
                        {cat.name}
                      </h3>
                      <span className="text-[11px] font-mono text-stone-500">
                        /{cat.slug}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-purple-100 bg-[#FAF8FF] flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    cat.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                  }`}>
                    {cat.is_active ? 'Active' : 'Hidden'}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 text-[#8B5CF6] hover:text-[#7C3AED] hover:bg-purple-100/50 rounded-lg transition"
                      title="Edit Breed"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCategoryToDelete(cat)}
                      className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Breed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Create / Edit Category Modal */}
      {(isCreating || editingCategory) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-purple-100 max-w-lg w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <h3 className="text-lg font-serif font-bold text-[#191816]">
                {editingCategory ? `Edit ${editingCategory.name}` : 'Add Pedigree Breed Category'}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setEditingCategory(null);
                }}
                className="p-1 text-stone-400 hover:text-[#191816]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                  Breed Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scottish Fold"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                  URL Slug (Auto-generated if empty)
                </label>
                <input
                  type="text"
                  placeholder="e.g. scottish-fold"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-[#FAF8FF] border border-purple-100 rounded-xl text-xs font-mono focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                  Cover Photo URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-2 bg-[#FAF8FF] border border-purple-100 rounded-xl text-xs font-mono focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                  Breed Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe temperament, origins, and physical characteristics..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="catActive"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]"
                />
                <label htmlFor="catActive" className="text-xs font-semibold text-[#191816] cursor-pointer">
                  Visible in public breed discovery
                </label>
              </div>

              <div className="flex items-center space-x-3 justify-end pt-4 border-t border-purple-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingCategory(null);
                  }}
                  className="px-5 py-2.5 bg-purple-50 text-[#191816] rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-purple-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-luxury-gradient text-white rounded-full text-xs font-semibold uppercase tracking-wider shadow-md shadow-purple-500/20 hover:shadow-lg transition"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-purple-100 max-w-md w-full p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center space-x-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-serif font-bold text-[#191816]">
                Delete Breed Category?
              </h3>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to remove <strong>{categoryToDelete.name}</strong>? Cats currently assigned to this category will retain their breed name but will no longer link to this category ID.
            </p>

            <div className="flex items-center space-x-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-5 py-2.5 bg-purple-50 text-[#191816] rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-purple-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteCategory(categoryToDelete.id);
                  setCategoryToDelete(null);
                }}
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
