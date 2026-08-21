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
  isLoading: boolean;
  error: string | null;
  
  // Navigation
  navigate: (page: ActivePage, params?: NavigationParams) => void;
  
  // Cat Actions
  addCat: (cat: Omit<Cat, 'id' | 'created_at' | 'updated_at'>) => Promise<Cat>;
  updateCat: (id: string, cat: Partial<Cat>) => Promise<void>;
  deleteCat: (id: string) => Promise<void>;
  toggleAvailability: (id: string) => Promise<void>;
  
  // Category Actions
  addCategory: (category: Omit<Category, 'id' | 'created_at' | 'updated_at'>) => Promise<Category>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Enquiry Actions
  createEnquiry: (enquiry: Omit<Enquiry, 'id' | 'created_at'>) => Promise<Enquiry>;
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  
  // Settings Actions
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  
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

import { supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  ADMIN_AUTH: 'catzone_admin_auth_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cats, setCats] = useState<Cat[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

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
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const [catsRes, categoriesRes, enquiriesRes, settingsRes] = await Promise.all([
          supabase.from('cats').select('*').order('created_at', { ascending: false }),
          supabase.from('categories').select('*').order('display_order', { ascending: true }),
          supabase.from('enquiries').select('*').order('created_at', { ascending: false }),
          supabase.from('settings').select('*').eq('id', 'global_settings').maybeSingle()
        ]);

        if (catsRes.error) throw new Error(catsRes.error.message);
        if (categoriesRes.error) throw new Error(categoriesRes.error.message);
        if (enquiriesRes.error) throw new Error(enquiriesRes.error.message);
        if (settingsRes.error) throw new Error(settingsRes.error.message);

        setCats((catsRes.data as unknown as Cat[]) || []);
        setCategories((categoriesRes.data as unknown as Category[]) || []);
        setEnquiries((enquiriesRes.data as unknown as Enquiry[]) || []);
        
        if (settingsRes.data) {
          setSettings(settingsRes.data as unknown as SiteSettings);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch data from Supabase.');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

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
  const addCat = async (catData: Omit<Cat, 'id' | 'created_at' | 'updated_at'>): Promise<Cat> => {
    const { data, error } = await supabase.from('cats').insert([{ ...catData }]).select().single();
    if (error) throw new Error(error.message);
    const newCat = data as unknown as Cat;
    setCats((prev) => [newCat, ...prev]);
    return newCat;
  };

  const updateCat = async (id: string, updatedFields: Partial<Cat>): Promise<void> => {
    const { error } = await supabase.from('cats').update({ ...updatedFields, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw new Error(error.message);
    setCats((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updatedFields, updated_at: new Date().toISOString() } : item))
    );
  };

  const deleteCat = async (id: string): Promise<void> => {
    const { error } = await supabase.from('cats').delete().eq('id', id);
    if (error) throw new Error(error.message);
    setCats((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleAvailability = async (id: string): Promise<void> => {
    const cat = cats.find(c => c.id === id);
    if (!cat) return;
    const { error } = await supabase.from('cats').update({ is_available: !cat.is_available, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw new Error(error.message);
    setCats((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, is_available: !item.is_available, updated_at: new Date().toISOString() } : item
      )
    );
  };

  // Category Operations
  const addCategory = async (categoryData: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> => {
    // Generate a simple id since categories uses TEXT id
    const id = categoryData.slug || `cat-${Date.now()}`;
    const { data, error } = await supabase.from('categories').insert([{ ...categoryData, id }]).select().single();
    if (error) throw new Error(error.message);
    const newCat = data as unknown as Category;
    setCategories((prev) => [...prev, newCat]);
    return newCat;
  };

  const updateCategory = async (id: string, updatedFields: Partial<Category>): Promise<void> => {
    const { error } = await supabase.from('categories').update({ ...updatedFields, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) throw new Error(error.message);
    setCategories((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updatedFields, updated_at: new Date().toISOString() } : item
      )
    );
  };

  const deleteCategory = async (id: string): Promise<void> => {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw new Error(error.message);
    setCategories((prev) => prev.filter((item) => item.id !== id));
  };

  // Enquiry Operations
  const createEnquiry = async (enquiryData: Omit<Enquiry, 'id' | 'created_at'>): Promise<Enquiry> => {
    const { data, error } = await supabase.from('enquiries').insert([{ ...enquiryData }]).select().single();
    if (error) throw new Error(error.message);
    const newEnq = data as unknown as Enquiry;
    setEnquiries((prev) => [newEnq, ...prev]);
    return newEnq;
  };

  const updateEnquiryStatus = async (id: string, status: EnquiryStatus): Promise<void> => {
    const { error } = await supabase.from('enquiries').update({ status }).eq('id', id);
    if (error) throw new Error(error.message);
    setEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status } : item))
    );
  };

  const deleteEnquiry = async (id: string): Promise<void> => {
    const { error } = await supabase.from('enquiries').delete().eq('id', id);
    if (error) throw new Error(error.message);
    setEnquiries((prev) => prev.filter((item) => item.id !== id));
  };

  // Settings
  const updateSettings = async (newSettings: Partial<SiteSettings>): Promise<void> => {
    const { data, error } = await supabase.from('settings').update({ ...newSettings, updated_at: new Date().toISOString() }).eq('id', 'global_settings').select().single();
    if (error) {
       // if global_settings doesn't exist, we should upsert it
       const { error: upsertError } = await supabase.from('settings').upsert({ id: 'global_settings', ...settings, ...newSettings, updated_at: new Date().toISOString() });
       if (upsertError) throw new Error(upsertError.message);
    }
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
      updated_at: new Date().toISOString(),
    }));
  };

  const resetToDefaults = async (): Promise<void> => {
    // Note: Reset to defaults in a production DB might require truncating tables.
    // For now we just reset the local state, but usually you wouldn't reset DB defaults globally without care.
    console.warn("Reset to defaults does not wipe the Supabase database automatically.");
    setCats(DEFAULT_CATS);
    setCategories(DEFAULT_CATEGORIES);
    setEnquiries(DEFAULT_ENQUIRIES);
    setSettings(DEFAULT_SETTINGS);
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
        isLoading,
        error,
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
