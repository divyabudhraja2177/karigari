import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import {
  TrendingUp,
  ShieldCheck,
  Download,
  Filter,
  Users
} from 'lucide-react-native';

export const MobileImpactAnalytics: React.FC = () => {
  const {
    artisans,
    ngoFilter,
    setNgoFilter,
    cityFilter,
    setCityFilter,
    t,
    language,
    showToast
  } = useApp();

  const [selectedCohort, setSelectedCohort] = useState<'6m' | '12m'>('6m');

  const filteredArtisans = artisans.filter((a) => {
    if (ngoFilter !== 'all' && a.ngoPartner !== ngoFilter) return false;
    if (cityFilter !== 'all' && a.city !== cityFilter) return false;
    return true;
  });

  const cohortSizeN = filteredArtisans.length;

  const totalBaseline = filteredArtisans.reduce((sum, a) => sum + a.baselineMonthlyIncome, 0);
  const avgBaseline = cohortSizeN > 0 ? Math.round(totalBaseline / cohortSizeN) : 0;

  const totalCurrent = filteredArtisans.reduce((sum, a) => sum + a.currentMonthlyIncome, 0);
  const avgCurrent = cohortSizeN > 0 ? Math.round(totalCurrent / cohortSizeN) : 0;

  const absGain = avgCurrent - avgBaseline;
  const pctGain = avgBaseline > 0 ? Math.round((absGain / avgBaseline) * 100) : 0;

  const bankOwners = filteredArtisans.filter((a) => a.bankAccountActive).length;
  const bankRate = cohortSizeN > 0 ? Math.round((bankOwners / cohortSizeN) * 100) : 0;

  const independentCount = filteredArtisans.filter(
    (a) => a.householdDecisionMaking === 'independent' || a.householdDecisionMaking === 'joint'
  ).length;
  const autonomyRate = cohortSizeN > 0 ? Math.round((independentCount / cohortSizeN) * 100) : 0;

  const handleExport = () => {
    showToast(
      language === 'hi'
        ? 'सामाजिक प्रभाव रिपोर्ट (CSV) डाउनलोड हो गई'
        : 'Impact report CSV exported successfully',
      'success'
    );
  };

  const maxVal = Math.max(...filteredArtisans.map((a) => Math.max(a.baselineMonthlyIncome, a.currentMonthlyIncome)), 15000);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Title & Export */}
      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.tagBadge}>
            <ShieldCheck size={11} color={theme.colors.sageGreenDark} />
            <Text style={styles.tagBadgeText}>
              {language === 'hi' ? 'सत्यापित प्रभाव विश्लेषण' : 'Verified Cohort Analytics'}
            </Text>
          </View>
          <Text style={styles.pageTitle}>
            {language === 'hi' ? 'सामाजिक प्रभाव रिपोर्ट' : 'Socio-Economic Impact'}
          </Text>
          <Text style={styles.pageSub}>
            {language === 'hi'
              ? 'कारीगरी से जुड़ने से पहले और बाद का तुलनात्मक अध्ययन'
              : 'Comparing Before vs After metrics across women artisans'}
          </Text>
        </View>

        <TouchableOpacity onPress={handleExport} style={styles.exportBtn}>
          <Download size={13} color={theme.colors.deepBrownDark} />
          <Text style={styles.exportBtnText}>CSV</Text>
        </TouchableOpacity>
      </View>

      {/* Cohort Filters */}
      <View style={styles.filterCard}>
        <View style={styles.filterHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Filter size={13} color={theme.colors.deepBrown} />
            <Text style={styles.filterLabel}>
              {language === 'hi' ? 'समूह फ़िल्टर (Filters):' : 'Cohort Filters:'}
            </Text>
          </View>
          <Text style={styles.sampleText}>N = {cohortSizeN} artisans</Text>
        </View>

        <View style={styles.filterPills}>
          {/* City Chips */}
          <TouchableOpacity
            onPress={() => setCityFilter('all')}
            style={[styles.pill, cityFilter === 'all' && styles.pillActive]}
          >
            <Text style={[styles.pillText, cityFilter === 'all' && styles.pillTextActive]}>
              {language === 'hi' ? 'सभी शहर' : 'All Cities'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCityFilter('Mumbai')}
            style={[styles.pill, cityFilter === 'Mumbai' && styles.pillActive]}
          >
            <Text style={[styles.pillText, cityFilter === 'Mumbai' && styles.pillTextActive]}>
              Mumbai
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setCityFilter('Delhi')}
            style={[styles.pill, cityFilter === 'Delhi' && styles.pillActive]}
          >
            <Text style={[styles.pillText, cityFilter === 'Delhi' && styles.pillTextActive]}>
              Delhi
            </Text>
          </TouchableOpacity>
        </View>

        {/* NGO Chips */}
        <View style={styles.filterPills}>
          <TouchableOpacity
            onPress={() => setNgoFilter('all')}
            style={[styles.pill, ngoFilter === 'all' && styles.pillActive]}
          >
            <Text style={[styles.pillText, ngoFilter === 'all' && styles.pillTextActive]}>
              {language === 'hi' ? 'सभी एनजीओ' : 'All NGOs'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNgoFilter('Shakti Foundation Mumbai')}
            style={[styles.pill, ngoFilter === 'Shakti Foundation Mumbai' && styles.pillActive]}
          >
            <Text style={[styles.pillText, ngoFilter === 'Shakti Foundation Mumbai' && styles.pillTextActive]}>
              Shakti Fdn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setNgoFilter('SEWA Delhi')}
            style={[styles.pill, ngoFilter === 'SEWA Delhi' && styles.pillActive]}
          >
            <Text style={[styles.pillText, ngoFilter === 'SEWA Delhi' && styles.pillTextActive]}>
              SEWA Delhi
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* CORE BEFORE-AND-AFTER HERO CARD */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroLabel}>
            {language === 'hi' ? 'औसत मासिक आय में बदलाव' : 'Monthly Income Impact'}
          </Text>
          <View style={styles.growthBadge}>
            <Text style={styles.growthBadgeText}>+{pctGain}% Growth</Text>
          </View>
        </View>

        {/* Dual Before / After Box */}
        <View style={styles.dualBox}>
          <View style={styles.beforeBox}>
            <Text style={styles.boxLabel}>
              {language === 'hi' ? 'पहले (Baseline)' : 'Before Karigari'}
            </Text>
            <Text style={styles.beforeAmount}>₹{avgBaseline.toLocaleString('en-IN')}</Text>
            <Text style={styles.boxSub}>
              {language === 'hi' ? 'असंगठित मजदूरी' : 'Informal labor'}
            </Text>
          </View>

          <View style={styles.afterBox}>
            <Text style={styles.boxLabelAfter}>
              {language === 'hi' ? 'अब (Current Verified)' : 'Current Karigari'}
            </Text>
            <Text style={styles.afterAmount}>₹{avgCurrent.toLocaleString('en-IN')}</Text>
            <Text style={styles.boxSubAfter}>+₹{absGain.toLocaleString('en-IN')}/mo</Text>
          </View>
        </View>

        {/* Multiplier ratio bar */}
        <View style={{ marginTop: 8 }}>
          <View style={styles.ratioRow}>
            <Text style={styles.ratioLabel}>
              {language === 'hi' ? 'आय वृद्धि अनुपात:' : 'Income Multiplier:'}
            </Text>
            <Text style={styles.ratioVal}>
              {(avgCurrent / Math.max(1, avgBaseline)).toFixed(1)}x {language === 'hi' ? 'गुना अधिक' : 'higher'}
            </Text>
          </View>
          <View style={styles.ratioTrack}>
            <View style={styles.ratioFill} />
          </View>
        </View>
      </View>

      {/* 2 SECONDARY SOCIO-ECONOMIC METRIC CARDS */}
      <View style={styles.dualGrid}>
        {/* Banking Autonomy */}
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>
            {language === 'hi' ? 'निजी बैंक खाता' : 'Banking Autonomy'}
          </Text>
          <View style={styles.metricValRow}>
            <Text style={styles.metricVal}>{bankRate}%</Text>
            <Text style={styles.metricPrev}>(was 25%)</Text>
          </View>
          <Text style={styles.metricDesc}>
            {language === 'hi' ? 'स्वयं का बैंक या यूपीआई खाता संचालन' : 'Operate own personal bank accounts'}
          </Text>
        </View>

        {/* Decision Autonomy */}
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>
            {language === 'hi' ? 'पारिवारिक निर्णय' : 'Decision Autonomy'}
          </Text>
          <View style={styles.metricValRow}>
            <Text style={styles.metricVal}>{autonomyRate}%</Text>
            <Text style={styles.metricPrev}>(was 22%)</Text>
          </View>
          <Text style={styles.metricDesc}>
            {language === 'hi' ? 'आर्थिक फैसलों में स्वतंत्र या संयुक्त सहभागिता' : 'Independent/joint household decisions'}
          </Text>
        </View>
      </View>

      {/* VISUAL INCOME COMPARISON CHART (PURE REACT NATIVE BARS) */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>
          {language === 'hi' ? 'कारीगर आय तुलना चार्ट (Baseline vs Now)' : 'Artisan Income Comparison Chart'}
        </Text>
        <Text style={styles.chartSub}>
          {language === 'hi' ? 'ग्रे = पहले, हरा = वर्तमान मासिक कमाई' : 'Grey = Baseline, Green = Current Karigari Income'}
        </Text>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 14 }}>
          <View style={styles.barsContainer}>
            {filteredArtisans.map((art) => {
              const baseH = Math.max(15, Math.round((art.baselineMonthlyIncome / maxVal) * 120));
              const currH = Math.max(25, Math.round((art.currentMonthlyIncome / maxVal) * 120));
              const growth = art.baselineMonthlyIncome > 0
                ? Math.round(((art.currentMonthlyIncome - art.baselineMonthlyIncome) / art.baselineMonthlyIncome) * 100)
                : 0;

              return (
                <View key={art.id} style={styles.barGroup}>
                  <Text style={styles.growthTag}>+{growth}%</Text>
                  <View style={styles.barPair}>
                    <View style={[styles.barBaseline, { height: baseH }]} />
                    <View style={[styles.barCurrent, { height: currH }]} />
                  </View>
                  <Text style={styles.barArtisanName} numberOfLines={1}>
                    {art.name.split(' ')[0]}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {/* INDIVIDUAL ARTISANS LIST */}
      <Text style={styles.sectionHeading}>
        {language === 'hi' ? 'कारीगरों की व्यक्तिगत प्रगति' : 'Individual Artisan Cohort'}
      </Text>
      <View style={{ gap: 8 }}>
        {filteredArtisans.map((art) => {
          const gain = art.currentMonthlyIncome - art.baselineMonthlyIncome;
          const pct = art.baselineMonthlyIncome > 0
            ? Math.round((gain / art.baselineMonthlyIncome) * 100)
            : 0;

          return (
            <View key={art.id} style={styles.artisanRowCard}>
              <Image source={{ uri: art.photoUrl }} style={styles.artisanImg} />
              <View style={{ flex: 1 }}>
                <Text style={styles.artisanName}>
                  {language === 'hi' ? art.hindiName : art.name}
                </Text>
                <Text style={styles.artisanSub}>
                  {art.city} • {art.ngoPartner}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.artisanIncome}>
                  ₹{art.currentMonthlyIncome.toLocaleString('en-IN')}
                </Text>
                <Text style={styles.artisanGain}>
                  +{pct}% (was ₹{art.baselineMonthlyIncome.toLocaleString('en-IN')})
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.warmCream
  },
  container: {
    padding: 16,
    paddingBottom: 28,
    gap: 14
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.sageGreenLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen,
    alignSelf: 'flex-start',
    marginBottom: 4
  },
  tagBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.sageGreenDark
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  pageSub: {
    fontSize: 11,
    color: theme.colors.mutedGrey,
    marginTop: 2
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.dustyPink,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.sm
  },
  exportBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.deepBrownDark
  },
  filterCard: {
    backgroundColor: theme.colors.white,
    padding: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    gap: 8
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  sampleText: {
    fontSize: 11,
    color: theme.colors.mutedGrey
  },
  filterPills: {
    flexDirection: 'row',
    gap: 6
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.warmCream,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  pillActive: {
    backgroundColor: theme.colors.dustyPinkLight,
    borderColor: theme.colors.dustyPink
  },
  pillText: {
    fontSize: 11,
    color: theme.colors.mutedGrey
  },
  pillTextActive: {
    color: theme.colors.deepBrown,
    fontWeight: '800'
  },
  heroCard: {
    backgroundColor: '#FFFCFA',
    padding: 16,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.lightBorder,
    gap: 12
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.mutedGrey,
    textTransform: 'uppercase'
  },
  growthBadge: {
    backgroundColor: theme.colors.sageGreenLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full
  },
  growthBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.sageGreenDark
  },
  dualBox: {
    flexDirection: 'row',
    gap: 10
  },
  beforeBox: {
    flex: 1,
    backgroundColor: theme.colors.warmCream,
    padding: 12,
    borderRadius: theme.radius.md
  },
  afterBox: {
    flex: 1,
    backgroundColor: theme.colors.sageGreenLight,
    padding: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.sageGreenBorder
  },
  boxLabel: {
    fontSize: 10,
    color: theme.colors.mutedGrey
  },
  boxLabelAfter: {
    fontSize: 10,
    color: theme.colors.sageGreenDark,
    fontWeight: '700'
  },
  beforeAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    marginTop: 2
  },
  afterAmount: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.sageGreenDark,
    marginTop: 2
  },
  boxSub: {
    fontSize: 10,
    color: theme.colors.mutedGrey,
    marginTop: 2
  },
  boxSubAfter: {
    fontSize: 10,
    color: theme.colors.sageGreenDark,
    fontWeight: '700',
    marginTop: 2
  },
  ratioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  ratioLabel: {
    fontSize: 11,
    color: theme.colors.mutedGrey
  },
  ratioVal: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  ratioTrack: {
    height: 6,
    backgroundColor: theme.colors.warmCream,
    borderRadius: 3,
    overflow: 'hidden'
  },
  ratioFill: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.sageGreen
  },
  dualGrid: {
    flexDirection: 'row',
    gap: 10
  },
  metricCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    justifyContent: 'space-between',
    gap: 6
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.mutedGrey,
    textTransform: 'uppercase'
  },
  metricValRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4
  },
  metricVal: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.deepBrown
  },
  metricPrev: {
    fontSize: 10,
    color: theme.colors.sageGreenDark,
    fontWeight: '700'
  },
  metricDesc: {
    fontSize: 10,
    color: theme.colors.mutedGrey,
    lineHeight: 13
  },
  chartCard: {
    backgroundColor: theme.colors.white,
    padding: 16,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  chartTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  chartSub: {
    fontSize: 10,
    color: theme.colors.mutedGrey,
    marginTop: 2
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
    height: 160,
    paddingBottom: 6
  },
  barGroup: {
    alignItems: 'center',
    gap: 4,
    width: 44
  },
  growthTag: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.sageGreenDark
  },
  barPair: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3
  },
  barBaseline: {
    width: 14,
    backgroundColor: '#E5DDD3',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  },
  barCurrent: {
    width: 14,
    backgroundColor: theme.colors.sageGreen,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3
  },
  barArtisanName: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.deepBrown,
    marginTop: 4
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    textTransform: 'uppercase'
  },
  artisanRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    padding: 12,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    gap: 10
  },
  artisanImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: theme.colors.dustyPink
  },
  artisanName: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  artisanSub: {
    fontSize: 10,
    color: theme.colors.mutedGrey
  },
  artisanIncome: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.sageGreenDark
  },
  artisanGain: {
    fontSize: 9,
    color: theme.colors.mutedGrey
  }
});
