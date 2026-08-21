-- Create tables for CatZone application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Cats Table
CREATE TABLE IF NOT EXISTS cats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cat_id TEXT NOT NULL,
    name TEXT NOT NULL,
    category_id TEXT NOT NULL,
    breed TEXT NOT NULL,
    gender TEXT NOT NULL,
    age TEXT,
    date_of_birth TEXT,
    color TEXT,
    price INTEGER NOT NULL,
    vaccinated BOOLEAN DEFAULT false,
    dewormed BOOLEAN DEFAULT false,
    health_status TEXT,
    personality TEXT,
    description TEXT,
    location TEXT,
    main_image TEXT,
    gallery_images TEXT[] DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cat_id TEXT NOT NULL,
    cat_name TEXT NOT NULL,
    cat_breed TEXT NOT NULL,
    cat_price INTEGER NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    city TEXT,
    message TEXT,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Settings Table (Only one row expected)
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY DEFAULT 'global_settings',
    whatsapp_number TEXT,
    business_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    currency_symbol TEXT,
    address TEXT,
    instagram_handle TEXT,
    default_whatsapp_template TEXT,
    hero_title TEXT,
    hero_subtitle TEXT,
    announcement_bar TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Row Level Security (RLS) Setup

-- Enable RLS on all tables
ALTER TABLE cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public reading
CREATE POLICY "Allow public read access to cats" ON cats FOR SELECT USING (true);
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to settings" ON settings FOR SELECT USING (true);

-- Allow public to insert enquiries
CREATE POLICY "Allow public insert to enquiries" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to own enquiries or all" ON enquiries FOR SELECT USING (true);

-- Create policies for admin writing
-- We allow all for now since auth is local.
CREATE POLICY "Allow all operations for cats" ON cats FOR ALL USING (true);
CREATE POLICY "Allow all operations for categories" ON categories FOR ALL USING (true);
CREATE POLICY "Allow all operations for enquiries" ON enquiries FOR ALL USING (true);
CREATE POLICY "Allow all operations for settings" ON settings FOR ALL USING (true);
