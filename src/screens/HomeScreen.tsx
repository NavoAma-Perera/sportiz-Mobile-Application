// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  TextInput,
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

    // Filter by sport
    if (selectedSport !== 'All') {
      filtered = filtered.filter((m) => m.sport === selectedSport);
    }

    // Filter by date
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

    // Filter by search query
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

  // Reset to page 1 when filters change
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

  const clearDate = () => {
    setSelectedDate(null);
    setShowDatePicker(false);
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
      {/* Header */}
      <View style={styles.headerContainer}>
        <Header title="Sportiz" subtitle="Your Sports Hub" />
      </View>

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

      {/* Sport Filter */}
      <View style={styles.filterSection}>
        <View style={styles.filterHeader}>
          <Text style={[styles.filterTitle, { color: theme.text }]}>
            <Feather name="filter" size={16} color={theme.primary} /> Sport
          </Text>
          {(selectedSport !== 'All' || selectedDate !== null || searchQuery.length > 0) && (
            <TouchableOpacity onPress={resetFilters}>
              <Text style={[styles.resetBtn, { color: theme.accent }]}>
                Reset All
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {sports.map((sport) => (
            <TouchableOpacity
              key={sport}
              style={[
                styles.filterChip,
                {
                  backgroundColor:
                    selectedSport === sport ? theme.primary : theme.surface,
                  borderColor: selectedSport === sport ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setSelectedSport(sport)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  {
                    color:
                      selectedSport === sport ? '#fff' : theme.text,
                  },
                ]}
              >
                {sport}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Date Picker Filter */}
      <View style={styles.filterSection}>
        <Text style={[styles.filterTitle, { color: theme.text }]}>
          <Feather name="calendar" size={16} color={theme.primary} /> Date
        </Text>
        <View style={styles.datePickerRow}>
          <TouchableOpacity
            style={[
              styles.datePickerBtn,
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
              size={20} 
              color={selectedDate ? theme.primary : theme.textSecondary} 
            />
            <Text
              style={[
                styles.datePickerText,
                { color: selectedDate ? theme.text : theme.textSecondary },
              ]}
            >
              {selectedDate
                ? selectedDate.toLocaleDateString('en-GB', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Select Date'}
            </Text>
          </TouchableOpacity>
          {selectedDate && (
            <TouchableOpacity
              style={[styles.clearDateBtn, { backgroundColor: theme.accent }]}
              onPress={clearDate}
            >
              <Feather name="x" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Date Picker Modal */}
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

      {/* iOS Date Picker Done Button */}
      {showDatePicker && Platform.OS === 'ios' && (
        <View style={[styles.iosPickerActions, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <TouchableOpacity onPress={clearDate}>
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
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No matches found
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
            Try adjusting your filters or search
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <View style={[styles.pagination, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
              <TouchableOpacity
                style={[
                  styles.pageBtn,
                  {
                    backgroundColor: currentPage === 1 ? theme.border : theme.primary,
                  },
                ]}
                onPress={handlePrevPage}
                disabled={currentPage === 1}
              >
                <Feather
                  name="chevron-left"
                  size={20}
                  color={currentPage === 1 ? theme.textSecondary : '#fff'}
                />
              </TouchableOpacity>

              <View style={styles.pageInfo}>
                <Text style={[styles.pageText, { color: theme.text }]}>
                  Page {currentPage} of {totalPages}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.pageBtn,
                  {
                    backgroundColor:
                      currentPage === totalPages ? theme.border : theme.primary,
                  },
                ]}
                onPress={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <Feather
                  name="chevron-right"
                  size={20}
                  color={currentPage === totalPages ? theme.textSecondary : '#fff'}
                />
              </TouchableOpacity>
            </View>
          )}
        </>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  filterSection: {
    paddingHorizontal: 16,
    marginTop: 12,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  resetBtn: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterScroll: {
    paddingRight: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  datePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  datePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
  },
  datePickerText: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearDateBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iosPickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
  },
  iosPickerBtn: {
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
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
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  pageBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageInfo: {
    flex: 1,
    alignItems: 'center',
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
  },
});