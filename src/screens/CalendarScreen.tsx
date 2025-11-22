// src/screens/CalendarScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import { useSelector } from 'react-redux';
import type { RootState } from '../types';
import { Colors } from '../constants/colors';
import Header from '../components/Header';

interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  notes: string | null | undefined;
  location: string | null | undefined;
}

export default function CalendarScreen() {
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  useEffect(() => {
    loadCalendarEvents();
  }, [selectedMonth]);

  const loadCalendarEvents = async () => {
    try {
      setLoading(true);
      const { status } = await Calendar.requestCalendarPermissionsAsync();

      if (status === 'granted') {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

        const startDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
        const endDate = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);

        let allEvents: CalendarEvent[] = [];

        for (const calendar of calendars) {
          const calendarEvents = await Calendar.getEventsAsync(
            [calendar.id],
            startDate,
            endDate
          );

          allEvents = allEvents.concat(
            calendarEvents
              .filter(
                (event) =>
                  event.title?.includes('vs') || event.title?.includes('vs'.toLowerCase())
              )
              .map((event) => ({
                id: event.id,
                title: event.title || 'Event',
                startDate: new Date(event.startDate as any),
                endDate: new Date(event.endDate as any),
                notes: event.notes,
                location: event.location,
              }))
          );
        }

        // Sort by date
        allEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
        setEvents(allEvents);
      } else {
        Alert.alert('Permission Required', 'Please grant calendar access');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not load calendar events');
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1)
    );
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await Calendar.deleteEventAsync(eventId);
      Alert.alert('Success', 'Event removed from calendar');
      loadCalendarEvents();
    } catch (error) {
      Alert.alert('Error', 'Could not delete event');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerContainer}>
        <Header title="Calendar" subtitle="Your Sports Events" />
      </View>

      {/* Month Navigation */}
      <View style={[styles.monthNav, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={handlePreviousMonth} style={styles.monthBtn}>
          <Feather name="chevron-left" size={24} color={theme.primary} />
        </TouchableOpacity>

        <Text style={[styles.monthText, { color: theme.text }]}>
          {selectedMonth.toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric',
          })}
        </Text>

        <TouchableOpacity onPress={handleNextMonth} style={styles.monthBtn}>
          <Feather name="chevron-right" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading events...
          </Text>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>📅</Text>
          <Text style={[styles.emptyText, { color: theme.text }]}>No matches scheduled</Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Add matches from details screen
          </Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.eventCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}>
              <View style={styles.eventHeader}>
                <View style={styles.eventTitleSection}>
                  <Text style={[styles.eventTitle, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.eventDate, { color: theme.textSecondary }]}>
                    {item.startDate.toLocaleDateString('en-GB', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => deleteEvent(item.id)}
                >
                  <Feather name="trash-2" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>

              {item.location && (
                <View style={styles.eventMeta}>
                  <Feather name="map-pin" size={16} color={theme.textSecondary} />
                  <Text style={[styles.eventMetaText, { color: theme.textSecondary }]}>
                    {item.location}
                  </Text>
                </View>
              )}

              {item.notes && (
                <View style={styles.eventMeta}>
                  <Feather name="info" size={16} color={theme.textSecondary} />
                  <Text style={[styles.eventMetaText, { color: theme.textSecondary }]}>
                    {item.notes}
                  </Text>
                </View>
              )}
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 0,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  monthBtn: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
  },
  listContent: {
    padding: 16,
  },
  eventCard: {
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
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  eventTitleSection: {
    flex: 1,
    marginRight: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  eventDate: {
    fontSize: 13,
    fontWeight: '500',
  },
  deleteBtn: {
    padding: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
  },
  eventMetaText: {
    fontSize: 13,
    fontWeight: '500',
  },
});