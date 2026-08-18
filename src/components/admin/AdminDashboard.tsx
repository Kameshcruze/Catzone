import React from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from './AdminLayout';
import { normalizeImageUrl, DEFAULT_FALLBACK_IMAGE } from '../../utils/imageUtils';
import {
  Cat as CatIcon,
  CheckCircle2,
  XCircle,
  FolderTree,
  MessageSquare,
  TrendingUp,
  PlusCircle,
  ExternalLink,
  ArrowRight,
  Phone,
  Clock,
  Eye,
  Edit,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    cats,
    categories,
    enquiries,
    settings,
    navigate,
    toggleAvailability,
    updateEnquiryStatus,
  } = useStore();

  const totalCats = cats.length;
  const availableCats = cats.filter((c) => c.is_available).length;
  const soldCats = cats.filter((c) => !c.is_available).length;
  const totalCategories = categories.length;
  const newEnquiries = enquiries.filter((e) => e.status === 'New').length;

  const totalInventoryValue = cats
    .filter((c) => c.is_available)
    .reduce((acc, curr) => acc + curr.price, 0);

  const recentEnquiries = enquiries.slice(0, 5);
  const recentCats = cats.slice(0, 5);

  const availablePercentage = totalCats > 0 ? Math.round((availableCats / totalCats) * 100) : 0;

  return (
    <AdminLayout
      title="Good morning, Admin."
      subtitle="Here is an overview of your cattery inventory, availability statuses, and WhatsApp adoption requests."
      actionButton={
        <button
          onClick={() => navigate('admin-cat-new')}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-luxury-gradient text-white text-xs uppercase tracking-widest font-semibold rounded-full shadow-md shadow-purple-500/20 hover:shadow-lg transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Cat</span>
        </button>
      }
    >
      <div className="space-y-8 max-w-7xl">
        
        {/* Top 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Stat 1 */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs uppercase tracking-wider font-semibold">Total Felines</span>
              <CatIcon className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <div className="text-3xl font-display font-bold text-[#191816]">
              {totalCats}
            </div>
            <p className="text-[11px] text-stone-500">
              Across {totalCategories} pedigree breeds
            </p>
          </div>

          {/* Stat 2 */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs uppercase tracking-wider font-semibold">Available in Cattery</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-display font-bold text-emerald-700">
              {availableCats}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">
              {availablePercentage}% of total catalog
            </p>
          </div>

          {/* Stat 3 */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs uppercase tracking-wider font-semibold">Sold Out / Adopted</span>
              <XCircle className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <div className="text-3xl font-display font-bold text-[#8B5CF6]">
              {soldCats}
            </div>
            <p className="text-[11px] text-stone-500">
              Companions in forever homes
            </p>
          </div>

          {/* Stat 4 */}
          <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-stone-500">
              <span className="text-xs uppercase tracking-wider font-semibold">New Enquiries</span>
              <MessageSquare className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-display font-bold text-[#191816]">
              {newEnquiries}
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">
              {enquiries.length} total WhatsApp leads
            </p>
          </div>
        </div>

        {/* Availability Ratio & Config Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Availability breakdown bar */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-purple-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-display font-bold text-[#191816]">
                Catalog Availability Distribution
              </h3>
              <span className="text-xs font-semibold text-[#8B5CF6]">
                Active Inventory Fee: ₹{totalInventoryValue.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Visual ratio bar */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-purple-50 rounded-full overflow-hidden flex border border-purple-100">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${availablePercentage}%` }}
                  title={`Available: ${availableCats}`}
                />
                <div
                  className="bg-[#8B5CF6] h-full transition-all duration-500"
                  style={{ width: `${100 - availablePercentage}%` }}
                  title={`Sold Out: ${soldCats}`}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-1 font-medium">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Available ({availableCats} cats)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6]" />
                  <span>Sold Out ({soldCats} cats)</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed pt-2 border-t border-purple-100">
              💡 <strong>Instant Availability Rule:</strong> Switching a cat to &ldquo;OFF&rdquo; immediately shows &ldquo;SOLD OUT&rdquo; on the public customer catalog, preventing conflicting purchase inquiries while preserving full search visibility.
            </p>
          </div>

          {/* WhatsApp Settings Quick Glance */}
          <div className="bg-gradient-to-br from-[#130E20] to-[#201538] text-white p-6 rounded-3xl border border-purple-900/40 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-purple-300">
                Active WhatsApp Integration
              </span>
              <h4 className="text-lg font-display font-bold text-white">
                +{settings.whatsapp_number}
              </h4>
              <p className="text-xs text-purple-200">
                Connected to: {settings.business_name}
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-purple-900/50">
              <button
                onClick={() => navigate('admin-settings')}
                className="w-full py-2.5 bg-luxury-gradient text-white text-xs uppercase tracking-wider font-semibold rounded-full shadow-md shadow-purple-500/20 hover:opacity-95 transition"
              >
                Configure WhatsApp Settings
              </button>
            </div>
          </div>
        </div>

        {/* Recent WhatsApp Enquiries Table */}
        <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-[#8B5CF6]" />
              <h3 className="text-base font-display font-bold text-[#191816]">
                Recent WhatsApp Customer Inquiries
              </h3>
            </div>
            <button
              onClick={() => navigate('admin-enquiries')}
              className="text-xs font-semibold text-[#8B5CF6] hover:underline"
            >
              View All ({enquiries.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-purple-100 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Contact</th>
                  <th className="pb-3">Companion Requested</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-purple-50/30 transition">
                    <td className="py-3 font-semibold text-[#191816]">
                      {enq.customer_name}
                      {enq.city && <span className="text-[10px] text-stone-500 block">{enq.city}</span>}
                    </td>
                    <td className="py-3 text-stone-600">
                      <span>{enq.phone}</span>
                    </td>
                    <td className="py-3">
                      <span className="font-semibold text-[#191816]">{enq.cat_name}</span>
                      <span className="text-[10px] text-stone-500 block">{enq.cat_breed} ({enq.cat_id})</span>
                    </td>
                    <td className="py-3 text-stone-600">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      <select
                        value={enq.status}
                        onChange={(e: any) => updateEnquiryStatus(enq.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
                          enq.status === 'New'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : enq.status === 'Contacted'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : enq.status === 'Completed'
                            ? 'bg-stone-100 text-stone-800 border-stone-300'
                            : 'bg-rose-50 text-rose-800 border-rose-300'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <a
                        href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(
                          enq.customer_name
                        )},%20thank%20you%20for%20contacting%20CatZone%20regarding%20${encodeURIComponent(
                          enq.cat_name
                        )}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#25D366]/10 text-[#1EBE5D] hover:bg-[#25D366]/20 rounded-md font-semibold text-[11px]"
                      >
                        <span>WhatsApp Reply</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recently Added Cats with Quick Toggle */}
        <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CatIcon className="w-4 h-4 text-[#8B5CF6]" />
              <h3 className="text-base font-display font-bold text-[#191816]">
                Latest Feline Inventory
              </h3>
            </div>
            <button
              onClick={() => navigate('admin-cats')}
              className="text-xs font-semibold text-[#8B5CF6] hover:underline"
            >
              Manage All ({cats.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-purple-100 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="pb-3">Companion</th>
                  <th className="pb-3">Breed</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Vaccinated</th>
                  <th className="pb-3">Instant Availability</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {recentCats.map((cat) => (
                  <tr key={cat.id} className="hover:bg-purple-50/30 transition">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={normalizeImageUrl(cat.main_image)}
                          alt={cat.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = DEFAULT_FALLBACK_IMAGE;
                          }}
                          className="w-10 h-10 rounded-lg object-cover border border-purple-100"
                        />
                        <div>
                          <p className="font-semibold text-[#191816]">{cat.name}</p>
                          <p className="text-[10px] text-stone-500 font-mono">{cat.cat_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-[#191816] font-medium">{cat.breed}</td>
                    <td className="py-3 font-semibold text-[#8B5CF6]">₹{cat.price.toLocaleString('en-IN')}</td>
                    <td className="py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        cat.vaccinated ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                      }`}>
                        {cat.vaccinated ? 'Yes' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3">
                      {/* INSTANT AVAILABILITY TOGGLE */}
                      <button
                        onClick={() => toggleAvailability(cat.id)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition ${
                          cat.is_available
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.is_available ? 'bg-emerald-600' : 'bg-stone-500'}`} />
                        <span>{cat.is_available ? 'AVAILABLE [ON]' : 'SOLD OUT [OFF]'}</span>
                      </button>
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => navigate('admin-cat-edit', { editCatId: cat.id })}
                        className="p-1.5 text-stone-500 hover:text-[#8B5CF6] hover:bg-purple-50 rounded-lg transition"
                        title="Edit Cat"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate('cat-detail', { catId: cat.id })}
                        className="p-1.5 text-stone-500 hover:text-[#8B5CF6] hover:bg-purple-50 rounded-lg transition"
                        title="View Public Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};
