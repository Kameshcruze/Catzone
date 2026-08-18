import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle, Video, ShieldCheck, Home, ArrowUpRight } from 'lucide-react';

export const AdoptionProcessSection: React.FC = () => {
  const { navigate } = useStore();

  const steps = [
    {
      num: '01',
      icon: <Home className="w-5 h-5 text-[#8B5CF6]" />,
      title: 'Select Your Companion',
      description: 'Explore our catalog of verified pedigree kittens and cats with transparent health and breed records.',
    },
    {
      num: '02',
      icon: <MessageCircle className="w-5 h-5 text-[#8B5CF6]" />,
      title: 'WhatsApp Concierge',
      description: 'Click "Enquire on WhatsApp". Our feline specialist instantly confirms availability and answers questions.',
    },
    {
      num: '03',
      icon: <Video className="w-5 h-5 text-[#8B5CF6]" />,
      title: 'Live Video Meet & Records',
      description: 'Enjoy a live private HD video session with your chosen kitten and review veterinary health certificates.',
    },
    {
      num: '04',
      icon: <ShieldCheck className="w-5 h-5 text-[#8B5CF6]" />,
      title: 'Doorstep Concierge Handover',
      description: 'We arrange temperature-controlled, escorted delivery right to your home with a deluxe starter care package.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-[#FAF8FF] border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-[#7C3AED] font-semibold mb-2">
            CONCIERGE JOURNEY
          </p>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#111111] tracking-tight">
            How CatZone Adoption Works
          </h2>
          <p className="text-sm text-stone-500 mt-3">
            A transparent, stress-free path from discovery to welcoming your companion home.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-purple-100/80 shadow-xs relative flex flex-col justify-between space-y-4 hover:-translate-y-1 transition duration-200 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-display font-extrabold text-purple-300">
                  {step.num}
                </span>
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                  {step.icon}
                </div>
              </div>

              <div>
                <h3 className="text-base font-display font-bold text-[#111111] mb-1.5">
                  {step.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="w-full h-1 bg-purple-100/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9]"
                  style={{ width: `${(idx + 1) * 25}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <button
            onClick={() => navigate('cats')}
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-xs font-semibold rounded-full shadow-lg hover:shadow-purple-500/25 transition hover:scale-105"
          >
            <span>Begin Companion Discovery</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
