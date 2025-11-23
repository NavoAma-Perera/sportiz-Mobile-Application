import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Match } from '../types';
import { fetchLeagueDetails,fetchEventDetails } from '../api/api';

interface OverviewTabProps {
  item: Match;
  theme: any;
  isDark: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ item, theme, isDark }) => {
  const [leagueInfo, setLeagueInfo] = useState<any>(null);
  const [eventDetails, setEventDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch venue info
        const eventData = await fetchEventDetails(item.id);
        setEventDetails(eventData);

        // Fetch league details 
        if (item.leagueId) {
          const league = await fetchLeagueDetails(item.leagueId);
          setLeagueInfo(league);
        }
      } catch (err) {
        console.log('Error loading data:', err);
      }
      setLoading(false);
    };
    
    loadData();
  }, [item.id, item.leagueId]);

  // Get venue from event details
  const venue = eventDetails?.strVenue || eventDetails?.strStadium || null;

  return (
    <View>
      

      {/* Category & Venue */}
      <View style={styles.categoryVenueRow}>
        {/* Category */}
        <View style={[styles.infoBox, { flex: venue ? 1 : 1 }]}>
          <View style={styles.infoBoxHeader}>
            <Feather name="tag" size={16} color={theme.primary} />
            <Text style={[styles.infoBoxLabel, { color: theme.textSecondary }]}>Category</Text>
          </View>
          <Text style={[styles.infoBoxValue, { color: theme.text }]} numberOfLines={1}>
            {item.sport}
          </Text>
        </View>

        {/* Venue */}
        {venue && (
          <>
            <View style={[styles.verticalDivider, { backgroundColor: theme.border }]} />
            <View style={[styles.infoBox, { flex: 1 }]}>
              <View style={styles.infoBoxHeader}>
                <Feather name="map-pin" size={16} color={theme.accent} />
                <Text style={[styles.infoBoxLabel, { color: theme.textSecondary }]}>Venue</Text>
              </View>
              <Text style={[styles.infoBoxValue, { color: theme.text }]} numberOfLines={2}>
                {venue}
              </Text>
            </View>
          </>
        )}
      </View>
 {/* Date & Time Row */}
      <View style={styles.dateTimeRow}>
        <View style={styles.dateSection}>
          <View style={[styles.iconCircle, { backgroundColor: theme.primary + '25' }]}>
            <Feather name="calendar" size={20} color={theme.primary} />
          </View>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Date</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {new Date(item.date).toLocaleDateString('en-GB', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </Text>
        </View>

        <View style={styles.timeSection}>
          <View style={[styles.iconCircle, { backgroundColor: theme.accent + '25' }]}>
            <Feather name="clock" size={20} color={theme.accent} />
          </View>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Time</Text>
          <Text style={[styles.value, { color: theme.text }]}>
            {new Date(item.date).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>

        <View style={styles.statusSection}>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'ongoing' ? '#10b98125' : theme.primary + '25' }]}>
            <View 
              style={[
                styles.statusDot, 
                { backgroundColor: item.status === 'ongoing' ? '#10b981' : theme.primary }
              ]} 
            />
          </View>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Status</Text>
          <Text style={[styles.statusValue, { color: item.status === 'ongoing' ? '#10b981' : theme.primary }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.border }]} />
{leagueInfo && (
        <View style={[styles.competitionCard, { backgroundColor: theme.primary + '15' }]}>
          <Text style={[styles.competitionTitle, { color: theme.primary }]}>About {item.league}</Text>
          <Text style={[styles.competitionDesc, { color: theme.text }]}>
            {leagueInfo.strDescriptionEN || leagueInfo.strDescription || 'Professional sports league'}
          </Text>
          <View style={styles.leagueInfoRow}>
            <View style={styles.leagueInfoItem}>
              <Text style={[styles.leagueLabel, { color: theme.textSecondary }]}>Country</Text>
              <Text style={[styles.leagueValue, { color: theme.text }]}>{leagueInfo.strCountry || 'N/A'}</Text>
            </View>
            <View style={styles.leagueInfoItem}>
              <Text style={[styles.leagueLabel, { color: theme.textSecondary }]}>Founded</Text>
              <Text style={[styles.leagueValue, { color: theme.text }]}>{leagueInfo.intFormedYear || 'N/A'}</Text>
            </View>
          </View>
        </View>
      )}
     
    </View>
  );
};

const styles = StyleSheet.create({
  competitionCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  competitionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  competitionDesc: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  leagueInfoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  leagueInfoItem: {
    flex: 1,
  },
  leagueLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  leagueValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  // New styles for category and venue row
  categoryVenueRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  infoBox: {
    backgroundColor: 'rgba(0,0,0,0.03)',
    padding: 12,
    borderRadius: 10,
  },
  infoBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  infoBoxLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoBoxValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  verticalDivider: {
    width: 1,
    marginVertical: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: { 
    height: 1, 
    marginVertical: 16 
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateSection: { 
    flex: 1, 
    alignItems: 'center' 
  },
  timeSection: { 
    flex: 1, 
    alignItems: 'center' 
  },
  statusSection: { 
    flex: 1, 
    alignItems: 'center' 
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: { 
    width: 8, 
    height: 8, 
    borderRadius: 4 
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '700',
  },
});