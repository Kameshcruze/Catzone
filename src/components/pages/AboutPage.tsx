import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Award, Heart, ShieldCheck, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="bg-[#FAF8FF] min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7C3AED]">
            ABOUT CATZONE
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-[#111111] tracking-tight">
            The Cattery of Refined Standards
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Established to bring world-class feline breeding, ethical stewardship, and bespoke concierge purchasing to India.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-12 rounded-3xl border border-purple-100 shadow-xs">
          <div className="md:col-span-6 space-y-4">
            <span className="text-xs uppercase tracking-widest text-[#7C3AED] font-semibold">
              Our Genesis
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#111111]">
              A Sanctuary Founded on Empathy and Pedigree Purity
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              CatZone was born out of frustration with unregulated pet markets and unreliable brokers. We set out to build India&apos;s most sophisticated cattery sanctuary — a place where champion lineage meets nursery-style warmth and rigorous veterinary governance.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Today, our nurseries based in Karur, India house some of the finest British Shorthair, Persian, Maine Coon, and Ragdoll lines in South Asia.
            </p>
          </div>

          <div className="md:col-span-6">
            <div className="aspect-4/3 rounded-2xl overflow-hidden shadow-lg border border-purple-100">
              <img
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80"
                alt="CatZone Nursery"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-white p-8 rounded-3xl border border-purple-100 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#8B5CF6] mx-auto flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-[#111111]">
              Zero Compromise Lineage
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Authentic WCF and TICA registered parents with certified multi-generation lineage charts.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-purple-100 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#8B5CF6] mx-auto flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-[#111111]">
              Cage-Free Rearing
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Raised in spacious nursery suites with interactive feline enrichments and daily social holding.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-purple-100 space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#8B5CF6] mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-display font-bold text-[#111111]">
              Lifetime Advisory
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Ongoing nutritional advice, veterinary consultation, and grooming assistance for all adopters.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <button
            onClick={() => navigate('cats')}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg hover:shadow-purple-500/25 transition hover:scale-105"
          >
            <span>Explore Our Pedigrees</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
