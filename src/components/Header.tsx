// src/components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../types';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  const getFirstName = (name?: string | null, email?: string) => {
    if (name) return name.split(' ')[0];
    return email?.split('@')[0] || 'Guest';
  };

  const firstName = getFirstName(user?.name, user?.email);

  return (
    <View style={styles.container}>
      {/* This makes header go behind status bar + full width */}
      <StatusBar 
        backgroundColor="#8b5cf6" 
        barStyle="light-content" 
        translucent={true} 
      />

      <View style={styles.content}>
        <View style={styles.leftContent}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        <View style={styles.userBadge}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{firstName}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#8b5cf6',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 30 : 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    width: '100%',           // Full width
    alignSelf: 'stretch',    // Ensures it takes full width
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: { flex: 1 },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
    marginTop: 4,
  },
  userBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});