import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
// Load from .env if it exists, though vite exposes them as VITE_
const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
if(!url) console.log("NO URL");
