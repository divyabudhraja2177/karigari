import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ScrollView
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import {
  Check,
  Sparkles,
  ArrowRight,
  BadgePercent,
  Clock,
  HeartHandshake,
  Layers
} from 'lucide-react-native';
import {
  curatedProductVisuals,
  ProductVisualSpec
} from '../utils/productImages';
import { ProductDetailModal } from './ProductDetailModal';

import { BrandLogo } from './BrandLogo';

export const WelcomeScreen: React.FC = () => {
  const { language, setLanguage, t, setHasPassedWelcome } = useApp();
  const [selectedProduct, setSelectedProduct] = useState<ProductVisualSpec | null>(null);

  const isHindi = language === 'hi';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.header}>
          <BrandLogo
            size={108}
            withCardFrame
            style={styles.logoFrame}
          />

          <View style={styles.badge}>
            <Sparkles size={13} color={theme.colors.dustyPinkDark} />
            <Text style={styles.badgeText}>Karigari Craft Collective</Text>
          </View>

          <Text style={styles.brandTitle}>कारीगरी • KARIGARI</Text>
          <Text style={styles.tagline}>
            {isHindi ? 'हुनर से आत्मनिर्भरता तक' : 'Empowering Hands. Preserving Heritage.'}
          </Text>

          <Text style={styles.subtext}>
            {isHindi
              ? 'मुंबई व दिल्ली की महिला कारीगरों के लिए विशेष रूप से निर्मित डिजिटल मंच।'
              : 'A dedicated handicraft tracking and financial empowerment platform for women artisans.'}
          </Text>
        </View>

        {/* 3 Visual Trust Badges */}
        <View style={styles.pillRow}>
          <View style={styles.pillBadge}>
            <Layers size={13} color={theme.colors.dustyPinkDark} />
            <Text style={styles.pillText}>{t.handcraftedTag}</Text>
          </View>
          <View style={styles.pillBadge}>
            <BadgePercent size={13} color={theme.colors.sageGreenDark} />
            <Text style={styles.pillText}>{t.fairTradeTag}</Text>
          </View>
          <View style={styles.pillBadge}>
            <HeartHandshake size={13} color={theme.colors.softYellowDark} />
            <Text style={styles.pillText}>{t.womenEmpowermentTag}</Text>
          </View>
        </View>

        {/* Visual Product Showcase Section */}
        <View style={styles.showcaseSection}>
          <View style={styles.showcaseHeader}>
            <View>
              <Text style={styles.showcaseTitle}>{t.ourProducts}</Text>
              <Text style={styles.showcaseSub}>{t.ourProductsSub}</Text>
            </View>
          </View>

          {/* Horizontal Product Image Scroll */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productScrollContent}
          >
            {curatedProductVisuals.map((prod) => (
              <TouchableOpacity
                key={prod.id}
                activeOpacity={0.85}
                onPress={() => setSelectedProduct(prod)}
                style={styles.productCard}
              >
                {/* Product Image Frame */}
                <View style={styles.productImageFrame}>
                  <Image
                    source={prod.image}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                  {/* Floating Piece-Rate Badge */}
                  <View style={styles.ratePill}>
                    <Text style={styles.ratePillText}>
                      ₹{prod.pieceRate}
                    </Text>
                  </View>
                  {/* Category Pill */}
                  <View style={styles.categoryPill}>
                    <Text style={styles.categoryPillText}>{prod.category}</Text>
                  </View>
                </View>

                {/* Card Info */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle} numberOfLines={1}>
                    {isHindi ? prod.hindiName : prod.name}
                  </Text>
                  <Text style={styles.cardHeritage} numberOfLines={1}>
                    {isHindi ? prod.craftHeritageHindi : prod.craftHeritage}
                  </Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.timeTag}>
                      <Clock size={11} color={theme.colors.mutedGrey} />
                      <Text style={styles.timeTagText}>{prod.estimatedHours}</Text>
                    </View>
                    <Text style={styles.inspectHint}>{t.viewDetails} →</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stitched Divider Accent */}
        <View style={styles.divider} />

        {/* Language Selection Header */}
        <Text style={styles.sectionLabel}>
          {t.chooseLanguage} / अपनी भाषा चुनें
        </Text>

        {/* 2 Big Language Selection Cards */}
        <View style={styles.langGrid}>
          {/* Hindi */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setLanguage('hi')}
            style={[
              styles.langCard,
              language === 'hi' && styles.langCardSelected
            ]}
          >
            {language === 'hi' && (
              <View style={styles.checkBadge}>
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              </View>
            )}
            <Text style={styles.langMainText}>हिंदी</Text>
            <Text style={styles.langSubText}>नमस्ते व स्वागत</Text>
          </TouchableOpacity>

          {/* English */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setLanguage('en')}
            style={[
              styles.langCard,
              language === 'en' && styles.langCardSelected
            ]}
          >
            {language === 'en' && (
              <View style={styles.checkBadge}>
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              </View>
            )}
            <Text style={styles.langMainText}>English</Text>
            <Text style={styles.langSubText}>Welcome</Text>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setHasPassedWelcome(true)}
          style={styles.continueButton}
        >
          <Text style={styles.continueButtonText}>{t.continueBtn}</Text>
          <ArrowRight size={18} color={theme.colors.deepBrownDark} strokeWidth={2.5} />
        </TouchableOpacity>

        {/* Footer Note */}
        <Text style={styles.footerText}>
          {isHindi
            ? 'शिल्पकार सशक्तिकरण • फेयर ट्रेड • पारदर्शी भुगतान'
            : 'Artisan Empowerment • Fair Trade • Transparent Earnings'}
        </Text>
      </ScrollView>

      {/* Product Spec Modal */}
      <ProductDetailModal
        visible={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.warmCream
  },
  scroll: {
    flex: 1
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
    alignItems: 'center'
  },
  header: {
    alignItems: 'center',
    marginBottom: 16
  },
  logoFrame: {
    marginBottom: 12
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.dustyPinkLight,
    borderWidth: 1,
    borderColor: theme.colors.dustyPink,
    marginBottom: 10
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.dustyPinkDark
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: theme.colors.deepBrown,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: 4
  },
  tagline: {
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.dustyPinkDark,
    textAlign: 'center',
    marginBottom: 6
  },
  subtext: {
    fontSize: 13,
    color: theme.colors.mutedGrey,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  showcaseSection: {
    width: '100%',
    marginBottom: 18
  },
  showcaseHeader: {
    marginBottom: 12,
    paddingHorizontal: 4
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
  productScrollContent: {
    paddingRight: 10,
    gap: 12
  },
  productCard: {
    width: 190,
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: theme.colors.cardBorder,
    shadowColor: theme.colors.deepBrown,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  productImageFrame: {
    width: '100%',
    height: 140,
    backgroundColor: theme.colors.warmCreamAlt,
    position: 'relative'
  },
  productImage: {
    width: '100%',
    height: '100%'
  },
  ratePill: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: theme.colors.sageGreenDark,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.full
  },
  ratePillText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  categoryPill: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(89, 71, 63, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full
  },
  categoryPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  cardInfo: {
    padding: 10
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    marginBottom: 2
  },
  cardHeritage: {
    fontSize: 11,
    color: theme.colors.dustyPinkDark,
    fontWeight: '600',
    marginBottom: 8
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightBorder
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  timeTagText: {
    fontSize: 11,
    color: theme.colors.mutedGrey,
    fontWeight: '600'
  },
  inspectHint: {
    fontSize: 11,
    color: theme.colors.dustyPinkDark,
    fontWeight: '800'
  },
  divider: {
    width: '100%',
    height: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: theme.colors.dustyPink,
    borderStyle: 'dashed',
    marginVertical: 18,
    opacity: 0.6
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.deepBrown,
    marginBottom: 12,
    alignSelf: 'flex-start'
  },
  langGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 20
  },
  langCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.lightBorder,
    alignItems: 'center',
    position: 'relative'
  },
  langCardSelected: {
    borderColor: theme.colors.dustyPink,
    backgroundColor: theme.colors.dustyPinkLight
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.dustyPinkDark,
    alignItems: 'center',
    justifyContent: 'center'
  },
  langMainText: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    marginBottom: 2
  },
  langSubText: {
    fontSize: 11,
    color: theme.colors.mutedGrey
  },
  continueButton: {
    width: '100%',
    backgroundColor: theme.colors.dustyPink,
    paddingVertical: 15,
    borderRadius: theme.radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: theme.colors.deepBrown,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 3
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.deepBrownDark
  },
  footerText: {
    fontSize: 11,
    color: theme.colors.mutedGrey,
    marginTop: 16,
    textAlign: 'center'
  }
});
