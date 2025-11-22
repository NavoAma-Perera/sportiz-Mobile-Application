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
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import { useSelector } from 'react-redux';
import type { RootState, Match } from '../types';
import { Colors } from '../constants/colors';

interface CalendarEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  notes: string | null | undefined;
  location: string | null | undefined;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEARS = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i);

export default function CalendarScreen({ navigation }: { navigation: any }) {
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const matches = useSelector((state: RootState) => state.matches.items);
  const theme = Colors(isDark);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);

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
          const calendarEvents = await Calendar.getEventsAsync([calendar.id], startDate, endDate);
          allEvents = allEvents.concat(
            calendarEvents
              .filter((event) => event.title?.toLowerCase().includes('vs'))
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
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 1));
  };

  const handleSelectMonth = (month: number, year: number) => {
    setSelectedMonth(new Date(year, month, 1));
    setShowMonthPicker(false);
  };

  const confirmDelete = (eventId: string, eventTitle: string) => {
    Alert.alert(
      'Delete Event',
      `Are you sure you want to remove "${eventTitle}" from your calendar?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', style: 'destructive', onPress: () => deleteEvent(eventId) },
      ]
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

  const handleEventPress = (event: CalendarEvent) => {
    // Try to find matching match from Redux store
    const match = matches.find((m: Match) => {
      const matchTitle = `${m.teamA} vs ${m.teamB}`;
      return event.title.includes(m.teamA) && event.title.includes(m.teamB);
    });

    if (match) {
      navigation.navigate('Details', { item: match });
    } else {
      Alert.alert('Match Not Found', 'This match is no longer available in the app.');
    }
  };

  const parseEventInfo = (event: CalendarEvent) => {
    // Extract competition from notes (format: "Sport - Competition")
    const parts = event.notes?.split(' - ') || [];
    const sport = parts[0] || '';
    const competition = parts[1] || 'Match';
    return { sport, competition };
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Month Navigation */}
      <View style={[styles.monthNav, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={handlePreviousMonth} style={styles.monthBtn}>
          <Feather name="chevron-left" size={24} color={theme.primary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowMonthPicker(true)} style={styles.monthSelector}>
          <Text style={[styles.monthText, { color: theme.text }]}>
            {selectedMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
          </Text>
          <Feather name="chevron-down" size={18} color={theme.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNextMonth} style={styles.monthBtn}>
          <Feather name="chevron-right" size={24} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Month/Year Picker Modal */}
      <Modal visible={showMonthPicker} transparent animationType="fade" onRequestClose={() => setShowMonthPicker(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowMonthPicker(false)}>
          <View style={[styles.pickerModal, { backgroundColor: theme.surface }]}>
            <View style={[styles.pickerHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.pickerTitle, { color: theme.text }]}>Select Month & Year</Text>
              <TouchableOpacity onPress={() => setShowMonthPicker(false)}>
                <Feather name="x" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Year Selection */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.yearScroll}>
              {YEARS.map((year) => (
                <TouchableOpacity
                  key={year}
                  style={[
                    styles.yearChip,
                    {
                      backgroundColor: selectedMonth.getFullYear() === year ? theme.primary : theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setSelectedMonth(new Date(year, selectedMonth.getMonth(), 1))}
                >
                  <Text style={{ color: selectedMonth.getFullYear() === year ? '#fff' : theme.text, fontWeight: '600' }}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Month Grid */}
            <View style={styles.monthGrid}>
              {MONTHS.map((month, index) => (
                <TouchableOpacity
                  key={month}
                  style={[
                    styles.monthChip,
                    {
                      backgroundColor:
                        selectedMonth.getMonth() === index ? theme.primary : theme.background,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => handleSelectMonth(index, selectedMonth.getFullYear())}
                >
                  <Text style={{ color: selectedMonth.getMonth() === index ? '#fff' : theme.text, fontWeight: '600' }}>
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Pressable>
      </Modal>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>Loading events...</Text>
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
          renderItem={({ item }) => {
            const { sport, competition } = parseEventInfo(item);
            return (
              <TouchableOpacity
                style={[styles.eventCard, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
                onPress={() => handleEventPress(item)}
                activeOpacity={0.7}
              >
                {/* Competition */}
                <Text style={[styles.competition, { color: theme.primary }]}>{competition}</Text>

                {/* Match Title */}
                <Text style={[styles.eventTitle, { color: theme.text }]}>{item.title}</Text>

                {/* Venue */}
                {item.location && (
                  <View style={styles.infoRow}>
                    <Feather name="map-pin" size={14} color={theme.textSecondary} />
                    <Text style={[styles.infoText, { color: theme.textSecondary }]}>{item.location}</Text>
                  </View>
                )}

                {/* Date & Time with Pink Highlight */}
                <View style={styles.dateTimeRow}>
                  <View style={[styles.dateTimeBadge, { backgroundColor: theme.accent + '20' }]}>
                    <Feather name="calendar" size={14} color={theme.accent} />
                    <Text style={[styles.dateTimeText, { color: theme.accent }]}>
                      {item.startDate.toLocaleDateString('en-GB', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View style={[styles.dateTimeBadge, { backgroundColor: theme.accent + '20' }]}>
                    <Feather name="clock" size={14} color={theme.accent} />
                    <Text style={[styles.dateTimeText, { color: theme.accent }]}>
                      {item.startDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </View>

                {/* Delete Button */}
                <TouchableOpacity
                  style={[styles.deleteBtn, { backgroundColor: '#ef444420' }]}
                  onPress={() => confirmDelete(item.id, item.title)}
                >
                  <Feather name="trash-2" size={18} color="#ef4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  monthBtn: { padding: 8 },
  monthSelector: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  monthText: { fontSize: 18, fontWeight: '700' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerModal: { width: '100%', maxWidth: 340, borderRadius: 20, overflow: 'hidden' },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  pickerTitle: { fontSize: 18, fontWeight: '700' },
  yearScroll: { paddingHorizontal: 12, paddingVertical: 12 },
  yearChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  monthGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 8 },
  monthChip: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtext: { fontSize: 14 },
  listContent: { padding: 16 },
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
    position: 'relative',
  },
  competition: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  eventTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  infoText: { fontSize: 13, fontWeight: '500' },
  dateTimeRow: { flexDirection: 'row', gap: 10 },
  dateTimeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  dateTimeText: { fontSize: 13, fontWeight: '700' },
  deleteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    borderRadius: 10,
  },
});