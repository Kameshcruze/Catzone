import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from './AdminLayout';
import {
  Settings,
  MessageCircle,
  Save,
  Check,
  Building,
  Phone,
  Mail,
  MapPin,
  Globe,
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    }
  };

  return (
    <AdminLayout
      title="Platform & WhatsApp Settings"
      subtitle="Configure concierge destination WhatsApp number, default messaging templates, and business contact information."
    >
      <div className="max-w-4xl space-y-8">
        
        {savedSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>Settings successfully saved and synchronized across the marketplace.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* 1. WhatsApp Destination Settings */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 border-b border-purple-100 pb-4">
              <MessageCircle className="w-5 h-5 text-[#25D366]" />
              <h3 className="text-base font-serif font-bold text-[#191816]">
                1. WhatsApp Concierge Integration
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                Concierge WhatsApp Number (With Country Code) *
              </label>
              <input
                type="text"
                required
                placeholder="919585262522"
                value={formData.whatsapp_number}
                onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm font-mono focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
              <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                All &ldquo;Enquire on WhatsApp&rdquo; and concierge checkout buttons across the public website will route purchase leads to this WhatsApp number without modifying code. (Example format: <code>919585262522</code>)
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                WhatsApp Message Template
              </label>
              <textarea
                rows={4}
                value={formData.whatsapp_message_template}
                onChange={(e) => setFormData({ ...formData, whatsapp_message_template: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-xs font-mono focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
              <p className="text-[11px] text-stone-500 mt-1.5">
                Available placeholders: <code>{'{cat_name}'}</code>, <code>{'{cat_id}'}</code>, <code>{'{cat_breed}'}</code>, <code>{'{cat_price}'}</code>, <code>{'{customer_name}'}</code>, <code>{'{phone}'}</code>, <code>{'{city}'}</code>
              </p>
            </div>
          </div>

          {/* 2. Business & Contact Information */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 border-b border-purple-100 pb-4">
              <Building className="w-5 h-5 text-[#8B5CF6]" />
              <h3 className="text-base font-serif font-bold text-[#191816]">
                2. Business Identity & Contact Info
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                  Brand / Business Name
                </label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  value={formData.contact_phone}
                  onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                  Physical Cattery Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
                />
              </div>
            </div>
          </div>

          {/* 3. Homepage Headlines */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-sm space-y-6">
            <div className="flex items-center space-x-2 border-b border-purple-100 pb-4">
              <Globe className="w-5 h-5 text-[#8B5CF6]" />
              <h3 className="text-base font-serif font-bold text-[#191816]">
                3. Public Hero Copy
              </h3>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                Hero Title Headline
              </label>
              <input
                type="text"
                value={formData.hero_title}
                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#191816] mb-1">
                Hero Subtitle Copy
              </label>
              <textarea
                rows={2}
                value={formData.hero_subtitle}
                onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex items-center space-x-4">
            <button
              type="submit"
              className="flex-1 py-4 bg-luxury-gradient text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-lg shadow-purple-500/20 hover:shadow-xl transition flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Publish Settings</span>
            </button>
          </div>
        </form>

      </div>
    </AdminLayout>
  );
};
