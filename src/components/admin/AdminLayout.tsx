import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  Cat as CatIcon,
  PlusCircle,
  FolderTree,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title,
  subtitle,
  actionButton,
}) => {
  const { currentPage, navigate, logoutAdmin, isAdminLoggedIn, enquiries, cats } = useStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAdminLoggedIn) {
    navigate('admin-login');
    return null;
  }

  const newEnquiriesCount = enquiries.filter((e) => e.status === 'New').length;
  const availableCatsCount = cats.filter((c) => c.is_available).length;

  const menuItems = [
    {
      label: 'Dashboard',
      page: 'admin-dashboard' as const,
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      label: 'Cats Inventory',
      page: 'admin-cats' as const,
      icon: <CatIcon className="w-4 h-4" />,
      badge: `${availableCatsCount} avail`,
    },
    {
      label: 'Add New Cat',
      page: 'admin-cat-new' as const,
      icon: <PlusCircle className="w-4 h-4" />,
    },
    {
      label: 'Breed Categories',
      page: 'admin-categories' as const,
      icon: <FolderTree className="w-4 h-4" />,
    },
    {
      label: 'WhatsApp Enquiries',
      page: 'admin-enquiries' as const,
      icon: <MessageSquare className="w-4 h-4" />,
      badge: newEnquiriesCount > 0 ? `${newEnquiriesCount} new` : undefined,
      badgeColor: 'bg-emerald-500 text-white',
    },
    {
      label: 'Site & WhatsApp Settings',
      page: 'admin-settings' as const,
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-[100dvh] bg-[#FAF8FF] flex flex-col md:flex-row">
      
      {/* Mobile Top Nav Bar */}
      <div className="md:hidden bg-[#130E20] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 border-b border-purple-900/40">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 flex items-center justify-center">
            <img 
              src="/favicon.png" 
              alt="CatZone Logo" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-brand font-bold text-base tracking-widest text-white">
            CATZONE ADMIN
          </span>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 text-stone-300 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 h-[100dvh] w-64 bg-[#130E20] text-[#EEE9E1] z-40 flex flex-col justify-between border-r border-purple-900/30 transition-transform duration-200 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="p-6 border-b border-purple-900/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src="/favicon.png" 
                  alt="CatZone Logo" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-brand font-bold text-lg tracking-[0.18em] text-white block">
                  CATZONE
                </span>
                <span className="text-[10px] uppercase tracking-wider text-purple-300 font-medium block">
                  Admin Dashboard
                </span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => {
                    navigate(item.page);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition ${
                    isActive
                      ? 'bg-luxury-gradient text-white shadow-md shadow-purple-500/20'
                      : 'text-stone-400 hover:text-white hover:bg-purple-950/40'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold lowercase ${
                        item.badgeColor || 'bg-purple-900/80 text-purple-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-purple-900/30 space-y-2 shrink-0 bg-[#130E20]">
          <button
            onClick={() => navigate('home')}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs text-stone-400 hover:text-white hover:bg-purple-950/40 transition"
          >
            <ExternalLink className="w-4 h-4 text-purple-300" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs text-rose-400 hover:bg-rose-950/40 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar header */}
        <div className="bg-white border-b border-purple-100 px-6 lg:px-10 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#191816]">
              {title}
            </h1>
            {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
          </div>

          {actionButton && <div>{actionButton}</div>}
        </div>

        {/* Page Inner Container */}
        <main className="p-6 lg:p-10 flex-1">{children}</main>
      </div>

    </div>
  );
};
