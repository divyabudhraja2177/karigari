import React from 'react';
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
import { CheckCircle2, Clock, ShieldCheck } from 'lucide-react-native';
import { getProductImage } from '../utils/productImages';

export const ArtisanEarnings: React.FC = () => {
  const { currentUser, earnings, orders, t, language, showToast } = useApp();

  const artisanId = currentUser.artisanId || 'art-1';
  const myEarnings = earnings.filter((e) => e.artisanId === artisanId);

  const totalMonthEarnings = myEarnings.reduce((sum, e) => sum + e.amount, 0);
  const totalPaid = myEarnings.filter((e) => e.status === 'paid').reduce((sum, e) => sum + e.amount, 0);
  const totalPending = myEarnings.filter((e) => e.status !== 'paid').reduce((sum, e) => sum + e.amount, 0);

  const handleDownload = () => {
    showToast(language === 'hi' ? 'कमाई रसीद तैयार है' : 'Earnings statement exported', 'success');
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.pageTitle}>{t.earningsTitle}</Text>
      <Text style={styles.pageSub}>{t.earningsSubtitle}</Text>

      {/* Main Earnings Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroLabel}>{t.monthlyEarnings}</Text>
          <View style={styles.verifiedTag}>
            <CheckCircle2 size={12} color={theme.colors.sageGreenDark} />
            <Text style={styles.verifiedTagText}>
              {language === 'hi' ? 'पारदर्शी भुगतान' : 'Fair Trade'}
            </Text>
          </View>
        </View>

        <Text style={styles.heroAmount}>
          ₹{totalMonthEarnings.toLocaleString('en-IN')}
        </Text>

        {/* Breakdown bar */}
        <View style={styles.breakdownRow}>
          <View style={styles.breakdownCol}>
            <Text style={styles.breakdownLabel}>{t.paidToDate}</Text>
            <Text style={styles.paidAmount}>₹{totalPaid.toLocaleString('en-IN')}</Text>
          </View>
          <View style={[styles.breakdownCol, { borderLeftWidth: 1, borderLeftColor: theme.colors.lightBorder, paddingLeft: 16 }]}>
            <Text style={styles.breakdownLabel}>{t.pendingApproval}</Text>
            <Text style={styles.pendingAmount}>₹{totalPending.toLocaleString('en-IN')}</Text>
          </View>
        </View>

        {/* Export Statement Button */}
        <TouchableOpacity onPress={handleDownload} style={styles.downloadBtn}>
          <Text style={styles.downloadBtnText}>
            {language === 'hi' ? 'मासिक रसीद डाउनलोड करें (Statement)' : 'Download Earnings Statement'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Earnings Ledger Feed */}
      <Text style={styles.sectionHeading}>{t.earningsHistory}</Text>

      <View style={{ gap: 10 }}>
        {myEarnings.map((item) => {
          const isPaid = item.status === 'paid';
          const associatedOrder = orders.find((o) => o.id === item.orderId || o.orderNumber === item.orderNumber);
          const hasOrder = !!associatedOrder;
          const prodImage = hasOrder
            ? getProductImage(associatedOrder.productId, associatedOrder.productCategory)
            : null;

          return (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                {prodImage && (
                  <Image source={prodImage} style={styles.earningThumb} resizeMode="cover" />
                )}
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTitle}>
                    {language === 'hi' ? item.hindiDescription : item.description}
                  </Text>
                  <Text style={styles.itemDate}>{item.date}</Text>
                </View>
                <Text style={styles.itemAmount}>
                  ₹{item.amount.toLocaleString('en-IN')}
                </Text>
              </View>

              <View style={styles.itemFooter}>
                <View
                  style={[
                    styles.statusPill,
                    isPaid ? styles.statusPillPaid : styles.statusPillPending
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      isPaid ? { color: theme.colors.sageGreenDark } : { color: theme.colors.dustyPinkDark }
                    ]}
                  >
                    {isPaid ? t.statusPaid : t.statusCalculated}
                  </Text>
                </View>

                {item.paymentRef && (
                  <Text style={styles.refText}>{item.paymentRef}</Text>
                )}
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
    gap: 16
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  pageSub: {
    fontSize: 12,
    color: theme.colors.mutedGrey,
    marginTop: 2
  },
  heroCard: {
    backgroundColor: '#FFFCFA',
    padding: 20,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.lightBorder
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.mutedGrey,
    textTransform: 'uppercase'
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.sageGreenLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen
  },
  verifiedTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.sageGreenDark
  },
  heroAmount: {
    fontSize: 34,
    fontWeight: '900',
    color: theme.colors.deepBrown,
    marginBottom: 16
  },
  breakdownRow: {
    flexDirection: 'row',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightBorder,
    marginBottom: 16
  },
  breakdownCol: {
    flex: 1
  },
  breakdownLabel: {
    fontSize: 11,
    color: theme.colors.mutedGrey
  },
  paidAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.sageGreenDark,
    marginTop: 2
  },
  pendingAmount: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.dustyPinkDark,
    marginTop: 2
  },
  downloadBtn: {
    backgroundColor: theme.colors.warmCream,
    paddingVertical: 12,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  downloadBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    textTransform: 'uppercase'
  },
  itemCard: {
    backgroundColor: theme.colors.white,
    padding: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    gap: 8
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  earningThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  itemDate: {
    fontSize: 11,
    color: theme.colors.mutedGrey,
    marginTop: 2
  },
  itemAmount: {
    fontSize: 16,
    fontWeight: '900',
    color: theme.colors.deepBrown
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightBorder
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.full
  },
  statusPillPaid: {
    backgroundColor: theme.colors.sageGreenLight
  },
  statusPillPending: {
    backgroundColor: theme.colors.dustyPinkLight
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700'
  },
  refText: {
    fontSize: 10,
    color: theme.colors.mutedGrey
  }
});
