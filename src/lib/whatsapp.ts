import { Cat, SiteSettings } from '../types';

export interface CheckoutCustomerData {
  customer_name: string;
  phone: string;
  email: string;
  city?: string;
  message?: string;
}

export function cleanPhoneNumber(phone: string): string {
  // Strip all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // If starts with 0, replace with 91 for India default, or keep if 12+ digits
  if (digits.length === 10) {
    return `91${digits}`;
  }
  return digits;
}

export function generateWhatsAppMessage(
  cat: Cat,
  customer: CheckoutCustomerData,
  settings: SiteSettings
): string {
  let template = settings.default_whatsapp_template || `Hello CatZone,

I would like to enquire about purchasing this cat:

Cat: {cat_name}
Breed: {breed}
Gender: {gender}
Age: {age}
Color: {color}
Cat ID: {cat_id}
Price: ₹{price}

Customer Name: {customer_name}
Phone: {phone}
Email: {email}
City: {city}

Message: {message}

Please confirm availability and next steps.`;

  const replacements: Record<string, string> = {
    '{cat_name}': cat.name,
    '{breed}': cat.breed,
    '{gender}': cat.gender,
    '{age}': cat.age,
    '{color}': cat.color,
    '{cat_id}': cat.cat_id,
    '{price}': cat.price.toLocaleString('en-IN'),
    '{customer_name}': customer.customer_name || 'Valued Customer',
    '{phone}': customer.phone || 'Not provided',
    '{email}': customer.email || 'Not provided',
    '{city}': customer.city || 'India',
    '{message}': customer.message || 'Looking forward to welcoming this companion home.',
  };

  for (const [key, value] of Object.entries(replacements)) {
    template = template.replaceAll(key, value);
  }

  return template;
}

export function generateWhatsAppUrl(
  cat: Cat,
  customer: CheckoutCustomerData,
  settings: SiteSettings
): string {
  const targetNumber = cleanPhoneNumber(settings.whatsapp_number || '918270898054');
  const messageText = generateWhatsAppMessage(cat, customer, settings);
  const encodedText = encodeURIComponent(messageText);
  return `https://wa.me/${targetNumber}?text=${encodedText}`;
}
