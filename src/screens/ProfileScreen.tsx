import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../features/auth/authSlice';

import type { RootState, AppDispatch } from '../types';

export default function ProfileScreen() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user?.name || 'Guest'}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email || 'N/A'}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>User ID</Text>
        <Text style={styles.value}>{user?.id || 'N/A'}</Text>
      </View>
      {user?.email_verified !== undefined && (
        <View style={styles.infoBox}>
          <Text style={styles.label}>Email Verified</Text>
          <Text style={styles.value}>{user.email_verified ? 'Yes' : 'No'}</Text>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Button
          title="Logout"
          onPress={() => dispatch(logoutUser())}
          color="#FF6B6B"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#000',
    marginTop: 4,
  },
  buttonContainer: {
    marginTop: 30,
  },
});