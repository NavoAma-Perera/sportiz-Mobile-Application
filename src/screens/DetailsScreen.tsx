// src/screens/DetailsScreen.tsx
import React from 'react';
import {
  ScrollView,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFav } from '../features/favourites/favouritesSlice';
import type { RootState, AppDispatch, Match } from '../types';
import { Colors } from '../constants/colors';

const sportIcons: Record<string, string> = {
  Football: '⚽',
  Cricket: '🏏',
  Swimming: '🏊',
  Basketball: '🏀',
  Tennis: '🎾',
  F1: '🏎️',
};

export default function DetailsScreen({ route, navigation }: { route: any; navigation: any }) {
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

  const onShare = async () => {
    try {
      await Share.share({
        message: `${item.teamA} vs ${item.teamB} - ${new Date(item.date).toLocaleString()} on Sportiz!`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share match');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {isDark ? (
        <LinearGradient colors={['#6366f1', '#8b5cf6', '#ec4899']} style={{ flex: 1 }}>
          <ScrollView>
            <DetailContent item={item} isFav={isFav} theme={theme} onToggleFav={onToggleFav} onShare={onShare} />
          </ScrollView>
        </LinearGradient>
      ) : (
        <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
          <DetailContent item={item} isFav={isFav} theme={theme} onToggleFav={onToggleFav} onShare={onShare} />
        </ScrollView>
      )}
    </View>
  );
}

function DetailContent({ item, isFav, theme, onToggleFav, onShare }: any) {
  return (
    <>
      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <ImageBackground source={{ uri: item.image }} style={styles.hero} resizeMode="cover">
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.heroGradient}>
            <View style={styles.heroContent}>
              <View style={[styles.sportBadge, { backgroundColor: theme.primary }]}>
                <Text style={styles.sportBadgeText}>
                  {sportIcons[item.sport] || '🎯'} {item.sport}
                </Text>
              </View>
              <Text style={styles.heroLeague}>{item.league || 'International Match'}</Text>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Floating Icons — POSITIONED LOWER & BETTER VISIBILITY */}
      <View style={styles.floatingIcons}>
        <TouchableOpacity style={[styles.iconButton, styles.heartButton]} onPress={onToggleFav}>
          <Feather
            name={isFav ? 'heart' : 'heart'}
            size={28}
            color={isFav ? '#ec4899' : '#818cf8'}
            fill={isFav ? '#ec4899' : 'none'}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconButton, styles.shareButton]} onPress={onShare}>
          <Feather name="share-2" size={28} color="#6366f1" />
        </TouchableOpacity>
      </View>

      {/* Main Content Card */}
      <View style={styles.contentCard}>
        {/* Teams */}
        <View style={styles.titleSection}>
          <Text style={[styles.title, { color: theme.text }]}>{item.teamA}</Text>
          <View style={[styles.vsContainer, { backgroundColor: theme.surface }]}>
            <Text style={[styles.vsText, { color: theme.primary }]}>VS</Text>
          </View>
          <Text style={[styles.title, { color: theme.text }]}>{item.teamB}</Text>
        </View>

        {/* Status */}
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.status === 'ongoing' ? '#10b981' : theme.primary },
            ]}
          >
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        {/* Date & Time Card */}
        <View style={[styles.infoGrid, { backgroundColor: theme.surface }]}>
          <View style={styles.infoCard}>
            <View style={[styles.iconCircle, { backgroundColor: theme.primary + '20' }]}>
              <Feather name="calendar" size={24} color={theme.primary} />
            </View>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Date</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {new Date(item.date).toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.infoCard}>
            <View style={[styles.iconCircle, { backgroundColor: theme.accent + '20' }]}>
              <Feather name="clock" size={24} color={theme.accent} />
            </View>
            <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Time</Text>
            <Text style={[styles.infoValue, { color: theme.text }]}>
              {new Date(item.date).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        </View>

        {/* REDUCED GAP — only 16 instead of 40 */}
        <View style={{ height: 16 }} />

        {/* Match Information */}
        <View style={[styles.additionalInfo, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Match Information</Text>
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={18} color={theme.textSecondary} />
            <Text style={[styles.infoRowText, { color: theme.textSecondary }]}>Venue: TBA</Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="award" size={18} color={theme.textSecondary} />
            <Text style={[styles.infoRowText, { color: theme.textSecondary }]}>
              Competition: {item.league || 'International'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Feather name="activity" size={18} color={theme.textSecondary} />
            <Text style={[styles.infoRowText, { color: theme.textSecondary }]}>Sport: {item.sport}</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  heroContainer: { height: 280 },
  hero: { flex: 1 },
  heroGradient: { flex: 1, justifyContent: 'flex-end' },
  heroContent: { padding: 24 },
  sportBadge: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginBottom: 12 },
  sportBadgeText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  heroLeague: { fontSize: 22, fontWeight: '800', color: '#fff' },

  // Floating Icons — POSITIONED LOWER TO AVOID CARD OVERLAP
  floatingIcons: {
    position: 'absolute',
    top: 310, // Moved down from 260
    right: 28,
    gap: 14,
    zIndex: 10,
  },
  iconButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 15,
  },
  heartButton: {
    // Pink background for heart icon
  },
  shareButton: {
    // White background for share icon (already default)
  },

  contentCard: { marginTop: -30, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingTop: 32, paddingHorizontal: 20, paddingBottom: 40 },
  titleSection: { alignItems: 'center', marginBottom: 18 },
  title: { fontSize: 24, fontWeight: '800', textAlign: 'center' },
  vsContainer: { marginVertical: 16, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  vsText: { fontSize: 16, fontWeight: '800', letterSpacing: 2 },
  statusContainer: { alignItems: 'center', marginBottom: 24},
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 30, gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  statusText: { color: '#fff', fontWeight: '700', fontSize: 14, letterSpacing: 1 },
  infoGrid: { flexDirection: 'row', borderRadius: 20, padding: 20, marginBottom: 24 },
  infoCard: { flex: 1, alignItems: 'center', gap: 8 },
  iconCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  infoLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  infoValue: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
  divider: { width: 1, marginHorizontal: 16 },
  additionalInfo: { borderRadius: 20, padding: 20, gap: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 8 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  infoRowText: { fontSize: 14, fontWeight: '500' },
});