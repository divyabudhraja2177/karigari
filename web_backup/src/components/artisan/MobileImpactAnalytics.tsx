import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  ShieldCheck,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Award,
  Users,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { IncomeComparisonChart } from '../admin/charts/IncomeComparisonChart';
import { EmpowermentDistributionChart } from '../admin/charts/EmpowermentDistributionChart';

export const MobileImpactAnalytics: React.FC = () => {
  const {
    artisans,
    surveyResponses,
    ngoFilter,
    setNgoFilter,
    cityFilter,
    setCityFilter,
    t,
    language,
    showToast
  } = useApp();

  const [selectedCohortTime, setSelectedCohortTime] = useState<'6m' | '12m' | 'all'>('6m');

  // Filter artisans based on selected cohort parameters
  const filteredArtisans = artisans.filter((a) => {
    if (ngoFilter !== 'all' && a.ngoPartner !== ngoFilter) return false;
    if (cityFilter !== 'all' && a.city !== cityFilter) return false;
    return true;
  });

  const cohortSizeN = filteredArtisans.length;

  // Economic calculations
  const totalBaselineIncome = filteredArtisans.reduce((sum, a) => sum + a.baselineMonthlyIncome, 0);
  const avgBaselineIncome = cohortSizeN > 0 ? Math.round(totalBaselineIncome / cohortSizeN) : 0;

  const totalCurrentIncome = filteredArtisans.reduce((sum, a) => sum + a.currentMonthlyIncome, 0);
  const avgCurrentIncome = cohortSizeN > 0 ? Math.round(totalCurrentIncome / cohortSizeN) : 0;

  const absoluteIncomeGain = avgCurrentIncome - avgBaselineIncome;
  const percentageIncomeGain = avgBaselineIncome > 0
    ? Math.round(((avgCurrentIncome - avgBaselineIncome) / avgBaselineIncome) * 100)
    : 0;

  // Empowerment calculations
  const bankOwnersCount = filteredArtisans.filter((a) => a.bankAccountActive).length;
  const currentBankRate = cohortSizeN > 0 ? Math.round((bankOwnersCount / cohortSizeN) * 100) : 0;

  const independentCount = filteredArtisans.filter(
    (a) => a.householdDecisionMaking === 'independent' || a.householdDecisionMaking === 'joint'
  ).length;
  const currentAutonomyRate = cohortSizeN > 0 ? Math.round((independentCount / cohortSizeN) * 100) : 0;

  const totalHours = filteredArtisans.reduce((sum, a) => sum + a.recordedHours, 0);

  const handleExportImpactCsv = () => {
    const headers = 'Artisan Code,Name,City,Partner NGO,Baseline Income (INR),Current Karigari Income (INR),Absolute Gain (INR),Growth (%),Bank Account Active,Decision Autonomy,Craft Skills';
    const rows = filteredArtisans.map((a) => {
      const abs = a.currentMonthlyIncome - a.baselineMonthlyIncome;
      const pct = a.baselineMonthlyIncome > 0 ? Math.round((abs / a.baselineMonthlyIncome) * 100) : 0;
      return `"${a.artisanCode}","${a.name}","${a.city}","${a.ngoPartner}",${a.baselineMonthlyIncome},${a.currentMonthlyIncome},${abs},${pct}%,"${a.bankAccountActive ? 'Yes' : 'No'}","${a.householdDecisionMaking}","${a.skills.join('; ')}"`;
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Karigari_Impact_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(language === 'hi' ? 'प्रभाव रिपोर्ट डाउनलोड हो गई' : 'Impact report downloaded', 'success');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', paddingBottom: '28px' }}>
      {/* Title & Export Button */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
            <span className="tag-textile" style={{ backgroundColor: 'var(--sage-green-light)', borderColor: 'var(--sage-green)', fontSize: '10px' }}>
              <ShieldCheck size={11} color="var(--sage-green-dark)" />
              {language === 'hi' ? 'सत्यापित प्रभाव विश्लेषण' : 'Verified Cohort Analytics'}
            </span>
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--deep-brown)', lineHeight: 1.2 }}>
            {language === 'hi' ? 'सामाजिक प्रभाव रिपोर्ट' : 'Socio-Economic Impact'}
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--muted-grey)', marginTop: '2px' }}>
            {language === 'hi' ? 'कारीगरी से जुड़ने से पहले और बाद का तुलनात्मक अध्ययन' : 'Comparing Before vs After metrics across women artisans'}
          </p>
        </div>

        <button
          onClick={handleExportImpactCsv}
          className="btn-primary"
          style={{ padding: '8px 12px', fontSize: '11px', flexShrink: 0, gap: '4px' }}
        >
          <Download size={13} />
          <span>{language === 'hi' ? 'CSV रसीद' : 'Export CSV'}</span>
        </button>
      </div>

      {/* Cohort Segmentation Filters (Mobile-friendly dropdowns) */}
      <div
        className="artisan-card"
        style={{
          padding: '14px 16px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted-grey)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700, color: 'var(--deep-brown)' }}>
            <Filter size={13} />
            <span>{language === 'hi' ? 'फ़िल्टर व समूह (Cohorts):' : 'Cohort Filters:'}</span>
          </div>
          <span>N = {cohortSizeN} {language === 'hi' ? 'कारीगर' : 'artisans'}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {/* City Filter */}
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--light-border)',
              backgroundColor: 'var(--warm-cream)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--deep-brown)',
              width: '100%'
            }}
          >
            <option value="all">{language === 'hi' ? 'सभी शहर' : 'All Cities'}</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
          </select>

          {/* NGO Filter */}
          <select
            value={ngoFilter}
            onChange={(e) => setNgoFilter(e.target.value)}
            style={{
              padding: '8px 10px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--light-border)',
              backgroundColor: 'var(--warm-cream)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--deep-brown)',
              width: '100%'
            }}
          >
            <option value="all">{language === 'hi' ? 'सभी एनजीओ' : 'All NGOs'}</option>
            <option value="Shakti Foundation Mumbai">Shakti Foundation</option>
            <option value="SEWA Delhi">SEWA Delhi</option>
          </select>
        </div>

        {/* Timeframe selector */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setSelectedCohortTime('6m')}
            style={{
              flex: 1,
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              border: selectedCohortTime === '6m' ? '1.5px solid var(--dusty-pink)' : '1px solid var(--light-border)',
              backgroundColor: selectedCohortTime === '6m' ? 'var(--dusty-pink-light)' : 'var(--white)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--deep-brown)',
              cursor: 'pointer'
            }}
          >
            {language === 'hi' ? '6-माह समीक्षा' : '6-Month Cohort'}
          </button>
          <button
            onClick={() => setSelectedCohortTime('12m')}
            style={{
              flex: 1,
              padding: '6px',
              borderRadius: 'var(--radius-full)',
              border: selectedCohortTime === '12m' ? '1.5px solid var(--dusty-pink)' : '1px solid var(--light-border)',
              backgroundColor: selectedCohortTime === '12m' ? 'var(--dusty-pink-light)' : 'var(--white)',
              fontSize: '11px',
              fontWeight: 600,
              color: 'var(--deep-brown)',
              cursor: 'pointer'
            }}
          >
            {language === 'hi' ? '12-माह समीक्षा' : '12-Month Cohort'}
          </button>
        </div>
      </div>

      {/* CORE BEFORE-AND-AFTER HERO CARD */}
      <div
        className="artisan-card border-stitched"
        style={{
          padding: '20px',
          backgroundColor: '#FFFCFA',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
            {language === 'hi' ? 'औसत मासिक आय में बदलाव' : 'Monthly Income Impact'}
          </span>
          <span
            style={{
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--sage-green-light)',
              color: 'var(--sage-green-dark)',
              fontSize: '11px',
              fontWeight: 800
            }}
          >
            +{percentageIncomeGain}% {language === 'hi' ? 'वृद्धि' : 'Growth'}
          </span>
        </div>

        {/* Before vs After Numbers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div
            style={{
              backgroundColor: 'var(--warm-cream)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px'
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
              {language === 'hi' ? 'पहले (Baseline)' : 'Before Karigari'}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--deep-brown)', marginTop: '2px' }}>
              ₹{avgBaselineIncome.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--muted-grey)', marginTop: '2px' }}>
              {language === 'hi' ? 'असंगठित मजदूरी' : 'Informal labor'}
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--sage-green-light)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              border: '1.5px solid var(--sage-green-border)'
            }}
          >
            <div style={{ fontSize: '11px', color: 'var(--sage-green-dark)', fontWeight: 600 }}>
              {language === 'hi' ? 'अब (Current Verified)' : 'Current Karigari'}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--sage-green-dark)', marginTop: '2px' }}>
              ₹{avgCurrentIncome.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--sage-green-dark)', marginTop: '2px', fontWeight: 600 }}>
              +₹{absoluteIncomeGain.toLocaleString('en-IN')}/mo
            </div>
          </div>
        </div>

        {/* Visual progress bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--muted-grey)', marginBottom: '4px' }}>
            <span>{language === 'hi' ? 'आय वृद्धि अनुपात' : 'Income Multiplier'}</span>
            <strong style={{ color: 'var(--deep-brown)' }}>
              {(avgCurrentIncome / Math.max(1, avgBaselineIncome)).toFixed(1)}x {language === 'hi' ? 'गुना अधिक' : 'higher'}
            </strong>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--warm-cream)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: '100%',
                background: 'linear-gradient(90deg, #E5DDD3 0%, var(--dusty-pink) 35%, var(--sage-green) 100%)',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>
      </div>

      {/* 2 SECONDARY SOCIO-ECONOMIC KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {/* Bank Account Autonomy */}
        <div
          className="artisan-card"
          style={{
            padding: '14px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
            {language === 'hi' ? 'निजी बैंक खाता' : 'Banking Autonomy'}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--deep-brown)' }}>
              {currentBankRate}%
            </span>
            <span style={{ fontSize: '11px', color: 'var(--sage-green-dark)', fontWeight: 700 }}>
              (was 25%)
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted-grey)', lineHeight: 1.3 }}>
            {language === 'hi' ? 'स्वयं का बैंक या यूपीआई खाता संचालन' : 'Artisans directly operating personal bank accounts'}
          </div>
        </div>

        {/* Decision-Making Empowerment */}
        <div
          className="artisan-card"
          style={{
            padding: '14px',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '8px'
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted-grey)', textTransform: 'uppercase' }}>
            {language === 'hi' ? 'पारिवारिक निर्णय' : 'Decision Autonomy'}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontSize: '26px', fontWeight: 800, color: 'var(--deep-brown)' }}>
              {currentAutonomyRate}%
            </span>
            <span style={{ fontSize: '11px', color: 'var(--sage-green-dark)', fontWeight: 700 }}>
              (was 22%)
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--muted-grey)', lineHeight: 1.3 }}>
            {language === 'hi' ? 'आर्थिक फैसलों में स्वतंत्र या संयुक्त सहभागिता' : 'Independent or joint financial decision making'}
          </div>
        </div>
      </div>

      {/* INCOME COMPARISON BAR CHART */}
      <div
        className="artisan-card"
        style={{
          padding: '18px 16px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-brown)' }}>
            {language === 'hi' ? 'कारीगर आय तुलना चार्ट' : 'Artisan Income Comparison Chart'}
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '2px' }}>
            {language === 'hi' ? 'प्रत्येक महिला कारीगर की पहले vs वर्तमान आय (INR)' : 'Baseline vs Karigari Monthly Earnings per artisan'}
          </p>
        </div>

        <IncomeComparisonChart artisans={filteredArtisans} />
      </div>

      {/* EMPOWERMENT DISTRIBUTION CHART */}
      <div
        className="artisan-card"
        style={{
          padding: '18px 16px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div>
          <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-brown)' }}>
            {language === 'hi' ? 'निर्णय सहभागिता वितरण' : 'Household Decision-Making Breakdown'}
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--muted-grey)', marginTop: '2px' }}>
            {language === 'hi' ? 'स्वतंत्र, संयुक्त और आश्रित निर्णयों का प्रतिशत' : 'Independent, joint, and dependent decisions across cohort'}
          </p>
        </div>

        <EmpowermentDistributionChart artisans={filteredArtisans} />
      </div>

      {/* INDIVIDUAL ARTISANS BREAKDOWN FEED */}
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--deep-brown)', marginBottom: '10px' }}>
          {language === 'hi' ? 'कारीगरों की व्यक्तिगत प्रगति' : 'Individual Artisan Cohort List'}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredArtisans.map((artisan) => {
            const gain = artisan.currentMonthlyIncome - artisan.baselineMonthlyIncome;
            const pct = artisan.baselineMonthlyIncome > 0
              ? Math.round((gain / artisan.baselineMonthlyIncome) * 100)
              : 0;

            return (
              <div
                key={artisan.id}
                className="artisan-card"
                style={{
                  padding: '14px 16px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      backgroundImage: `url(${artisan.photoUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      flexShrink: 0,
                      border: '1.5px solid var(--dusty-pink)'
                    }}
                  />

                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--deep-brown)' }}>
                      {language === 'hi' ? artisan.hindiName : artisan.name}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--muted-grey)' }}>
                      {artisan.city} • {artisan.ngoPartner}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--sage-green-dark)' }}>
                    ₹{artisan.currentMonthlyIncome.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--muted-grey)' }}>
                    {language === 'hi' ? 'पहले' : 'was'} ₹{artisan.baselineMonthlyIncome.toLocaleString('en-IN')} (
                    <strong style={{ color: 'var(--sage-green-dark)' }}>+{pct}%</strong>)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
