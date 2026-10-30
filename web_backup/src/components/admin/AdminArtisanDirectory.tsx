import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Artisan } from '../../types';
import {
  Users,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Eye,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  IndianRupee,
  X,
  Phone,
  Award,
  Sparkles
} from 'lucide-react';

export const AdminArtisanDirectory: React.FC = () => {
  const { artisans, addArtisan, orders, workingHours, earnings, surveyResponses, t, language } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [ngoFilter, setNgoFilter] = useState('all');
  const [selectedArtisan, setSelectedArtisan] = useState<Artisan | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Artisan Form State
  const [newName, setNewName] = useState('');
  const [newHindiName, setNewHindiName] = useState('');
  const [newCity, setNewCity] = useState<'Mumbai' | 'Delhi'>('Mumbai');
  const [newArea, setNewArea] = useState('');
  const [newNgo, setNewNgo] = useState<'SEWA Delhi' | 'Shakti Foundation Mumbai'>('Shakti Foundation Mumbai');
  const [newPhone, setNewPhone] = useState('');
  const [newBaselineIncome, setNewBaselineIncome] = useState<number>(3000);
  const [newSkills, setNewSkills] = useState('Kantha Embroidery, Patchwork');

  // Filtered and searched artisans
  const filteredArtisans = artisans.filter((a) => {
    if (cityFilter !== 'all' && a.city !== cityFilter) return false;
    if (ngoFilter !== 'all' && a.ngoPartner !== ngoFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = a.name.toLowerCase().includes(q) || a.hindiName.includes(q);
      const matchCode = a.artisanCode.toLowerCase().includes(q);
      const matchArea = a.area.toLowerCase().includes(q);
      return matchName || matchCode || matchArea;
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    addArtisan({
      name: newName,
      hindiName: newHindiName || newName,
      city: newCity,
      area: newArea || `${newCity} Cluster`,
      ngoPartner: newNgo,
      joiningDate: new Date().toISOString().split('T')[0],
      phone: newPhone,
      status: 'active',
      baselineMonthlyIncome: Number(newBaselineIncome) || 3000,
      currentMonthlyIncome: Number(newBaselineIncome) || 3000,
      bankAccountActive: true,
      financialConfidenceScore: 3,
      householdDecisionMaking: 'joint',
      skills: newSkills.split(',').map((s) => s.trim()),
      photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
    });

    setShowAddModal(false);
    setNewName('');
    setNewHindiName('');
    setNewPhone('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header and Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--deep-brown)' }}>
            Artisan Directory & Biographies
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--muted-grey)', marginTop: '2px' }}>
            Registered women craftmakers in Mumbai and Delhi partner clusters
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
          style={{ padding: '10px 16px', fontSize: '13px' }}
        >
          <Plus size={16} />
          <span>Register New Artisan</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div
        className="artisan-card"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexWrap: 'wrap'
        }}
      >
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--warm-cream)', padding: '8px 14px', borderRadius: 'var(--radius-sm)' }}>
          <Search size={16} color="var(--muted-grey)" />
          <input
            type="text"
            placeholder="Search by name, ID, or area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none' }}
          />
        </div>

        {/* City Filter */}
        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          style={{
            padding: '9px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--light-border)',
            backgroundColor: 'var(--white)',
            fontSize: '13px'
          }}
        >
          <option value="all">All Cities</option>
          <option value="Mumbai">Mumbai</option>
          <option value="Delhi">Delhi</option>
        </select>

        {/* NGO Filter */}
        <select
          value={ngoFilter}
          onChange={(e) => setNgoFilter(e.target.value)}
          style={{
            padding: '9px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--light-border)',
            backgroundColor: 'var(--white)',
            fontSize: '13px'
          }}
        >
          <option value="all">All Partner NGOs</option>
          <option value="Shakti Foundation Mumbai">Shakti Foundation Mumbai</option>
          <option value="SEWA Delhi">SEWA Delhi</option>
        </select>

        <span style={{ fontSize: '12px', color: 'var(--muted-grey)', marginLeft: 'auto' }}>
          Showing <strong>{filteredArtisans.length}</strong> artisans
        </span>
      </div>

      {/* Artisans Table */}
      <div className="artisan-card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--light-border)', color: 'var(--muted-grey)', fontSize: '11px', textTransform: 'uppercase' }}>
              <th style={{ padding: '12px 16px' }}>Artisan</th>
              <th style={{ padding: '12px 16px' }}>ID / Code</th>
              <th style={{ padding: '12px 16px' }}>Location</th>
              <th style={{ padding: '12px 16px' }}>Partner NGO</th>
              <th style={{ padding: '12px 16px' }}>Hours Logged</th>
              <th style={{ padding: '12px 16px' }}>Completed Orders</th>
              <th style={{ padding: '12px 16px' }}>Current Income</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredArtisans.map((art) => (
              <tr
                key={art.id}
                style={{
                  borderBottom: '1px solid var(--light-border)',
                  transition: 'background-color 0.15s ease'
                }}
              >
                {/* Name & Photo */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundImage: `url(${art.photoUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: '1.5px solid var(--dusty-pink)',
                        flexShrink: 0
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--deep-brown)' }}>
                        {art.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--muted-grey)', fontFamily: 'var(--font-hindi)' }}>
                        {art.hindiName}
                      </div>
                    </div>
                  </div>
                </td>

                {/* ID */}
                <td style={{ padding: '14px 16px' }}>
                  <span className="tag-textile" style={{ fontSize: '11px', fontWeight: 700 }}>
                    {art.artisanCode}
                  </span>
                </td>

                {/* City & Area */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--deep-brown)' }}>{art.city}</div>
                  <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>{art.area}</div>
                </td>

                {/* NGO */}
                <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--deep-brown)' }}>
                  {art.ngoPartner}
                </td>

                {/* Hours */}
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                  {art.recordedHours} hrs
                </td>

                {/* Completed */}
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                  {art.totalCompletedOrders} batches
                </td>

                {/* Income */}
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ fontWeight: 800, color: 'var(--sage-green-dark)' }}>
                    ₹{art.currentMonthlyIncome.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--muted-grey)' }}>
                    Base: ₹{art.baselineMonthlyIncome.toLocaleString('en-IN')}
                  </div>
                </td>

                {/* Status */}
                <td style={{ padding: '14px 16px' }}>
                  <span className="badge-status badge-completed" style={{ fontSize: '10px' }}>
                    Active
                  </span>
                </td>

                {/* Action: View Dossier */}
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => setSelectedArtisan(art)}
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '12px' }}
                  >
                    <Eye size={14} />
                    <span>Dossier</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: Artisan Dossier Modal */}
      {selectedArtisan && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(42, 37, 35, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 100
          }}
          onClick={() => setSelectedArtisan(null)}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '560px',
              width: '100%',
              padding: '28px 24px',
              boxShadow: 'var(--shadow-lg)',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundImage: `url(${selectedArtisan.photoUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    border: '2.5px solid var(--dusty-pink)'
                  }}
                />
                <div>
                  <span className="tag-textile" style={{ fontSize: '10px' }}>
                    {selectedArtisan.artisanCode}
                  </span>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--deep-brown)', marginTop: '2px' }}>
                    {selectedArtisan.name} ({selectedArtisan.hindiName})
                  </h2>
                  <div style={{ fontSize: '12px', color: 'var(--muted-grey)' }}>
                    {selectedArtisan.area}, {selectedArtisan.city} • {selectedArtisan.ngoPartner}
                  </div>
                </div>
              </div>

              <button onClick={() => setSelectedArtisan(null)} style={{ color: 'var(--muted-grey)', padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Economic Baseline vs Current Breakdown */}
            <div
              style={{
                backgroundColor: 'var(--warm-cream)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                marginBottom: '18px'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>Baseline Income</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--deep-brown)', marginTop: '2px' }}>
                  ₹{selectedArtisan.baselineMonthlyIncome.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--sage-green-dark)' }}>Current Karigari Income</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--sage-green-dark)', marginTop: '2px' }}>
                  ₹{selectedArtisan.currentMonthlyIncome.toLocaleString('en-IN')}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', color: 'var(--dusty-pink-dark)' }}>Absolute Net Gain</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--dusty-pink-dark)', marginTop: '2px' }}>
                  +₹{(selectedArtisan.currentMonthlyIncome - selectedArtisan.baselineMonthlyIncome).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Verified Skills */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '6px' }}>
                Mastered Handicraft Skills
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedArtisan.skills.map((s, idx) => (
                  <span key={idx} className="tag-textile" style={{ fontSize: '11px' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Assigned Orders for this artisan */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '8px' }}>
                Recent Assigned Batches
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {orders
                  .filter((o) => o.artisanId === selectedArtisan.id)
                  .map((ord) => (
                    <div
                      key={ord.id}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: '#FFFCFA',
                        border: '1px solid var(--light-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        fontSize: '12px'
                      }}
                    >
                      <div>
                        <strong>{ord.orderNumber}</strong>: {ord.productName} ({ord.completedQty} / {ord.assignedQty} units)
                      </div>
                      <span className="badge-status badge-completed" style={{ fontSize: '10px' }}>
                        {ord.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <button onClick={() => setSelectedArtisan(null)} className="btn-secondary" style={{ padding: '8px 16px' }}>
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Register New Artisan Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(42, 37, 35, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 100
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: 'var(--white)',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '460px',
              width: '100%',
              padding: '26px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--deep-brown)' }}>
                Register New Artisan Member
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ color: 'var(--muted-grey)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Full Name (English)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Geeta Devi"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  नाम (हिंदी)
                </label>
                <input
                  type="text"
                  placeholder="उदा. गीता देवी"
                  value={newHindiName}
                  onChange={(e) => setNewHindiName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    City Cluster
                  </label>
                  <select
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}
                  >
                    <option value="Mumbai">Mumbai</option>
                    <option value="Delhi">Delhi</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Partner NGO
                  </label>
                  <select
                    value={newNgo}
                    onChange={(e) => setNewNgo(e.target.value as any)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}
                  >
                    <option value="Shakti Foundation Mumbai">Shakti Foundation Mumbai</option>
                    <option value="SEWA Delhi">SEWA Delhi</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit number"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Baseline Monthly Income (Pre-Karigari in ₹)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newBaselineIncome}
                  onChange={(e) => setNewBaselineIncome(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--light-border)' }}
                />
                <span style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                  Used for verified longitudinal before-and-after impact analytics.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary" style={{ flex: 1, padding: '12px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '12px' }}>
                  Save & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
