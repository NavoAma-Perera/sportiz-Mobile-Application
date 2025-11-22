// src/screens/DetailsScreen.tsx
import React, { useLayoutEffect } from 'react';
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
import * as Calendar from 'expo-calendar';
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

  const onAddToCalendar = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const defaultCalendar = calendars.find((cal) => cal.isPrimary) || calendars[0];

        if (!defaultCalendar) {
          Alert.alert('Error', 'No calendar found');
          return;
        }

        const startDate = new Date(item.date);
        const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

        await Calendar.createEventAsync(defaultCalendar.id, {
          title: `${item.teamA} vs ${item.teamB}`,
          startDate,
          endDate,
          notes: `${item.sport} - ${item.league || 'International'}`,
          location: 'TBA',
        });

        Alert.alert('Success', 'Match added to your calendar!');
      } else {
        Alert.alert('Permission Required', 'Please grant calendar access to add events');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not add event to calendar');
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Match Details',
      headerShown: true,
      headerStyle: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
      },
      headerTitleStyle: {
        color: isDark ? '#ffffff' : '#000000',
        fontSize: 18,
        fontWeight: '700',
      },
      headerTintColor: isDark ? '#ffffff' : '#000000',
      headerBackTitleVisible: false,
    });
  }, [navigation, isDark]);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0f172a' : theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <DetailContent 
          item={item} 
          isFav={isFav} 
          theme={theme} 
          onToggleFav={onToggleFav} 
          onShare={onShare}
          onAddToCalendar={onAddToCalendar}
          isDark={isDark}
        />
      </ScrollView>
    </View>
  );
}

function DetailContent({ item, isFav, theme, onToggleFav, onShare, onAddToCalendar, isDark }: any) {
  return (
    <>
      {/* Hero Image */}
      <View style={styles.heroContainer}>
        <ImageBackground source={{ uri: item.image }} style={styles.hero} resizeMode="cover">
          <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.heroGradient}>
            <View style={styles.heroContent}>
             
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Floating Icons */}
      <View style={styles.floatingIcons}>
        <TouchableOpacity style={[styles.iconButton]} onPress={onToggleFav}>
          <Feather
            name="heart"
            size={28}
            color={isFav ? '#ec4899' : '#818cf8'}
            fill={isFav ? '#ec4899' : 'none'}
            strokeWidth={2}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconButton]} onPress={onShare}>
          <Feather name="share-2" size={28} color="#6366f1" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconButton]} onPress={onAddToCalendar}>
          <Feather name="calendar" size={28} color="#10b981" />
        </TouchableOpacity>
      </View>

      {/* Main Content Card - Glassmorphism */}
      <BlurView intensity={isDark ? 40 : 20} style={styles.blurContainer}>
        <View style={[styles.contentCard, isDark ? styles.glassCardDark : styles.glassCardLight]}>
          {/* Competition Name */}
          <Text style={[styles.competitionLabel, { color: theme.primary }]}>
            {item.league || 'International Match'}
          </Text>

          {/* Category */}
          <View style={styles.categorySection}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>Category</Text>
            <Text style={[styles.value, { color: theme.text }]}>
              {item.sport}
            </Text>
          </View>

          {/* Teams */}
          <View style={styles.teamsSection}>
            <Text style={[styles.teamName, { color: theme.text }]}>{item.teamA}</Text>
            <View style={[styles.vsContainer, { backgroundColor: theme.primary + '25' }]}>
              <Text style={[styles.vsText, { color: theme.primary }]}>VS</Text>
            </View>
            <Text style={[styles.teamName, { color: theme.text }]}>{item.teamB}</Text>
          </View>

          {/* Venue */}
          <View style={styles.infoRow}>
            <Feather name="map-pin" size={18} color={theme.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>Venue</Text>
              <Text style={[styles.value, { color: theme.text }]}>TBA</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

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
        </View>
      </BlurView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: { height: 280 },
  hero: { flex: 1 },
  heroGradient: { flex: 1, justifyContent: 'flex-end' },
  heroContent: { padding: 24 },
  sportBadge: { alignSelf: 'flex-start', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  sportBadgeText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  floatingIcons: {
    position: 'absolute',
    top: 230,
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

  blurContainer: {
    marginHorizontal: 16,
    marginTop: -40,
    marginBottom: 40,
    borderRadius: 24,
    overflow: 'hidden',
  },

  contentCard: {
    padding: 24,
  },

  glassCardLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },

  glassCardDark: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },

  competitionLabel: { 
    fontSize: 14, 
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 16,
  },

  categorySection: { marginBottom: 16 },
  label: { 
    fontSize: 11, 
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: { 
    fontSize: 16, 
    fontWeight: '700',
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

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoContent: { flex: 1 },

  divider: { height: 1, marginVertical: 16 },

  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateSection: { flex: 1, alignItems: 'center' },
  timeSection: { flex: 1, alignItems: 'center' },
  statusSection: { flex: 1, alignItems: 'center' },

  iconCircle: { 
    width: 48, 
    height: 48, 
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
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusValue: {
    fontSize: 14,
    fontWeight: '700',
  },
});