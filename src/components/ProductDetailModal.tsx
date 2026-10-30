import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Platform
} from 'react-native';
import { theme } from '../theme';
import { useApp } from '../context/AppContext';
import { ProductVisualSpec, curatedProductVisuals } from '../utils/productImages';
import {
  X,
  Sparkles,
  Clock,
  Layers,
  Ruler,
  BadgePercent,
  CheckCircle2,
  Hammer
} from 'lucide-react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ProductDetailModalProps {
  visible: boolean;
  product: ProductVisualSpec | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  visible,
  product,
  onClose
}) => {
  const { language, t } = useApp();

  const currentProduct = product || curatedProductVisuals[0];
  const isHindi = language === 'hi';
  const materials = isHindi ? currentProduct.materialsHindi : currentProduct.materials;

  return (
    <Modal
      visible={visible && !!product}
      animationType="slide"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        {/* Dimmed background - tap to dismiss */}
        <TouchableOpacity
          style={styles.backdropDismiss}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Bottom Sheet Card with fixed height to guarantee ScrollView layout */}
        <View style={styles.modalContainer}>
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <View style={styles.headerTitleBox}>
              <Sparkles size={16} color={theme.colors.dustyPinkDark} />
              <Text style={styles.headerTitle}>
                {isHindi ? 'हस्तशिल्प उत्पाद विवरण' : 'Artisan Craft Specifications'}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color={theme.colors.deepBrown} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            bounces={true}
          >
            {/* Hero Image with Floating Overlays */}
            <View style={styles.imageBox}>
              <Image
                source={currentProduct.image}
                style={styles.productHeroImage}
                resizeMode="cover"
              />
              {/* Category Pill */}
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{currentProduct.category}</Text>
              </View>

              {/* Rate Overlay Badge */}
              <View style={styles.rateBadge}>
                <BadgePercent size={14} color="#FFFFFF" />
                <Text style={styles.rateBadgeText}>
                  ₹{currentProduct.pieceRate} / {isHindi ? 'नग' : 'unit'}
                </Text>
              </View>
            </View>

            {/* Title & Heritage Origin */}
            <View style={styles.titleSection}>
              <Text style={styles.productName}>
                {isHindi ? currentProduct.hindiName : currentProduct.name}
              </Text>
              <Text style={styles.productHeritage}>
                {isHindi ? currentProduct.craftHeritageHindi : currentProduct.craftHeritage}
              </Text>
              <Text style={styles.productDesc}>
                {isHindi ? currentProduct.hindiDescription : currentProduct.description}
              </Text>
            </View>

            {/* Quick Metrics Cards */}
            <View style={styles.metricsRow}>
              {/* Piece Rate */}
              <View style={styles.metricCard}>
                <View style={[styles.metricIconBox, { backgroundColor: theme.colors.sageGreenLight }]}>
                  <BadgePercent size={18} color={theme.colors.sageGreenDark} />
                </View>
                <Text style={styles.metricLabel}>{t.pieceRate}</Text>
                <Text style={[styles.metricValue, { color: theme.colors.sageGreenDark }]}>
                  ₹{currentProduct.pieceRate}
                </Text>
              </View>

              {/* Estimated Time */}
              <View style={styles.metricCard}>
                <View style={[styles.metricIconBox, { backgroundColor: theme.colors.dustyPinkLight }]}>
                  <Clock size={18} color={theme.colors.dustyPinkDark} />
                </View>
                <Text style={styles.metricLabel}>{t.estTime}</Text>
                <Text style={styles.metricValue}>{currentProduct.estimatedHours}</Text>
              </View>

              {/* Dimensions */}
              <View style={styles.metricCard}>
                <View style={[styles.metricIconBox, { backgroundColor: theme.colors.softYellowLight }]}>
                  <Ruler size={18} color={theme.colors.softYellowDark} />
                </View>
                <Text style={styles.metricLabel}>{t.craftDimensions}</Text>
                <Text style={[styles.metricValue, { fontSize: 13 }]}>{currentProduct.dimensions}</Text>
              </View>
            </View>

            {/* Crafting Technique Guideline */}
            <View style={styles.cardSection}>
              <View style={styles.sectionHeaderRow}>
                <Hammer size={16} color={theme.colors.dustyPinkDark} />
                <Text style={styles.sectionHeading}>{t.heritageTechnique}</Text>
              </View>
              <Text style={styles.techniqueText}>
                {isHindi ? currentProduct.techniqueHindi : currentProduct.technique}
              </Text>
            </View>

            {/* Required Materials Checklist */}
            <View style={styles.cardSection}>
              <View style={styles.sectionHeaderRow}>
                <Layers size={16} color={theme.colors.dustyPinkDark} />
                <Text style={styles.sectionHeading}>{t.materialsList}</Text>
              </View>
              <View style={styles.materialsList}>
                {materials.map((mat, index) => (
                  <View key={index} style={styles.materialItem}>
                    <CheckCircle2 size={15} color={theme.colors.sageGreenDark} />
                    <Text style={styles.materialText}>{mat}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onClose}
              style={styles.doneBtn}
            >
              <Text style={styles.doneBtnText}>{t.closeBtn}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'flex-end'
  },
  backdropDismiss: {
    flex: 1,
    width: '100%'
  },
  modalContainer: {
    backgroundColor: theme.colors.warmCream,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: Math.min(SCREEN_HEIGHT * 0.88, 720),
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 20
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightBorder,
    backgroundColor: theme.colors.white
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center'
  },
  scroll: {
    flex: 1
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40
  },
  imageBox: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: theme.colors.white,
    position: 'relative',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: theme.colors.cardBorder,
    shadowColor: theme.colors.deepBrown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4
  },
  productHeroImage: {
    width: '100%',
    height: '100%'
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(89, 71, 63, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF'
  },
  rateBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: theme.colors.sageGreenDark,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.full
  },
  rateBadgeText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  titleSection: {
    marginBottom: 18
  },
  productName: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.deepBrown,
    marginBottom: 4
  },
  productHeritage: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.dustyPinkDark,
    marginBottom: 8
  },
  productDesc: {
    fontSize: 14,
    color: theme.colors.deepBrownLight,
    lineHeight: 20
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16
  },
  metricCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  metricIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6
  },
  metricLabel: {
    fontSize: 11,
    color: theme.colors.mutedGrey,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '900',
    color: theme.colors.deepBrown,
    textAlign: 'center'
  },
  cardSection: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder,
    marginBottom: 14
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  techniqueText: {
    fontSize: 13,
    color: theme.colors.deepBrownLight,
    lineHeight: 19
  },
  materialsList: {
    gap: 8
  },
  materialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  materialText: {
    fontSize: 13,
    color: theme.colors.deepBrown,
    fontWeight: '600'
  },
  doneBtn: {
    backgroundColor: theme.colors.dustyPink,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.deepBrownDark
  }
});
