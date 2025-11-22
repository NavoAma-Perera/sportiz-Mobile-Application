// src/components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import type { RootState } from '../types';
import { Colors } from '../constants/colors';

interface HeaderProps {
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export default function Header({ 
  onNotificationPress,
  onProfilePress,
}: HeaderProps) {
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

  const getFirstName = (name?: string | null, email?: string) => {
    if (name) return name.split(' ')[0];
    return email?.split('@')[0] || 'Guest';
  };

  const initials = getInitials(user?.name, user?.email);
  const firstName = getFirstName(user?.name, user?.email);

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
          { paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 56 }
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
            <Text style={styles.userName}>{firstName}</Text>
          </View>

          {/* Right: Actions */}
          <View style={styles.rightSection}>
            {/* Notification Bell */}
            <TouchableOpacity 
              style={[styles.iconBtn, { backgroundColor: isDark ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.2)' }]}
              onPress={onNotificationPress}
              activeOpacity={0.7}
            >
              <Feather name="bell" size={22} color="#fff" />
              <View style={[styles.notifBadge, { borderColor: theme.primaryLight }]}>
                <Text style={styles.notifBadgeText}>3</Text>
              </View>
            </TouchableOpacity>

            {/* Avatar */}
            <TouchableOpacity 
              style={[styles.avatarBtn, { backgroundColor: isDark ? 'rgba(244,114,182,0.25)' : 'rgba(255,255,255,0.25)' }]}
              onPress={onProfilePress}
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
          <Text style={styles.brandTitle}>Sport</Text>
          <Text style={[styles.brandAccent, { color: theme.accent }]}>iz</Text>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 16,
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
    marginBottom: 16,
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
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  notifBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
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
    paddingHorizontal: 24,
    borderRadius: 16,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 1,
  },
  brandAccent: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
  },
});