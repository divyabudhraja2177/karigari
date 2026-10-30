import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useApp } from '../context/AppContext';
import { theme } from '../theme';
import { Globe, Sparkles } from 'lucide-react-native';
import { BrandLogo } from './BrandLogo';

export const ArtisanHeader: React.FC = () => {
  const { currentUser, language, setLanguage, artisans } = useApp();
  const artisanProfile = artisans.find((a) => a.id === currentUser.artisanId) || artisans[0];

  return (
    <View style={styles.header}>
      {/* Left: Artisan Profile & Brand Logo */}
      <View style={styles.leftRow}>
        <BrandLogo
          size={36}
          style={styles.logoEmblem}
        />
        <Image
          source={{ uri: currentUser.avatarUrl || artisanProfile.photoUrl }}
          style={styles.avatar}
        />
        <View>
          <View style={styles.ngoBadge}>
            <Sparkles size={11} color={theme.colors.dustyPinkDark} />
            <Text style={styles.ngoText}>{artisanProfile.ngoPartner}</Text>
          </View>
          <Text style={styles.nameText}>
            {language === 'hi' ? currentUser.hindiName || currentUser.name : currentUser.name}
          </Text>
        </View>
      </View>

      {/* Right: Language Switcher Button */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
        style={styles.langBtn}
      >
        <Globe size={14} color={theme.colors.deepBrown} />
        <Text style={styles.langBtnText}>{language === 'hi' ? 'English' : 'हिंदी'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.lightBorder
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  logoEmblem: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: theme.colors.dustyPink,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: theme.colors.dustyPink
  },
  ngoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  ngoText: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.dustyPinkDark
  },
  nameText: {
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.deepBrown
  },
  langBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.warmCream,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.lightBorder
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.deepBrown
  }
});
