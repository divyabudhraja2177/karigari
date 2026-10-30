import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Clock,
  PackageCheck,
  IndianRupee,
  ClipboardCheck,
  Layers,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { IncomeComparisonChart } from './charts/IncomeComparisonChart';
import { MonthlyTrendChart } from './charts/MonthlyTrendChart';

export const AdminOverview: React.FC = () => {
  const {
    artisans,
    orders,
    workingHours,
    earnings,
    materials,
    materialRequests,
    surveyResponses,
    ngoFilter,
    cityFilter,
    dateFilter,
    setAdminTab,
    t,
    language
  } = useApp();

  // Apply filters
  const filteredArtisans = artisans.filter((a) => {
    if (ngoFilter !== 'all' && a.ngoPartner !== ngoFilter) return false;
    if (cityFilter !== 'all' && a.city !== cityFilter) return false;
    return true;
  });

  const filteredArtisanIds = new Set(filteredArtisans.map((a) => a.id));

  const filteredOrders = orders.filter((o) => filteredArtisanIds.has(o.artisanId));
  const filteredHours = workingHours.filter((h) => filteredArtisanIds.has(h.artisanId));
  const filteredEarnings = earnings.filter((e) => filteredArtisanIds.has(e.artisanId));
  const filteredRequests = materialRequests.filter((r) => filteredArtisanIds.has(r.artisanId));
  const filteredResponses = surveyResponses.filter((r) => filteredArtisanIds.has(r.artisanId));

  // Compute Metrics
  const totalRegistered = filteredArtisans.length;
  const activeArtisans = filteredArtisans.filter((a) => a.status === 'active').length;
  const totalRecordedHours = filteredArtisans.reduce((sum, a) => sum + a.recordedHours, 0);
  const totalCompletedOrders = filteredArtisans.reduce((sum, a) => sum + a.totalCompletedOrders, 0);
  const totalProductionUnits = filteredOrders.reduce((sum, o) => sum + o.completedQty, 0) + 1850; // Historical base + current
  const totalEarningsDisbursed = filteredEarnings.reduce((sum, e) => sum + e.amount, 0) + 78000;
  const pendingPaymentsAmount = filteredEarnings
    .filter((e) => e.status !== 'paid')
    .reduce((sum, e) => sum + e.amount, 0);
  const surveysCount = filteredResponses.length;
  const pendingRequestsCount = filteredRequests.filter((r) => r.status === 'pending').length;
  const pendingTimesheetsCount = filteredHours.filter((h) => h.status === 'submitted').length;
  const lowStockCount = materials.filter((m) => m.inStock <= m.minThreshold).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Executive Welcome & Impact Notice */}
      <div
        className="artisan-card"
        style={{
          padding: '24px',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F6F0E7 100%)',
          borderLeft: '5px solid var(--dusty-pink)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="tag-textile" style={{ backgroundColor: 'var(--dusty-pink-light)', borderColor: 'var(--dusty-pink)' }}>
                <Sparkles size={12} color="var(--dusty-pink-dark)" />
                Social Impact & Artisan Welfare Hub
              </span>
              <span style={{ fontSize: '12px', color: 'var(--muted-grey)' }}>
                Active Cohort: {filteredArtisans.length} Artisans across Mumbai & Delhi
              </span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--deep-brown)', lineHeight: 1.2 }}>
              {t.adminTitle}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--muted-grey)', marginTop: '4px', maxWidth: '750px' }}>
              {t.adminSubtitle}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setAdminTab('orders')}
              className="btn-primary"
              style={{ padding: '10px 16px', fontSize: '13px' }}
            >
              <PackageCheck size={16} />
              <span>Create Order</span>
            </button>
            <button
              onClick={() => setAdminTab('impact')}
              className="btn-sage"
              style={{ padding: '10px 16px', fontSize: '13px' }}
            >
              <TrendingUp size={16} />
              <span>View Impact Analysis</span>
            </button>
          </div>
        </div>
      </div>

      {/* 9 Primary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {/* KPI 1: Registered Artisans */}
        <div className="artisan-card" style={{ padding: '18px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
              {t.kpiRegisteredArtisans}
            </span>
            <Users size={18} color="var(--dusty-pink-dark)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--deep-brown)' }}>
            {totalRegistered}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--sage-green-dark)', marginTop: '4px', fontWeight: 600 }}>
            {activeArtisans} active this cycle (100%)
          </div>
        </div>

        {/* KPI 2: Total Working Hours */}
        <div className="artisan-card" style={{ padding: '18px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
              {t.kpiTotalHours}
            </span>
            <Clock size={18} color="var(--dusty-pink-dark)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--deep-brown)' }}>
            {totalRecordedHours.toLocaleString('en-IN')} hrs
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '4px' }}>
            Avg {(totalRecordedHours / (totalRegistered || 1)).toFixed(0)} hrs / artisan
          </div>
        </div>

        {/* KPI 3: Completed Orders */}
        <div className="artisan-card" style={{ padding: '18px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
              {t.kpiCompletedOrders}
            </span>
            <PackageCheck size={18} color="var(--sage-green-dark)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--deep-brown)' }}>
            {totalCompletedOrders}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--sage-green-dark)', marginTop: '4px', fontWeight: 600 }}>
            94.2% on-time delivery rate
          </div>
        </div>

        {/* KPI 4: Total Production Units */}
        <div className="artisan-card" style={{ padding: '18px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
              {t.kpiProductionUnits}
            </span>
            <Layers size={18} color="var(--deep-brown)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--deep-brown)' }}>
            {totalProductionUnits.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '4px' }}>
            Pouches, Sleeves & Totes
          </div>
        </div>

        {/* KPI 5: Total Earnings Recorded */}
        <div className="artisan-card" style={{ padding: '18px 16px', borderColor: 'var(--sage-green-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
              {t.kpiTotalEarnings}
            </span>
            <IndianRupee size={18} color="var(--sage-green-dark)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--sage-green-dark)' }}>
            ₹{totalEarningsDisbursed.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--sage-green-dark)', marginTop: '4px', fontWeight: 600 }}>
            +235% vs pre-joining baseline
          </div>
        </div>

        {/* KPI 6: Pending Approvals */}
        <div className="artisan-card" style={{ padding: '18px 16px', borderColor: 'var(--soft-yellow-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
              {t.kpiPendingPayments}
            </span>
            <IndianRupee size={18} color="var(--soft-yellow-dark)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--deep-brown)' }}>
            ₹{pendingPaymentsAmount.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '4px' }}>
            Awaiting batch approval
          </div>
        </div>

        {/* KPI 7: Surveys Completed */}
        <div className="artisan-card" style={{ padding: '18px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
              {t.kpiSurveysCompleted}
            </span>
            <ClipboardCheck size={18} color="var(--dusty-pink-dark)" />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: 'var(--deep-brown)' }}>
            {surveysCount} / {totalRegistered}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--sage-green-dark)', marginTop: '4px', fontWeight: 600 }}>
            100% follow-up completion
          </div>
        </div>

        {/* KPI 8: Pending Supply Requests */}
        <div className="artisan-card" style={{ padding: '18px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
              {t.kpiMaterialRequests}
            </span>
            <Layers size={18} color={pendingRequestsCount > 0 ? '#B43828' : 'var(--muted-grey)'} />
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: pendingRequestsCount > 0 ? '#B43828' : 'var(--deep-brown)' }}>
            {pendingRequestsCount}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '4px' }}>
            Zips, linings & threads
          </div>
        </div>
      </div>

      {/* Operational Alerts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
        {/* Alert 1: Pending Timesheets */}
        <div
          className="artisan-card"
          style={{
            padding: '16px',
            backgroundColor: pendingTimesheetsCount > 0 ? '#FFFCFA' : 'var(--white)',
            borderLeft: pendingTimesheetsCount > 0 ? '4px solid var(--soft-yellow)' : '1px solid var(--light-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Clock size={20} color="var(--soft-yellow-dark)" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                {pendingTimesheetsCount} Pending Timesheets
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                Artisans submitted daily crafting hours for review
              </div>
            </div>
          </div>
          <button
            onClick={() => setAdminTab('timesheets')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            Review
          </button>
        </div>

        {/* Alert 2: Low Material Stock */}
        <div
          className="artisan-card"
          style={{
            padding: '16px',
            backgroundColor: lowStockCount > 0 ? '#FFF8F7' : 'var(--white)',
            borderLeft: lowStockCount > 0 ? '4px solid #D8A7AD' : '1px solid var(--light-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertCircle size={20} color="var(--dusty-pink-dark)" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                {lowStockCount > 0 ? `${lowStockCount} Materials Near Minimum Threshold` : 'Material Inventory Healthy'}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                {lowStockCount > 0 ? 'Replenish fabrics and zips before next batch' : 'Sufficient raw stocks on hand'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setAdminTab('inventory')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            Manage Stock
          </button>
        </div>
      </div>

      {/* Visual Analytics Preview Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '20px' }}>
        {/* Chart 1: Baseline vs Follow-up Income */}
        <div className="artisan-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                Income Trajectory: Baseline vs Current Karigari Verified Earnings
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--muted-grey)', marginTop: '2px' }}>
                Comparing artisan earnings prior to joining vs active monthly compensation
              </p>
            </div>
            <button
              onClick={() => setAdminTab('impact')}
              style={{ fontSize: '12px', fontWeight: 600, color: 'var(--dusty-pink-dark)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <span>Full Analytics</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <IncomeComparisonChart artisans={filteredArtisans} />
        </div>

        {/* Chart 2: 6-Month Monthly Disbursals & Volume */}
        <div className="artisan-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                6-Month Economic Trajectory & Order Volume
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--muted-grey)', marginTop: '2px' }}>
                Total artisan earnings disbursed across Delhi & Mumbai clusters
              </p>
            </div>
            <span className="tag-textile" style={{ fontSize: '10px' }}>
              May - Oct 2026
            </span>
          </div>

          <MonthlyTrendChart />
        </div>
      </div>
    </div>
  );
};
