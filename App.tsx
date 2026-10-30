import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { theme } from './src/theme';
import { WelcomeScreen } from './src/components/WelcomeScreen';
import { ArtisanHeader } from './src/components/ArtisanHeader';
import { ArtisanNav } from './src/components/ArtisanNav';
import { ArtisanHome } from './src/components/ArtisanHome';
import { ArtisanOrders } from './src/components/ArtisanOrders';
import { ArtisanEarnings } from './src/components/ArtisanEarnings';
import { ArtisanHours } from './src/components/ArtisanHours';
import { ArtisanMaterials } from './src/components/ArtisanMaterials';
import { ArtisanSurveys } from './src/components/ArtisanSurveys';
import { ArtisanProfile } from './src/components/ArtisanProfile';
import { MobileImpactAnalytics } from './src/components/MobileImpactAnalytics';

const MainScreen: React.FC = () => {
  const { hasPassedWelcome, currentTab, toast } = useApp();

  if (!hasPassedWelcome) {
    return <WelcomeScreen />;
  }

  const renderActiveScreen = () => {
    switch (currentTab) {
      case 'home':
        return <ArtisanHome />;
      case 'orders':
        return <ArtisanOrders />;
      case 'earnings':
        return <ArtisanEarnings />;
      case 'hours':
        return <ArtisanHours />;
      case 'materials':
        return <ArtisanMaterials />;
      case 'surveys':
        return <ArtisanSurveys />;
      case 'profile':
        return <ArtisanProfile />;
      case 'impact':
        return <MobileImpactAnalytics />;
      default:
        return <ArtisanHome />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <ArtisanHeader />

        <View style={styles.screenContainer}>
          {renderActiveScreen()}
        </View>

        <ArtisanNav />

        {/* Global Floating Toast */}
        {toast && (
          <View
            style={[
              styles.toastContainer,
              toast.type === 'error'
                ? styles.toastError
                : toast.type === 'info'
                ? styles.toastInfo
                : styles.toastSuccess
            ]}
          >
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainScreen />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.warmCream,
    paddingTop: Platform.OS === 'android' ? (RNStatusBar.currentHeight || 0) : 0,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.warmCream,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: theme.colors.warmCream,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 95,
    left: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    alignItems: 'center',
    zIndex: 9999,
  },
  toastSuccess: {
    backgroundColor: theme.colors.sageGreenDark,
  },
  toastError: {
    backgroundColor: '#DC2626',
  },
  toastInfo: {
    backgroundColor: theme.colors.deepBrown,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
