// src/components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import type { RootState } from '../types';
import { Colors } from '../constants/colors';

interface HeaderProps {
  navigation?: any;
}

export default function Header({ navigation }: HeaderProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      const parts = name.split(' ');
      return parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
    }
    return email?.substring(0, 2).toUpperCase() || 'GU';
  };

  const getDisplayName = (user?: any) => {
    // Use username for greeting, fallback to email-derived name
    return user?.username || user?.email?.split('@')[0] || 'Guest';
  };

  const initials = getInitials(user?.name, user?.email);
  const displayName = getDisplayName(user);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Theme-aware colors (typed as tuples for LinearGradient)
  const gradientColors: readonly [string, string, string] = isDark
    ? [theme.background, theme.surface, theme.primary]
    : [theme.primary, theme.primaryLight, '#a5b4fc'];

  const accentGradient: readonly [string, string] = isDark
    ? [theme.accent, '#ec4899']
    : ['#f472b6', theme.accent];

  const handleAvatarPress = () => {
    if (navigation) {
      navigation.navigate('Settings');
    }
  };

  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="light-content"
      />
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.container,
          { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 24 : 72 }
        ]}
      >
        {/* Decorative elements */}
        <View style={[styles.decorCircle1, { backgroundColor: isDark ? 'rgba(167,139,250,0.1)' : 'rgba(255,255,255,0.12)' }]} />
        <View style={[styles.decorCircle2, { backgroundColor: isDark ? 'rgba(244,114,182,0.08)' : 'rgba(255,255,255,0.08)' }]} />

        <View style={styles.content}>
          {/* Left: Greeting & Title */}
          <View style={styles.leftSection}>
            <View style={styles.greetingRow}>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.wave}> 👋</Text>
            </View>
            <Text style={styles.userName}>{displayName}</Text>
          </View>

          {/* Right: Avatar */}
          <View style={styles.rightSection}>
            <TouchableOpacity
              style={[styles.avatarBtn, { backgroundColor: isDark ? 'rgba(244,114,182,0.25)' : 'rgba(255,255,255,0.25)' }]}
              onPress={handleAvatarPress}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={accentGradient}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{initials}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* App branding */}
        <View style={[styles.brandBar, { backgroundColor: isDark ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.15)' }]}>
          <LinearGradient 
            colors={['#8b5cf6', '#ec4899']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            style={styles.iconGradientBg}
          >
            <Feather name="activity" size={28} color="#fff" />
          </LinearGradient>
          <View style={styles.brandTextContainer}>
            <Text style={styles.brandTitle}>Sport</Text>
            <Text style={[styles.brandAccent, { color: '#8b5cf6' }]}>i</Text>
            <Text style={[styles.brandAccent, { color: '#ec4899' }]}>z</Text>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  decorCircle2: {
    position: 'absolute',
    bottom: -20,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  leftSection: {
    flex: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  wave: {
    fontSize: 14,
  },
  userName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBtn: {
    borderRadius: 16,
    padding: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  brandBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    gap: 12,
  },
  iconGradientBg: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  brandAccent: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
});