import React, { createContext, useContext, useState, useEffect } from 'react';
import { Cat, Category, Enquiry, EnquiryStatus, SiteSettings, ActivePage } from '../types';
import { DEFAULT_CATS, DEFAULT_CATEGORIES, DEFAULT_ENQUIRIES, DEFAULT_SETTINGS } from '../data/seedData';

interface NavigationParams {
  catId?: string;
  categorySlug?: string;
  editCatId?: string;
  searchTerm?: string;
  selectedCategory?: string;
}

interface StoreContextType {
  cats: Cat[];
  categories: Category[];
  enquiries: Enquiry[];
  settings: SiteSettings;
  isAdminLoggedIn: boolean;
  currentPage: ActivePage;
  navParams: NavigationParams;
  
  // Navigation
  navigate: (page: ActivePage, params?: NavigationParams) => void;
  
  // Cat Actions
  addCat: (cat: Omit<Cat, 'id' | 'created_at' | 'updated_at'>) => Cat;
  updateCat: (id: string, cat: Partial<Cat>) => void;
  deleteCat: (id: string) => void;
  toggleAvailability: (id: string) => void;
  
  // Category Actions
  addCategory: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => Category;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  
  // Enquiry Actions
  createEnquiry: (enquiry: Omit<Enquiry, 'id' | 'created_at'>) => Enquiry;
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => void;
  deleteEnquiry: (id: string) => void;
  
  // Settings Actions
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  resetToDefaults: () => void;
  
