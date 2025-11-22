// src/components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import type { RootState } from '../types';
import { Colors } from '../constants/colors';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);

  const getFirstName = (name?: string | null, email?: string) => {
    if (name) return name.split(' ')[0];
    return email?.split('@')[0] || 'Guest';
  };

  const firstName = getFirstName(user?.name, user?.email);

  return (
    <>
      <StatusBar 
        backgroundColor={isDark ? '#6366f1' : theme.primary}
        barStyle="light-content"
      />
      <LinearGradient
        colors={isDark ? ['#6366f1', '#8b5cf6'] : [theme.primary, '#6366f1']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.container, { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 30 : 50 }]}
      >
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>

          <View style={styles.greetingSection}>
            <Text style={styles.greetingText}>Hey,</Text>
            <Text style={styles.userName}>{firstName}</Text>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    width: '100%',
    alignSelf: 'stretch',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContent: { 
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
    marginTop: 4,
  },
  greetingSection: {
    alignItems: 'flex-end',
  },
  greetingText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
});