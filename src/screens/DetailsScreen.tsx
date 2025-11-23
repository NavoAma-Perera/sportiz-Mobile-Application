import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFav } from '../features/favourites/favouritesSlice';
import type { RootState, AppDispatch, Match } from '../types';
import { Colors } from '../constants/colors';

import { HeroSection } from '../components/HeroSection';
import { FloatingActions } from '../components/FloatingActions';
import { TabNavigation,TabType } from '../components/TabNavigation';
import { OverviewTab } from '../components/OverviewTab';
import { TeamsTab } from '../components/TeamsTab';
import { PlayersTab } from '../components/PlayersTab';
import { StatsTab } from '../components/StatsTab';

export default function DetailsScreen({ route, navigation }: { route: any; navigation: any }) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!route?.params?.item) {
    navigation.goBack();
    return null;
  }

  const item: Match = route.params.item;
  
  const dispatch = useDispatch<AppDispatch>();
  const favs = useSelector((state: RootState) => state.favourites.items);
  const isFav = favs.some((f: Match) => f.id === item.id);
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);

  const onToggleFav = () => dispatch(toggleFav(item));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeroSection imageUri={item.image} />

        <FloatingActions
          match={item}
          isFavorite={isFav}
          onToggleFavorite={onToggleFav}
          primaryColor={theme.primary}
        />

        <BlurView intensity={isDark ? 40 : 20} style={styles.blurContainer}>
          <View style={[styles.contentCard, isDark ? styles.glassCardDark : styles.glassCardLight]}>
            <Text style={[styles.competitionLabel, { color: theme.primary }]}>
              {item.league || 'International Match'}
            </Text>

            <View style={styles.teamsSection}>
              <Text style={[styles.teamName, { color: theme.text }]}>{item.teamA}</Text>
              <View style={[styles.vsContainer, { backgroundColor: theme.primary + '25' }]}>
                <Text style={[styles.vsText, { color: theme.primary }]}>VS</Text>
              </View>
              <Text style={[styles.teamName, { color: theme.text }]}>{item.teamB}</Text>
            </View>

            <TabNavigation
              activeTab={activeTab}
              onTabChange={setActiveTab}
              primaryColor={theme.primary}
              textSecondaryColor={theme.textSecondary}
            />

            <View style={styles.tabContent}>
              {activeTab === 'overview' && <OverviewTab item={item} theme={theme} isDark={isDark} />}
              {activeTab === 'teams' && <TeamsTab item={item} theme={theme} />}
              {activeTab === 'players' && <PlayersTab item={item} theme={theme} />}
              {activeTab === 'stats' && <StatsTab item={item} theme={theme} />}
            </View>
          </View>
        </BlurView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blurContainer: {
    marginHorizontal: 16,
    marginTop: -60,
    marginBottom: 40,
    borderRadius: 24,
    overflow: 'hidden',
  },
  contentCard: {
    padding: 24,
  },
  glassCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  glassCardDark: {
    backgroundColor: 'rgba(30, 41, 59, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },
  competitionLabel: {
    fontSize: 14,
    fontWeight: '700',
    alignSelf: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  teamsSection: {
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  teamName: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  vsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  vsText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 2,
  },
  tabContent: {
    marginTop: 12,
  },
});