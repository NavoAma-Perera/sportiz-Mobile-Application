// src/screens/SettingsScreen.tsx
import React from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  View,
  Button,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/favourites/favouritesSlice';
import { logoutUser } from '../features/auth/authSlice';
import type { RootState, AppDispatch } from '../types';

export default function SettingsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <ScrollView style={[styles.container, isDark && styles.containerDark]}>
      <Text style={[styles.title, isDark && styles.textDark]}>Settings</Text>

      {/* Dark Mode */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Appearance</Text>
        <View style={[styles.settingItem, isDark && styles.itemDark]}>
          <View>
            <Text style={[styles.settingLabel, isDark && styles.textDark]}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              {isDark ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleThemeToggle}
            trackColor={{ false: '#767577', true: '#81c784' }}
            thumbColor={isDark ? '#4caf50' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>Account</Text>
        
        <View style={[styles.infoBox, isDark && styles.itemDark]}>
          <Feather name="user" size={18} color="#007AFF" style={styles.icon} />
          <View style={styles.infoRow}>
            <Text style={[styles.label, isDark && styles.textDark]}>Name</Text>
           // Line ~62 — change this line only:
<Text style={[styles.value, isDark && styles.textDark]}>
  {user?.name || user?.email?.split('@')[0] || 'Guest User'}
</Text>
          </View>
        </View>

        <View style={[styles.infoBox, isDark && styles.itemDark]}>
          <Feather name="mail" size={18} color="#007AFF" style={styles.icon} />
          <View style={styles.infoRow}>
            <Text style={[styles.label, isDark && styles.textDark]}>Email</Text>
            <Text style={[styles.value, isDark && styles.textDark]}>
              {user?.email || 'Not logged in'}
            </Text>
          </View>
        </View>

        <Button title="Logout" onPress={handleLogout} color="#FF3B30" />
      </View>

      {/* App Info */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, isDark && styles.textDark]}>About Sportiz</Text>
        <View style={[styles.infoBox, isDark && styles.itemDark]}>
          <Text style={[styles.infoTitle, isDark && styles.textDark]}>App Information</Text>
          <Text style={[styles.infoText, isDark && styles.textDark]}>Version: 1.0.0</Text>
          <Text style={[styles.infoText, isDark && styles.textDark]}>Built with: Expo + React Native</Text>
          <Text style={[styles.infoText, isDark && styles.textDark]}>Data from: TheSportsDB API</Text>
          <Text style={[styles.infoText, isDark && styles.textDark, { marginTop: 8 }]}>
            Made with ❤️ for sports lovers
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 24,
    color: '#222',
  },
  textDark: {
    color: '#fff',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  itemDark: {
    backgroundColor: '#1e1e1e',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  settingDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  infoRow: {
    flex: 1,
    marginLeft: 12,
  },
  icon: {
    position: 'absolute',
    left: 16,
    top: 18,
  },
  label: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
    fontWeight: '500',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});