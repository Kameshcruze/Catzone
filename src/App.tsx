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
  const { currentPage } = useStore();

  // Scroll to top on page switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const isAdminRoute = currentPage.startsWith('admin-');

  // Render Current Page
  const renderCurrentView = () => {
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

      // Admin views
      case 'admin-login':
        return <AdminLogin />;

      case 'admin-dashboard':
        return <AdminDashboard />;

      case 'admin-cats':
        return <AdminCatsList />;

      case 'admin-cat-new':
      case 'admin-cat-edit':
        return <AdminCatForm />;

      case 'admin-categories':
        return <AdminCategories />;

      case 'admin-enquiries':
        return <AdminEnquiries />;

      case 'admin-settings':
        return <AdminSettings />;

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
