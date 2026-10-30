import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  LayoutDashboard,
  TrendingUp,
  Users,
  PackageCheck,
  Clock,
  IndianRupee,
  Layers,
  FileText,
  RotateCcw,
  Smartphone,
  UserCheck,
  Calendar,
  Filter,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { AdminOverview } from './AdminOverview';
import { AdminImpactAnalytics } from './AdminImpactAnalytics';
import { AdminArtisanDirectory } from './AdminArtisanDirectory';
import { AdminOrders } from './AdminOrders';
import { AdminTimesheets } from './AdminTimesheets';
import { AdminPayments } from './AdminPayments';
import { AdminInventory } from './AdminInventory';
import { AdminReports } from './AdminReports';

export const AdminLayout: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    currentUser,
    setCurrentUser,
    availableUsers,
    dateFilter,
    setDateFilter,
    ngoFilter,
    setNgoFilter,
    cityFilter,
    setCityFilter,
    setViewMode,
    setArtisanTab,
    resetAllData,
    language,
    setLanguage
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'impact', label: 'Impact (Before-After)', icon: TrendingUp, highlight: true },
    { id: 'artisans', label: 'Artisans Directory', icon: Users },
    { id: 'orders', label: 'Orders & Batches', icon: PackageCheck },
    { id: 'timesheets', label: 'Timesheets Review', icon: Clock },
    { id: 'payments', label: 'Earnings & Payouts', icon: IndianRupee },
    { id: 'inventory', label: 'Materials Inventory', icon: Layers },
    { id: 'reports', label: 'Reports & CSV', icon: FileText }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--warm-cream)' }}>
      {/* Top Global Administrative Bar */}
      <header
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1.5px solid var(--light-border)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: 'var(--shadow-sm)',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'none', padding: '6px' }}
            className="mobile-menu-trigger"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Logo size="md" showTagline={false} />
          <span
            className="tag-textile"
            style={{
              backgroundColor: 'var(--dusty-pink-light)',
              borderColor: 'var(--dusty-pink)',
              fontSize: '11px',
              fontWeight: 700
            }}
          >
            Business Admin & Impact Analytics
          </span>
        </div>

        {/* Filters & Quick User Switching Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Date Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} color="var(--muted-grey)" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              style={{
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--light-border)',
                backgroundColor: 'var(--warm-cream)',
                fontSize: '12px',
                fontWeight: 600
              }}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="this_month">This Month (Oct 2026)</option>
              <option value="last_month">Last Month (Sep 2026)</option>
              <option value="all">All-Time Cumulative</option>
            </select>
          </div>

          {/* Partner NGO Filter */}
          <select
            value={ngoFilter}
            onChange={(e) => setNgoFilter(e.target.value)}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--light-border)',
              backgroundColor: 'var(--warm-cream)',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <option value="all">All Partner NGOs</option>
            <option value="Shakti Foundation Mumbai">Shakti Foundation Mumbai</option>
            <option value="SEWA Delhi">SEWA Delhi</option>
          </select>

          {/* Quick Experience Artisan App Button */}
          <button
            onClick={() => {
              // Switch to Sunita Sharma artisan profile
              const sunita = availableUsers.find((u) => u.role === 'artisan') || availableUsers[0];
              setCurrentUser(sunita);
              setViewMode('artisan');
              setArtisanTab('home');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--dusty-pink)',
              color: 'var(--deep-brown-dark)',
              fontSize: '12px',
              fontWeight: 700,
              boxShadow: 'var(--shadow-sm)'
            }}
            title="Open Artisan Smartphone Experience"
          >
            <Smartphone size={14} />
            <span>Switch to Artisan App</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetAllData}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--light-border)',
              backgroundColor: '#FFFFFF',
              color: 'var(--muted-grey)',
              fontSize: '11px',
              cursor: 'pointer'
            }}
            title="Reset all localStorage records to clean initial state"
          >
            <RotateCcw size={12} />
            <span>Reset Demo</span>
          </button>
        </div>
      </header>

      {/* Admin Tabs Navigation Bar */}
      <nav
        style={{
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--light-border)',
          padding: '0 24px',
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          position: 'sticky',
          top: '60px',
          zIndex: 35
        }}
      >
        {tabs.map((tab) => {
          const isSelected = adminTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setAdminTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '14px 16px',
                borderBottom: isSelected ? '3px solid var(--dusty-pink)' : '3px solid transparent',
                color: isSelected ? 'var(--deep-brown)' : 'var(--muted-grey)',
                fontWeight: isSelected ? 700 : 500,
                fontSize: '13px',
                backgroundColor: isSelected && tab.highlight ? 'var(--dusty-pink-soft)' : 'transparent',
                borderRadius: '4px 4px 0 0',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              <Icon
                size={16}
                color={isSelected ? 'var(--dusty-pink-dark)' : 'var(--muted-grey)'}
                strokeWidth={isSelected ? 2.5 : 2}
              />
              <span>{tab.label}</span>
              {tab.highlight && (
                <span
                  style={{
                    backgroundColor: 'var(--sage-green)',
                    color: '#FFFFFF',
                    fontSize: '9px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-full)',
                    letterSpacing: '0.04em'
                  }}
                >
                  IMPACT
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '24px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
        {adminTab === 'overview' && <AdminOverview />}
        {adminTab === 'impact' && <AdminImpactAnalytics />}
        {adminTab === 'artisans' && <AdminArtisanDirectory />}
        {adminTab === 'orders' && <AdminOrders />}
        {adminTab === 'timesheets' && <AdminTimesheets />}
        {adminTab === 'payments' && <AdminPayments />}
        {adminTab === 'inventory' && <AdminInventory />}
        {adminTab === 'reports' && <AdminReports />}
      </main>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--light-border)',
          backgroundColor: '#FFFFFF',
          padding: '16px 24px',
          fontSize: '12px',
          color: 'var(--muted-grey)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <div>
          <strong>Karigari कारीगरी</strong> — Indian Handicraft Empowerment Platform | In collaboration with SEWA Delhi & Shakti Foundation Mumbai
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span>Logged in as: <strong>Pooja Rao (Founder)</strong></span>
          <span>Role: System Admin</span>
        </div>
      </footer>
    </div>
  );
};
