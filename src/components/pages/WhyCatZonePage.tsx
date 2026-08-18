import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShieldCheck,
  Award,
  Heart,
  Truck,
  Stethoscope,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';

export const WhyCatZonePage: React.FC = () => {
  const { navigate } = useStore();

  const standards = [
    {
      title: '1. Verified Pedigree Lineage',
      desc: 'Every CatZone kitten descends from champion bloodlines recognized by the World Cat Federation (WCF) and The International Cat Association (TICA). We provide 4-generation pedigree tree documentation.',
      icon: <Award className="w-6 h-6 text-[#8B5CF6]" />,
    },
    {
      title: '2. Zero Cage Policy & Enrichment',
      desc: 'Our nursery suites are expansive, climate-managed, and cage-free. Kittens interact daily with caring feline nurses, custom climbing trees, and gentle human contact for early behavioral socialization.',
      icon: <Heart className="w-6 h-6 text-[#8B5CF6]" />,
    },
    {
      title: '3. Clinical Genetic Screening',
      desc: 'Both parent cats undergo DNA assays and Doppler echocardiograms to rule out Hypertrophic Cardiomyopathy (HCM), Polycystic Kidney Disease (PKD), and Progressive Retinal Atrophy (PRA-b).',
      icon: <Stethoscope className="w-6 h-6 text-[#8B5CF6]" />,
    },
    {
      title: '4. Complete Immunization & Microchipping',
      desc: 'Kittens receive core feline vaccines (FPV, FHV, FCV), preventive deworming cycles, ISO-compliant international microchip implantation, and an official health passport.',
      icon: <ShieldCheck className="w-6 h-6 text-[#8B5CF6]" />,
    },
    {
      title: '5. White-Glove Accompanied Transit',
      desc: 'We never ship animals in standard cargo. Every kitten travels in a temperature-controlled cabin with a dedicated CatZone feline attendant directly to your airport or doorstep.',
      icon: <Truck className="w-6 h-6 text-[#8B5CF6]" />,
    },
    {
      title: '6. Lifetime Concierge & Nutrition Kit',
      desc: 'You receive a deluxe welcome hamper including the kitten’s familiar premium food, scent blanket, probiotics, interactive toys, and 24/7 WhatsApp access to our veterinary advisory team.',
      icon: <PhoneCall className="w-6 h-6 text-[#8B5CF6]" />,
    },
  ];

  return (
    <div className="bg-[#FAF8FF] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#7C3AED] text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OUR ADOPTION PROMISE</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-[#191816] tracking-tight">
            Why Discerning Families Choose CatZone
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            We were founded on a singular conviction: buying a pedigree cat in India should be a transparent, compassionate, and regal experience.
          </p>
        </div>

        {/* Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {standards.map((std, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-3xl border border-purple-100 shadow-sm space-y-4 hover:border-purple-300 hover:shadow-md transition duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100">
                {std.icon}
              </div>
              <h3 className="text-xl font-display font-bold text-[#191816]">
                {std.title}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {std.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Health Warranty Section */}
        <div className="bg-gradient-to-br from-stone-900 via-purple-950 to-stone-900 text-white p-8 sm:p-12 rounded-3xl border border-purple-800/40 space-y-6 shadow-2xl">
          <div className="flex items-center space-x-2 text-purple-300 text-xs font-semibold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            <span>Health & Hereditary Guarantee</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white leading-tight">
            1-Year Complete Genetic Health Guarantee
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed max-w-3xl">
            In the improbable event that your kitten develops a congenital or hereditary condition within their first 12 months, CatZone guarantees full veterinary support, medical mediation, or a replacement companion with equal pedigree standing.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate('cats')}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-luxury-gradient hover:opacity-95 text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg shadow-purple-500/25 transition"
            >
              <span>Explore Available Pedigrees</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
