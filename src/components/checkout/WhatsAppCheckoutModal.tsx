import React, { useState } from 'react';
import { Cat } from '../../types';
import { useStore } from '../../context/StoreContext';
import { generateWhatsAppUrl, CheckoutCustomerData } from '../../lib/whatsapp';
import { normalizeImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUtils';
import { X, MessageCircle, ShieldCheck, Check, AlertCircle } from 'lucide-react';

interface WhatsAppCheckoutModalProps {
  cat: Cat | null;
  isOpen: boolean;
  onClose: () => void;
}

export const WhatsAppCheckoutModal: React.FC<WhatsAppCheckoutModalProps> = ({
  cat,
  isOpen,
  onClose,
}) => {
  const { settings, createEnquiry } = useStore();
  
  const [formData, setFormData] = useState<CheckoutCustomerData>({
    customer_name: '',
    phone: '',
    email: '',
    city: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !cat) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setError('Please provide a valid WhatsApp phone number.');
      return;
    }

    if (!cat.is_available) {
      setError('This feline companion is currently marked as Sold Out.');
      return;
    }

    try {
      // 1. Record enquiry in store / database
      await createEnquiry({
        cat_id: cat.cat_id,
        cat_name: cat.name,
        cat_breed: cat.breed,
        cat_price: cat.price,
        customer_name: formData.customer_name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        city: formData.city?.trim() || 'India',
        message: formData.message?.trim() || 'Interested in adopting this cat.',
        status: 'New',
      });

      // 2. Generate WhatsApp URL
      const waUrl = generateWhatsAppUrl(cat, formData, settings);
      setLastWhatsAppUrl(waUrl);
      setSubmitted(true);

      // 3. Open WhatsApp in new tab
      try {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      } catch {
        // fallback in case popup blocked
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to record enquiry. Please try again or contact us directly.');
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-purple-100 bg-gradient-to-r from-purple-50/50 via-white to-purple-50/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#7C3AED] font-semibold">
                CatZone Concierge
              </p>
              <h3 className="text-lg font-display font-bold text-[#111111]">
                WhatsApp Priority Booking & Enquiry
              </h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-stone-400 hover:text-[#111111] hover:bg-stone-100 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* SUCCESS STATE */
          <div className="p-8 text-center bg-[#FAF8FF]">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-[#7C3AED] mx-auto flex items-center justify-center mb-4">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-display font-bold text-[#111111] mb-2">
              Enquiry Dispatched via WhatsApp
            </h3>
            <p className="text-stone-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              Thank you, <strong className="text-[#111111]">{formData.customer_name}</strong>. Your enquiry for <strong className="text-[#111111]">{cat.name} ({cat.cat_id})</strong> has been saved and your WhatsApp chat window has been launched.
            </p>

            <div className="p-4 bg-white rounded-2xl border border-purple-100 max-w-md mx-auto text-left mb-6 space-y-2 text-xs text-stone-600 shadow-xs">
              <div className="flex items-center justify-between">
                <span>Direct WhatsApp Number:</span>
                <span className="font-semibold text-[#111111]">+{settings.whatsapp_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Selected Feline:</span>
                <span className="font-semibold text-[#111111]">{cat.name} · {cat.breed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Price:</span>
                <span className="font-semibold text-[#7C3AED]">₹{cat.price.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={lastWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1EBE5D] hover:to-[#075E54] text-white font-medium rounded-xl shadow-md transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reopen WhatsApp Chat</span>
              </a>
              <button
                onClick={handleClose}
                className="px-6 py-3 bg-white border border-stone-200 hover:bg-stone-50 text-[#111111] font-medium rounded-xl transition"
              >
                Done / Back to Catalog
              </button>
            </div>
          </div>
        ) : (
          /* FORM STATE */
          <div className="p-6 md:p-8 overflow-y-auto max-h-[80vh]">
            {/* Selected Cat Card preview */}
            <div className="flex items-center space-x-4 p-4 bg-[#FAF8FF] rounded-2xl border border-purple-100 mb-6">
              <img
                src={normalizeImageUrl(cat.main_image)}
                alt={cat.name}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                }}
                className="w-20 h-20 rounded-xl object-cover border border-purple-100 shadow-xs"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">
                    {cat.cat_id}
                  </span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    cat.is_available ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-200 text-stone-700'
                  }`}>
                    {cat.is_available ? 'Available' : 'Sold Out'}
                  </span>
                </div>
                <h4 className="text-lg font-display font-bold text-[#111111] truncate">
                  {cat.name} — {cat.breed}
                </h4>
                <p className="text-xs text-stone-500">
                  {cat.gender} · {cat.age} · {cat.color}
                </p>
                <p className="text-sm font-bold text-[#7C3AED] mt-1">
                  ₹{cat.price.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {!cat.is_available ? (
              <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 mb-6 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-amber-700" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Companion Currently Reserved or Sold</p>
                  <p className="text-xs text-amber-800">
                    {cat.name} has already found a loving family. You may still message our concierge team to ask about upcoming litters or similar {cat.breed} kittens.
                  </p>
                </div>
              </div>
            ) : null}

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Sen"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#8B5CF6] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                    WhatsApp Phone Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#8B5CF6] transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. ananya@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#8B5CF6] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                    City / Delivery Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Karur / Bengaluru / Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#8B5CF6] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                  Specific Requests or Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Would love to schedule a live HD video call with Luna and view health certificate copies."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#8B5CF6] transition resize-none"
                />
              </div>

              <div className="p-3.5 bg-purple-50/70 rounded-xl border border-purple-100 flex items-start space-x-3 text-xs text-stone-600">
                <ShieldCheck className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
                <p>
                  No payment is processed on the website. Clicking proceed connects you directly with our verified feline concierge on WhatsApp to review vaccination records, parents&apos; pedigree, and coordinate safe transit.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 text-xs uppercase tracking-wider font-semibold text-stone-500 hover:text-[#111111] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-xs uppercase tracking-widest font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Proceed to WhatsApp Concierge</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
