import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Truck, Users, FileText, ShieldCheck, DollarSign, LogOut, Menu, X, Plus, Building2 } from 'lucide-react';
import Logo from '../../components/site/Logo';
import { useAuth } from '../../lib/auth';

const nav = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/app/loads', label: 'Loads', icon: Truck },
  { to: '/app/drivers', label: 'Drivers', icon: Users },
  { to: '/app/documents', label: 'Documents', icon: FileText },
  { to: '/app/compliance', label: 'Compliance', icon: ShieldCheck },
  { to: '/app/financials', label: 'Financials', icon: DollarSign },
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex bg-[#f7f7f5]">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 border-r border-white/5 transform transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ backgroundColor: '#0a0a0a' }}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <Logo size="sm" />
          <button className="lg:hidden text-white" onClick={() => setOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {nav.map((n) => {
            const Icon = n.icon;
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#d4a23a]/15 text-[#d4a23a]'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <button
            onClick={() => navigate('/app/loads/new')}
            className="w-full flex items-center justify-center gap-2 rounded-md py-2 font-bold text-sm transition-all hover:-translate-y-0.5"
            style={{ backgroundColor: '#d4a23a', color: '#0a0a0a' }}
          >
            <Plus className="h-4 w-4" /> New Load
          </button>
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 px-1">
            <Building2 className="h-3.5 w-3.5" />
            <span className="truncate">{user?.company_name || user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-2 px-2 py-2 rounded-md text-xs text-gray-400 hover:bg-white/5"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-14 bg-white border-b border-gray-200 flex items-center px-4 lg:px-6">
          <button className="lg:hidden mr-3" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="text-sm text-gray-500">
            <span className="text-gray-900 font-semibold">FleetForge</span>
            <span className="mx-2 text-gray-300">/</span>
            <span>{user?.company_name || 'Workspace'}</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default AppLayout;
