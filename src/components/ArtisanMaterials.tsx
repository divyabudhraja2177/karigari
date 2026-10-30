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
import { Layers, Send, CheckCircle2, Clock } from 'lucide-react-native';

export const ArtisanMaterials: React.FC = () => {
  const { currentUser, materials, materialRequests, createMaterialRequest, t, language } = useApp();

  const artisanId = currentUser.artisanId || 'art-1';
  const myRequests = materialRequests.filter((r) => r.artisanId === artisanId);

  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(materials[3]?.id || materials[0]?.id || '');
  const [requestedQty, setRequestedQty] = useState<number>(25);
  const [reason, setReason] = useState<string>('Need extra brass zips and cotton lining for next pouch batch');

  const handleSubmit = () => {
    if (!selectedMaterialId || requestedQty <= 0) return;
    createMaterialRequest(selectedMaterialId, requestedQty, reason);
    setReason('');
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.pageTitle}>{t.materialsTitle}</Text>
      <Text style={styles.pageSub}>{t.materialsSubtitle}</Text>

      {/* Available Raw Materials Grid */}
      <Text style={styles.sectionHeading}>{t.assignedMaterials}</Text>
      <View style={styles.matGrid}>
        {materials.map((mat) => (
          <View key={mat.id} style={styles.matCard}>
            <View style={styles.catBadge}>
              <Text style={styles.catBadgeText}>{mat.category}</Text>
            </View>
            <Text style={styles.matName}>
              {language === 'hi' ? mat.hindiName : mat.name}
            </Text>
            <View style={styles.stockRow}>
              <Text style={styles.stockLabel}>{t.inStock}:</Text>
              <Text style={styles.stockQty}>{mat.inStock} {mat.unit}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Request for Extra Materials & Supplies (e.g. Zips and Linings) */}
      <View style={styles.requestCard}>
        <View style={styles.reqHeader}>
          <Layers size={18} color={theme.colors.dustyPinkDark} />
          <Text style={styles.reqTitle}>{t.btnRequestMaterials}</Text>
        </View>

        <Text style={styles.fieldLabel}>
          {language === 'hi' ? 'सामग्री चुनें (उदा. ज़िपर, अस्तर, कपड़ा):' : 'Select Material (e.g. Zips, Linings):'}
        </Text>
        <View style={{ gap: 6 }}>
          {materials.map((m) => (
            <TouchableOpacity
              key={m.id}
              activeOpacity={0.7}
              onPress={() => setSelectedMaterialId(m.id)}
              style={[
                styles.selectOption,
                selectedMaterialId === m.id && styles.selectOptionActive
              ]}
            >
              <Text
                style={[
                  styles.selectOptionText,
                  selectedMaterialId === m.id && styles.selectOptionTextActive
                ]}
              >
                {language === 'hi' ? m.hindiName : m.name} ({m.inStock} {m.unit} {language === 'hi' ? 'स्टॉक' : 'avail'})
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quantity */}
        <Text style={styles.fieldLabel}>
          {language === 'hi' ? 'आवश्यक मात्रा (संख्या / मीटर):' : 'Requested Quantity:'}
        </Text>
        <View style={styles.qtyRow}>
          {[10, 25, 50].map((qty) => (
            <TouchableOpacity
              key={qty}
              onPress={() => setRequestedQty(qty)}
              style={[
                styles.qtyChip,
                requestedQty === qty && styles.qtyChipActive
              ]}
            >
              <Text style={[styles.qtyChipText, requestedQty === qty && styles.qtyChipTextActive]}>
                {qty}
              </Text>
            </TouchableOpacity>
          ))}
          <TextInput
            value={String(requestedQty)}
            onChangeText={(v) => setRequestedQty(parseInt(v, 10) || 0)}
            keyboardType="numeric"
            style={styles.qtyInput}
          />
        </View>

        {/* Reason */}
        <Text style={styles.fieldLabel}>
          {language === 'hi' ? 'कारण या विवरण:' : 'Reason / Notes:'}
        </Text>
        <TextInput
          value={reason}
          onChangeText={setReason}
          placeholder={language === 'hi' ? 'उदा. लैपटॉप स्लीव हेतु 20 ज़िप व अस्तर चाहिए' : 'e.g. Need zips & linings for order'}
          placeholderTextColor={theme.colors.mutedGrey}
          style={styles.reasonInput}
        />

        {/* Submit */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleSubmit}
          style={styles.submitReqBtn}
        >
          <Send size={16} color={theme.colors.deepBrownDark} />
          <Text style={styles.submitReqText}>{t.submitRequestBtn}</Text>
        </TouchableOpacity>
      </View>

      {/* Previous Requests */}
      <Text style={styles.sectionHeading}>{t.requestStatusTitle}</Text>
      <View style={{ gap: 8 }}>
        {myRequests.map((req) => (
          <View key={req.id} style={styles.historyCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.historyName}>{req.materialName}</Text>
              <Text style={styles.historyQty}>
                {req.requestedQty} {req.unit} • {req.requestDate}
              </Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                req.status === 'fulfilled'
                  ? styles.statusFulfilled
                  : req.status === 'approved'
                  ? styles.statusApproved
                  : styles.statusPending
              ]}
            >
              <Text style={styles.statusBadgeText}>
                {req.status === 'fulfilled' ? t.statusFulfilled : req.status === 'approved' ? t.statusApproved : t.statusPending}
              </Text>
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
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    textTransform: 'uppercase'
  },
  matGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  matCard: {
    width: '48%',
    backgroundColor: theme.colors.white,
    padding: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    justifyContent: 'space-between',
    minHeight: 90
  },
  catBadge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.warmCream,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.sm
  },
  catBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: theme.colors.mutedGrey
  },
  matName: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    marginVertical: 4
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between'
  },
  stockLabel: {
    fontSize: 10,
    color: theme.colors.mutedGrey
  },
  stockQty: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.sageGreenDark
  },
  requestCard: {
    backgroundColor: theme.colors.white,
    padding: 18,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.lightBorder,
    gap: 10
  },
  reqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4
  },
  reqTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.deepBrown,
    marginTop: 4
  },
  selectOption: {
    padding: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.warmCream,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  selectOptionActive: {
    backgroundColor: theme.colors.dustyPinkLight,
    borderColor: theme.colors.dustyPink
  },
  selectOptionText: {
    fontSize: 11,
    color: theme.colors.deepBrown
  },
  selectOptionTextActive: {
    fontWeight: '800',
    color: theme.colors.dustyPinkDark
  },
  qtyRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  qtyChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.warmCream,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  qtyChipActive: {
    backgroundColor: theme.colors.dustyPink,
    borderColor: theme.colors.dustyPinkDark
  },
  qtyChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  qtyChipTextActive: {
    color: theme.colors.deepBrownDark,
    fontWeight: '800'
  },
  qtyInput: {
    flex: 1,
    padding: 8,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    borderRadius: theme.radius.sm,
    padding: 10,
    fontSize: 12,
    color: theme.colors.deepBrown
  },
  submitReqBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.dustyPink,
    paddingVertical: 14,
    borderRadius: theme.radius.sm,
    marginTop: 6
  },
  submitReqText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrownDark
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.white,
    padding: 12,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  historyName: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  historyQty: {
    fontSize: 10,
    color: theme.colors.mutedGrey,
    marginTop: 2
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full
  },
  statusFulfilled: {
    backgroundColor: theme.colors.sageGreenLight
  },
  statusApproved: {
    backgroundColor: theme.colors.softYellowLight
  },
  statusPending: {
    backgroundColor: theme.colors.warmCream
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.deepBrown
  }
});