  // Auth Actions
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  
  // Quick Lookups
  getCatById: (id: string) => Cat | undefined;
  getCatByCatCode: (code: string) => Cat | undefined;
  getCategoryBySlug: (slug: string) => Category | undefined;
  getAvailableCountByCategory: (categoryId: string) => number;
  getTotalCountByCategory: (categoryId: string) => number;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  CATS: 'catzone_cats_v1',
  CATEGORIES: 'catzone_categories_v1',
  ENQUIRIES: 'catzone_enquiries_v1',
  SETTINGS: 'catzone_settings_v1',
  ADMIN_AUTH: 'catzone_admin_auth_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cats, setCats] = useState<Cat[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATS);
      return saved ? JSON.parse(saved) : DEFAULT_CATS;
    } catch {
      return DEFAULT_CATS;
    }
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [enquiries, setEnquiries] = useState<Enquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      return saved ? JSON.parse(saved) : DEFAULT_ENQUIRIES;
    } catch {
      return DEFAULT_ENQUIRIES;
    }
  });

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new contact information is always prioritized
        const cleanedAnnouncement = parsed.announcement_bar
          ? parsed.announcement_bar.replace(/✨/g, '').trim()
          : DEFAULT_SETTINGS.announcement_bar;

        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          announcement_bar: cleanedAnnouncement,
          whatsapp_number: parsed.whatsapp_number === '919840012345' ? '919585262522' : parsed.whatsapp_number || '919585262522',
          contact_email: parsed.contact_email === 'concierge@catzone.in' ? 'support@catzone.in' : parsed.contact_email || 'support@catzone.in',
          contact_phone: parsed.contact_phone === '+91 (0) 98400 12345' ? '+91 95852 62522' : parsed.contact_phone || '+91 95852 62522',
          address: parsed.address && parsed.address.includes('Jubilee Hills') ? 'CatZone Sanctuary & Cattery, Karur, India' : parsed.address || 'CatZone Sanctuary & Cattery, Karur, India',
        };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const [currentPage, setCurrentPage] = useState<ActivePage>('home');
  const [navParams, setNavParams] = useState<NavigationParams>({});

  // Sync to local storage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATS, JSON.stringify(cats));
    } catch (e) {
      console.warn('Failed to save cats to localStorage', e);
    }
  }, [cats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.warn('Failed to save categories to localStorage', e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
    } catch (e) {
      console.warn('Failed to save enquiries to localStorage', e);
    }
  }, [enquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to localStorage', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdminLoggedIn ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to save auth state', e);
    }
  }, [isAdminLoggedIn]);

  // Handle URL hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) {
        // default home
        return;
      }
      
      if (hash.startsWith('cat/')) {
        const catId = hash.replace('cat/', '');
        setCurrentPage('cat-detail');
        setNavParams({ catId });
      } else if (hash.startsWith('category/')) {
        const slug = hash.replace('category/', '');
        setCurrentPage('category-detail');
        setNavParams({ categorySlug: slug });
      } else if (hash.startsWith('admin/cats/edit/')) {
        const editCatId = hash.replace('admin/cats/edit/', '');
        setCurrentPage('admin-cat-edit');
        setNavParams({ editCatId });
      } else if (hash === 'admin/login') {
        setCurrentPage('admin-login');
      } else if (hash === 'admin' || hash === 'admin/dashboard') {
        setCurrentPage('admin-dashboard');
      } else if (hash === 'admin/cats') {
        setCurrentPage('admin-cats');
      } else if (hash === 'admin/cats/new') {
        setCurrentPage('admin-cat-new');
      } else if (hash === 'admin/categories') {
        setCurrentPage('admin-categories');
      } else if (hash === 'admin/enquiries') {
        setCurrentPage('admin-enquiries');
      } else if (hash === 'admin/settings') {
        setCurrentPage('admin-settings');
      } else if (
        ['cats', 'categories', 'about', 'why-catzone', 'faq', 'contact', 'privacy', 'terms'].includes(hash)
      ) {
        setCurrentPage(hash as ActivePage);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: ActivePage, params?: NavigationParams) => {
    setCurrentPage(page);
    setNavParams(params || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update browser hash for bookmarking and back button
    let newHash = '';
    switch (page) {
      case 'home':
        newHash = '';
        break;
      case 'cats':
        newHash = '#cats';
        break;
      case 'cat-detail':
        newHash = `#cat/${params?.catId || ''}`;
        break;
      case 'categories':
        newHash = '#categories';
        break;
      case 'category-detail':
        newHash = `#category/${params?.categorySlug || ''}`;
        break;
      case 'about':
        newHash = '#about';
        break;
      case 'why-catzone':
        newHash = '#why-catzone';
        break;
      case 'faq':
        newHash = '#faq';
        break;
      case 'contact':
        newHash = '#contact';
        break;
      case 'privacy':
        newHash = '#privacy';
        break;
      case 'terms':
        newHash = '#terms';
        break;
      case 'admin-login':
        newHash = '#admin/login';
        break;
      case 'admin-dashboard':
        newHash = '#admin/dashboard';
        break;
      case 'admin-cats':
        newHash = '#admin/cats';
        break;
      case 'admin-cat-new':
        newHash = '#admin/cats/new';
        break;
      case 'admin-cat-edit':
        newHash = `#admin/cats/edit/${params?.editCatId || ''}`;
        break;
      case 'admin-categories':
        newHash = '#admin/categories';
        break;
      case 'admin-enquiries':
        newHash = '#admin/enquiries';
        break;
      case 'admin-settings':
        newHash = '#admin/settings';
        break;
    }

    if (window.location.hash !== newHash) {
      if (!newHash) {
        window.history.pushState(null, '', window.location.pathname);
      } else {
        window.location.hash = newHash;
      }
    }
  };

  // Cat Operations
  const addCat = (catData: Omit<Cat, 'id' | 'created_at' | 'updated_at'>): Cat => {
    const id = `cat-${Date.now()}`;
    const now = new Date().toISOString();
    const newCat: Cat = {
      ...catData,
      id,
      created_at: now,
      updated_at: now,
    };
    setCats((prev) => [newCat, ...prev]);
    return newCat;
  };

  const updateCat = (id: string, updatedFields: Partial<Cat>) => {
    const now = new Date().toISOString();
    setCats((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields, updated_at: now } : item))
    );
  };

  const deleteCat = (id: string) => {
    setCats((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleAvailability = (id: string) => {
    const now = new Date().toISOString();
    setCats((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_available: !item.is_available, updated_at: now } : item
      )
    );
  };

  // Category Operations
  const addCategory = (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Category => {
    const id = `cat-cat-${Date.now()}`;
    const now = new Date().toISOString();
    const newCat: Category = {
      ...categoryData,
      id,
      created_at: now,
      updated_at: now,
    };
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    const now = new Date().toISOString();
    setCategories((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updatedFields, updated_at: now } : item
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((item) => item.id !== id));
  };

  // Enquiry Operations
  const createEnquiry = (enquiryData: Omit<Enquiry, 'id' | 'created_at'>): Enquiry => {
    const id = `enq-${Date.now()}`;
    const newEnq: Enquiry = {
      ...enquiryData,
      id,
      created_at: new Date().toISOString(),
    };
    setEnquiries((prev) => [newEnq, ...prev]);
    return newEnq;
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries((prev) => prev.filter((item) => item.id !== id));
  };

  // Settings
  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      updated_at: new Date().toISOString(),
    }));
  };

  const resetToDefaults = () => {
    setCats(DEFAULT_CATS);
    setCategories(DEFAULT_CATEGORIES);
    setEnquiries(DEFAULT_ENQUIRIES);
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEYS.CATS, JSON.stringify(DEFAULT_CATS));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(DEFAULT_ENQUIRIES));
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    } catch {
      // ignore
    }
  };

  // Admin Auth
  const loginAdmin = (email: string, pass: string): boolean => {
    // Verified admin credential handler
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    if (
      (cleanEmail === 'admin' && cleanPass === 'admin1234') ||
      (cleanEmail === 'admin@catzone.in' && cleanPass === 'admin1234') ||
      (cleanEmail === 'admin' && cleanPass === 'catzone2026') ||
      (cleanEmail === 'admin@catzone.in' && cleanPass === 'catzone2026')
    ) {
      setIsAdminLoggedIn(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    navigate('home');
  };

  // Helpers
  const getCatById = (id: string) => cats.find((c) => c.id === id || c.cat_id === id);
  const getCatByCatCode = (code: string) =>
    cats.find((c) => c.cat_id.toLowerCase() === code.toLowerCase());

  const getCategoryBySlug = (slug: string) =>
    categories.find((cat) => cat.slug.toLowerCase() === slug.toLowerCase());

  const getAvailableCountByCategory = (categoryId: string) =>
    cats.filter((c) => c.category_id === categoryId && c.is_available).length;

  const getTotalCountByCategory = (categoryId: string) =>
    cats.filter((c) => c.category_id === categoryId).length;

  return (
    <StoreContext.Provider
      value={{
        cats,
        categories,
        enquiries,
        settings,
        isAdminLoggedIn,
        currentPage,
        navParams,
        navigate,
        addCat,
        updateCat,
        deleteCat,
        toggleAvailability,
        addCategory,
        updateCategory,
        deleteCategory,
        createEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        updateSettings,
        resetToDefaults,
        loginAdmin,
        logoutAdmin,
        getCatById,
        getCatByCatCode,
        getCategoryBySlug,
        getAvailableCountByCategory,
        getTotalCountByCategory,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
