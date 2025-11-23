import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Match } from '../types';
import { fetchEventStats } from '../api/api';

const getStatDescription = (statType: string): string => {
  const descriptions: Record<string, string> = {
    'Possession %': 'Percentage of time ball is with the team',
    'Shots': 'Total shots attempted on goal',
    'Shots on Target': 'Shots that were aimed at the goal',
    'Pass Accuracy %': 'Percentage of successful passes',
    'Fouls': 'Total fouls committed',
    'Yellow Cards': 'Cautions given to players',
    'Red Cards': 'Players sent off',
    'Corner Kicks': 'Defensive corner opportunities',
    'Passes': 'Total number of passes made',
    'Tackles': 'Successful defensive tackles',
  };
  return descriptions[statType] || 'Match statistic';
};

interface StatsTabProps {
  item: Match;
  theme: any;
}

export const StatsTab: React.FC<StatsTabProps> = ({ item, theme }) => {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const eventStats = await fetchEventStats(item.id);

      if (eventStats && eventStats.length > 0) {
        const statsMap: Record<string, any> = {};
        
        eventStats.forEach((stat: any) => {
          const type = stat.strStatistic;
          if (!statsMap[type]) {
            statsMap[type] = { label: type, teamA: 0, teamB: 0, description: getStatDescription(type) };
          }
          
          if (stat.strTeam === item.teamA) {
            statsMap[type].teamA = parseInt(stat.intStat) || 0;
          } else {
            statsMap[type].teamB = parseInt(stat.intStat) || 0;
          }
        });

        setStats(Object.values(statsMap).slice(0, 6));
      } else {
        setStats([
          { label: 'Possession %', teamA: 55, teamB: 45, description: 'Percentage of time ball is with the team' },
          { label: 'Shots', teamA: 12, teamB: 8, description: 'Total shots attempted' },
          { label: 'Shots on Target', teamA: 6, teamB: 4, description: 'Shots that hit the target' },
          { label: 'Pass Accuracy %', teamA: 68, teamB: 72, description: 'Percentage of accurate passes' },
          { label: 'Fouls', teamA: 14, teamB: 11, description: 'Total fouls committed' },
          { label: 'Yellow Cards', teamA: 2, teamB: 1, description: 'Cautions given' },
        ]);
      }
      setLoading(false);
    };
    loadStats();
  }, [item]);

  if (loading) {
    return <Text style={{ color: theme.text, textAlign: 'center', padding: 20 }}>Loading stats...</Text>;
  }

  return (
    <View>
      {stats.map((stat, idx) => (
        <View key={idx} style={styles.statRowContainer}>
          <View style={styles.statRowHeader}>
            <Text style={[styles.statRowLabel, { color: theme.text }]}>{stat.label}</Text>
            <Text style={[styles.statRowValues, { color: theme.textSecondary }]}>
              {stat.teamA} : {stat.teamB}
            </Text>
          </View>
          {stat.description && (
            <Text style={[styles.statDescription, { color: theme.textSecondary }]}>{stat.description}</Text>
          )}
          <View style={styles.statBars}>
            <View 
              style={[
                { 
                  flex: stat.teamA, 
                  backgroundColor: theme.primary, 
                  borderTopLeftRadius: 4, 
                  borderBottomLeftRadius: 4 
                }
              ]} 
            />
            <View 
              style={[
                { 
                  flex: stat.teamB, 
                  backgroundColor: theme.accent, 
                  borderTopRightRadius: 4, 
                  borderBottomRightRadius: 4 
                }
              ]} 
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  statRowContainer: {
    marginBottom: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  statRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  statRowLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  statRowValues: {
    fontSize: 12,
    fontWeight: '600',
  },
  statDescription: {
    fontSize: 11,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  statBars: {
    flex: 1,
    height: 8,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});