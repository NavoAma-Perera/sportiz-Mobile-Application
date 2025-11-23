// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMatches } from '../features/matches/matchesSlice';
import { toggleFav } from '../features/favourites/favouritesSlice';
import MatchCard from '../components/MatchCard';
import Header from '../components/Header';
import type { RootState, AppDispatch, Match } from '../types';
import { Colors } from '../constants/colors';

interface HomeScreenProps {
  navigation: any;
}

const ITEMS_PER_PAGE = 5;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const dispatch = useDispatch<AppDispatch>();
  const matches = useSelector((state: RootState) => state.matches.items);
  const status = useSelector((state: RootState) => state.matches.status);
  const favs = useSelector((state: RootState) => state.favourites.items);
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);

  // Filter states
  const [selectedSport, setSelectedSport] = useState<string>('All');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSportDropdown, setShowSportDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMatches());
    }
  }, [status, dispatch]);

  // Get unique sports
  const sports = useMemo(() => {
    const uniqueSports = Array.from(new Set(matches.map((m) => m.sport)));
    return ['All', ...uniqueSports];
  }, [matches]);

  // Filter matches
  const filteredMatches = useMemo(() => {
    let filtered = [...matches];

    if (selectedSport !== 'All') {
      filtered = filtered.filter((m) => m.sport === selectedSport);
    }

    if (selectedDate) {
      filtered = filtered.filter((m) => {
        const matchDate = new Date(m.date);
        return (
          matchDate.getDate() === selectedDate.getDate() &&
          matchDate.getMonth() === selectedDate.getMonth() &&
          matchDate.getFullYear() === selectedDate.getFullYear()
        );
      });
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((m) =>
        m.teamA.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.teamB.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.league?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [matches, selectedSport, selectedDate, searchQuery]);

  // Paginate filtered matches
  const paginatedMatches = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredMatches.slice(startIndex, endIndex);
  }, [filteredMatches, currentPage]);

  const totalPages = Math.ceil(filteredMatches.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSport, selectedDate, searchQuery]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const hasActiveFilters = selectedSport !== 'All' || selectedDate !== null || searchQuery.length > 0;

  const resetFilters = () => {
    setSelectedSport('All');
    setSelectedDate(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const onDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSelectSport = (sport: string) => {
    setSelectedSport(sport);
    setShowSportDropdown(false);
  };

  if (status === 'loading') {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
          Loading matches...
        </Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>
          Failed to load matches
        </Text>
        <Text style={[styles.errorSubtext, { color: theme.textSecondary }]}>
          Please check your connection and try again
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header navigation={navigation} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Feather name="search" size={20} color={theme.textSecondary} />
          <TextInput
            placeholder="Search teams, league..."
            placeholderTextColor={theme.textSecondary}
            style={[styles.searchInput, { color: theme.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Compact Filter Row */}
      <View style={styles.filterRow}>
        {/* Sport Dropdown */}
        <View style={styles.filterItem}>
          <TouchableOpacity
            style={[
              styles.dropdownBtn,
              {
                backgroundColor: theme.surface,
                borderColor: selectedSport !== 'All' ? theme.primary : theme.border,
                borderWidth: selectedSport !== 'All' ? 2 : 1,
              },
            ]}
            onPress={() => setShowSportDropdown(true)}
          >
            <Feather 
              name="activity" 
              size={18} 
              color={selectedSport !== 'All' ? theme.primary : theme.textSecondary} 
            />
            <Text
              style={[
                styles.dropdownText,
                { color: selectedSport !== 'All' ? theme.text : theme.textSecondary },
              ]}
              numberOfLines={1}
            >
              {selectedSport}
            </Text>
            <Feather name="chevron-down" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Date Picker */}
        <View style={styles.filterItem}>
          <TouchableOpacity
            style={[
              styles.dropdownBtn,
              {
                backgroundColor: theme.surface,
                borderColor: selectedDate ? theme.primary : theme.border,
                borderWidth: selectedDate ? 2 : 1,
              },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <Feather 
              name="calendar" 
              size={18} 
              color={selectedDate ? theme.primary : theme.textSecondary} 
            />
            <Text
              style={[
                styles.dropdownText,
                { color: selectedDate ? theme.text : theme.textSecondary },
              ]}
              numberOfLines={1}
            >
              {selectedDate
                ? selectedDate.toLocaleDateString('en-GB', {
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Date'}
            </Text>
            {selectedDate ? (
              <TouchableOpacity 
                onPress={(e) => {
                  e.stopPropagation();
                  setSelectedDate(null);
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Feather name="x" size={18} color={theme.accent} />
              </TouchableOpacity>
            ) : (
              <Feather name="chevron-down" size={18} color={theme.textSecondary} />
            )}
          </TouchableOpacity>
        </View>

        {/* Reset Button */}
        {hasActiveFilters && (
          <TouchableOpacity
            style={[styles.resetBtn, { backgroundColor: theme.accent }]}
            onPress={resetFilters}
          >
            <Feather name="refresh-cw" size={18} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Sport Dropdown Modal */}
      <Modal
        visible={showSportDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSportDropdown(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowSportDropdown(false)}
        >
          <View style={[styles.dropdownModal, { backgroundColor: theme.surface }]}>
            <View style={[styles.dropdownHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.dropdownTitle, { color: theme.text }]}>
                Select Sport
              </Text>
              <TouchableOpacity onPress={() => setShowSportDropdown(false)}>
                <Feather name="x" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            {sports.map((sport) => (
              <TouchableOpacity
                key={sport}
                style={[
                  styles.dropdownOption,
                  selectedSport === sport && { backgroundColor: theme.primary + '20' },
                ]}
                onPress={() => handleSelectSport(sport)}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    { color: selectedSport === sport ? theme.primary : theme.text },
                  ]}
                >
                  {sport}
                </Text>
                {selectedSport === sport && (
                  <Feather name="check" size={20} color={theme.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={new Date()}
          themeVariant={isDark ? 'dark' : 'light'}
        />
      )}

      {showDatePicker && Platform.OS === 'ios' && (
        <View style={[styles.iosPickerActions, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <TouchableOpacity onPress={() => { setSelectedDate(null); setShowDatePicker(false); }}>
            <Text style={[styles.iosPickerBtn, { color: theme.accent }]}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowDatePicker(false)}>
            <Text style={[styles.iosPickerBtn, { color: theme.primary }]}>Done</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Results count */}
      <View style={styles.resultsContainer}>
        <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
          {filteredMatches.length} match{filteredMatches.length !== 1 ? 'es' : ''} found
        </Text>
      </View>

      {/* Matches List */}
      {paginatedMatches.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={[styles.emptyText, { color: theme.text }]}>No matches found</Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Try adjusting your filters
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={paginatedMatches}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderItem={({ item }) => {
              const isFav = favs.some((f: Match) => f.id === item.id);
              return (
                <MatchCard
                  item={item}
                  onPress={() => navigation.navigate('Details', { item })}
                  onToggleFav={() => dispatch(toggleFav(item))}
                  isFav={isFav}
                />
              );
            }}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {totalPages > 1 && (
            <View style={[styles.pagination, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
              <TouchableOpacity
                style={[styles.pageBtn, { backgroundColor: currentPage === 1 ? theme.border : theme.primary }]}
                onPress={handlePrevPage}
                disabled={currentPage === 1}
              >
                <Feather name="chevron-left" size={20} color={currentPage === 1 ? theme.textSecondary : '#fff'} />
              </TouchableOpacity>
              <Text style={[styles.pageText, { color: theme.text }]}>
                {currentPage} / {totalPages}
              </Text>
              <TouchableOpacity
                style={[styles.pageBtn, { backgroundColor: currentPage === totalPages ? theme.border : theme.primary }]}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <Feather name="chevron-right" size={20} color={currentPage === totalPages ? theme.textSecondary : '#fff'} />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { paddingHorizontal: 16, paddingVertical: 10 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, fontWeight: '500' },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  filterItem: { flex: 1 },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  dropdownText: { flex: 1, fontSize: 14, fontWeight: '600' },
  resetBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  dropdownModal: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  dropdownTitle: { fontSize: 18, fontWeight: '700' },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dropdownOptionText: { fontSize: 16, fontWeight: '500' },
  iosPickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
  },
  iosPickerBtn: { fontSize: 16, fontWeight: '600' },
  resultsContainer: { paddingHorizontal: 16, marginTop: 12, marginBottom: 4 },
  resultsText: { fontSize: 13, fontWeight: '600' },
  listContent: { padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 16, fontWeight: '600' },
  errorText: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  errorSubtext: { fontSize: 14, textAlign: 'center', paddingHorizontal: 32 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  emptySubtext: { fontSize: 14 },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    gap: 20,
    borderTopWidth: 1,
  },
  pageBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  pageText: { fontSize: 14, fontWeight: '600' },
});