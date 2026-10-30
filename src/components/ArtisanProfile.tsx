import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking
} from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import {
  MapPin,
  Sparkles,
  Award,
  HeartHandshake,
  Phone,
  Globe,
  TrendingUp,
  LogOut,
  ChevronRight
} from 'lucide-react-native';

export const ArtisanProfile: React.FC = () => {
  const { currentUser, artisans, language, setLanguage, t, setHasPassedWelcome, setCurrentTab } = useApp();

  const artisanId = currentUser.artisanId || 'art-1';
  const profile = artisans.find((a) => a.id === artisanId) || artisans[0];

  const handleCall = () => {
    Linking.openURL('tel:9820011223');
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      {/* Header Profile Card */}
      <View style={styles.profileCard}>
        <Image
          source={{ uri: profile.photoUrl || currentUser.avatarUrl }}
          style={styles.avatar}
        />
        <View style={styles.codeTag}>
          <Text style={styles.codeTagText}>{profile.artisanCode}</Text>
        </View>

        <Text style={styles.nameText}>
          {language === 'hi' ? profile.hindiName : profile.name}
        </Text>

        <View style={styles.locRow}>
          <MapPin size={14} color={theme.colors.dustyPinkDark} />
          <Text style={styles.locText}>{profile.area}, {profile.city}</Text>
        </View>

        <View style={styles.ngoBadge}>
          <Sparkles size={13} color={theme.colors.sageGreenDark} />
          <Text style={styles.ngoBadgeText}>{profile.ngoPartner}</Text>
        </View>
      </View>

      {/* Verified Skills */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Award size={18} color={theme.colors.dustyPinkDark} />
          <Text style={styles.cardTitle}>{t.verifiedSkills}</Text>
        </View>
        <View style={styles.skillsRow}>
          {profile.skills.map((skill, idx) => (
            <View key={idx} style={styles.skillPill}>
              <Text style={styles.skillText}>• {skill}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Lifetime Stats */}
      <View style={[styles.card, styles.statsRow]}>
        <View style={styles.statCol}>
          <Text style={styles.statLabel}>{t.totalCrafted}</Text>
          <Text style={styles.statValue}>
            {profile.totalCompletedOrders} {language === 'hi' ? 'ऑर्डर' : 'batches'}
          </Text>
        </View>
        <View style={[styles.statCol, { borderLeftWidth: 1, borderLeftColor: theme.colors.lightBorder, paddingLeft: 16 }]}>
          <Text style={styles.statLabel}>{t.hoursContributed}</Text>
          <Text style={[styles.statValue, { color: theme.colors.sageGreenDark }]}>
            {profile.recordedHours} {language === 'hi' ? 'घंटे' : 'hrs'}
          </Text>
        </View>
      </View>

      {/* Coordinator Helpline */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <HeartHandshake size={18} color={theme.colors.dustyPinkDark} />
          <Text style={styles.cardTitle}>{t.coordinatorHelp}</Text>
        </View>
        <Text style={styles.helpText}>
          {language === 'hi'
            ? 'कच्ची सामग्री, सिलाई मशीन सहायता या स्वास्थ्य परामर्श हेतु अपने एनजीओ समन्वयक से संपर्क करें।'
            : 'For emergency supplies, sewing machine repairs, or health advice, call your supervisor.'}
        </Text>
        <TouchableOpacity activeOpacity={0.8} onPress={handleCall} style={styles.callBtn}>
          <Phone size={15} color={theme.colors.sageGreenDark} />
          <Text style={styles.callBtnText}>{t.callCoordinator} (98200 11223)</Text>
        </TouchableOpacity>
      </View>

      {/* Shortcut: Socio-Economic Impact Report */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setCurrentTab('impact')}
        style={styles.impactCard}
      >
        <View style={styles.impactIconBox}>
          <TrendingUp size={20} color={theme.colors.sageGreenDark} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.impactCardTitle}>
            {language === 'hi' ? 'सामाजिक प्रभाव विश्लेषण देखें' : 'View Impact Analytics & Reports'}
          </Text>
          <Text style={styles.impactCardSub}>
            {language === 'hi' ? 'पहले और बाद की आय व आजीविका के आंकड़े' : 'Before vs After income gains across all artisans'}
          </Text>
        </View>
        <ChevronRight size={18} color={theme.colors.mutedGrey} />
      </TouchableOpacity>

      {/* Language Toggle */}
      <View style={[styles.card, styles.langRow]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Globe size={18} color={theme.colors.dustyPinkDark} />
          <View>
            <Text style={styles.langTitle}>
              {language === 'hi' ? 'भाषा (Language)' : 'App Language'}
            </Text>
            <Text style={styles.langCurrent}>
              {language === 'hi' ? 'वर्तमान: हिंदी' : 'Current: English'}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
          style={styles.langSwitchBtn}
        >
          <Text style={styles.langSwitchText}>
            {language === 'hi' ? 'English' : 'हिंदी'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Logout / Switch */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setHasPassedWelcome(false)}
        style={styles.logoutBtn}
      >
        <LogOut size={16} color={theme.colors.danger} />
        <Text style={styles.logoutText}>{t.logoutBtn}</Text>
      </TouchableOpacity>
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
  profileCard: {
    backgroundColor: '#FFFCFA',
    padding: 20,
    borderRadius: theme.radius.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.lightBorder,
    alignItems: 'center'
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: theme.colors.dustyPink,
    marginBottom: 10
  },
  codeTag: {
    backgroundColor: theme.colors.warmCream,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
    marginBottom: 4
  },
  codeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  nameText: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    marginBottom: 2
  },
  locRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10
  },
  locText: {
    fontSize: 12,
    color: theme.colors.mutedGrey
  },
  ngoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.sageGreenLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.sageGreenBorder
  },
  ngoBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.sageGreenDark
  },
  card: {
    backgroundColor: theme.colors.white,
    padding: 16,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6
  },
  skillPill: {
    backgroundColor: theme.colors.warmCream,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  skillText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.deepBrown
  },
  statsRow: {
    flexDirection: 'row'
  },
  statCol: {
    flex: 1
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.mutedGrey
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.deepBrown,
    marginTop: 2
  },
  helpText: {
    fontSize: 12,
    color: theme.colors.mutedGrey,
    lineHeight: 16,
    marginBottom: 10
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.warmCream,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  callBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  impactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFCFA',
    padding: 16,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: theme.colors.sageGreenBorder,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.sageGreen
  },
  impactIconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.sageGreenLight,
    alignItems: 'center',
    justifyContent: 'center'
  },
  impactCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  impactCardSub: {
    fontSize: 10,
    color: theme.colors.mutedGrey,
    marginTop: 2
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  langTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  langCurrent: {
    fontSize: 11,
    color: theme.colors.mutedGrey
  },
  langSwitchBtn: {
    backgroundColor: theme.colors.warmCream,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  langSwitchText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.deepBrown
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.dangerLight,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.dangerBorder
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.danger
  }
});
