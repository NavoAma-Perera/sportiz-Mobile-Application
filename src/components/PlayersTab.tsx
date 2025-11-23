// src/components/details/PlayersTab.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import type { Match } from '../types';
import { fetchTeamPlayers } from '../api/api';

interface PlayersTabProps {
  item: Match;
  theme: any;
}

export const PlayersTab: React.FC<PlayersTabProps> = ({ item, theme }) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlayers = async () => {
      setLoading(true);
      let allPlayers: any[] = [];

      // Fetch Team A players
      if (item.teamAId) {
        const teamAPlayers = await fetchTeamPlayers(item.teamAId);
        if (teamAPlayers && teamAPlayers.length > 0) {
          allPlayers.push(...teamAPlayers.slice(0, 5).map((p: any) => ({
            name: p.strPlayer,
            team: item.teamA,
            position: p.strPosition || 'Player',
            number: p.strNumber ? parseInt(p.strNumber) : null,
            // Use cutout for better quality, fallback to thumb
            image: p.strCutout || p.strThumb || null,
            age: p.intAge || null,
            nationality: p.strNationality || null,
          })));
        }
      }

      // Fetch Team B players
      if (item.teamBId) {
        const teamBPlayers = await fetchTeamPlayers(item.teamBId);
        if (teamBPlayers && teamBPlayers.length > 0) {
          allPlayers.push(...teamBPlayers.slice(0, 5).map((p: any) => ({
            name: p.strPlayer,
            team: item.teamB,
            position: p.strPosition || 'Player',
            number: p.strNumber ? parseInt(p.strNumber) : null,
            image: p.strCutout || p.strThumb || null,
            age: p.intAge || null,
            nationality: p.strNationality || null,
          })));
        }
      }

      setPlayers(allPlayers);
      setLoading(false);
    };
    loadPlayers();
  }, [item]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Loading players...
        </Text>
      </View>
    );
  }

  // Show message if no players found
  if (players.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
          No player information available for this match yet.
        </Text>
      </View>
    );
  }

  return (
    <View>
      {players.map((player, idx) => {
        const isTeamA = player.team === item.teamA;
        const cardBgColor = isTeamA ? theme.primary + '15' : theme.accent + '15';
        const accentColor = isTeamA ? theme.primary : theme.accent;

        return (
          <View
            key={`${player.name}-${idx}`}
            style={[
              styles.playerCard,
              { 
                backgroundColor: cardBgColor,
                borderLeftColor: accentColor,
                borderLeftWidth: 4,
              }
            ]}
          >
            {/* Player image with gradient background */}
            <View style={[styles.imageContainer, { backgroundColor: accentColor + '20' }]}>
              {player.image ? (
                <>
                  {/* Gradient background for cutout images */}
                  <View style={[styles.gradientBg, { backgroundColor: accentColor + '30' }]} />
                  <Image
                    source={{ uri: player.image }}
                    style={styles.playerImage}
                    resizeMode="contain"
                  />
                  {/* Jersey number badge */}
                  {player.number && (
                    <View style={[styles.numberBadge, { backgroundColor: accentColor }]}>
                      <Text style={styles.numberBadgeText}>{player.number}</Text>
                    </View>
                  )}
                </>
              ) : (
                // Fallback when no image
                <View style={[styles.playerNumberBox, { backgroundColor: accentColor }]}>
                  <Text style={styles.numberText}>
                    {player.number || '?'}
                  </Text>
                </View>
              )}
            </View>

            {/* Player info */}
            <View style={styles.playerInfo}>
              <Text style={[styles.playerName, { color: theme.text }]} numberOfLines={1}>
                {player.name}
              </Text>
              <Text style={[styles.playerPosition, { color: theme.textSecondary }]}>
                {player.position}
              </Text>
              <View style={styles.playerMeta}>
                {player.age && (
                  <View style={[styles.metaChip, { backgroundColor: theme.primary + '15' }]}>
                    <Text style={[styles.metaText, { color: theme.text }]}>
                      {player.age} yrs
                    </Text>
                  </View>
                )}
                {player.nationality && (
                  <View style={[styles.metaChip, { backgroundColor: theme.accent + '15' }]}>
                    <Text style={[styles.metaText, { color: theme.text }]} numberOfLines={1}>
                      {player.nationality}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Team badge */}
            <View style={styles.teamBadge}>
              <View style={[styles.teamChip, { backgroundColor: accentColor + '25' }]}>
                <Text style={[styles.teamChipText, { color: accentColor }]} numberOfLines={2}>
                  {player.team}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
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
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 10,
  },
  playerImage: {
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  playerNumberBox: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 2,
  },
  numberBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
  numberText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  playerInfo: {
    flex: 1,
    paddingRight: 8,
  },
  playerName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  playerPosition: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  playerMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  metaText: {
    fontSize: 10,
    fontWeight: '600',
  },
  teamBadge: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    maxWidth: 70,
  },
  teamChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  teamChipText: {
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
  },
});