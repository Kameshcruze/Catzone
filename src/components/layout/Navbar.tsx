import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Menu, X, Search, ShoppingBag, User, MessageSquare, ArrowUpRight, Lock } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPage, navigate, settings, isAdminLoggedIn, enquiries } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Available Cats', page: 'cats' as const },
    { label: 'Breeds', page: 'categories' as const },
    { label: 'Why Choose Us', page: 'why-catzone' as const },
    { label: 'About Us', page: 'about' as const },
    { label: 'Delivery', page: 'faq' as const },
    { label: 'Contact', page: 'contact' as const },
  ];

  return (
    <>
      {/* Announcement Bar */}
      {settings.announcement_bar && (
        <div className="bg-gradient-to-r from-[#180F2E] via-[#111111] to-[#1E1038] text-[#E5E7EB] text-[11px] font-medium tracking-wide py-2 px-4 text-center flex items-center justify-center space-x-2 border-b border-[#8B5CF6]/20">
          <span>{settings.announcement_bar}</span>
        </div>
      )}

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-stone-200/80 py-3.5'
            : 'bg-white py-4 border-b border-stone-200/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Brand Logo with Cat Image in Circle */}
          <button
            onClick={() => navigate('home')}
            className="flex items-center space-x-2.5 text-left group focus:outline-none"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-[#8B5CF6] via-purple-400 to-indigo-500 shadow-xs group-hover:scale-105 transition-transform duration-200">
              <img
                src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=120&q=80"
                alt="CatZone Logo"
                className="w-full h-full object-cover rounded-full bg-stone-100"
              />
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-[#111111] group-hover:text-[#7C3AED] transition-colors">
              CatZone
            </span>
          </button>

          {/* Center Navigation Links (Clean sans-serif) */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => navigate(link.page)}
                  className={`text-xs font-medium transition-colors duration-150 relative py-1 ${
                    isActive ? 'text-[#7C3AED] font-semibold' : 'text-[#6B7280] hover:text-[#111111]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Button */}
          <div className="hidden sm:flex items-center space-x-5">
            {/* Search Icon */}
            <button
              onClick={() => navigate('cats')}
              className="p-1.5 text-[#111111] hover:text-[#7C3AED] transition"
              title="Search catalog"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Inquiries / Wishlist Bag Icon */}
            <button
              onClick={() => navigate('cats')}
              className="p-1.5 text-[#111111] hover:text-[#7C3AED] transition relative"
              title="View Inquiries / Catalog"
            >
              <ShoppingBag className="w-4 h-4" />
              {enquiries.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white text-[9px] font-bold flex items-center justify-center">
                  {enquiries.length}
                </span>
              )}
            </button>

            {/* User / Admin Icon */}
            <button
              onClick={() => navigate(isAdminLoggedIn ? 'admin-dashboard' : 'admin-login')}
              className={`p-1.5 transition ${
                isAdminLoggedIn ? 'text-[#8B5CF6]' : 'text-[#111111] hover:text-[#7C3AED]'
              }`}
              title={isAdminLoggedIn ? 'Admin Dashboard' : 'Admin Sign In'}
            >
              <User className="w-4 h-4" />
            </button>

            {/* Quick Explore Button with Gradient Accent */}
            <button
              onClick={() => navigate('cats')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#111111] to-[#1E1035] hover:from-[#8B5CF6] hover:to-[#6D28D9] text-white text-xs font-semibold transition-all duration-200 shadow-xs hover:shadow-md"
            >
              <span>Explore</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              onClick={() => navigate('cats')}
              className="p-2 text-[#111111]"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#111111] hover:bg-stone-100 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E5E7EB] bg-white px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.page}
                  onClick={() => {
                    navigate(link.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left text-sm font-medium py-2 border-b border-[#E5E7EB]/60 ${
                    currentPage === link.page ? 'text-[#111111] font-bold' : 'text-[#4B5563]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="pt-3 flex flex-col space-y-3">
              <button
                onClick={() => {
                  navigate('cats');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 bg-[#111111] text-white rounded-full text-xs font-semibold text-center flex items-center justify-center space-x-2"
              >
                <span>Browse All Companions</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              {isAdminLoggedIn ? (
                <button
                  onClick={() => {
                    navigate('admin-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 bg-stone-100 text-[#111111] rounded-full text-xs font-semibold flex items-center justify-center space-x-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate('admin-login');
                    setMobileMenuOpen(false);
                  }}
                  className="text-center text-xs text-[#6B7280] py-1 hover:text-[#111111]"
                >
                  Admin Portal Access
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

