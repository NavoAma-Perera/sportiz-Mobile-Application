// src/components/details/TeamsTab.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { Match } from '../types';
import { fetchTeamDetails } from '../api/api';

interface TeamsTabProps {
  item: Match;
  theme: any;
}

export const TeamsTab: React.FC<TeamsTabProps> = ({ item, theme }) => {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      setLoading(true);
      const teamsData = [];

      // Fetch Team A details
      if (item.teamAId) {
        const teamA = await fetchTeamDetails(item.teamAId);
        if (teamA) {
          teamsData.push({
            name: item.teamA,
            wins: teamA.intWin || null,
            losses: teamA.intLoss || null,
            draws: teamA.intDraws || null,
            description: teamA.strDescriptionEN || teamA.strDescription || null,
            formed: teamA.intFormedYear || null,
            stadium: teamA.strStadium || null,
            league: teamA.strLeague || null,
          });
        }
      }

      // Fetch Team B details
      if (item.teamBId) {
        const teamB = await fetchTeamDetails(item.teamBId);
        if (teamB) {
          teamsData.push({
            name: item.teamB,
            wins: teamB.intWin || null,
            losses: teamB.intLoss || null,
            draws: teamB.intDraws || null,
            description: teamB.strDescriptionEN || teamB.strDescription || null,
            formed: teamB.intFormedYear || null,
            stadium: teamB.strStadium || null,
            league: teamB.strLeague || null,
          });
        }
      }

      // If no data fetched, add basic team info
      if (teamsData.length === 0) {
        teamsData.push(
          { name: item.teamA, wins: null, losses: null, draws: null },
          { name: item.teamB, wins: null, losses: null, draws: null }
        );
      }

      setTeams(teamsData);
      setLoading(false);
    };
    loadTeams();
  }, [item]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Loading team information...
        </Text>
      </View>
    );
  }

  return (
    <View>
      {teams.map((team, idx) => (
        <View key={idx}>
          <View style={[styles.teamCard, { backgroundColor: theme.primary + '15' }]}>
            <Text style={[styles.teamCardTitle, { color: theme.text }]}>
              {team.name}
            </Text>

            {/* Team Description */}
            {team.description && (
              <Text style={[styles.teamDescription, { color: theme.textSecondary }]} numberOfLines={3}>
                {team.description}
              </Text>
            )}

            {/* Team Stats - Only show if we have data */}
            {(team.wins !== null || team.losses !== null || team.draws !== null) && (
              <View style={styles.teamStatsRow}>
                {team.wins !== null && (
                  <View style={styles.teamStat}>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Wins</Text>
                    <Text style={[styles.statValue, { color: theme.primary }]}>{team.wins}</Text>
                  </View>
                )}
                {team.losses !== null && (
                  <View style={styles.teamStat}>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Losses</Text>
                    <Text style={[styles.statValue, { color: '#ef4444' }]}>{team.losses}</Text>
                  </View>
                )}
                {team.draws !== null && (
                  <View style={styles.teamStat}>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Draws</Text>
                    <Text style={[styles.statValue, { color: '#f59e0b' }]}>{team.draws}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Additional Info */}
            <View style={styles.additionalInfo}>
              {team.stadium && (
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Stadium:</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{team.stadium}</Text>
                </View>
              )}
              {team.formed && (
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Founded:</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{team.formed}</Text>
                </View>
              )}
              {team.league && (
                <View style={styles.infoItem}>
                  <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>League:</Text>
                  <Text style={[styles.infoValue, { color: theme.text }]}>{team.league}</Text>
                </View>
              )}
            </View>

            {/* Show message if no data available */}
            {!team.wins && !team.losses && !team.draws && !team.description && !team.stadium && (
              <Text style={[styles.noDataText, { color: theme.textSecondary }]}>
                Detailed statistics not available
              </Text>
            )}
          </View>
          {idx === 0 && <View style={{ height: 12 }} />}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
  teamCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  teamCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  teamDescription: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  teamStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  teamStat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  additionalInfo: {
    marginTop: 12,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  noDataText: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});