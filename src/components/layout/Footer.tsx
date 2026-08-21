import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, MessageCircle, Heart, Phone, Mail, MapPin, Award, ExternalLink, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate, categories, settings } = useStore();

  const mainCategories = categories.slice(0, 6);

  return (
    <footer className="bg-gradient-to-b from-[#110D1D] via-[#0E0919] to-[#07040C] text-white pt-16 pb-12 border-t border-[#8B5CF6]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#8B5CF6] via-purple-400 to-indigo-500 shadow-xs">
                <img
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=120&q=80"
                  alt="CatZone Logo"
                  className="w-full h-full object-cover rounded-full bg-stone-900"
                />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                CATZONE
              </span>
            </div>
            
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Discover ethically reared pedigree felines, transparent genetic health clearances, and white-glove doorstep concierge transit across India.
            </p>

            <div className="pt-2 flex items-center space-x-3 text-xs text-stone-400">
              <div className="flex items-center space-x-1.5 bg-[#1B1232]/80 px-3 py-1.5 rounded-full border border-[#8B5CF6]/30">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-purple-200 text-[11px] font-medium">WCF & TICA Registered Lineages</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
              Explore
            </p>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => navigate('cats')}
                  className="hover:text-white transition"
                >
                  Available Companions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('categories')}
                  className="hover:text-white transition"
                >
                  All Cat Breeds
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('why-catzone')}
                  className="hover:text-white transition"
                >
                  Why CatZone
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('about')}
                  className="hover:text-white transition"
                >
                  Our Cattery Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('faq')}
                  className="hover:text-white transition"
                >
                  Purchase FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Popular Breeds */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
              Popular Breeds
            </p>
            <ul className="space-y-2 text-xs text-stone-400">
              {mainCategories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => navigate('category-detail', { categorySlug: cat.slug })}
                    className="hover:text-white transition text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Concierge & Contact */}
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-widest text-stone-400 font-semibold">
              Concierge
            </p>
            <div className="space-y-2.5 text-xs text-stone-400">
              <p className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>{settings.contact_phone}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>{settings.contact_email}</span>
              </p>
              <a
                href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 mt-2 bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] rounded-full hover:bg-[#25D366]/30 transition text-[11px]"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Minimal Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-400 space-y-4 md:space-y-0">
          <p>© 2026 CatZone.in · Karur, India. All rights reserved.</p>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('privacy')}
              className="hover:text-stone-300 transition"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => navigate('terms')}
              className="hover:text-stone-300 transition"
            >
              Terms of Sale
            </button>
            <span>·</span>
            <button
              onClick={() => navigate('contact')}
              className="hover:text-stone-300 transition"
            >
              Contact
            </button>
            <span>·</span>
            {/* Discreet Admin Login Link */}
            <button
              onClick={() => navigate('admin-login')}
              className="text-purple-400/60 hover:text-purple-300 transition"
              title="Admin Portal"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

