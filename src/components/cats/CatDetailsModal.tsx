import React, { useState } from 'react';
import { Cat } from '../../types';
import { useStore } from '../../context/StoreContext';
import { WhatsAppCheckoutModal } from '../checkout/WhatsAppCheckoutModal';
import { normalizeImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUtils';
import {
  X,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Heart,
  Tag,
  ArrowRight,
  Info,
  ChevronLeft,
  ChevronRight,
  Share2,
} from 'lucide-react';

interface CatDetailsModalProps {
  cat: Cat | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CatDetailsModal: React.FC<CatDetailsModalProps> = ({ cat, isOpen, onClose }) => {
  const { navigate, categories } = useStore();
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !cat) return null;

  const rawImages = cat.gallery_images && cat.gallery_images.length > 0
    ? [cat.main_image, ...cat.gallery_images.filter((img) => img !== cat.main_image)]
    : [cat.main_image];

  const images = rawImages.map((img) => normalizeImageUrl(img));

  const category = categories.find((c) => c.id === cat.category_id);

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
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
        <div 
          className="relative w-full max-w-5xl bg-[#FAF8FF] rounded-2xl md:rounded-3xl shadow-2xl border border-purple-100 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close & Share Top Float Buttons */}
          <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-white/80 hover:bg-white text-[#191816] shadow-md transition backdrop-blur-xs"
              title="Copy Profile Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-full bg-white/80 hover:bg-white text-[#191816] shadow-md transition backdrop-blur-xs"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {copied && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-[#191816] text-white text-xs px-4 py-2 rounded-full shadow-lg">
              Companion link copied to clipboard
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
            {/* LEFT: Image Gallery (5 cols) */}
            <div className="lg:col-span-6 bg-purple-50/50 p-4 sm:p-6 flex flex-col justify-between">
              <div>
                {/* Main Active Image with Prev/Next Controls */}
                <div className="relative aspect-4/3 sm:aspect-square w-full rounded-2xl overflow-hidden bg-white border border-purple-100 shadow-inner mb-3">
                  <img
                    src={images[activeImageIdx] || cat.main_image}
                    alt={`${cat.name} photo`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all duration-300"
                  />

                  {images.length > 1 && (
                    <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                        }}
                        className="p-2 rounded-full bg-white/80 hover:bg-white text-[#191816] shadow-md pointer-events-auto transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                        }}
                        className="p-2 rounded-full bg-white/80 hover:bg-white text-[#191816] shadow-md pointer-events-auto transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {/* Status Overlay */}
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                      cat.is_available
                        ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-500/30'
                        : 'bg-purple-950/90 text-purple-200 border border-purple-500/30'
                    }`}>
                      {cat.is_available ? '● Available' : '● Sold Out'}
                    </span>
                  </div>
                </div>

                {/* Thumbnails Row */}
                {images.length > 1 && (
                  <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                    {images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          activeImageIdx === idx
                            ? 'border-[#8B5CF6] ring-2 ring-[#8B5CF6]/30 scale-105'
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

              {/* Verified Badge info */}
              <div className="p-3.5 bg-white/90 backdrop-blur-xs rounded-xl border border-purple-100 mt-4 flex items-center space-x-3 text-xs text-stone-600">
                <ShieldCheck className="w-5 h-5 text-[#8B5CF6] shrink-0" />
                <div>
                  <p className="font-semibold text-[#191816]">CatZone Certified Purebred Lineage</p>
                  <p className="text-[11px]">Includes microchip registration, vaccination booklet & 1-year health warranty.</p>
                </div>
              </div>
            </div>

            {/* RIGHT: Cat Information (7 cols) */}
            <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                {/* Eyebrow / Cat ID / Location */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase font-mono tracking-widest text-stone-600 font-semibold bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                      ID: {cat.cat_id}
                    </span>
                    <span className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-wider">
                      {cat.breed}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-stone-600">
                    <MapPin className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>{cat.location}</span>
                  </div>
                </div>

                {/* Main Heading & Price */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#191816]">
                    {cat.name}
                  </h2>
                  <div>
                    <span className="text-[11px] uppercase tracking-widest text-stone-500 block font-semibold">
                      Purchase Price
                    </span>
                    <span className="text-2xl sm:text-3xl font-display font-bold text-[#8B5CF6]">
                      ₹{cat.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Key Attributes Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-white rounded-xl border border-purple-100">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-500 block">
                      Gender
                    </span>
                    <span className="text-xs font-bold text-[#191816]">{cat.gender}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-500 block">
                      Age
                    </span>
                    <span className="text-xs font-bold text-[#191816]">{cat.age}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-500 block">
                      Color / Coat
                    </span>
                    <span className="text-xs font-bold text-[#191816] truncate block">{cat.color}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-stone-500 block">
                      Date of Birth
                    </span>
                    <span className="text-xs font-bold text-[#191816]">{cat.date_of_birth || 'Verified'}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs uppercase font-semibold tracking-wider text-stone-500 mb-1.5">
                    About {cat.name}
                  </h4>
                  <p className="text-sm text-[#191816] leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                {/* Personality */}
                <div>
                  <h4 className="text-xs uppercase font-semibold tracking-wider text-stone-500 mb-1.5 flex items-center space-x-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#8B5CF6]" />
                    <span>Personality & Temperament</span>
                  </h4>
                  <p className="text-xs text-stone-700 bg-white p-3 rounded-lg border border-purple-100 italic">
                    &ldquo;{cat.personality}&rdquo;
                  </p>
                </div>

                {/* Health & Verification Records */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase font-semibold tracking-wider text-stone-500">
                    Veterinary & Health Verification
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center space-x-2 p-2.5 bg-white rounded-lg border border-purple-100">
                      <CheckCircle2 className={`w-4 h-4 ${cat.vaccinated ? 'text-emerald-600' : 'text-stone-400'}`} />
                      <div>
                        <p className="font-semibold text-[#191816]">Vaccinations</p>
                        <p className="text-[10px] text-stone-500">{cat.vaccinated ? 'Up-to-Date & Certified' : 'Scheduled'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 p-2.5 bg-white rounded-lg border border-purple-100">
                      <CheckCircle2 className={`w-4 h-4 ${cat.dewormed ? 'text-emerald-600' : 'text-stone-400'}`} />
                      <div>
                        <p className="font-semibold text-[#191816]">Deworming</p>
                        <p className="text-[10px] text-stone-500">{cat.dewormed ? 'Completed Protocol' : 'Under Care'}</p>
                      </div>
                    </div>
                  </div>

                  {cat.health_status && (
                    <div className="p-3 bg-purple-50/70 rounded-lg text-xs text-stone-600 border border-purple-100">
                      <span className="font-semibold text-[#191816]">Clinical Status: </span>
                      {cat.health_status}
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-purple-100 space-y-3">
                {cat.is_available ? (
                  <button
                    onClick={() => setIsCheckoutOpen(true)}
                    className="w-full px-5 py-3.5 sm:py-4 bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-xs sm:text-sm font-bold tracking-wide rounded-full shadow-lg shadow-purple-500/25 transition-all duration-200 flex items-center justify-center gap-2.5 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5 shrink-0 text-white" />
                    <span className="text-center leading-snug">
                      Enquire on WhatsApp &bull; Reserve {cat.name}
                    </span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      disabled
                      className="w-full px-5 py-3.5 sm:py-4 bg-stone-200 text-stone-500 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <span>SOLD OUT &mdash; Found a Home</span>
                    </button>
                    <p className="text-center text-xs text-stone-600">
                      This companion has already found a loving family.{' '}
                      <button
                        onClick={() => {
                          onClose();
                          navigate('cats');
                        }}
                        className="text-[#8B5CF6] font-semibold underline underline-offset-2 hover:text-[#7C3AED]"
                      >
                        Explore available companions
                      </button>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Lead Checkout Modal */}
      <WhatsAppCheckoutModal
        cat={cat}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </>
  );
};
