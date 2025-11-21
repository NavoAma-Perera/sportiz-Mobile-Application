import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '../types';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      <View>
<Text style={styles.user}>
  {user ? user.name ?? user.email : 'Guest'}
</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: 'gray',
  },
  user: {
    fontWeight: '600',
  },
});