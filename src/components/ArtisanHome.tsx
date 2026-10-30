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
  PackageCheck,
  CircleDollarSign,
  Clock,
  Layers,
  ClipboardCheck,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Award,
  Sparkles
} from 'lucide-react-native';
import {
  curatedProductVisuals,
  getProductImage,
  getProductSpec,
  ProductVisualSpec
} from '../utils/productImages';
import { ProductDetailModal } from './ProductDetailModal';

export const ArtisanHome: React.FC = () => {
  const {
    currentUser,
    orders,
    workingHours,
    earnings,
    t,
    language,
    setCurrentTab,
    artisans
  } = useApp();

  const artisanId = currentUser.artisanId || 'art-1';
  const myOrders = orders.filter((o) => o.artisanId === artisanId);
  const activeOrders = myOrders.filter((o) => o.status === 'in_progress' || o.status === 'not_started');
  const completedOrders = myOrders.filter((o) => o.status === 'completed');

  const myEarnings = earnings.filter((e) => e.artisanId === artisanId);
  const totalEarnedThisMonth = myEarnings.reduce((sum, e) => sum + e.amount, 0);

  const urgentOrder = activeOrders.sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  )[0];

  const myHours = workingHours.filter((h) => h.artisanId === artisanId);
  const hoursThisWeek = myHours.reduce((sum, h) => sum + h.durationHours, 0);

  const [selectedProductSpec, setSelectedProductSpec] = useState<ProductVisualSpec | null>(null);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Greeting Banner */}
      <View style={styles.heroCard}>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
          })}
        </Text>
        <Text style={styles.greetingTitle}>
          {language === 'hi'
            ? `नमस्ते, ${currentUser.hindiName || currentUser.name} जी`
            : `Namaste, ${currentUser.name}`}
        </Text>
        <Text style={styles.greetingSub}>
          {language === 'hi'
            ? 'आज का आपका हस्तशिल्प कार्य और कमाई का विवरण नीचे देखें।'
            : 'Here is your daily craft progress and verified earnings.'}
        </Text>
      </View>

      {/* QUESTION 1 & 2: Quick Dual Status Cards */}
      <View style={styles.dualGrid}>
        {/* Card 1: What work do I have? */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCurrentTab('orders')}
          style={[styles.kpiCard, { borderLeftColor: theme.colors.dustyPink }]}
        >
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>{t.q1WorkTitle}</Text>
            <View style={[styles.kpiIconBox, { backgroundColor: theme.colors.dustyPinkLight }]}>
              <PackageCheck size={18} color={theme.colors.dustyPinkDark} />
            </View>
          </View>
          <Text style={styles.kpiValue}>{activeOrders.length}</Text>
          <Text style={styles.kpiSub}>
            {activeOrders.length === 1 ? t.q1WorkDesc : t.q1WorkDescPlural}
          </Text>
          <View style={styles.kpiFooter}>
            <Text style={[styles.kpiLinkText, { color: theme.colors.dustyPinkDark }]}>
              {t.btnViewOrders}
            </Text>
            <ChevronRight size={14} color={theme.colors.dustyPinkDark} />
          </View>
        </TouchableOpacity>

        {/* Card 2: How much have I earned? */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCurrentTab('earnings')}
          style={[styles.kpiCard, { borderLeftColor: theme.colors.sageGreen }]}
        >
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>{t.q2EarnTitle}</Text>
            <View style={[styles.kpiIconBox, { backgroundColor: theme.colors.sageGreenLight }]}>
              <CircleDollarSign size={18} color={theme.colors.sageGreenDark} />
            </View>
          </View>
          <Text style={styles.kpiValue}>₹{totalEarnedThisMonth.toLocaleString('en-IN')}</Text>
          <Text style={styles.kpiSub}>{t.q2EarnDesc}</Text>
          <View style={styles.kpiFooter}>
            <Text style={[styles.kpiLinkText, { color: theme.colors.sageGreenDark }]}>
              {language === 'hi' ? 'खाता देखें' : 'View Ledger'}
            </Text>
            <ChevronRight size={14} color={theme.colors.sageGreenDark} />
          </View>
        </TouchableOpacity>
      </View>

      {/* QUESTION 3: What do I need to complete today? (Urgent Deadline Card) */}
      {urgentOrder ? (
        <View style={styles.urgentCard}>
          <View style={styles.urgentHeader}>
            <View style={styles.urgentBadge}>
              <AlertCircle size={13} color="#B43828" />
              <Text style={styles.urgentBadgeText}>{t.q3TodayTitle}</Text>
            </View>
            <Text style={styles.orderNumText}>{urgentOrder.orderNumber}</Text>
          </View>

          {/* Urgent Product Image Banner with Tap to Inspect */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => setSelectedProductSpec(getProductSpec(urgentOrder.productId, urgentOrder.productCategory))}
            style={styles.urgentImageBanner}
          >
            <Image
              source={getProductImage(urgentOrder.productId, urgentOrder.productCategory, urgentOrder.proofUrl)}
              style={styles.urgentProductImage}
              resizeMode="cover"
            />
            <View style={styles.urgentCategoryPill}>
              <Text style={styles.urgentCategoryPillText}>{urgentOrder.productCategory}</Text>
            </View>
            <View style={styles.urgentRatePill}>
              <Text style={styles.urgentRatePillText}>
                ₹{urgentOrder.pieceRate} / {language === 'hi' ? 'नग' : 'unit'}
              </Text>
            </View>
            <View style={styles.urgentInspectHint}>
              <Sparkles size={11} color="#FFFFFF" />
              <Text style={styles.urgentInspectHintText}>{t.viewDetails}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedProductSpec(getProductSpec(urgentOrder.productId, urgentOrder.productCategory))}
          >
            <Text style={styles.urgentProdTitle}>
              {language === 'hi' ? urgentOrder.productHindiName : urgentOrder.productName}
            </Text>
          </TouchableOpacity>
          <Text style={styles.urgentProdDesc} numberOfLines={2}>
            {language === 'hi' ? urgentOrder.hindiInstructions : urgentOrder.instructions}
          </Text>

          {/* Progress bar */}
          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              {language === 'hi' ? 'तैयार वस्तुएं:' : 'Progress:'} {urgentOrder.completedQty} / {urgentOrder.assignedQty}
            </Text>
            <Text style={styles.progressPct}>
              {Math.round((urgentOrder.completedQty / urgentOrder.assignedQty) * 100)}%
            </Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(urgentOrder.completedQty / urgentOrder.assignedQty) * 100}%` }
              ]}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setCurrentTab('orders')}
            style={styles.urgentActionBtn}
          >
            <Text style={styles.urgentActionBtnText}>{t.updateProgressBtn}</Text>
            <ArrowRight size={14} color={theme.colors.deepBrownDark} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.allDoneCard}>
          <Award size={24} color={theme.colors.sageGreenDark} />
          <View style={{ flex: 1 }}>
            <Text style={styles.allDoneTitle}>
              {language === 'hi' ? 'सभी कार्य समय पर पूर्ण हैं!' : 'All orders up to date!'}
            </Text>
            <Text style={styles.allDoneSub}>
              {language === 'hi' ? 'नया बैच जल्द ही सौंपा जाएगा।' : 'New orders will be assigned soon.'}
            </Text>
          </View>
        </View>
      )}

      {/* Featured Craft Products Showcase */}
      <View style={styles.showcaseBox}>
        <View style={styles.showcaseHeader}>
          <Text style={styles.showcaseTitle}>{t.ourProducts}</Text>
          <Text style={styles.showcaseSub}>{t.ourProductsSub}</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.showcaseScroll}
        >
          {curatedProductVisuals.map((prod) => (
            <TouchableOpacity
              key={prod.id}
              activeOpacity={0.85}
              onPress={() => setSelectedProductSpec(prod)}
              style={styles.showcaseCard}
            >
              <Image source={prod.image} style={styles.showcaseImage} resizeMode="cover" />
              <View style={styles.showcaseRateBadge}>
                <Text style={styles.showcaseRateText}>₹{prod.pieceRate}</Text>
              </View>
              <View style={styles.showcaseInfo}>
                <Text style={styles.showcaseProdName} numberOfLines={1}>
                  {language === 'hi' ? prod.hindiName : prod.name}
                </Text>
                <Text style={styles.showcaseProdHeritage} numberOfLines={1}>
                  {language === 'hi' ? prod.craftHeritageHindi : prod.craftHeritage}
                </Text>
                <View style={styles.showcaseFooter}>
                  <Text style={styles.showcaseTime}>⏱ {prod.estimatedHours}</Text>
                  <Text style={styles.showcaseLink}>{t.viewDetails} →</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* QUESTION 4: Two Prominent Large Buttons (Log Hours + View Orders) */}
      <Text style={styles.sectionHeading}>{t.q4NextTitle}</Text>
      <View style={styles.bigBtnGrid}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCurrentTab('hours')}
          style={[styles.bigBtn, { backgroundColor: theme.colors.dustyPink }]}
        >
          <Clock size={24} color={theme.colors.deepBrownDark} />
          <Text style={styles.bigBtnTitle}>{t.btnLogHours}</Text>
          <Text style={styles.bigBtnSub}>
            {language === 'hi' ? 'समय दर्ज करें' : 'Record time'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCurrentTab('orders')}
          style={[styles.bigBtn, { backgroundColor: theme.colors.sageGreen }]}
        >
          <PackageCheck size={24} color={theme.colors.deepBrownDark} />
          <Text style={styles.bigBtnTitle}>{t.btnViewOrders}</Text>
          <Text style={styles.bigBtnSub}>
            {language === 'hi' ? 'उत्पादन स्थिति' : 'Track yield'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Secondary Service Buttons: Materials & Impact Survey */}
      <View style={styles.secGrid}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCurrentTab('materials')}
          style={styles.secBtn}
        >
          <View style={styles.secBtnIcon}>
            <Layers size={18} color={theme.colors.deepBrown} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.secBtnTitle}>{t.btnRequestMaterials}</Text>
            <Text style={styles.secBtnSub}>
              {language === 'hi' ? 'कपड़ा, ज़िप व धागे' : 'Zips & Linings'}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setCurrentTab('surveys')}
          style={styles.secBtn}
        >
          <View style={styles.secBtnIcon}>
            <ClipboardCheck size={18} color={theme.colors.deepBrown} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.secBtnTitle}>{t.btnTakeSurvey}</Text>
            <Text style={styles.secBtnSub}>
              {language === 'hi' ? 'प्रभाव समीक्षा' : 'Impact survey'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Featured Shortcut: Socio-Economic Impact Analytics (Before vs After) */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setCurrentTab('impact')}
        style={styles.impactFeatureBanner}
      >
        <View style={styles.impactFeatureIcon}>
          <TrendingUp size={22} color={theme.colors.sageGreenDark} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.impactFeatureTitle}>
              {language === 'hi' ? 'सामाजिक प्रभाव विश्लेषण देखें' : 'View Impact Analytics'}
            </Text>
            <View style={styles.tagPill}>
              <Text style={styles.tagPillText}>
                {language === 'hi' ? 'रिपोर्ट' : 'Report'}
              </Text>
            </View>
          </View>
          <Text style={styles.impactFeatureSub}>
            {language === 'hi'
              ? 'कारीगरी से पहले और बाद की आय में वृद्धि (+276%) व आंकड़े'
              : 'Before vs After income gains (+276%) across all artisans'}
          </Text>
        </View>
        <ChevronRight size={18} color={theme.colors.mutedGrey} />
      </TouchableOpacity>

      {/* Product Detail Modal */}
      <ProductDetailModal
        visible={!!selectedProductSpec}
        product={selectedProductSpec}
        onClose={() => setSelectedProductSpec(null)}
      />
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
    gap: 16
  },
  heroCard: {
    backgroundColor: theme.colors.white,
    padding: 18,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.lightBorder
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.mutedGrey,
    marginBottom: 4
  },
  greetingTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    marginBottom: 4
  },
  greetingSub: {
    fontSize: 13,
    color: theme.colors.mutedGrey,
    lineHeight: 18
  },
  dualGrid: {
    flexDirection: 'row',
    gap: 12
  },
  kpiCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    borderLeftWidth: 4,
    justifyContent: 'space-between'
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.mutedGrey,
    textTransform: 'uppercase'
  },
  kpiIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  kpiValue: {
    fontSize: 24,
    fontWeight: '900',
    color: theme.colors.deepBrown,
    marginBottom: 2
  },
  kpiSub: {
    fontSize: 11,
    color: theme.colors.mutedGrey
  },
  kpiFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10
  },
  kpiLinkText: {
    fontSize: 11,
    fontWeight: '700'
  },
  urgentCard: {
    backgroundColor: '#FFFCFA',
    padding: 16,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.lightBorder
  },
  urgentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FDF1EF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full
  },
  urgentBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B43828'
  },
  orderNumText: {
    fontSize: 11,
    color: theme.colors.mutedGrey
  },
  urgentImageBanner: {
    width: '100%',
    height: 135,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: theme.colors.warmCreamAlt,
    position: 'relative',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder
  },
  urgentProductImage: {
    width: '100%',
    height: '100%'
  },
  urgentCategoryPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(89, 71, 63, 0.88)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full
  },
  urgentCategoryPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  urgentRatePill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: theme.colors.sageGreenDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.full
  },
  urgentRatePillText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  urgentInspectHint: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.full
  },
  urgentInspectHintText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  urgentProdTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    marginBottom: 4
  },
  urgentProdDesc: {
    fontSize: 12,
    color: theme.colors.mutedGrey,
    marginBottom: 10,
    lineHeight: 16
  },
  showcaseBox: {
    marginVertical: 4
  },
  showcaseHeader: {
    marginBottom: 10,
    paddingHorizontal: 2
  },
  showcaseTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    marginBottom: 2
  },
  showcaseSub: {
    fontSize: 12,
    color: theme.colors.mutedGrey
  },
  showcaseScroll: {
    paddingRight: 10,
    gap: 12
  },
  showcaseCard: {
    width: 175,
    backgroundColor: theme.colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.cardBorder,
    shadowColor: theme.colors.deepBrown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  showcaseImage: {
    width: '100%',
    height: 115
  },
  showcaseRateBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.sageGreenDark,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: theme.radius.full
  },
  showcaseRateText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  showcaseInfo: {
    padding: 10
  },
  showcaseProdName: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    marginBottom: 2
  },
  showcaseProdHeritage: {
    fontSize: 11,
    color: theme.colors.dustyPinkDark,
    fontWeight: '600',
    marginBottom: 6
  },
  showcaseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightBorder
  },
  showcaseTime: {
    fontSize: 10,
    color: theme.colors.mutedGrey,
    fontWeight: '600'
  },
  showcaseLink: {
    fontSize: 11,
    color: theme.colors.dustyPinkDark,
    fontWeight: '800'
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.deepBrown
  },
  progressPct: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.dustyPinkDark
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: theme.colors.warmCream,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: theme.colors.dustyPink,
    borderRadius: 4
  },
  urgentActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.dustyPink,
    paddingVertical: 10,
    borderRadius: theme.radius.sm
  },
  urgentActionBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrownDark
  },
  allDoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.sageGreenLight,
    padding: 16,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.sageGreenBorder
  },
  allDoneTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.sageGreenDark
  },
  allDoneSub: {
    fontSize: 11,
    color: theme.colors.mutedGrey,
    marginTop: 2
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  bigBtnGrid: {
    flexDirection: 'row',
    gap: 12
  },
  bigBtn: {
    flex: 1,
    padding: 16,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    gap: 6,
    shadowColor: theme.colors.deepBrown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3
  },
  bigBtnTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.deepBrownDark
  },
  bigBtnSub: {
    fontSize: 11,
    color: theme.colors.deepBrown,
    opacity: 0.8
  },
  secGrid: {
    flexDirection: 'row',
    gap: 10
  },
  secBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: theme.colors.white,
    padding: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  secBtnIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: theme.colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center'
  },
  secBtnTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  secBtnSub: {
    fontSize: 10,
    color: theme.colors.mutedGrey
  },
  impactFeatureBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: theme.colors.white,
    padding: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.sageGreenBorder,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.sageGreen
  },
  impactFeatureIcon: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.sageGreenLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  impactFeatureTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  tagPill: {
    backgroundColor: theme.colors.sageGreenLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen
  },
  tagPillText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.sageGreenDark
  },
  impactFeatureSub: {
    fontSize: 11,
    color: theme.colors.mutedGrey,
    marginTop: 2
  }
});
