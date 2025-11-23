// src/screens/SettingsScreen.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/favourites/favouritesSlice';
import { logoutUser, updateUserName, updateUsername } from '../features/auth/authSlice';
import { Colors } from '../constants/colors';
import type { RootState, AppDispatch } from '../types';

export default function SettingsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const user = useSelector((state: RootState) => state.auth.user);
  const theme = Colors(isDark);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editField, setEditField] = useState<'name' | 'username'>('name');
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const confirmLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => dispatch(logoutUser()) },
      ]
    );
  };

  const getInitials = () => {
    if (user?.name) {
      const parts = user.name.split(' ');
      return parts.length > 1 
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : parts[0].substring(0, 2).toUpperCase();
    }
    return user?.email?.substring(0, 2).toUpperCase() || 'GU';
  };

  const getUserName = () => {
    return user?.username || user?.email?.split('@')[0] || 'Guest User';
  };

  const getFullName = () => {
    return user?.name || 'Not set';
  };

  const handleEditName = () => {
    setEditField('name');
    setNewName(user?.name || '');
    setShowEditModal(true);
  };

  const handleEditUsername = () => {
    setEditField('username');
    setNewUsername(user?.username || '');
    setShowEditModal(true);
  };

  const handleSave = () => {
    if (editField === 'name') {
      if (newName.trim().length < 2) {
        Alert.alert('Invalid Name', 'Name must be at least 2 characters long');
        return;
      }
      dispatch(updateUserName(newName.trim()));
      setShowEditModal(false);
      Alert.alert('Success', 'Full name updated successfully!');
    } else {
      if (newUsername.trim().length < 3) {
        Alert.alert('Invalid Username', 'Username must be at least 3 characters long');
        return;
      }
      dispatch(updateUsername(newUsername.trim()));
      setShowEditModal(false);
      Alert.alert('Success', 'Username updated successfully!');
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Card */}
      <View style={[styles.profileCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <View style={[styles.avatar, { backgroundColor: theme.accent }]}>
          <Text style={styles.avatarText}>{getInitials()}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={[styles.userName, { color: theme.text }]}>{getUserName()}</Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
            {user?.email || 'Not logged in'}
          </Text>
        </View>
      </View>

      {/* Account Info Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ACCOUNT INFO</Text>
        
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Full Name */}
          <View style={styles.settingRow}>
            <View style={[styles.iconWrap, { backgroundColor: theme.primary + '20' }]}>
              <Feather name="user" size={20} color={theme.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Full Name</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                {getFullName()}
              </Text>
            </View>
            <TouchableOpacity onPress={handleEditName}>
              <Feather name="edit-2" size={18} color={theme.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Username */}
          <View style={styles.settingRow}>
            <View style={[styles.iconWrap, { backgroundColor: theme.accent + '20' }]}>
              <Feather name="at-sign" size={20} color={theme.accent} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Username</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                {getUserName()}
              </Text>
            </View>
            <TouchableOpacity onPress={handleEditUsername}>
              <Feather name="edit-2" size={18} color={theme.accent} />
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Email (non-editable) */}
          <View style={styles.settingRow}>
            <View style={[styles.iconWrap, { backgroundColor: '#10b98120' }]}>
              <Feather name="mail" size={20} color="#10b981" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Email</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                {user?.email || 'Not set'}
              </Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Password */}
          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.iconWrap, { backgroundColor: '#ef444420' }]}>
              <Feather name="lock" size={20} color="#ef4444" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Password</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                ••••••••
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowEditModal(false)}>
          <View style={[styles.editModal, { backgroundColor: theme.surface }]}>
            <View style={[styles.editModalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.editModalTitle, { color: theme.text }]}>
                {editField === 'name' ? 'Edit Full Name' : 'Edit Username'}
              </Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Feather name="x" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.editModalContent}>
              <Text style={[styles.inputLabel, { color: theme.textSecondary }]}>
                {editField === 'name' ? 'Full Name' : 'Username'}
              </Text>
              <TextInput
                style={[
                  styles.nameInput,
                  {
                    backgroundColor: isDark ? theme.inputBg : theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                value={editField === 'name' ? newName : newUsername}
                onChangeText={editField === 'name' ? setNewName : setNewUsername}
                placeholder={editField === 'name' ? 'Enter your full name' : 'Enter your username'}
                placeholderTextColor={theme.textSecondary}
                autoFocus
                autoCapitalize={editField === 'username' ? 'none' : 'words'}
              />

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn, { backgroundColor: theme.border }]}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={[styles.cancelBtnText, { color: theme.text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.saveBtn, { backgroundColor: theme.primary }]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
      </Modal>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>PREFERENCES</Text>
        
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {/* Dark Mode */}
          <View style={styles.settingRow}>
            <View style={[styles.iconWrap, { backgroundColor: '#6366f120' }]}>
              <Feather name="moon" size={20} color="#6366f1" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                {isDark ? 'On' : 'Off'}
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={handleThemeToggle}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor="#fff"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Notifications */}
          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.iconWrap, { backgroundColor: '#f59e0b20' }]}>
              <Feather name="bell" size={20} color="#f59e0b" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Notifications</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>
                Match reminders & updates
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          {/* Language */}
          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.iconWrap, { backgroundColor: '#10b98120' }]}>
              <Feather name="globe" size={20} color="#10b981" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Language</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>English</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>SUPPORT</Text>
        
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.iconWrap, { backgroundColor: '#3b82f620' }]}>
              <Feather name="help-circle" size={20} color="#3b82f6" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Help Center</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>FAQs & Support</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.iconWrap, { backgroundColor: '#8b5cf620' }]}>
              <Feather name="message-circle" size={20} color="#8b5cf6" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Contact Us</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>Get in touch</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.iconWrap, { backgroundColor: '#ec489920' }]}>
              <Feather name="star" size={20} color="#ec4899" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Rate App</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>Love Sportify? Rate us!</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>ABOUT</Text>
        
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.iconWrap, { backgroundColor: '#64748b20' }]}>
              <Feather name="file-text" size={20} color="#64748b" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Terms of Service</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <TouchableOpacity style={styles.settingRow}>
            <View style={[styles.iconWrap, { backgroundColor: '#64748b20' }]}>
              <Feather name="shield" size={20} color="#64748b" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Privacy Policy</Text>
            </View>
            <Feather name="chevron-right" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.settingRow}>
            <View style={[styles.iconWrap, { backgroundColor: '#64748b20' }]}>
              <Feather name="info" size={20} color="#64748b" />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Version</Text>
              <Text style={[styles.settingDesc, { color: theme.textSecondary }]}>1.0.0</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={[styles.logoutBtn, { backgroundColor: '#ef444415', borderColor: '#ef4444' }]}
        onPress={confirmLogout}
      >
        <Feather name="log-out" size={20} color="#ef4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.textSecondary }]}>
          Made by 224149R for sports lovers
        </Text>
        <Text style={[styles.footerSubtext, { color: theme.textSecondary }]}>
          Sportiz © 2025
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 14,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 14,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 68,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  editModal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
  },
  editModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  editModalTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  editModalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {},
  saveBtn: {},
  cancelBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});