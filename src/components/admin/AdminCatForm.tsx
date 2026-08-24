import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from './AdminLayout';
import { Cat, Category } from '../../types';
import { DEFAULT_CATEGORIES } from '../../data/seedData';
import { normalizeImageUrl, processImageFile, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUtils';
import {
  Save,
  ArrowLeft,
  Award,
  Image as ImageIcon,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
  Link as LinkIcon,
  Sparkles,
  CheckCircle2,
  List,
  PlusCircle,
} from 'lucide-react';

const SAMPLE_CAT_PHOTOS = [
  { label: 'British Shorthair Golden', url: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=1000&q=80' },
  { label: 'British Lilac', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Persian White', url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Maine Coon Silver', url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Ragdoll Blue Point', url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Siamese Seal Point', url: 'https://images.unsplash.com/photo-1513360309081-38f0762b80a6?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Bengal Leopard Rosette', url: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Scottish Fold Blue', url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Sphynx Nude', url: 'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Russian Blue', url: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Exotic Shorthair Fluff', url: 'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=1000&q=80' },
];

export const AdminCatForm: React.FC = () => {
  const { cats, categories, addCat, updateCat, navigate, navParams } = useStore();
  const editCatId = navParams.editCatId;
  const isEditing = !!editCatId;

  const existingCat = cats.find((c) => c.id === editCatId);

  // Form State
  const [formData, setFormData] = useState<Partial<Cat>>({
    name: '',
    cat_id: `CZ-${Math.floor(100 + Math.random() * 900)}`,
    category_id: categories[0]?.id || 'cat-1',
    breed: categories[0]?.name || 'British Shorthair',
    gender: 'Male',
    age: '4 Months',
    date_of_birth: new Date(Date.now() - 4 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    color: 'Golden Shaded (NY11)',
    price: 75000,
    vaccinated: true,
    dewormed: true,
    microchipped: true,
    health_status: 'Fully vaccinated, dewormed, negative for HCM & PKD',
    personality: 'Affectionate, Calm, Playful, Cuddly',
    description: 'An exceptional pedigree kitten with champion lineage, dense plush double coat, and radiant personality.',
    location: 'Bengaluru Sanctuary Nursery',
    main_image: '',
    gallery_images: [],
    is_available: true,
    is_featured: false,
  });

  const [galleryUrlInput, setGalleryUrlInput] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [successPopup, setSuccessPopup] = useState<{
    title: string;
    message: string;
    catName: string;
    catId: string;
    breed: string;
    age: string;
    price: number;
    image: string;
    isNew: boolean;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  // Merge categories from store and defaults to ensure all available breeds are always present
  const availableCategories = useMemo(() => {
    const map = new Map<string, Category>();
    
    // First include DEFAULT_CATEGORIES
    DEFAULT_CATEGORIES.forEach((cat) => {
      map.set(cat.slug || cat.id, cat);
    });

    // Then merge store categories (which can overwrite or add new custom categories)
    categories.forEach((cat) => {
      const key = cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-');
      map.set(key, cat);
    });

    // Also if any cat in cats list has a unique breed not yet in categories, add it
    cats.forEach((c) => {
      if (c.breed) {
        const slug = c.breed.toLowerCase().replace(/\s+/g, '-');
        if (!map.has(slug) && !Array.from(map.values()).some((item) => item.name.toLowerCase() === c.breed.toLowerCase())) {
          map.set(slug, {
            id: c.category_id || `cat-${slug}`,
            name: c.breed,
            slug: slug,
            description: `${c.breed} pedigree breed companion`,
            image_url: c.main_image || '',
            is_active: true,
            display_order: 99,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => (a.display_order || 99) - (b.display_order || 99) || a.name.localeCompare(b.name)
    );
  }, [categories, cats]);

  // Populate if editing
  useEffect(() => {
    if (existingCat) {
      setFormData(existingCat);
    }
  }, [existingCat]);

  // When category changes, auto-fill breed name
  const handleCategoryChange = (categoryId: string) => {
    const selectedCatObj = availableCategories.find(
      (c) => c.id === categoryId || c.slug === categoryId || c.name.toLowerCase() === categoryId.toLowerCase()
    );
    setFormData((prev) => ({
      ...prev,
      category_id: selectedCatObj ? selectedCatObj.id : categoryId,
      breed: selectedCatObj ? selectedCatObj.name : prev.breed,
    }));
  };

  const handleMainImageChange = (rawUrl: string) => {
    const normalized = normalizeImageUrl(rawUrl);
    setFormData((prev) => ({ ...prev, main_image: normalized }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const dataUrl = await processImageFile(file);
      if (isMain) {
        setFormData((prev) => ({ ...prev, main_image: dataUrl }));
      } else {
        setFormData((prev) => ({
          ...prev,
          gallery_images: [...(prev.gallery_images || []), dataUrl],
        }));
      }
    } catch (err) {
      setError('Failed to process image file. Please try another image.');
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.cat_id?.trim()) {
      setError('Please fill in Cat Name and Cat ID.');
      return;
    }

    const cleanedMain = formData.main_image ? normalizeImageUrl(formData.main_image) : '';
    const cleanedGallery = (formData.gallery_images || [])
      .filter(Boolean)
      .map((img) => normalizeImageUrl(img));

    const rawAge = (formData.age || '').trim();
    const formattedAge = (() => {
      if (!rawAge) return '3 Months';
      // If user typed only a number e.g. "4", "5.5", "12"
      if (/^\d+(\.\d+)?$/.test(rawAge)) {
        const n = parseFloat(rawAge);
        return n === 1 ? '1 Month' : `${n} Months`;
      }
      return rawAge;
    })();

    try {
      if (isEditing && editCatId) {
        await updateCat(editCatId, {
          ...formData,
          age: formattedAge,
          main_image: cleanedMain,
          gallery_images: cleanedGallery,
        });
        setSuccessPopup({
          title: 'Successfully updated cat details!',
          message: `The profile details for "${formData.name || 'Pedigree Cat'}" have been successfully saved and updated in the system.`,
          catName: formData.name || 'Pedigree Cat',
          catId: formData.cat_id || 'CZ-Profile',
          breed: formData.breed || 'Pedigree Breed',
          age: formattedAge,
          price: Number(formData.price) || 50000,
          image: cleanedMain || DEFAULT_FALLBACK_IMAGE,
          isNew: false,
        });
      } else {
        const generatedId = formData.cat_id || `CZ-${Math.floor(100 + Math.random() * 900)}`;
        await addCat({
          name: formData.name || 'Pedigree Kitten',
          cat_id: generatedId,
          category_id: formData.category_id || categories[0]?.id,
          breed: formData.breed || 'British Shorthair',
          gender: (formData.gender as 'Male' | 'Female') || 'Male',
          age: formattedAge,
          date_of_birth: formData.date_of_birth || '',
          color: formData.color || 'Solid',
          price: Number(formData.price) || 50000,
          vaccinated: !!formData.vaccinated,
          dewormed: !!formData.dewormed,
          health_status: formData.health_status || 'Clinically vet-verified and microchipped',
          personality: formData.personality || 'Affectionate',
          description: formData.description || 'Verified purebred cattery pedigree companion.',
          location: formData.location || 'Bengaluru Cattery Suite',
          main_image: cleanedMain,
          gallery_images: cleanedGallery,
          is_available: formData.is_available !== undefined ? formData.is_available : true,
          is_featured: !!formData.is_featured,
        });
        setSuccessPopup({
          title: 'Successfully saved the new cat details!',
          message: `The new cat details for "${formData.name || 'Pedigree Kitten'}" (${generatedId}) have been successfully saved to your catalog.`,
          catName: formData.name || 'Pedigree Kitten',
          catId: generatedId,
          breed: formData.breed || 'British Shorthair',
          age: formattedAge,
          price: Number(formData.price) || 50000,
          image: cleanedMain || DEFAULT_FALLBACK_IMAGE,
          isNew: true,
        });
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to save cat. ' + (err.message || ''));
    }
  };

  const addGalleryImage = () => {
    if (galleryUrlInput.trim()) {
      const normalized = normalizeImageUrl(galleryUrlInput.trim());
      setFormData((prev) => ({
        ...prev,
        gallery_images: [...(prev.gallery_images || []), normalized],
      }));
      setGalleryUrlInput('');
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery_images: prev.gallery_images?.filter((_, i) => i !== index),
    }));
  };

  return (
    <AdminLayout
      title={isEditing ? `Edit ${formData.name || 'Cat Profile'}` : 'Register New Pedigree Companion'}
      subtitle="Complete profile specifications, health guarantees, and media assets."
      actionButton={
        <button
          onClick={() => navigate('admin-cats')}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-white border border-purple-100 text-[#191816] text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-purple-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Inventory</span>
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
        
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Identity & Classification */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 border-b border-purple-100 pb-4">
            <Award className="w-5 h-5 text-[#8B5CF6]" />
            <h3 className="text-base font-serif font-bold text-[#191816]">
              1. Feline Identity & Pedigree Classification
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                Cat Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Luna / Aurelius"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                Unique Cat ID *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. CZ-101"
                value={formData.cat_id || ''}
                onChange={(e) => setFormData({ ...formData, cat_id: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm font-mono focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                Breed Category *
              </label>
              <select
                value={
                  availableCategories.find(
                    (c) =>
                      c.id === formData.category_id ||
                      c.slug === formData.category_id ||
                      c.name.toLowerCase() === (formData.breed || '').toLowerCase()
                  )?.id ||
                  formData.category_id ||
                  availableCategories[0]?.id
                }
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm font-semibold text-[#191816] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20 cursor-pointer"
              >
                {availableCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e: any) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                Age *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 4 Months, 8 Months, 1.5 Years"
                value={formData.age || ''}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                Coat Color & Pattern *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Golden Shaded (NY11)"
                value={formData.color || ''}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                Purchase Price (INR ₹) *
              </label>
              <input
                type="number"
                step={1000}
                required
                placeholder="e.g. 75000"
                value={formData.price || 50000}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm font-semibold text-[#8B5CF6] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                Cattery Location *
              </label>
              <input
                type="text"
                placeholder="e.g. Karur Cattery Nursery"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>
          </div>
        </div>

        {/* 2. Health & Certification */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 border-b border-purple-100 pb-4">
            <Check className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-serif font-bold text-[#191816]">
              2. Health Passport & Certification
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center space-x-3 p-4 bg-[#FAF8FF] rounded-2xl border border-purple-100 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.vaccinated}
                onChange={(e) => setFormData({ ...formData, vaccinated: e.target.checked })}
                className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]"
              />
              <span className="text-xs font-semibold text-[#191816]">Fully Vaccinated</span>
            </label>

            <label className="flex items-center space-x-3 p-4 bg-[#FAF8FF] rounded-2xl border border-purple-100 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.dewormed}
                onChange={(e) => setFormData({ ...formData, dewormed: e.target.checked })}
                className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]"
              />
              <span className="text-xs font-semibold text-[#191816]">Dewormed Cycle Complete</span>
            </label>

            <label className="flex items-center space-x-3 p-4 bg-[#FAF8FF] rounded-2xl border border-purple-100 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.microchipped}
                onChange={(e) => setFormData({ ...formData, microchipped: e.target.checked })}
                className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6]"
              />
              <span className="text-xs font-semibold text-[#191816]">ISO Microchipped</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
              Veterinary & Genetic Screen Note
            </label>
            <input
              type="text"
              placeholder="e.g. Fully vaccinated, dewormed, negative for HCM & PKD, microchipped"
              value={formData.health_status || ''}
              onChange={(e) => setFormData({ ...formData, health_status: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
            />
          </div>
        </div>

        {/* 3. Photos & Gallery */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-purple-100 pb-4">
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5 text-[#8B5CF6]" />
              <h3 className="text-base font-display font-bold text-[#191816]">
                3. Photography & Media Assets
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Google Drive, Dropbox, Web URLs & Device Uploads Supported
            </span>
          </div>

          {/* Main Cover Photo Input & Live Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816]">
                Main Cover Photo (URL or File) *
              </label>
              <span className="text-[11px] text-purple-600 font-medium">
                Google Drive links are automatically converted to direct viewable photos
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <LinkIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Paste Google Drive share link, Dropbox link, or image URL..."
                  value={formData.main_image || ''}
                  onChange={(e) => handleMainImageChange(e.target.value)}
                  onBlur={(e) => handleMainImageChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-xs font-mono focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
              </div>

              {/* Hidden file input & upload button */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => handleFileUpload(e, true)}
                className="hidden"
              />
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#8B5CF6] text-xs font-semibold rounded-xl transition shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span>{isUploading ? 'Processing...' : 'Upload from Device'}</span>
              </button>
            </div>

            {/* Live Cover Photo Preview */}
            {formData.main_image ? (
              <div className="flex items-center space-x-4 p-3.5 bg-[#FAF8FF] rounded-2xl border border-purple-100">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 border border-purple-100 shrink-0 relative">
                  <img
                    src={normalizeImageUrl(formData.main_image)}
                    alt="Cover preview"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-semibold text-xs mb-0.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Active Cover Preview</span>
                  </div>
                  <p className="text-[11px] text-stone-500 truncate font-mono">
                    {formData.main_image}
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Tip: Ensure Google Drive files are set to &quot;Anyone with the link can view&quot;.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 p-3.5 bg-[#FAF8FF] rounded-2xl border border-purple-100 border-dashed">
                 <div className="w-20 h-20 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
                    <ImageIcon className="w-6 h-6 text-purple-200" />
                 </div>
                 <div className="flex-1 min-w-0">
                    <p className="text-xs text-stone-500 font-medium">No cover image selected</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">Upload or paste a URL above</p>
                 </div>
              </div>
            )}
          </div>

          {/* Preset Photo Selector */}


          {/* Gallery Images List */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816]">
                Additional Gallery Images
              </label>
              <span className="text-[11px] text-stone-500">
                Multiple photos help adopters view coat details
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text"
                placeholder="Paste Google Drive link or image URL for gallery..."
                value={galleryUrlInput}
                onChange={(e) => setGalleryUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addGalleryImage();
                  }
                }}
                className="flex-1 px-4 py-2 bg-[#FAF8FF] border border-purple-100 rounded-xl text-xs font-mono focus:outline-none focus:border-[#8B5CF6]"
              />
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={addGalleryImage}
                  className="px-4 py-2 bg-[#8B5CF6] text-white rounded-xl text-xs font-semibold hover:bg-[#7C3AED] transition"
                >
                  Add Link
                </button>

                <input
                  type="file"
                  ref={galleryFileInputRef}
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, false)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-[#8B5CF6] rounded-xl text-xs font-semibold transition flex items-center space-x-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
              </div>
            </div>

            {formData.gallery_images && formData.gallery_images.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {formData.gallery_images.map((img, idx) => (
                  <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-purple-100 bg-stone-100 shadow-xs">
                    <img
                      src={normalizeImageUrl(img)}
                      alt="Gallery"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                      }}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. Personality & Bio Description */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
          <h3 className="text-base font-serif font-bold text-[#191816] border-b border-purple-100 pb-4">
            4. Narrative & Character Bio
          </h3>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
              Personality Tags (Comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Affectionate, Calm, Playful, Lap Cat"
              value={formData.personality || ''}
              onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
              Companion Bio & Lineage Story
            </label>
            <textarea
              rows={4}
              placeholder="Describe the kitten's temperament, parental achievements, and home readiness..."
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
            />
          </div>
        </div>

        {/* 5. Instant Status Controls */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-4">
          <h3 className="text-base font-serif font-bold text-[#191816] border-b border-purple-100 pb-4">
            5. Availability & Display Controls
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 p-4 bg-[#FAF8FF] rounded-2xl border border-purple-100 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6] w-5 h-5"
              />
              <div>
                <span className="text-xs font-bold text-[#191816] block">
                  {formData.is_available ? 'Available for Sale (ON)' : 'Marked as Sold Out (OFF)'}
                </span>
                <span className="text-[11px] text-stone-500">
                  When disabled, website displays &ldquo;SOLD OUT&rdquo; badge.
                </span>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-4 bg-[#FAF8FF] rounded-2xl border border-purple-100 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="rounded text-[#8B5CF6] focus:ring-[#8B5CF6] w-5 h-5"
              />
              <div>
                <span className="text-xs font-bold text-[#191816] block">
                  Featured on Homepage Showcase
                </span>
                <span className="text-[11px] text-stone-500">
                  Pin this feline to top homepage sections.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center space-x-4 pt-4">
          <button
            type="submit"
            className="flex-1 py-4 bg-luxury-gradient text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg shadow-purple-500/20 hover:shadow-xl transition flex items-center justify-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Update Cat Profile' : 'Publish to Catalog'}</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('admin-cats')}
            className="px-8 py-4 bg-purple-50 hover:bg-purple-100 text-[#191816] text-xs uppercase tracking-widest font-semibold rounded-full transition"
          >
            Cancel
          </button>
        </div>

      </form>

      {/* Success Popup Modal */}
      {successPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] border border-purple-100 max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl shadow-purple-950/20 text-center animate-in zoom-in-95 duration-200">
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-400/30 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full bg-emerald-400/10 animate-ping" />
              <CheckCircle2 className="w-9 h-9 text-emerald-600 relative z-10" />
            </div>

            {/* Title & Message */}
            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#191816]">
                {successPopup.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed px-2">
                {successPopup.message}
              </p>
            </div>

            {/* Cat Summary Card */}
            <div className="bg-[#FAF8FF] rounded-2xl border border-purple-100/80 p-3.5 flex items-center space-x-3.5 text-left">
              <img
                src={successPopup.image}
                alt={successPopup.catName}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border border-purple-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-serif font-bold text-[#191816] truncate">
                    {successPopup.catName}
                  </h4>
                  <span className="text-[11px] font-mono text-purple-700 font-semibold shrink-0">
                    {successPopup.catId}
                  </span>
                </div>
                <p className="text-xs text-stone-500 truncate mt-0.5">
                  {successPopup.breed} · {successPopup.age}
                </p>
                <p className="text-xs font-bold text-[#8B5CF6] mt-0.5">
                  ₹{successPopup.price.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setSuccessPopup(null);
                  navigate('admin-cats');
                }}
                className="w-full py-3.5 bg-luxury-gradient text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-md shadow-purple-500/20 hover:shadow-lg transition flex items-center justify-center space-x-2"
              >
                <List className="w-4 h-4" />
                <span>View in Inventory</span>
              </button>

              {successPopup.isNew ? (
                <button
                  type="button"
                  onClick={() => {
                    setSuccessPopup(null);
                    setFormData({
                      name: '',
                      cat_id: `CZ-${Math.floor(100 + Math.random() * 900)}`,
                      category_id: categories[0]?.id || 'cat-1',
                      breed: categories[0]?.name || 'British Shorthair',
                      gender: 'Male',
                      age: '4 Months',
                      date_of_birth: new Date().toISOString().split('T')[0],
                      color: '',
                      price: 60000,
                      vaccinated: true,
                      dewormed: true,
                      health_status: 'Clinically vet-verified, vaccinated & microchipped',
                      personality: 'Affectionate & Playful',
                      description: '',
                      location: 'Bengaluru Sanctuary Nursery',
                      main_image: '',
                      gallery_images: [],
                      is_available: true,
                      is_featured: false,
                    });
                  }}
                  className="w-full py-3.5 bg-purple-50 hover:bg-purple-100 text-[#191816] text-xs uppercase tracking-widest font-semibold rounded-full transition flex items-center justify-center space-x-2 border border-purple-100"
                >
                  <PlusCircle className="w-4 h-4 text-[#8B5CF6]" />
                  <span>Add Another Cat</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setSuccessPopup(null)}
                  className="w-full py-3.5 bg-purple-50 hover:bg-purple-100 text-[#191816] text-xs uppercase tracking-widest font-semibold rounded-full transition border border-purple-100"
                >
                  Stay on Page
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
