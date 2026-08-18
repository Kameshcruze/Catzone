import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from './AdminLayout';
import { Enquiry } from '../../types';
import {
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  Trash2,
  Filter,
} from 'lucide-react';

export const AdminEnquiries: React.FC = () => {
  const { enquiries, updateEnquiryStatus, deleteEnquiry, settings } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEnquiries = enquiries.filter((enq) => {
    if (filterStatus !== 'all' && enq.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = enq.customer_name.toLowerCase().includes(q);
      const matchCat = enq.cat_name.toLowerCase().includes(q);
      const matchPhone = enq.phone.includes(q);
      const matchCity = enq.city?.toLowerCase().includes(q);
      if (!matchName && !matchCat && !matchPhone && !matchCity) return false;
    }
    return true;
  });

  return (
    <AdminLayout
      title="WhatsApp Adoption Inquiries"
      subtitle="Track customer leads generated from the public concierge WhatsApp checkout flow."
    >
      <div className="space-y-6 max-w-7xl">
        
        {/* Filter Controls */}
        <div className="bg-white rounded-2xl border border-purple-100 p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer name, cat name, phone or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#FAF8FF] border border-purple-100 rounded-xl text-xs text-[#191816] focus:outline-none focus:border-[#8B5CF6] focus:ring-2 focus:ring-[#8B5CF6]/20"
            />
          </div>

          <div className="flex items-center space-x-2">
            {['all', 'New', 'Contacted', 'Completed', 'Cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition ${
                  filterStatus === status
                    ? 'bg-luxury-gradient text-white shadow-md shadow-purple-500/20'
                    : 'bg-purple-50 text-stone-600 border border-purple-100 hover:text-[#191816]'
                }`}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>
        </div>

        {/* Enquiries List */}
        <div className="space-y-4">
          {filteredEnquiries.length > 0 ? (
            filteredEnquiries.map((enq) => (
              <div
                key={enq.id}
                className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm space-y-4 hover:border-purple-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-[#8B5CF6] flex items-center justify-center font-bold font-serif text-sm">
                      {enq.customer_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-base text-[#191816]">
                        {enq.customer_name}
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Inquired on {new Date(enq.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-stone-500 font-semibold uppercase">Status:</span>
                    <select
                      value={enq.status}
                      onChange={(e: any) => updateEnquiryStatus(enq.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${
                        enq.status === 'New'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : enq.status === 'Contacted'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : enq.status === 'Completed'
                          ? 'bg-stone-100 text-stone-800 border-stone-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      <option value="New">New Lead</option>
                      <option value="Contacted">Contacted Adopter</option>
                      <option value="Completed">Adoption Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                    <button
                      onClick={() => deleteEnquiry(enq.id)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                      title="Delete Record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Companion */}
                  <div className="p-3.5 bg-[#FAF8FF] rounded-2xl border border-purple-100 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                      Target Feline
                    </span>
                    <p className="font-serif font-bold text-sm text-[#191816]">
                      {enq.cat_name}
                    </p>
                    <p className="text-stone-600">
                      {enq.cat_breed} ({enq.cat_id})
                    </p>
                    {enq.cat_price > 0 && (
                      <p className="text-[#8B5CF6] font-bold">
                        ₹{enq.cat_price.toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="p-3.5 bg-[#FAF8FF] rounded-2xl border border-purple-100 space-y-1.5 text-[#191816]">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                      Adopter Details
                    </span>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-[#8B5CF6]" />
                      <span className="font-semibold">{enq.phone}</span>
                    </div>
                    {enq.email && (
                      <div className="flex items-center space-x-2 text-stone-500">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{enq.email}</span>
                      </div>
                    )}
                    {enq.city && (
                      <div className="flex items-center space-x-2 text-stone-500">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{enq.city}</span>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Quick Link */}
                  <div className="p-3.5 bg-[#FAF8FF] rounded-2xl border border-purple-100 flex flex-col justify-between space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold block">
                      Concierge Action
                    </span>
                    <p className="text-[11px] text-stone-500">
                      Instant WhatsApp response directly with prefilled name & feline ID.
                    </p>
                    <a
                      href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                        enq.customer_name
                      )},%20I%20am%20contacting%20you%20from%20CatZone.in%20regarding%20your%20adoption%20enquiry%20for%20${encodeURIComponent(
                        enq.cat_name
                      )}%20(${encodeURIComponent(enq.cat_id)}).`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition flex items-center justify-center space-x-1.5 shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Open WhatsApp Chat</span>
                    </a>
                  </div>
                </div>

                {/* Custom Note/Message */}
                {enq.message && (
                  <div className="pt-2 text-xs text-stone-600 bg-purple-50/50 p-3 rounded-xl border border-purple-100">
                    <strong className="text-[#191816]">Client Note:</strong> &ldquo;{enq.message}&rdquo;
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl border border-purple-100 p-12 text-center space-y-3">
              <MessageSquare className="w-10 h-10 text-stone-400 mx-auto opacity-50" />
              <p className="text-sm font-semibold text-[#191816]">No inquiries matching this filter</p>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
};
