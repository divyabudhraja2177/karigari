import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { Clock, CheckCircle2 } from 'lucide-react-native';

export const ArtisanHours: React.FC = () => {
  const { currentUser, workingHours, logWorkingHours, orders, t, language } = useApp();

  const artisanId = currentUser.artisanId || 'art-1';
  const myHours = workingHours.filter((h) => h.artisanId === artisanId);
  const myOrders = orders.filter((o) => o.artisanId === artisanId);

  const [selectedDuration, setSelectedDuration] = useState<number>(4);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(myOrders[0]?.id || '');
  const [notes, setNotes] = useState<string>('');

  const totalLogged = myHours.reduce((sum, h) => sum + h.durationHours, 0);

  const handleSubmit = () => {
    const selectedOrder = myOrders.find((o) => o.id === selectedOrderId);
    logWorkingHours({
      artisanId,
      artisanName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00',
      endTime: '15:00',
      durationHours: selectedDuration,
      breakMinutes: 30,
      orderId: selectedOrder?.id,
      orderNumber: selectedOrder?.orderNumber,
      notes
    });
    setNotes('');
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.pageTitle}>{t.workingHoursTitle}</Text>
      <Text style={styles.pageSub}>{t.workingHoursSubtitle}</Text>

      {/* KPI Total Hours Card */}
      <View style={styles.kpiCard}>
        <View style={styles.kpiHeader}>
          <Text style={styles.kpiLabel}>{language === 'hi' ? 'कुल दर्ज कार्य समय' : 'Total Craft Hours'}</Text>
          <Clock size={16} color={theme.colors.sageGreenDark} />
        </View>
        <Text style={styles.kpiValue}>{totalLogged} {language === 'hi' ? 'घंटे' : 'hrs'}</Text>
      </View>

      {/* Log Form Card */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>
          {language === 'hi' ? 'आज का समय दर्ज करें (आसान 1-टैप)' : 'Log Today’s Craft Time (1-Tap)'}
        </Text>

        {/* Quick Duration Buttons (Minimal Typing for Low Digital Literacy) */}
        <Text style={styles.fieldLabel}>{t.quickHoursLabel}</Text>
        <View style={styles.durationRow}>
          {[2, 3, 4, 6, 8].map((hrs) => (
            <TouchableOpacity
              key={hrs}
              activeOpacity={0.7}
              onPress={() => setSelectedDuration(hrs)}
              style={[
                styles.durationChip,
                selectedDuration === hrs && styles.durationChipSelected
              ]}
            >
              <Text
                style={[
                  styles.durationText,
                  selectedDuration === hrs && styles.durationTextSelected
                ]}
              >
                {hrs} {language === 'hi' ? 'घंटे' : 'hrs'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Select Order */}
        <Text style={styles.fieldLabel}>{t.selectOrderLabel}</Text>
        <View style={styles.orderOptions}>
          {myOrders.slice(0, 3).map((ord) => (
            <TouchableOpacity
              key={ord.id}
              activeOpacity={0.7}
              onPress={() => setSelectedOrderId(ord.id)}
              style={[
                styles.orderOption,
                selectedOrderId === ord.id && styles.orderOptionSelected
              ]}
            >
              <Text style={[styles.orderOptionText, selectedOrderId === ord.id && styles.orderOptionTextSelected]}>
                {ord.orderNumber} • {language === 'hi' ? ord.productHindiName : ord.productName}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Notes */}
        <Text style={styles.fieldLabel}>{language === 'hi' ? 'टिप्पणी (वैकल्पिक)' : 'Notes (Optional)'}</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder={language === 'hi' ? 'उदा. ज़िपर सिलाई व फिनिशिंग' : 'e.g. Stitched zippers and corners'}
          placeholderTextColor={theme.colors.mutedGrey}
          style={styles.notesInput}
        />

        {/* Submit Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmit}
          style={styles.submitBtn}
        >
          <Text style={styles.submitBtnText}>{t.submitHoursBtn}</Text>
        </TouchableOpacity>
      </View>

      {/* History Log */}
      <Text style={styles.sectionHeading}>{t.recentActivity}</Text>
      <View style={{ gap: 8 }}>
        {myHours.map((entry) => (
          <View key={entry.id} style={styles.entryCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.entryTitle}>
                {entry.durationHours} {language === 'hi' ? 'घंटे' : 'hrs'} ({entry.date})
              </Text>
              <Text style={styles.entrySub}>
                {entry.orderNumber ? `Batch: ${entry.orderNumber}` : 'General Handicraft Work'}
              </Text>
            </View>
            <View style={styles.approvedPill}>
              <CheckCircle2 size={12} color={theme.colors.sageGreenDark} />
              <Text style={styles.approvedPillText}>{t.statusApproved}</Text>
            </View>
          </View>
        ))}
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
  kpiCard: {
    backgroundColor: theme.colors.white,
    padding: 16,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.lightBorder
  },
  kpiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.mutedGrey,
    textTransform: 'uppercase'
  },
  kpiValue: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.deepBrown
  },
  formCard: {
    backgroundColor: theme.colors.white,
    padding: 18,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.lightBorder,
    gap: 10
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    marginBottom: 4
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.deepBrown,
    marginTop: 6
  },
  durationRow: {
    flexDirection: 'row',
    gap: 8
  },
  durationChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.warmCream,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  durationChipSelected: {
    backgroundColor: theme.colors.dustyPink,
    borderColor: theme.colors.dustyPinkDark
  },
  durationText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  durationTextSelected: {
    color: theme.colors.deepBrownDark,
    fontWeight: '800'
  },
  orderOptions: {
    gap: 6
  },
  orderOption: {
    padding: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.warmCream,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  orderOptionSelected: {
    backgroundColor: theme.colors.sageGreenLight,
    borderColor: theme.colors.sageGreenDark
  },
  orderOptionText: {
    fontSize: 12,
    color: theme.colors.deepBrown
  },
  orderOptionTextSelected: {
    fontWeight: '700',
    color: theme.colors.sageGreenDark
  },
  notesInput: {
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    borderRadius: theme.radius.sm,
    padding: 10,
    fontSize: 12,
    color: theme.colors.deepBrown
  },
  submitBtn: {
    backgroundColor: theme.colors.dustyPink,
    paddingVertical: 14,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    marginTop: 8
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.deepBrownDark
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    textTransform: 'uppercase'
  },
  entryCard: {
    backgroundColor: theme.colors.white,
    padding: 12,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  entryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  entrySub: {
    fontSize: 11,
    color: theme.colors.mutedGrey,
    marginTop: 2
  },
  approvedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.sageGreenLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full
  },
  approvedPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.sageGreenDark
  }
});
