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
  loginAdmin: (email: string, pass: string) => Promise<boolean>;
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
  const [cats, setCats] = useState<Cat[]>(DEFAULT_CATS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [enquiries, setEnquiries] = useState<Enquiry[]>(DEFAULT_ENQUIRIES);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH);
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

        const fetchedCats = (catsRes.data as unknown as Cat[]) || [];
        const fetchedCategories = (categoriesRes.data as unknown as Category[]) || [];
        const fetchedEnquiries = (enquiriesRes.data as unknown as Enquiry[]) || [];

        setCats(fetchedCats.length > 0 ? fetchedCats : DEFAULT_CATS);
        setCategories(fetchedCategories.length > 0 ? fetchedCategories : DEFAULT_CATEGORIES);
        setEnquiries(fetchedEnquiries.length > 0 ? fetchedEnquiries : DEFAULT_ENQUIRIES);
        
        if (settingsRes.data) {
          let loadedSettings = settingsRes.data as unknown as SiteSettings;
          
          // Auto-migrate old phone numbers to the new one
          if (loadedSettings.whatsapp_number !== '918270898054') {
             loadedSettings = { ...loadedSettings, whatsapp_number: '918270898054', contact_phone: '+91 82708 98054' };
             supabase.from('settings').update({ 
               whatsapp_number: '918270898054', 
               contact_phone: '+91 82708 98054' 
             }).eq('id', 'global_settings').then();
          }
          
          setSettings(loadedSettings);
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
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, isAdminLoggedIn ? 'true' : 'false');
    } catch (e) {
      console.warn('Failed to save auth state', e);
    }
  }, [isAdminLoggedIn]);

  // Handle Admin Inactivity Timeout (10 minutes)
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    let inactivityTimer: NodeJS.Timeout;
    
    const logout = () => {
      setIsAdminLoggedIn(false);
      setCurrentPage('admin-login');
      window.history.pushState(null, '', '/admin/login');
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(logout, 10 * 60 * 1000); // 10 minutes
    };

    const handleActivity = () => resetTimer();

    // Set initial timer
    resetTimer();

    // Listen to user activity events
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [isAdminLoggedIn]);

  // Handle URL path changes
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace(/^\/+/, '').trim();
      
      if (!path) {
        // default home
        setCurrentPage('home');
        setNavParams({});
        return;
      }
      
      if (path.startsWith('cat/')) {
        const catId = path.replace('cat/', '');
        setCurrentPage('cat-detail');
        setNavParams({ catId });
      } else if (path.startsWith('category/')) {
        const slug = path.replace('category/', '');
        setCurrentPage('category-detail');
        setNavParams({ categorySlug: slug });
      } else if (path.startsWith('admin/cats/edit/')) {
        const editCatId = path.replace('admin/cats/edit/', '');
        setCurrentPage('admin-cat-edit');
        setNavParams({ editCatId });
      } else if (path === 'admin/login') {
        setCurrentPage('admin-login');
      } else if (path === 'admin' || path === 'admin/dashboard') {
        setCurrentPage('admin-dashboard');
      } else if (path === 'admin/cats') {
        setCurrentPage('admin-cats');
      } else if (path === 'admin/cats/new') {
        setCurrentPage('admin-cat-new');
      } else if (path === 'admin/categories') {
        setCurrentPage('admin-categories');
      } else if (path === 'admin/enquiries') {
        setCurrentPage('admin-enquiries');
      } else if (path === 'admin/settings') {
        setCurrentPage('admin-settings');
      } else if (
        ['cats', 'categories', 'about', 'why-catzone', 'faq', 'contact', 'privacy', 'terms'].includes(path)
      ) {
        setCurrentPage(path as ActivePage);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigate = (page: ActivePage, params?: NavigationParams) => {
    setCurrentPage(page);
    setNavParams(params || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update browser path for bookmarking and back button
    let newPath = '/';
    switch (page) {
      case 'home':
        newPath = '/';
        break;
      case 'cats':
        newPath = '/cats';
        break;
      case 'cat-detail':
        newPath = `/cat/${params?.catId || ''}`;
        break;
      case 'categories':
        newPath = '/categories';
        break;
      case 'category-detail':
        newPath = `/category/${params?.categorySlug || ''}`;
        break;
      case 'about':
        newPath = '/about';
        break;
      case 'why-catzone':
        newPath = '/why-catzone';
        break;
      case 'faq':
        newPath = '/faq';
        break;
      case 'contact':
        newPath = '/contact';
        break;
      case 'privacy':
        newPath = '/privacy';
        break;
      case 'terms':
        newPath = '/terms';
        break;
      case 'admin-login':
        newPath = '/admin/login';
        break;
      case 'admin-dashboard':
        newPath = '/admin/dashboard';
        break;
      case 'admin-cats':
        newPath = '/admin/cats';
        break;
      case 'admin-cat-new':
        newPath = '/admin/cats/new';
        break;
      case 'admin-cat-edit':
        newPath = `/admin/cats/edit/${params?.editCatId || ''}`;
        break;
      case 'admin-categories':
        newPath = '/admin/categories';
        break;
      case 'admin-enquiries':
        newPath = '/admin/enquiries';
        break;
      case 'admin-settings':
        newPath = '/admin/settings';
        break;
    }

    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
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
  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanPass = pass.trim();
      
      const encoder = new TextEncoder();
      
      // Hash email
      const emailBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(cleanEmail));
      const emailHash = Array.from(new Uint8Array(emailBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Hash password
      const passBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(cleanPass));
      const passHash = Array.from(new Uint8Array(passBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
      
      // Pre-calculated SHA-256 hashes
      const admin1 = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // 'admin'
      const admin2 = '4a04a6bc870615d3b92679fe2443a3ef64c33eda89cdaaaa2bcc4e2617f72ba1'; // 'admin@catzone.in'
      
      const pass1 = 'ac9689e2272427085e35b9d3e3e8bed88cb3434828b43b86fc0596cad4c6e270'; // 'admin1234'
      const pass2 = '372962a119f8d8436e432363f77b893e882fedf0a4c51d498faf0730082de4b2'; // 'catzone2026'

      if (
        (emailHash === admin1 && passHash === pass1) ||
        (emailHash === admin2 && passHash === pass1) ||
        (emailHash === admin1 && passHash === pass2) ||
        (emailHash === admin2 && passHash === pass2)
      ) {
        setIsAdminLoggedIn(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Auth error", error);
      return false;
    }
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
