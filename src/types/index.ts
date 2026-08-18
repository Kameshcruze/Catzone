export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

export interface Cat {
  id: string;
  cat_id: string; // e.g. "CZ-101"
  name: string;
  category_id: string;
  breed: string;
  gender: 'Male' | 'Female';
  age: string; // e.g. "4 Months", "1.5 Years"
  date_of_birth: string;
  color: string;
  price: number;
  vaccinated: boolean;
  dewormed: boolean;
  health_status: string; // e.g. "Microchipped, Vet Certified, Triple-Vaccinated"
  personality: string; // e.g. "Playful, Affectionate, Purrs frequently"
  description: string;
  location: string;
  main_image: string;
  gallery_images: string[];
  is_available: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Completed' | 'Cancelled';

export interface Enquiry {
  id: string;
  cat_id: string;
  cat_name: string;
  cat_breed: string;
  cat_price: number;
  customer_name: string;
  phone: string;
  email: string;
  city?: string;
  message: string;
  status: EnquiryStatus;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  whatsapp_number: string; // e.g. "919876543210"
  business_name: string;
  contact_email: string;
  contact_phone: string;
  currency_symbol: string;
  address: string;
  instagram_handle: string;
  default_whatsapp_template: string;
  hero_title: string;
  hero_subtitle: string;
  announcement_bar: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager';
}

export type ActivePage =
  | 'home'
  | 'cats'
  | 'cat-detail'
  | 'categories'
  | 'category-detail'
  | 'about'
  | 'why-catzone'
  | 'faq'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'admin-login'
  | 'admin-dashboard'
  | 'admin-cats'
  | 'admin-cat-new'
  | 'admin-cat-edit'
  | 'admin-categories'
  | 'admin-enquiries'
  | 'admin-settings';
