// src/screens/FavouritesScreen.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Feather } from '@expo/vector-icons';
import MatchCard from '../components/MatchCard';
import { toggleFav } from '../features/favourites/favouritesSlice';
import { Colors } from '../constants/colors';
import type { RootState, AppDispatch, Match } from '../types';

interface FavouritesScreenProps {
  navigation: any;
}

const ITEMS_PER_PAGE = 5;

export default function FavouritesScreen({ navigation }: FavouritesScreenProps) {
  const favs = useSelector((state: RootState) => state.favourites.items);
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const dispatch = useDispatch<AppDispatch>();
  const theme = Colors(isDark);

  const [currentPage, setCurrentPage] = useState(1);

  // Paginate favourites
  const paginatedFavs = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return favs.slice(startIndex, endIndex);
  }, [favs, currentPage]);

  const totalPages = Math.ceil(favs.length / ITEMS_PER_PAGE);

  // Reset to page 1 if current page becomes invalid after removing items
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [favs.length, totalPages, currentPage]);

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

  if (!favs.length) {
    return (
      <View style={[styles.container, styles.emptyContainer, { backgroundColor: theme.background }]}>
       
        <Text style={[styles.emptyTitle, { color: theme.text }]}>
          No Favourites Yet
        </Text>
        <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
          Add matches to get started
        </Text>
        <TouchableOpacity
          style={[styles.goBackBtn, { backgroundColor: theme.primary }]}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={18} color="#fff" />
          <Text style={styles.goBackText}>Browse Matches</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Results count */}
      <View style={styles.countContainer}>
        <Text style={[styles.countText, { color: theme.textSecondary }]}>
          {favs.length} favourite{favs.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <FlatList
        data={paginatedFavs}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }: { item: Match }) => (
          <MatchCard
            item={item}
            onPress={() => navigation.navigate('Details', { item })}
            onToggleFav={() => dispatch(toggleFav(item))}
            isFav={true}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <View style={[styles.pagination, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <TouchableOpacity
            style={[
              styles.pageBtn,
              { backgroundColor: currentPage === 1 ? theme.border : theme.primary },
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

          <Text style={[styles.pageText, { color: theme.text }]}>
            {currentPage} / {totalPages}
          </Text>

          <TouchableOpacity
            style={[
              styles.pageBtn,
              { backgroundColor: currentPage === totalPages ? theme.border : theme.primary },
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    marginBottom: 24,
  },
  goBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  goBackText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  countContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingTop: 4,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    gap: 20,
    borderTopWidth: 1,
  },
  pageBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageText: {
    fontSize: 14,
    fontWeight: '600',
  },
});