
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Share, Alert, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import type { Match } from '../types';

interface FloatingActionsProps {
  match: Match;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  primaryColor: string;
}

const getOrCreateCalendar = async (): Promise<Calendar.Calendar | null> => {
  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  
  let defaultCalendar = calendars.find((cal) => cal.isPrimary) || 
                       calendars.find((cal) => cal.allowsModifications) ||
                       calendars[0];

  if (!defaultCalendar) {
    try {
      if (Platform.OS === 'ios') {
        const defaultSource = calendars[0]?.source;
        if (!defaultSource) return null;

        const newCalendarID = await Calendar.createCalendarAsync({
          title: 'Sportiz Matches',
          color: '#007AFF',
          entityType: Calendar.EntityTypes.EVENT,
          sourceId: defaultSource.id,
          source: defaultSource,
          name: 'sportiz_matches',
          ownerAccount: 'personal',
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });

        const newCalendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const foundCalendar = newCalendars.find(cal => cal.id === newCalendarID);
        if (foundCalendar) defaultCalendar = foundCalendar;
      } else {
        const newCalendarID = await Calendar.createCalendarAsync({
          title: 'Sportiz Matches',
          color: '#007AFF',
          entityType: Calendar.EntityTypes.EVENT,
          source: {
            isLocalAccount: true,
            name: 'Sportiz Calendar',
            type: Calendar.CalendarType.LOCAL,
          },
          name: 'sportiz_matches',
          ownerAccount: 'personal',
          accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });

        const newCalendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        const foundCalendar = newCalendars.find(cal => cal.id === newCalendarID);
        if (foundCalendar) defaultCalendar = foundCalendar;
      }
    } catch (error) {
      console.error('Error creating calendar:', error);
      return null;
    }
  }

  return defaultCalendar || null;
};

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  match,
  isFavorite,
  onToggleFavorite,
  primaryColor,
}) => {
  const onShare = async () => {
    try {
      await Share.share({
        message: `${match.teamA} vs ${match.teamB} - ${new Date(match.date).toLocaleString()} on Sportiz!`,
      });
    } catch (error) {
      Alert.alert('Error', 'Could not share match');
    }
  };

  const onAddToCalendar = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Calendar Access Required',
          'To set match reminders, please allow calendar access in your settings.',
          [{ text: 'Okay' }]
        );
        return;
      }

      const defaultCalendar = await getOrCreateCalendar();

      if (!defaultCalendar) {
        Alert.alert(
          'Calendar Setup Needed',
          'No calendar found on your device. Please add a Google account in Settings to use calendar features.',
          [{ text: 'Okay' }]
        );
        return;
      }

      const startDate = new Date(match.date);
      const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

      const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
        title: `${match.teamA} vs ${match.teamB}`,
        startDate,
        endDate,
        notes: `${match.sport} - ${match.league || 'International'}\n\nAdded via Sportiz App`,
        location: 'TBA',
        timeZone: 'GMT',
        alarms: [
          { relativeOffset: -60 },
          { relativeOffset: -30 },
        ],
      });

      if (eventId) {
        Alert.alert(
          '✅ Event Added to Calendar',
          `You'll receive reminders 1 hour and 30 minutes before kickoff.`,
          [{ text: 'Got it!' }]
        );
      }
    } catch (error) {
      console.error('Calendar error:', error);
      Alert.alert(
        'Unable to Add Event',
        'Something went wrong while adding the match to your calendar. Please try again.',
        [{ text: 'Okay' }]
      );
    }
  };

  return (
    <View style={styles.floatingIcons}>
      <TouchableOpacity style={styles.iconButton} onPress={onToggleFavorite}>
        <Feather
          name="heart"
          size={24}
          color={isFavorite ? '#ec4899' : '#374151'}
          strokeWidth={2}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={onShare}>
        <Feather name="share-2" size={24} color={primaryColor} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconButton} onPress={onAddToCalendar}>
        <Feather name="calendar" size={24} color="#10b981" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingIcons: {
    position: 'absolute',
    top: 270,
    right: 10,
    flexDirection: 'column',
    gap: 12,
    zIndex: 10,
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});
