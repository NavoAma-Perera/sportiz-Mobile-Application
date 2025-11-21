import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import MatchCard from '../components/MatchCard';
import { toggleFav } from '../features/favourites/favouritesSlice';
import type { RootState, AppDispatch } from '../types';

interface FavouritesScreenProps {
  navigation: any;
}

export default function FavouritesScreen({ navigation }: FavouritesScreenProps) {
  const favs = useSelector((state: RootState) => state.favourites.items);
  const dispatch = useDispatch<AppDispatch>();

  if (!favs.length) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={{ fontSize: 48 }}>❤️</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 12 }}>
          No Favourites Yet
        </Text>
        <Text style={{ color: 'gray', marginTop: 8 }}>
          Add matches to get started
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favs}
keyExtractor={(item, index) => `${item.id}-${index}`}        renderItem={({ item }) => (
          <MatchCard
            item={item}
            onPress={() => navigation.navigate('FavDetails', { item })}
            onToggleFav={() => dispatch(toggleFav(item))}
            isFav={true}
          />
        )}
        contentContainerStyle={{ padding: 12 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { justifyContent: 'center', alignItems: 'center' },
});