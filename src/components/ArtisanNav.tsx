import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import {
  Home,
  PackageCheck,
  CircleDollarSign,
  MoreHorizontal,
  Clock,
  Layers,
  ClipboardCheck,
  User,
  TrendingUp,
  X,
  Sparkles,
  Palette
} from 'lucide-react-native';
import {
  curatedProductVisuals,
  ProductVisualSpec
} from '../utils/productImages';
import { ProductDetailModal } from './ProductDetailModal';

export const ArtisanNav: React.FC = () => {
  const { currentTab, setCurrentTab, t, language } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showCatalogModal, setShowCatalogModal] = useState(false);
  const [selectedProductSpec, setSelectedProductSpec] = useState<ProductVisualSpec | null>(null);

  const isPrimaryTab = currentTab === 'home' || currentTab === 'orders' || currentTab === 'earnings';

  const selectTab = (tab: typeof currentTab) => {
    setCurrentTab(tab);
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/* Bottom 4-Item Floating Tab Bar */}
      <View style={styles.navBar}>
        {/* Destination 1: Home */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => selectTab('home')}
          style={styles.navItem}
        >
          <View
            style={[
              styles.iconWrapper,
              currentTab === 'home' && styles.iconWrapperActive
            ]}
          >
            <Home
              size={22}
              color={currentTab === 'home' ? theme.colors.dustyPinkDark : theme.colors.mutedGrey}
              strokeWidth={currentTab === 'home' ? 2.5 : 2}
            />
          </View>
          <Text
            style={[
              styles.navText,
              currentTab === 'home' && styles.navTextActive
            ]}
          >
            {t.navHome}
          </Text>
        </TouchableOpacity>

        {/* Destination 2: Orders */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => selectTab('orders')}
          style={styles.navItem}
        >
          <View
            style={[
              styles.iconWrapper,
              currentTab === 'orders' && styles.iconWrapperActive
            ]}
          >
            <PackageCheck
              size={22}
              color={currentTab === 'orders' ? theme.colors.dustyPinkDark : theme.colors.mutedGrey}
              strokeWidth={currentTab === 'orders' ? 2.5 : 2}
            />
          </View>
          <Text
            style={[
              styles.navText,
              currentTab === 'orders' && styles.navTextActive
            ]}
          >
            {t.navOrders}
          </Text>
        </TouchableOpacity>

        {/* Destination 3: Earnings */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => selectTab('earnings')}
          style={styles.navItem}
        >
          <View
            style={[
              styles.iconWrapper,
              currentTab === 'earnings' && styles.iconWrapperActive
            ]}
          >
            <CircleDollarSign
              size={22}
              color={currentTab === 'earnings' ? theme.colors.dustyPinkDark : theme.colors.mutedGrey}
              strokeWidth={currentTab === 'earnings' ? 2.5 : 2}
            />
          </View>
          <Text
            style={[
              styles.navText,
              currentTab === 'earnings' && styles.navTextActive
            ]}
          >
            {t.navEarnings}
          </Text>
        </TouchableOpacity>

        {/* Destination 4: More Drawer */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setIsDrawerOpen(true)}
          style={styles.navItem}
        >
          <View
            style={[
              styles.iconWrapper,
              !isPrimaryTab && styles.iconWrapperActive
            ]}
          >
            <MoreHorizontal
              size={22}
              color={!isPrimaryTab ? theme.colors.dustyPinkDark : theme.colors.mutedGrey}
              strokeWidth={!isPrimaryTab ? 2.5 : 2}
            />
          </View>
          <Text
            style={[
              styles.navText,
              !isPrimaryTab && styles.navTextActive
            ]}
          >
            {language === 'hi' ? 'अन्य' : 'More'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slide-Up Bottom Drawer Modal */}
      <Modal
        visible={isDrawerOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsDrawerOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setIsDrawerOpen(false)}
        >
          <View style={styles.drawerContent} onStartShouldSetResponder={() => true}>
            {/* Header */}
            <View style={styles.drawerHeader}>
              <View style={styles.drawerTitleRow}>
                <View style={styles.drawerTitleIcon}>
                  <MoreHorizontal size={18} color={theme.colors.deepBrown} />
                </View>
                <Text style={styles.drawerTitle}>
                  {language === 'hi' ? 'अन्य सुविधाएं व सेवाएं' : 'Craft Services & Tools'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsDrawerOpen(false)}
                style={styles.closeBtn}
              >
                <X size={20} color={theme.colors.mutedGrey} />
              </TouchableOpacity>
            </View>

            {/* 2-Column Grid */}
            <View style={styles.drawerGrid}>
              {/* Working Hours */}
              <TouchableOpacity
                onPress={() => selectTab('hours')}
                style={[
                  styles.drawerCard,
                  currentTab === 'hours' && styles.drawerCardActive
                ]}
              >
                <View style={styles.drawerCardIcon}>
                  <Clock size={20} color={theme.colors.deepBrown} />
                </View>
                <Text style={styles.drawerCardTitle}>{t.navHours}</Text>
                <Text style={styles.drawerCardSub}>
                  {language === 'hi' ? 'समय दर्ज करें' : 'Log craft hours'}
                </Text>
              </TouchableOpacity>

              {/* Materials */}
              <TouchableOpacity
                onPress={() => selectTab('materials')}
                style={[
                  styles.drawerCard,
                  currentTab === 'materials' && styles.drawerCardActive
                ]}
              >
                <View style={styles.drawerCardIcon}>
                  <Layers size={20} color={theme.colors.deepBrown} />
                </View>
                <Text style={styles.drawerCardTitle}>{t.navMaterials}</Text>
                <Text style={styles.drawerCardSub}>
                  {language === 'hi' ? 'कच्चा माल व ज़िप' : 'Zips & Linings'}
                </Text>
              </TouchableOpacity>

              {/* Impact Surveys */}
              <TouchableOpacity
                onPress={() => selectTab('surveys')}
                style={[
                  styles.drawerCard,
                  currentTab === 'surveys' && styles.drawerCardActive
                ]}
              >
                <View style={styles.drawerCardIcon}>
                  <ClipboardCheck size={20} color={theme.colors.deepBrown} />
                </View>
                <Text style={styles.drawerCardTitle}>{t.navSurveys}</Text>
                <Text style={styles.drawerCardSub}>
                  {language === 'hi' ? 'प्रभाव समीक्षा' : 'Impact survey'}
                </Text>
              </TouchableOpacity>

              {/* Profile */}
              <TouchableOpacity
                onPress={() => selectTab('profile')}
                style={[
                  styles.drawerCard,
                  currentTab === 'profile' && styles.drawerCardActive
                ]}
              >
                <View style={styles.drawerCardIcon}>
                  <User size={20} color={theme.colors.deepBrown} />
                </View>
                <Text style={styles.drawerCardTitle}>{t.navProfile}</Text>
                <Text style={styles.drawerCardSub}>
                  {language === 'hi' ? 'प्रोफ़ाइल व सहायता' : 'NGO helpline'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Featured Item 1: Craft Products Catalog Showcase */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setIsDrawerOpen(false);
                setShowCatalogModal(true);
              }}
              style={styles.catalogBanner}
            >
              <View style={styles.catalogIconBox}>
                <Palette size={20} color={theme.colors.dustyPinkDark} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.catalogTitle}>
                    {language === 'hi' ? 'हस्तशिल्प उत्पाद कैटलॉग' : 'Craft Products Catalog'}
                  </Text>
                  <View style={styles.catalogBadge}>
                    <Sparkles size={10} color={theme.colors.dustyPinkDark} />
                    <Text style={styles.catalogBadgeText}>
                      {language === 'hi' ? 'गैलरी' : 'Visuals'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.catalogSub}>
                  {language === 'hi'
                    ? 'सभी 4 उत्पादों की तस्वीरें, पारिश्रमिक दरें व सिलाई गाइड'
                    : 'Photos, piece rates (₹140-₹290) & materials specs'}
                </Text>
              </View>
              {/* Mini thumbs preview */}
              <View style={styles.catalogMiniThumbs}>
                {curatedProductVisuals.slice(0, 3).map((p) => (
                  <Image key={p.id} source={p.image} style={styles.catalogMiniThumb} />
                ))}
              </View>
            </TouchableOpacity>

            {/* Featured Item 2: Socio-Economic Impact Analytics (Main Client Feature) */}
            <TouchableOpacity
              onPress={() => selectTab('impact')}
              style={[
                styles.impactBanner,
                currentTab === 'impact' && styles.impactBannerActive
              ]}
            >
              <View style={styles.impactIcon}>
                <TrendingUp size={22} color={theme.colors.sageGreenDark} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={styles.impactTitle}>
                    {language === 'hi' ? 'डेटा एनालिटिक्स व प्रभाव रिपोर्ट' : 'Impact Analytics & Reports'}
                  </Text>
                  <View style={styles.mainFeatureTag}>
                    <Text style={styles.mainFeatureTagText}>
                      {language === 'hi' ? 'मुख्य' : 'Main'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.impactSub}>
                  {language === 'hi'
                    ? 'पहले और बाद की आय तुलना, वित्तीय आजादी व आंकड़े'
                    : 'Before vs After income gains across all artisans'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Craft Products Catalog Full Screen Modal */}
      <Modal
        visible={showCatalogModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowCatalogModal(false)}
      >
        <SafeAreaView style={styles.catalogModalSafeArea}>
          <View style={styles.catalogModalHeader}>
            <View>
              <Text style={styles.catalogModalHeading}>
                {language === 'hi' ? 'कारीगरी शिल्प कैटलॉग' : 'Craft Products Catalog'}
              </Text>
              <Text style={styles.catalogModalSub}>
                {language === 'hi'
                  ? 'मानकीकृत पारिश्रमिक दरें व निर्माण गाइड'
                  : 'Handcrafted items, standardized rates & specs'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowCatalogModal(false)}
              style={styles.catalogCloseBtn}
            >
              <X size={20} color={theme.colors.deepBrown} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.catalogModalScroll}>
            {curatedProductVisuals.map((prod) => (
              <TouchableOpacity
                key={prod.id}
                activeOpacity={0.88}
                onPress={() => {
                  setShowCatalogModal(false);
                  setTimeout(() => {
                    setSelectedProductSpec(prod);
                  }, 150);
                }}
                style={styles.catalogModalCard}
              >
                <Image source={prod.image} style={styles.catalogModalImg} resizeMode="cover" />
                <View style={styles.catalogModalCardBody}>
                  <View style={styles.catalogModalTopRow}>
                    <Text style={styles.catalogModalCat}>{prod.category}</Text>
                    <View style={styles.catalogModalRateBadge}>
                      <Text style={styles.catalogModalRateText}>
                        ₹{prod.pieceRate} / {language === 'hi' ? 'नग' : 'unit'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.catalogModalTitle}>
                    {language === 'hi' ? prod.hindiName : prod.name}
                  </Text>
                  <Text style={styles.catalogModalHeritage}>
                    {language === 'hi' ? prod.craftHeritageHindi : prod.craftHeritage}
                  </Text>
                  <Text style={styles.catalogModalDesc} numberOfLines={2}>
                    {language === 'hi' ? prod.hindiDescription : prod.description}
                  </Text>

                  <View style={styles.catalogModalFooter}>
                    <Text style={styles.catalogModalTime}>⏱ {prod.estimatedHours}</Text>
                    <Text style={styles.catalogModalInspectLink}>
                      {t.viewDetails} →
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Product Spec Detail Modal */}
      <ProductDetailModal
        visible={!!selectedProductSpec}
        product={selectedProductSpec}
        onClose={() => setSelectedProductSpec(null)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightBorder,
    shadowColor: theme.colors.deepBrown,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 8
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3
  },
  iconWrapper: {
    width: 44,
    height: 30,
    borderRadius: theme.radius.full,
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconWrapperActive: {
    backgroundColor: theme.colors.dustyPinkLight
  },
  navText: {
    fontSize: 11,
    fontWeight: '500',
    color: theme.colors.mutedGrey
  },
  navTextActive: {
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(42, 37, 35, 0.55)',
    justifyContent: 'flex-end'
  },
  drawerContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    padding: 20,
    paddingBottom: 36
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  drawerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  drawerTitleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center'
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  closeBtn: {
    padding: 6
  },
  drawerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12
  },
  drawerCard: {
    width: '48%',
    backgroundColor: theme.colors.warmCream,
    padding: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  drawerCardActive: {
    borderColor: theme.colors.dustyPink,
    backgroundColor: theme.colors.dustyPinkLight
  },
  drawerCardIcon: {
    width: 34,
    height: 34,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8
  },
  drawerCardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.deepBrown,
    marginBottom: 2
  },
  drawerCardSub: {
    fontSize: 10,
    color: theme.colors.mutedGrey
  },
  impactBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: theme.colors.sageGreenBorder,
    borderRadius: theme.radius.md,
    padding: 14,
    shadowColor: theme.colors.deepBrown,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  impactBannerActive: {
    backgroundColor: theme.colors.sageGreenLight,
    borderColor: theme.colors.sageGreenDark,
    borderWidth: 2
  },
  impactIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.sageGreenLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  impactTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  mainFeatureTag: {
    backgroundColor: theme.colors.sageGreenLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.sageGreen
  },
  mainFeatureTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.sageGreenDark
  },
  impactSub: {
    fontSize: 11,
    color: theme.colors.mutedGrey,
    marginTop: 2
  },
  catalogBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: theme.colors.dustyPink,
    borderRadius: theme.radius.md,
    padding: 12,
    marginBottom: 10,
    shadowColor: theme.colors.deepBrown,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2
  },
  catalogIconBox: {
    width: 38,
    height: 38,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.dustyPinkLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  catalogTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  catalogBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: theme.colors.dustyPinkLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.full
  },
  catalogBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: theme.colors.dustyPinkDark
  },
  catalogSub: {
    fontSize: 11,
    color: theme.colors.mutedGrey,
    marginTop: 2
  },
  catalogMiniThumbs: {
    flexDirection: 'row',
    marginLeft: 4
  },
  catalogMiniThumb: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    marginLeft: -6
  },
  catalogModalSafeArea: {
    flex: 1,
    backgroundColor: theme.colors.warmCream
  },
  catalogModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightBorder
  },
  catalogModalHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: theme.colors.deepBrown
  },
  catalogModalSub: {
    fontSize: 12,
    color: theme.colors.mutedGrey,
    marginTop: 2
  },
  catalogCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.warmCream,
    alignItems: 'center',
    justifyContent: 'center'
  },
  catalogModalScroll: {
    padding: 16,
    gap: 14
  },
  catalogModalCard: {
    backgroundColor: theme.colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: theme.colors.cardBorder,
    shadowColor: theme.colors.deepBrown,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3
  },
  catalogModalImg: {
    width: '100%',
    height: 170
  },
  catalogModalCardBody: {
    padding: 14
  },
  catalogModalTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  catalogModalCat: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    backgroundColor: theme.colors.warmCream,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full
  },
  catalogModalRateBadge: {
    backgroundColor: theme.colors.sageGreenDark,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.full
  },
  catalogModalRateText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFFFFF'
  },
  catalogModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    marginBottom: 2
  },
  catalogModalHeritage: {
    fontSize: 12,
    color: theme.colors.dustyPinkDark,
    fontWeight: '700',
    marginBottom: 6
  },
  catalogModalDesc: {
    fontSize: 12,
    color: theme.colors.deepBrownLight,
    lineHeight: 17,
    marginBottom: 10
  },
  catalogModalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.lightBorder
  },
  catalogModalTime: {
    fontSize: 11,
    color: theme.colors.mutedGrey,
    fontWeight: '600'
  },
  catalogModalInspectLink: {
    fontSize: 12,
    color: theme.colors.dustyPinkDark,
    fontWeight: '800'
  }
});
