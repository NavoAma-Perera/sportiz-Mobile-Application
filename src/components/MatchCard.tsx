// src/components/MatchCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../types';
import { Colors } from '../constants/colors';
import type { Match } from '../types';

interface MatchCardProps {
  item: Match;
  onPress?: () => void;
  onToggleFav?: () => void;
  isFav: boolean;
}

const sportIcons: Record<string, string> = {
  Football: '⚽',
  Cricket: '🏏',
  Swimming: '🏊',
  Basketball: '🏀',
  Tennis: '🎾',
  Volleyball: '🏐',
  F1: '🏎️',
  Baseball: '⚾',
  Rugby: '🏉',
  Hockey: '🏒',
  Golf: '⛳',
  Boxing: '🥊',
};

export default function MatchCard({ item, onPress, onToggleFav, isFav }: MatchCardProps) {
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[
        styles.card, 
        { 
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : theme.cardBg,
          borderColor: theme.border 
        }
      ]}
    >
      {/* Competition & Favorite Row */}
      <View style={styles.topRow}>
        <Text style={[styles.competition, { color: theme.primary }]}>
          {item.league || 'International'}
        </Text>
        <TouchableOpacity onPress={onToggleFav}>
          <Feather
            name="heart"
            size={24}
            color={isFav ? '#ec4899' : theme.textSecondary}
            fill={isFav ? '#ec4899' : 'none'}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      {/* Team vs Team */}
      <Text style={[styles.matchTitle, { color: theme.text }]}>
        {item.teamA} vs {item.teamB}
      </Text>

      {/* Sport Category */}
      <View style={styles.categoryRow}>
        <Text style={[styles.categoryLabel, { color: theme.textSecondary }]}>Category</Text>
        <Text style={[styles.categoryValue, { color: theme.text }]}>
          {sportIcons[item.sport] || '🎯'} {item.sport}
        </Text>
      </View>

      {/* Status & Date */}
      <View style={styles.statusDateRow}>
        <View style={styles.statusSection}>
          <Text style={[styles.statusLabel, { color: theme.textSecondary }]}>Status</Text>
          <View 
            style={[
              styles.statusBadge, 
              { 
                backgroundColor: item.status === 'ongoing' 
                  ? '#10b98140' 
                  : item.status === 'upcoming' 
                  ? theme.primary + '30'
                  : theme.primary + '20'
              }
            ]}
          >
            <View 
              style={[
                styles.statusDot, 
                { 
                  backgroundColor: item.status === 'ongoing' 
                    ? '#10b981' 
                    : theme.primary 
                }
              ]} 
            />
            <Text 
              style={[
                styles.statusValue, 
                { 
                  color: item.status === 'ongoing' 
                    ? '#10b981' 
                    : theme.primary
                }
              ]}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.dateSection}>
          <Text style={[styles.dateLabel, { color: theme.textSecondary }]}>Date & Time</Text>
          <View style={styles.dateInfo}>
            <Feather name="calendar" size={16} color={theme.primary} />
            <Text style={[styles.dateValue, { color: theme.text }]}>
              {new Date(item.date).toLocaleDateString('en-GB', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  competition: { 
    fontSize: 13, 
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  matchTitle: { 
    fontSize: 18, 
    fontWeight: '800', 
    marginVertical: 10,
    lineHeight: 24,
  },
  categoryRow: {
    marginVertical: 10,
  },
  categoryLabel: { 
    fontSize: 11, 
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  categoryValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusDateRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  statusSection: {
    flex: 1,
  },
  dateSection: {
    flex: 1,
  },
  statusLabel: { 
    fontSize: 11, 
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  dateLabel: { 
    fontSize: 11, 
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: '600',
  },
});