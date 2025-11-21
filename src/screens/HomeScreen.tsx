// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Feather } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import MatchCard from '../components/MatchCard';
import Header from '../components/Header';
import { fetchMatches } from '../features/matches/matchesSlice';
import { toggleFav } from '../features/favourites/favouritesSlice';
import type { RootState, AppDispatch, Match } from '../types';

export default function HomeScreen({ navigation }: { navigation: any }) {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((state: RootState) => state.matches);
  const favs = useSelector((state: RootState) => state.favourites.items);

  const [selectedSport, setSelectedSport] = useState<'All' | 'Football' | 'Cricket' | 'Swimming'>('All');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    dispatch(fetchMatches());
  }, [dispatch]);

  const filtered = items.filter(item => {
    if (selectedSport !== 'All' && item.sport !== selectedSport) return false;
    if (selectedDate) {
      const itemDate = new Date(item.date).toDateString();
      const filterDate = selectedDate.toDateString();
      if (itemDate !== filterDate) return false;
    }
    return true;
  });

  const sports: ('All' | 'Football' | 'Cricket' | 'Swimming')[] = ['All', 'Football', 'Cricket', 'Swimming'];

  if (status === 'loading' && !items.length) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 12, color: 'gray' }}>Loading matches...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Sportiz" subtitle="Football • Cricket • Swimming" />

      {/* Sport Filters */}
      <View style={styles.filterBar}>
        {sports.map(sport => (
          <TouchableOpacity
            key={sport}
            style={[styles.filterBtn, selectedSport === sport && styles.filterBtnActive]}
            onPress={() => setSelectedSport(sport)}>
            <Text style={[styles.filterText, selectedSport === sport && styles.filterTextActive]}>
              {sport === 'All' ? 'All Sports' : sport}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Calendar Filter */}
      <TouchableOpacity style={styles.calendarBtn} onPress={() => setShowCalendar(true)}>
        <Feather name="calendar" size={20} color="#007AFF" />
        <Text style={styles.calendarText}>
          {selectedDate ? selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'All Dates'}
        </Text>
        {selectedDate && (
          <TouchableOpacity onPress={() => setSelectedDate(null)}>
            <Feather name="x" size={20} color="#007AFF" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {showCalendar && (
        <DateTimePicker
          mode="date"
          value={selectedDate || new Date()}
          onChange={(_, date) => {
            setShowCalendar(false);
            setSelectedDate(date || null);
          }}
        />
      )}

      <FlatList
        data={filtered}
keyExtractor={(item, index) => `${item.id}-${index}`}        renderItem={({ item }) => (
          <MatchCard
            item={item}
            onPress={(match: Match) => navigation.navigate('Details', { item: match })}
            onToggleFav={() => dispatch(toggleFav(item))}
            isFav={favs.some(f => f.id === item.id)}
          />
        )}
        refreshControl={<RefreshControl refreshing={status === 'loading'} onRefresh={() => dispatch(fetchMatches())} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50, color: 'gray' }}>No matches found</Text>}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  filterBar: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 10, paddingHorizontal: 12, marginVertical: 12 },
  filterBtn: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#f0f0f0', borderRadius: 20 },
  filterBtnActive: { backgroundColor: '#007AFF' },
  filterText: { fontWeight: '600', color: '#333' },
  filterTextActive: { color: '#fff' },
  calendarBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, borderWidth: 1.5, borderColor: '#007AFF', borderRadius: 12, marginHorizontal: 20, marginBottom: 12 },
  calendarText: { color: '#007AFF', fontWeight: '600' },
});