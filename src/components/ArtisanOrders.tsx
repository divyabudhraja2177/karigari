import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { Order } from '../types';
import {
  PackageCheck,
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Circle,
  X,
  Sparkles
} from 'lucide-react-native';
import { getProductImage, getProductSpec, ProductVisualSpec } from '../utils/productImages';
import { ProductDetailModal } from './ProductDetailModal';

export const ArtisanOrders: React.FC = () => {
  const {
    currentUser,
    orders,
    updateOrderProgress,
    updateOrderStatus,
    createMaterialRequest,
    materials,
    t,
    language,
    showToast
  } = useApp();

  const artisanId = currentUser.artisanId || 'art-1';
  const myOrders = orders.filter((o) => o.artisanId === artisanId);

  const [filterTab, setFilterTab] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(null);
  const [completedQty, setCompletedQty] = useState<number>(0);
  const [proofNotes, setProofNotes] = useState<string>('');
  const [proofUri, setProofUri] = useState<string | null>(null);

  const [problemOrder, setProblemOrder] = useState<Order | null>(null);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>(materials[0]?.id || '');
  const [selectedProductSpec, setSelectedProductSpec] = useState<ProductVisualSpec | null>(null);

  const filteredOrders = myOrders.filter((o) => {
    if (filterTab === 'in_progress') return o.status === 'in_progress' || o.status === 'not_started';
    if (filterTab === 'completed') return o.status === 'completed';
    return true;
  });

  const openUpdateModal = (order: Order) => {
    setActiveModalOrder(order);
    setCompletedQty(order.completedQty);
    setProofNotes(order.proofNotes || '');
    setProofUri(order.proofUrl || null);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7
    });

    if (!result.canceled && result.assets[0]) {
      setProofUri(result.assets[0].uri);
      showToast(language === 'hi' ? 'फोटो संलग्न की गई' : 'Photo proof attached', 'success');
    }
  };

  const handleSaveProgress = () => {
    if (!activeModalOrder) return;
    updateOrderProgress(activeModalOrder.id, completedQty, proofNotes, proofUri || undefined);
    setActiveModalOrder(null);
  };

  const handleReportProblem = () => {
    if (!problemOrder) return;
    createMaterialRequest(selectedMaterialId, 10, `Missing supplies reported for ${problemOrder.orderNumber}`);
    setProblemOrder(null);
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.pageTitle}>{t.ordersTitle}</Text>
      <Text style={styles.pageSub}>{t.ordersSubtitle}</Text>

      {/* Filter Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          onPress={() => setFilterTab('all')}
          style={[styles.filterChip, filterTab === 'all' && styles.filterChipActive]}
        >
          <Text style={[styles.filterChipText, filterTab === 'all' && styles.filterChipTextActive]}>
            {language === 'hi' ? 'सभी ऑर्डर' : 'All'} ({myOrders.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilterTab('in_progress')}
          style={[styles.filterChip, filterTab === 'in_progress' && styles.filterChipActive]}
        >
          <Text style={[styles.filterChipText, filterTab === 'in_progress' && styles.filterChipTextActive]}>
            {t.statusInProgress} ({myOrders.filter((o) => o.status !== 'completed').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilterTab('completed')}
          style={[styles.filterChip, filterTab === 'completed' && styles.filterChipActive]}
        >
          <Text style={[styles.filterChipText, filterTab === 'completed' && styles.filterChipTextActive]}>
            {t.statusCompleted} ({myOrders.filter((o) => o.status === 'completed').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Order Cards List */}
      {filteredOrders.map((order) => {
        const isCompleted = order.status === 'completed';
        const percentage = Math.round((order.completedQty / order.assignedQty) * 100);

        return (
          <View key={order.id} style={styles.orderCard}>
            {/* Header: Order Number & Category */}
            <View style={styles.orderHeader}>
              <View style={styles.orderNumberBadge}>
                <Text style={styles.orderNumberText}>{order.orderNumber}</Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  isCompleted
                    ? styles.statusBadgeCompleted
                    : order.status === 'in_progress'
                    ? styles.statusBadgeInProgress
                    : styles.statusBadgeNotStarted
                ]}
              >
                <Text
                  style={[
                    styles.statusBadgeText,
                    isCompleted
                      ? { color: theme.colors.sageGreenDark }
                      : order.status === 'in_progress'
                      ? { color: theme.colors.dustyPinkDark }
                      : { color: theme.colors.mutedGrey }
                  ]}
                >
                  {isCompleted
                    ? t.statusCompleted
                    : order.status === 'in_progress'
                    ? t.statusInProgress
                    : t.statusNotStarted}
                </Text>
              </View>
            </View>

            {/* Product Image Frame with Tap to Inspect */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={() => setSelectedProductSpec(getProductSpec(order.productId, order.productCategory))}
              style={styles.orderImageFrame}
            >
              <Image
                source={getProductImage(order.productId, order.productCategory, order.proofUrl)}
                style={styles.orderProductImage}
                resizeMode="cover"
              />
              <View style={styles.orderCategoryPill}>
                <Text style={styles.orderCategoryPillText}>{order.productCategory}</Text>
              </View>
              {order.priority === 'urgent' && (
                <View style={styles.orderPriorityPill}>
                  <Text style={styles.orderPriorityPillText}>
                    {language === 'hi' ? 'प्राथमिकता' : 'Urgent'}
                  </Text>
                </View>
              )}
              <View style={styles.orderInspectPill}>
                <Sparkles size={11} color="#FFFFFF" />
                <Text style={styles.orderInspectPillText}>{t.viewDetails}</Text>
              </View>
            </TouchableOpacity>

            {/* Product Title & Rate */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setSelectedProductSpec(getProductSpec(order.productId, order.productCategory))}
            >
              <Text style={styles.prodName}>
                {language === 'hi' ? order.productHindiName : order.productName}
              </Text>
            </TouchableOpacity>
            <View style={styles.rateRow}>
              <Text style={styles.pieceRateText}>
                ₹{order.pieceRate} / {language === 'hi' ? 'नग' : 'unit'}
              </Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.deadlineText}>
                {language === 'hi' ? 'अंतिम तारीख:' : 'Deadline:'} {order.deadline}
              </Text>
            </View>

            {/* Yield / Progress Bar */}
            <View style={styles.progressBox}>
              <View style={styles.progressHeader}>
                <Text style={styles.yieldText}>
                  {language === 'hi' ? 'उत्पादन' : 'Progress'}: {order.completedQty} / {order.assignedQty}
                </Text>
                <Text style={[styles.pctText, isCompleted && { color: theme.colors.sageGreenDark }]}>
                  {percentage}%
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${percentage}%`,
                      backgroundColor: isCompleted ? theme.colors.sageGreen : theme.colors.dustyPink
                    }
                  ]}
                />
              </View>
            </View>

            {/* 3 SIMPLE BUTTONS: Not Started, In Progress, Completed (Page 2 Requirement) */}
            <View style={styles.simpleBtnBox}>
              <Text style={styles.simpleBtnLabel}>
                {language === 'hi' ? 'सीधे स्थिति चुनें (आसान बटन):' : 'Mark Status (Simple Buttons):'}
              </Text>
              <View style={styles.simpleBtnRow}>
                {/* 1. Not Started */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => updateOrderStatus(order.id, 'not_started')}
                  style={[
                    styles.stateBtn,
                    order.status === 'not_started' && styles.stateBtnNotStartedActive
                  ]}
                >
                  <Circle
                    size={11}
                    color={order.status === 'not_started' ? theme.colors.deepBrown : theme.colors.mutedGrey}
                  />
                  <Text
                    style={[
                      styles.stateBtnText,
                      order.status === 'not_started' && styles.stateBtnTextActive
                    ]}
                  >
                    {t.statusNotStarted}
                  </Text>
                </TouchableOpacity>

                {/* 2. In Progress */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => updateOrderStatus(order.id, 'in_progress')}
                  style={[
                    styles.stateBtn,
                    order.status === 'in_progress' && styles.stateBtnInProgressActive
                  ]}
                >
                  <Clock
                    size={11}
                    color={order.status === 'in_progress' ? theme.colors.dustyPinkDark : theme.colors.mutedGrey}
                  />
                  <Text
                    style={[
                      styles.stateBtnText,
                      order.status === 'in_progress' && { color: theme.colors.dustyPinkDark, fontWeight: '800' }
                    ]}
                  >
                    {t.statusInProgress}
                  </Text>
                </TouchableOpacity>

                {/* 3. Completed */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => updateOrderStatus(order.id, 'completed')}
                  style={[
                    styles.stateBtn,
                    isCompleted && styles.stateBtnCompletedActive
                  ]}
                >
                  <CheckCircle2
                    size={11}
                    color={isCompleted ? theme.colors.sageGreenDark : theme.colors.mutedGrey}
                  />
                  <Text
                    style={[
                      styles.stateBtnText,
                      isCompleted && { color: theme.colors.sageGreenDark, fontWeight: '800' }
                    ]}
                  >
                    {t.statusCompleted}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Row */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setSelectedProductSpec(getProductSpec(order.productId, order.productCategory))}
                style={styles.specBtn}
              >
                <Sparkles size={14} color={theme.colors.dustyPinkDark} />
                <Text style={styles.specBtnText}>{t.viewDetails}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => openUpdateModal(order)}
                style={styles.updateBtn}
              >
                <PackageCheck size={16} color={theme.colors.deepBrownDark} />
                <Text style={styles.updateBtnText}>{t.updateProgressBtn}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setProblemOrder(order)}
                style={styles.issueBtn}
              >
                <AlertTriangle size={16} color={theme.colors.deepBrown} />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* UPDATE PROGRESS MODAL */}
      {activeModalOrder && (
        <Modal
          visible={true}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setActiveModalOrder(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Image
                    source={getProductImage(activeModalOrder.productId, activeModalOrder.productCategory)}
                    style={styles.modalProductThumb}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.modalOrderNum}>{activeModalOrder.orderNumber}</Text>
                    <Text style={styles.modalProdTitle} numberOfLines={1}>
                      {language === 'hi' ? activeModalOrder.productHindiName : activeModalOrder.productName}
                    </Text>
                    <Text style={styles.modalRateText}>
                      ₹{activeModalOrder.pieceRate} / {language === 'hi' ? 'नग' : 'unit'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setActiveModalOrder(null)} style={{ padding: 4 }}>
                  <X size={20} color={theme.colors.mutedGrey} />
                </TouchableOpacity>
              </View>

              {/* Stepper Count */}
              <Text style={styles.inputLabel}>{t.enterCompletedCount}</Text>
              <View style={styles.stepperRow}>
                <TouchableOpacity
                  onPress={() => setCompletedQty((q) => Math.max(0, q - 1))}
                  style={styles.stepBtn}
                >
                  <Text style={styles.stepBtnText}>-1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setCompletedQty((q) => Math.min(activeModalOrder.assignedQty, q + 1))}
                  style={styles.stepBtn}
                >
                  <Text style={styles.stepBtnText}>+1</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setCompletedQty((q) => Math.min(activeModalOrder.assignedQty, q + 5))}
                  style={[styles.stepBtn, { backgroundColor: theme.colors.dustyPinkLight, borderColor: theme.colors.dustyPink }]}
                >
                  <Text style={[styles.stepBtnText, { color: theme.colors.dustyPinkDark }]}>+5</Text>
                </TouchableOpacity>

                <TextInput
                  value={String(completedQty)}
                  onChangeText={(val) => {
                    const num = parseInt(val, 10);
                    if (!isNaN(num)) setCompletedQty(Math.max(0, Math.min(activeModalOrder.assignedQty, num)));
                    else if (val === '') setCompletedQty(0);
                  }}
                  keyboardType="numeric"
                  style={styles.qtyInput}
                />
              </View>

              {/* Presets: 0 vs All */}
              <View style={styles.presetRow}>
                <TouchableOpacity onPress={() => setCompletedQty(0)} style={styles.presetChip}>
                  <Text style={styles.presetText}>0 ({language === 'hi' ? 'शुरू नहीं' : 'Reset'})</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setCompletedQty(activeModalOrder.assignedQty)}
                  style={[styles.presetChip, { backgroundColor: theme.colors.sageGreenLight, borderColor: theme.colors.sageGreen }]}
                >
                  <Text style={[styles.presetText, { color: theme.colors.sageGreenDark, fontWeight: '700' }]}>
                    {language === 'hi' ? `सभी ${activeModalOrder.assignedQty} पूर्ण` : `All ${activeModalOrder.assignedQty} Done`}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Proof Photo Picker */}
              <Text style={styles.inputLabel}>{t.uploadProofBtn}</Text>
              <TouchableOpacity onPress={handlePickImage} style={styles.photoBox}>
                {proofUri ? (
                  <View style={{ alignItems: 'center', gap: 6 }}>
                    <Image source={{ uri: proofUri }} style={styles.proofPreview} />
                    <Text style={styles.proofSuccessText}>✓ {t.proofUploaded}</Text>
                  </View>
                ) : (
                  <View style={{ alignItems: 'center', gap: 4 }}>
                    <Camera size={26} color={theme.colors.dustyPinkDark} />
                    <Text style={styles.photoBoxText}>
                      {language === 'hi' ? 'कैमरा या गैलरी से फोटो चुनें' : 'Take or upload batch photo'}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Inspection Remarks */}
              <Text style={styles.inputLabel}>
                {language === 'hi' ? 'टिप्पणी (वैकल्पिक)' : 'Notes / Remarks'}
              </Text>
              <TextInput
                value={proofNotes}
                onChangeText={setProofNotes}
                placeholder={language === 'hi' ? 'उदा. 24 पाउच सिल दिए गए हैं' : 'e.g. 24 pouches completed'}
                placeholderTextColor={theme.colors.mutedGrey}
                style={styles.notesInput}
              />

              {/* Action Buttons */}
              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  onPress={() => setActiveModalOrder(null)}
                  style={styles.modalCancelBtn}
                >
                  <Text style={styles.modalCancelText}>{t.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveProgress}
                  style={styles.modalSaveBtn}
                >
                  <Text style={styles.modalSaveText}>{t.save}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* REPORT ISSUE / MISSING MATERIALS MODAL */}
      {problemOrder && (
        <Modal
          visible={true}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setProblemOrder(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <AlertTriangle size={18} color="#B43828" />
                  <Text style={styles.modalProdTitle}>{t.reportIssueBtn}</Text>
                </View>
                <TouchableOpacity onPress={() => setProblemOrder(null)}>
                  <X size={20} color={theme.colors.mutedGrey} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.inputLabel, { marginTop: 10 }]}>
                {language === 'hi' ? 'किस सामग्री की कमी है?' : 'Select required material:'}
              </Text>
              {materials.slice(0, 3).map((mat) => (
                <TouchableOpacity
                  key={mat.id}
                  onPress={() => setSelectedMaterialId(mat.id)}
                  style={[
                    styles.matOption,
                    selectedMaterialId === mat.id && styles.matOptionSelected
                  ]}
                >
                  <Text style={[styles.matOptionText, selectedMaterialId === mat.id && styles.matOptionTextSelected]}>
                    {language === 'hi' ? mat.hindiName : mat.name}
                  </Text>
                </TouchableOpacity>
              ))}

              <View style={styles.modalBtnRow}>
                <TouchableOpacity
                  onPress={() => setProblemOrder(null)}
                  style={styles.modalCancelBtn}
                >
                  <Text style={styles.modalCancelText}>{t.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleReportProblem}
                  style={[styles.modalSaveBtn, { backgroundColor: theme.colors.sageGreen }]}
                >
                  <Text style={styles.modalSaveText}>
                    {language === 'hi' ? 'मांग भेजें' : 'Send Request'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Product Detail & Spec Modal */}
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
    gap: 14
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
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 4
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  filterChipActive: {
    backgroundColor: theme.colors.dustyPink,
    borderColor: theme.colors.dustyPinkDark
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.mutedGrey
  },
  filterChipTextActive: {
    color: theme.colors.deepBrownDark,
    fontWeight: '800'
  },
  orderCard: {
    backgroundColor: theme.colors.white,
    padding: 16,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.lightBorder,
    gap: 10
  },
  orderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  orderNumberBadge: {
    backgroundColor: theme.colors.warmCream,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm
  },
  orderNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full,
    borderWidth: 1
  },
  statusBadgeCompleted: {
    backgroundColor: theme.colors.sageGreenLight,
    borderColor: theme.colors.sageGreen
  },
  statusBadgeInProgress: {
    backgroundColor: theme.colors.dustyPinkLight,
    borderColor: theme.colors.dustyPink
  },
  statusBadgeNotStarted: {
    backgroundColor: theme.colors.warmCream,
    borderColor: theme.colors.lightBorder
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '800'
  },
  prodName: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  pieceRateText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.sageGreenDark
  },
  dot: {
    color: theme.colors.mutedGrey
  },
  deadlineText: {
    fontSize: 11,
    color: theme.colors.mutedGrey
  },
  progressBox: {
    backgroundColor: theme.colors.warmCream,
    padding: 10,
    borderRadius: theme.radius.sm
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4
  },
  yieldText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  pctText: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.dustyPinkDark
  },
  progressTrack: {
    height: 6,
    backgroundColor: theme.colors.white,
    borderRadius: 3,
    overflow: 'hidden'
  },
  progressFill: {
    height: '100%',
    borderRadius: 3
  },
  simpleBtnBox: {
    backgroundColor: theme.colors.warmCreamAlt,
    padding: 8,
    borderRadius: theme.radius.sm,
    gap: 6
  },
  simpleBtnLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  simpleBtnRow: {
    flexDirection: 'row',
    gap: 6
  },
  stateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 7,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  stateBtnNotStartedActive: {
    borderWidth: 2,
    borderColor: theme.colors.mutedGrey,
    backgroundColor: theme.colors.warmCream
  },
  stateBtnInProgressActive: {
    borderWidth: 2,
    borderColor: theme.colors.dustyPinkDark,
    backgroundColor: theme.colors.dustyPinkLight
  },
  stateBtnCompletedActive: {
    borderWidth: 2,
    borderColor: theme.colors.sageGreenDark,
    backgroundColor: theme.colors.sageGreenLight
  },
  stateBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.mutedGrey
  },
  stateBtnTextActive: {
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2
  },
  specBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.dustyPink
  },
  specBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.dustyPinkDark
  },
  updateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.dustyPink,
    paddingVertical: 10,
    borderRadius: theme.radius.sm
  },
  updateBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.deepBrownDark
  },
  issueBtn: {
    padding: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.warmCream,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(42, 37, 35, 0.6)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: 20,
    paddingBottom: 36,
    gap: 12
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightBorder,
    paddingBottom: 10
  },
  modalOrderNum: {
    fontSize: 11,
    color: theme.colors.mutedGrey,
    fontWeight: '700'
  },
  modalProdTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  stepBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.warmCream,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  stepBtnText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  qtyInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: theme.radius.sm,
    borderWidth: 1.5,
    borderColor: theme.colors.dustyPink,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    color: theme.colors.deepBrown
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  presetChip: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  presetText: {
    fontSize: 10,
    color: theme.colors.mutedGrey
  },
  photoBox: {
    borderWidth: 1.5,
    borderColor: theme.colors.lightBorder,
    borderStyle: 'dashed',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.warmCream,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  proofPreview: {
    width: 80,
    height: 80,
    borderRadius: theme.radius.sm
  },
  proofSuccessText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.sageGreenDark
  },
  photoBoxText: {
    fontSize: 11,
    color: theme.colors.deepBrown,
    fontWeight: '600'
  },
  notesInput: {
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    borderRadius: theme.radius.sm,
    padding: 10,
    fontSize: 12,
    color: theme.colors.deepBrown
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.warmCream,
    alignItems: 'center'
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  modalSaveBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.dustyPink,
    alignItems: 'center'
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrownDark
  },
  matOption: {
    padding: 10,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.warmCream,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    marginBottom: 6
  },
  matOptionSelected: {
    borderColor: theme.colors.sageGreenDark,
    backgroundColor: theme.colors.sageGreenLight
  },
  matOptionText: {
    fontSize: 12,
    color: theme.colors.deepBrown
  },
  matOptionTextSelected: {
    fontWeight: '700',
    color: theme.colors.sageGreenDark
  },
  orderImageFrame: {
    width: '100%',
    height: 145,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: theme.colors.warmCreamAlt,
    position: 'relative',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder
  },
  orderProductImage: {
    width: '100%',
    height: '100%'
  },
  orderCategoryPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(89, 71, 63, 0.88)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full
  },
  orderCategoryPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  orderPriorityPill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.danger,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full
  },
  orderPriorityPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  orderInspectPill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.full
  },
  orderInspectPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  modalProductThumb: {
    width: 48,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder
  },
  modalRateText: {
    fontSize: 11,
    color: theme.colors.sageGreenDark,
    fontWeight: '800',
    marginTop: 2
  }
});
