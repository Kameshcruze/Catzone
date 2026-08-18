import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, Check, ShieldCheck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings, createEnquiry } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    message: '',
    interest: 'General Concierge Enquiry',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    createEnquiry({
      cat_id: 'GENERAL',
      cat_name: 'General Enquiry',
      cat_breed: formData.interest,
      cat_price: 0,
      customer_name: formData.name,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      message: `[Interest: ${formData.interest}] ${formData.message}`,
      status: 'New',
    });

    setSubmitted(true);
  };

  return (
    <div className="bg-[#FAF8FF] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#7C3AED]">
            CONCIERGE CONTACT
          </span>
          <h1 className="text-4xl sm:text-6xl font-display font-bold text-[#111111] tracking-tight">
            Connect with CatZone
          </h1>
          <p className="text-sm sm:text-base text-stone-600">
            Whether you seek a specific pedigree kitten, require transit guidance, or wish to schedule a private sanctuary visit, our feline concierge team is at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Left (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-purple-100/80 shadow-xs space-y-6">
              <h3 className="text-xl font-display font-bold text-[#111111]">
                Direct Concierge Desk
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-stone-600">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#8B5CF6] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111]">Direct Line</p>
                    <p>{settings.contact_phone}</p>
                    <p className="text-[11px] text-stone-500">Daily 9:00 AM – 9:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#8B5CF6] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111]">Email Correspondence</p>
                    <p>{settings.contact_email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#8B5CF6] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#111111]">Sanctuary Catteries</p>
                    <p>{settings.address}</p>
                    <p className="text-[11px] text-stone-500">Private visits by appointment only</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Box */}
              <div className="pt-4 border-t border-purple-100">
                <a
                  href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1EBE5D] hover:to-[#075E54] text-white text-xs uppercase tracking-widest font-semibold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant WhatsApp Chat</span>
                </a>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-purple-100 text-xs text-stone-600 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-[#111111] font-semibold">
                <Clock className="w-4 h-4 text-[#8B5CF6]" />
                <span>Response Time Guarantee</span>
              </div>
              <p>
                WhatsApp inquiries receive response in under 15 minutes during operating hours. We ensure complete privacy of all customer information.
              </p>
            </div>
          </div>

          {/* Form Right (7 cols) */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-purple-100/80 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-purple-50 text-[#7C3AED] mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display font-bold text-[#111111]">
                  Message Received
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                  Thank you for reaching out to CatZone. One of our feline adoption coordinators will connect with you shortly on WhatsApp / phone.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: '',
                      phone: '',
                      email: '',
                      city: '',
                      message: '',
                      interest: 'General Concierge Enquiry',
                    });
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#6D28D9] text-white text-xs uppercase tracking-wider font-semibold rounded-xl"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-2xl font-display font-bold text-[#111111] mb-4">
                  Send a Private Concierge Note
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Singhania"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                      WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. vikram@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                      City / Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Karur / Mumbai / Bengaluru"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                    Pedigree Breed of Interest
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="British Shorthair">British Shorthair</option>
                    <option value="Persian">Persian</option>
                    <option value="Maine Coon">Maine Coon</option>
                    <option value="Ragdoll">Ragdoll</option>
                    <option value="Siamese">Siamese</option>
                    <option value="Bengal">Bengal</option>
                    <option value="Scottish Fold">Scottish Fold</option>
                    <option value="Sphynx">Sphynx</option>
                    <option value="Russian Blue">Russian Blue</option>
                    <option value="Exotic Shorthair">Exotic Shorthair</option>
                    <option value="General Concierge Enquiry">General Concierge Enquiry / Multiple Breeds</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111] mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about your home, timeline, or preferred kitten characteristics..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#FAF8FF] border border-purple-100 rounded-xl text-sm focus:outline-none focus:border-[#8B5CF6] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white text-xs uppercase tracking-widest font-semibold rounded-xl shadow-lg hover:shadow-purple-500/25 transition flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Concierge Note</span>
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
