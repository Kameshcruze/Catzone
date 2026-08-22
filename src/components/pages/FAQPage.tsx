import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronDown, MessageCircle, HelpCircle, ArrowRight } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'adoption' | 'health' | 'transit' | 'care';
}

export const FAQPage: React.FC = () => {
  const { navigate, settings } = useStore();
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [activeCat, setActiveCat] = useState<'all' | 'adoption' | 'health' | 'transit' | 'care'>('all');

  const faqs: FAQItem[] = [
    {
      category: 'adoption',
      question: 'How does the purchase & WhatsApp checkout process work?',
      answer: 'Browse our available cats and click "Enquire on WhatsApp". You will enter your contact details, and the platform generates a pre-formatted message with the exact cat ID, breed, and price to our concierge WhatsApp number (+91 82708 98054). We immediately confirm availability, arrange an HD live video call, and guide you through the reservation steps.',
    },
    {
      category: 'adoption',
      question: 'Can I visit the cattery sanctuary in person or see a video call?',
      answer: 'Yes! We host in-person sanctuary appointments in Karur, India by advance booking. For adopters outside the region, our team provides 4K live video sessions with your chosen kitten and parents.',
    },
    {
      category: 'health',
      question: 'What health tests and vaccinations are completed before delivery?',
      answer: 'All CatZone kittens receive core feline immunizations (FPV/FHV/FCV), routine deworming protocols, microchip implantation, and comprehensive genetic health clearances for HCM (cardiac) and PKD (renal) from certified veterinary labs.',
    },
    {
      category: 'health',
      question: 'What is included in the 1-Year Hereditary Health Warranty?',
      answer: 'Our 1-year guarantee covers any genetic or hereditary disease. If any hereditary condition arises, our veterinary panel provides comprehensive medical support, coverage, or companion replacement.',
    },
    {
      category: 'transit',
      question: 'How are cats safely transported across India?',
      answer: 'We never ship animals via cargo holds. CatZone companions travel in temperature-controlled passenger cabins accompanied by a dedicated CatZone attendant directly to major Indian airports or private home addresses.',
    },
    {
      category: 'care',
      question: 'What is inside the Deluxe Starter Care Hamper?',
      answer: 'Every companion arrives with their familiar premium kitten dry/wet food supply, probiotic packets, scent blanket from their mother, interactive toys, litter training guide, microchip registration certificate, and vaccination booklet.',
    },
    {
      category: 'care',
      question: 'Are all CatZone kittens litter trained and socialized?',
      answer: 'Yes! All kittens are 100% litter trained and familiar with scratch posts before moving. Because they are reared cage-free, they are confident, affectionate, and accustomed to human voices and household environments.',
    },
  ];

  const filteredFaqs = activeCat === 'all' ? faqs : faqs.filter((f) => f.category === activeCat);

  return (
    <div className="bg-[#FAF8FF] min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#7C3AED] text-xs font-semibold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-[#191816] tracking-tight">
            Everything You Need to Know
          </h1>
          <p className="text-sm text-stone-600 max-w-xl mx-auto">
            Clear answers about purchase protocols, veterinary screening, transit safety, and life with your new pedigree companion.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'adoption', label: 'Purchase & WhatsApp' },
            { id: 'health', label: 'Health & Guarantees' },
            { id: 'transit', label: 'India-Wide Transit' },
            { id: 'care', label: 'Starter Kit & Care' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCat(tab.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                activeCat === tab.id
                  ? 'bg-luxury-gradient text-white shadow-md shadow-purple-500/20'
                  : 'bg-white text-stone-600 border border-purple-100 hover:text-[#191816]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-purple-100 overflow-hidden shadow-sm transition duration-150"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between space-x-4 hover:bg-purple-50/30 transition"
                >
                  <span className="font-display font-bold text-base sm:text-lg text-[#191816]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8B5CF6] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-purple-100/60 pt-4 bg-[#FAF8FF]/50 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions? */}
        <div className="bg-gradient-to-br from-purple-900 to-indigo-950 p-8 sm:p-10 rounded-3xl border border-purple-800/40 text-center space-y-4 text-white shadow-xl">
          <h3 className="text-2xl font-display font-bold text-white">
            Have a Specific Question?
          </h3>
          <p className="text-xs sm:text-sm text-purple-200 max-w-md mx-auto">
            Our feline specialists are available 7 days a week on WhatsApp to discuss pedigree inquiries, upcoming litters, or custom delivery timelines.
          </p>
          <a
            href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg transition hover:scale-105"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat with Concierge</span>
          </a>
        </div>

      </div>
    </div>
  );
};
