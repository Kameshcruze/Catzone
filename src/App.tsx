/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Public Pages & Sections
import { HeroSection } from './components/home/HeroSection';
import { AvailableNowSection } from './components/home/AvailableNowSection';
import { CategoryDiscoverySection } from './components/home/CategoryDiscoverySection';
import { WhyCatZoneSection } from './components/home/WhyCatZoneSection';
import { AdoptionProcessSection } from './components/home/AdoptionProcessSection';

import { CatCatalog } from './components/cats/CatCatalog';
import { CatDetailPage } from './components/cats/CatDetailPage';
import { CategoriesPage } from './components/pages/CategoriesPage';
import { CategoryDetailPage } from './components/pages/CategoryDetailPage';
import { WhyCatZonePage } from './components/pages/WhyCatZonePage';
import { AboutPage } from './components/pages/AboutPage';
import { FAQPage } from './components/pages/FAQPage';
import { ContactPage } from './components/pages/ContactPage';
import { PrivacyPolicyPage, TermsPage } from './components/pages/LegalPages';

// Admin Pages
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminCatsList } from './components/admin/AdminCatsList';
import { AdminCatForm } from './components/admin/AdminCatForm';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminEnquiries } from './components/admin/AdminEnquiries';
import { AdminSettings } from './components/admin/AdminSettings';

const AppContent: React.FC = () => {
  const { currentPage, isLoading, error, isAdminLoggedIn } = useStore();

  // Scroll to top on page switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const isAdminRoute = currentPage.startsWith('admin-');

  // Render Current Page
  const renderCurrentView = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#E5E7EB] border-t-[#8B5CF6] rounded-full animate-spin mb-4"></div>
          <p className="text-[#6B7280] font-medium tracking-wide">Loading sanctuary data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Connection Error</h2>
          <p className="text-gray-600 max-w-md">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-6 px-6 py-2 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white rounded-full font-medium hover:opacity-90 transition">
            Try Again
          </button>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return (
          <>
            <HeroSection />
            <AvailableNowSection />
            <CategoryDiscoverySection />
            <WhyCatZoneSection />
            <AdoptionProcessSection />
          </>
        );

      case 'cats':
        return <CatCatalog />;

      case 'cat-detail':
        return <CatDetailPage />;

      case 'categories':
        return <CategoriesPage />;

      case 'category-detail':
        return <CategoryDetailPage />;

      case 'why-catzone':
        return <WhyCatZonePage />;

      case 'about':
        return <AboutPage />;

      case 'faq':
        return <FAQPage />;

      case 'contact':
        return <ContactPage />;

      case 'privacy':
        return <PrivacyPolicyPage />;

      case 'terms':
        return <TermsPage />;

      // Admin views (strictly protected if not authenticated)
      case 'admin-login':
        return <AdminLogin />;

      case 'admin-dashboard':
        return isAdminLoggedIn ? <AdminDashboard /> : <AdminLogin />;

      case 'admin-cats':
        return isAdminLoggedIn ? <AdminCatsList /> : <AdminLogin />;

      case 'admin-cat-new':
      case 'admin-cat-edit':
        return isAdminLoggedIn ? <AdminCatForm /> : <AdminLogin />;

      case 'admin-categories':
        return isAdminLoggedIn ? <AdminCategories /> : <AdminLogin />;

      case 'admin-enquiries':
        return isAdminLoggedIn ? <AdminEnquiries /> : <AdminLogin />;

      case 'admin-settings':
        return isAdminLoggedIn ? <AdminSettings /> : <AdminLogin />;

      default:
        return (
          <>
            <HeroSection />
            <AvailableNowSection />
            <CategoryDiscoverySection />
            <WhyCatZoneSection />
            <AdoptionProcessSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFC] text-[#111111] selection:bg-[#8B5CF6] selection:text-white font-sans">
      {/* Show Public Navbar on non-admin routes */}
      {!isAdminRoute && <Navbar />}

      {/* Main Page Content */}
      <main className="flex-1">{renderCurrentView()}</main>

      {/* Show Public Footer on non-admin routes */}
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
