import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { WhatsAppCheckoutModal } from '../checkout/WhatsAppCheckoutModal';
import { CatCard } from './CatCard';
import { normalizeImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUtils';
import {
  ArrowLeft,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Heart,
  ChevronLeft,
  ChevronRight,
  Share2,
  AlertCircle,
  Truck,
  Award,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

export const CatDetailPage: React.FC = () => {
  const { navParams, navigate, cats, categories } = useStore();
  const catId = navParams.catId;
  const cat = cats.find((c) => c.id === catId || c.cat_id.toLowerCase() === catId?.toLowerCase());

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!cat) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-purple-50 text-stone-500 mx-auto flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-display font-bold text-[#111111] mb-3">
          Companion Profile Not Found
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          The cat you are looking for might have been updated or moved.
        </p>
        <button
          onClick={() => navigate('cats')}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white text-xs uppercase tracking-widest font-semibold rounded-xl shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Available Cats</span>
        </button>
      </div>
    );
  }

  const rawImages = cat.gallery_images && cat.gallery_images.length > 0
    ? [cat.main_image, ...cat.gallery_images.filter((img) => img !== cat.main_image)]
    : [cat.main_image];

  const images = rawImages.map((img) => normalizeImageUrl(img));

  const category = categories.find((c) => c.id === cat.category_id);
  const similarCats = cats
    .filter((c) => c.id !== cat.id && (c.category_id === cat.category_id || c.is_available))
    .slice(0, 3);

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="py-8 md:py-12 bg-[#FAF8FF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link & breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('cats')}
            className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest font-semibold text-stone-500 hover:text-[#7C3AED] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Cats</span>
          </button>

          <div className="flex items-center space-x-3">
            {copied && (
              <span className="text-xs text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Link Copied!
              </span>
            )}
            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-white border border-purple-100 rounded-xl text-xs font-semibold text-stone-600 hover:text-[#7C3AED] hover:border-purple-200 shadow-xs transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Profile</span>
            </button>
          </div>
        </div>

        {/* Main Product Card */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Gallery Left (6 cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 bg-[#FAF8FF]/60 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-purple-100">
              <div>
                <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl overflow-hidden bg-white border border-purple-100 shadow-inner mb-4">
                  <img
                    src={images[activeImageIdx] || cat.main_image}
                    alt={cat.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />

                  {images.length > 1 && (
                    <div className="absolute inset-y-0 inset-x-3 flex items-center justify-between pointer-events-none">
                      <button
                        type="button"
                        onClick={() => setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                        className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#111111] shadow-md pointer-events-auto transition hover:scale-105"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                        className="p-2.5 rounded-full bg-white/90 hover:bg-white text-[#111111] shadow-md pointer-events-auto transition hover:scale-105"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}

                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                      cat.is_available
                        ? 'bg-emerald-950/85 text-emerald-100 border border-emerald-500/30'
                        : 'bg-stone-800/90 text-stone-300 border border-stone-600/30'
                    }`}>
                      {cat.is_available ? '● Available for Adoption' : '● Sold Out'}
                    </span>
                  </div>
                </div>

                {images.length > 1 && (
                  <div className="flex items-center space-x-3 overflow-x-auto pb-2">
                    {images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          activeImageIdx === idx
                            ? 'border-[#8B5CF6] ring-2 ring-purple-500/20 scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt="thumb"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Guarantees Box */}
              <div className="mt-6 p-4 bg-white rounded-2xl border border-purple-100 space-y-2 text-xs text-stone-600 shadow-xs">
                <div className="flex items-center space-x-2 font-semibold text-[#111111]">
                  <Award className="w-4 h-4 text-[#8B5CF6]" />
                  <span>The CatZone Pedigree Promise</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Every CatZone feline comes with authenticated ancestry pedigree papers, 1-year hereditary health warranty, microchip registration, and life-long feline care concierge access.
                </p>
              </div>
            </div>

            {/* Info Right (6 cols) */}
            <div className="lg:col-span-6 p-6 sm:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono uppercase tracking-widest font-bold text-stone-500 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                      ID: {cat.cat_id}
                    </span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#7C3AED]">
                      {cat.breed}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#111111]">
                    {cat.name}
                  </h1>

                  <div className="mt-3 flex items-baseline space-x-3">
                    <span className="text-3xl sm:text-4xl font-display font-bold text-[#7C3AED]">
                      ₹{cat.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-stone-500">
                      Inclusive of full vaccination & starter kit
                    </span>
                  </div>
                </div>

                {/* Specs Box */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#FAF8FF] rounded-2xl border border-purple-100">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">Gender</span>
                    <span className="text-sm font-bold text-[#111111]">{cat.gender}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">Age</span>
                    <span className="text-sm font-bold text-[#111111]">{cat.age}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">Color</span>
                    <span className="text-sm font-bold text-[#111111] truncate block">{cat.color}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block">Location</span>
                    <span className="text-sm font-bold text-[#111111]">{cat.location}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-xs uppercase font-semibold tracking-wider text-stone-500 mb-2">
                    Biography & Profile
                  </h3>
                  <p className="text-sm text-stone-700 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Personality */}
                <div>
                  <h3 className="text-xs uppercase font-semibold tracking-wider text-stone-500 mb-2 flex items-center space-x-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Temperament & Habits</span>
                  </h3>
                  <p className="text-xs text-stone-700 bg-[#FAF8FF] p-3.5 rounded-xl border border-purple-100 italic">
                    &ldquo;{cat.personality}&rdquo;
                  </p>
                </div>

                {/* Health & Veterinary Badges */}
                <div className="space-y-3">
                  <h3 className="text-xs uppercase font-semibold tracking-wider text-stone-500">
                    Health Records & Screening
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center space-x-2.5 p-3 bg-[#FAF8FF] rounded-xl border border-purple-100">
                      <CheckCircle2 className={`w-4 h-4 ${cat.vaccinated ? 'text-emerald-600' : 'text-stone-400'}`} />
                      <div>
                        <p className="font-semibold text-[#111111]">Vaccinations</p>
                        <p className="text-[10px] text-stone-500">{cat.vaccinated ? 'Core Triple Protocol Complete' : 'Scheduled'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5 p-3 bg-[#FAF8FF] rounded-xl border border-purple-100">
                      <CheckCircle2 className={`w-4 h-4 ${cat.dewormed ? 'text-emerald-600' : 'text-stone-400'}`} />
                      <div>
                        <p className="font-semibold text-[#111111]">Deworming</p>
                        <p className="text-[10px] text-stone-500">{cat.dewormed ? 'Veterinary Cleared' : 'Under Observation'}</p>
                      </div>
                    </div>
                  </div>

                  {cat.health_status && (
                    <div className="p-3.5 bg-purple-50/70 border border-purple-100 rounded-xl text-xs text-purple-950">
                      <span className="font-semibold">Clinical Certificate: </span>
                      {cat.health_status}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-purple-100 space-y-3">
                {cat.is_available ? (
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-sm uppercase tracking-widest font-semibold rounded-2xl shadow-xl hover:shadow-purple-500/25 transition flex items-center justify-center space-x-3 hover:scale-[1.01]"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Enquire on WhatsApp / Reserve {cat.name}</span>
                  </button>
                ) : (
                  <div className="p-5 bg-stone-100 rounded-2xl border border-stone-300 text-center space-y-2">
                    <p className="text-sm font-bold text-stone-700 uppercase tracking-wider">
                      This companion is Sold Out
                    </p>
                    <p className="text-xs text-stone-500">
                      {cat.name} has already moved to their forever home. Contact our concierge to inquire about future litters.
                    </p>
                    <button
                      onClick={() => navigate('cats')}
                      className="mt-2 inline-flex items-center space-x-1.5 text-xs uppercase tracking-wider font-semibold text-[#7C3AED] hover:underline"
                    >
                      <span>Browse Currently Available Companions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Similar Companions */}
        {similarCats.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#7C3AED] font-semibold">
                  Curated Suggestions
                </p>
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#111111]">
                  Similar Pedigree Companions
                </h3>
              </div>
              <button
                onClick={() => navigate('cats')}
                className="text-xs font-semibold uppercase tracking-wider text-[#7C3AED] hover:underline"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarCats.map((sc) => (
                <CatCard key={sc.id} cat={sc} />
              ))}
            </div>
          </div>
        )}
      </div>

      <WhatsAppCheckoutModal
        cat={cat}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};
