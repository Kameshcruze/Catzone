import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Play, Plus, X, ArrowUpRight, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';

export const WhyCatZoneSection: React.FC = () => {
  const { navigate, openCheckout } = useStore();
  const [openAccordion, setOpenAccordion] = useState<number | null>(1); // Item 2 open by default
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const accordionItems = [
    {
      id: 0,
      title: 'Sustainability & Ethical Stewardship',
      content:
        'We enforce strict zero-cage nursery protocols. Our queens and kings live in climate-controlled, sunlight-filled suites with customized enrichment walls, ensuring stress-free early development.',
    },
    {
      id: 1,
      title: 'Unrivaled Quality & Genetic Clearance',
      content:
        'Every companion undergoes comprehensive 40-panel DNA health screening, cardiac HCM ultrasound, and renal PKD clearance. We back every feline with an official 1-year hereditary guarantee.',
    },
    {
      id: 2,
      title: 'Unmatched Variety & Rare Bloodlines',
      content:
        'From Grand Champion European British Shorthairs to imported Russian Blues and Siberian Forest lines, our registry represents the most pristine pedigree lineages available in India.',
    },
    {
      id: 3,
      title: 'Legacy of Excellence & Lifetime Concierge',
      content:
        'Our licensed veterinary and feline nutrition advisory team remains accessible to you for the entire lifetime of your companion, ensuring seamless transition and optimal health.',
    },
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmailInput('');
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* 1. "Why Choose Us" Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Video Nursery Card */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative rounded-[28px] overflow-hidden bg-stone-100 aspect-4/3 border border-purple-100 shadow-xs group">
              <img
                src="https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=1000&q=80"
                alt="CatZone Nursery Environment"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Central Play Button with Purple Ring */}
              <button
                onClick={() => setIsVideoModalOpen(true)}
                className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#6D28D9] text-white flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110"
                aria-label="Play Cattery Tour Video"
              >
                <Play className="w-5 h-5 ml-1 fill-white" />
              </button>
            </div>

            <p className="text-xs text-stone-500 font-medium">
              Watch the video and learn more about CatZone nursery suites.
            </p>
          </div>

          {/* Right Column: Title + Clean Interactive Accordion */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-[#111111] tracking-tight">
                Why Choose Us
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-2">
                Here are the reasons why CatZone stands out as the ultimate choice in pedigree feline companionship.
              </p>
            </div>

            {/* Accordion List */}
            <div className="divide-y divide-stone-200 border-t border-b border-stone-200">
              {accordionItems.map((item) => {
                const isOpen = openAccordion === item.id;
                return (
                  <div key={item.id} className="py-4">
                    <button
                      onClick={() => setOpenAccordion(isOpen ? null : item.id)}
                      className="w-full flex items-center justify-between text-left group focus:outline-none"
                    >
                      <span className={`font-display font-bold text-base sm:text-lg transition-colors ${isOpen ? 'text-[#7C3AED]' : 'text-[#111111] group-hover:text-[#7C3AED]'}`}>
                        {item.title}
                      </span>
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'text-[#8B5CF6] bg-purple-50' : 'text-stone-600 group-hover:text-black'}`}>
                        {isOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="pt-3 pr-8 text-xs sm:text-sm text-stone-600 leading-relaxed animate-in fade-in slide-in-from-top-1 duration-200">
                        {item.content}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 2. Wide Highlight Banner */}
        <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden bg-gradient-to-r from-[#170E2C] via-[#100720] to-[#0A0415] border border-purple-900/40 shadow-xl p-8 sm:p-12 lg:p-16 flex flex-col justify-between min-h-[360px] group">
          <img
            src="https://images.unsplash.com/photo-1513360309081-38f0762daed9?auto=format&fit=crop&w=1600&q=80"
            alt="Royal Feline Sanctuary"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 group-hover:scale-103 transition-transform duration-700"
          />

          {/* Top Right "Book an Appointment ↗" button */}
          <div className="relative flex justify-end">
            <button
              onClick={() => navigate('contact')}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition hover:scale-105 shadow-md"
            >
              <span>Book an appointment</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Headline & Bottom Action */}
          <div className="relative max-w-2xl space-y-6 pt-12">
            <h3 className="text-2xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white leading-tight tracking-tight">
              When We Raise Companions, We Strive For The Finest Quality.
            </h3>

            <button
              onClick={() => navigate('cats')}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-xs font-semibold tracking-wide transition-all shadow-lg hover:shadow-purple-500/25 hover:scale-105"
            >
              <span>See Products / Cats</span>
            </button>
          </div>
        </div>

        {/* 3. Newsletter Banner */}
        <div className="text-center max-w-xl mx-auto space-y-4 pt-6">
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-[#111111] tracking-tight">
            Subscribe to our newsletter and <br />
            grab <span className="font-extrabold text-[#7C3AED]">30% OFF</span> starter kit
          </h3>
          <p className="text-xs text-stone-500">
            Receive priority notifications for newborn litters and pedigree certificates before public release.
          </p>

          <form onSubmit={handleSubscribe} className="flex items-center max-w-md mx-auto pt-2">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 px-5 py-3 bg-[#FAF8FF] border border-purple-200 rounded-l-full text-xs text-[#111111] focus:outline-none focus:border-[#8B5CF6] placeholder:text-stone-400"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-xs font-semibold rounded-r-full transition flex items-center space-x-1 shadow-sm shrink-0 hover:shadow-md"
            >
              <span>Subscribe</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {subscribed && (
            <p className="text-xs font-semibold text-emerald-700 animate-in fade-in">
              ✓ Thank you! We&apos;ve sent your exclusive 30% discount voucher code to your inbox.
            </p>
          )}
        </div>

      </div>

      {/* Video Modal Preview */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[28px] max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-lg text-[#111111]">
                CatZone Nursery & Cattery Experience
              </h4>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1 rounded-full text-stone-500 hover:text-black hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-16/9 w-full rounded-2xl overflow-hidden bg-stone-900 relative flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?auto=format&fit=crop&w=1200&q=80"
                alt="Video thumbnail"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-center">
                <ShieldCheck className="w-10 h-10 text-purple-400 mb-2" />
                <h5 className="font-display font-bold text-xl">Cage-Free Luxury Stewardship</h5>
                <p className="text-xs text-stone-200 mt-1 max-w-sm">
                  Our certified veterinary cattery features 24/7 HEPA filtration, acoustic enrichment, and individual mothering suites.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="px-5 py-2 bg-[#111111] hover:bg-[#8B5CF6] text-white rounded-full text-xs font-semibold transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

