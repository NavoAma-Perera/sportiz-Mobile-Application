import React from 'react';
import { ScrollView, View, Text, Image, Button, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFav } from '../features/favourites/favouritesSlice';
import type { RootState, AppDispatch, Match } from '../types';

interface DetailsScreenProps {
  route: any;
}

export default function DetailsScreen({ route }: DetailsScreenProps) {
  const { item }: { item: Match } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const favs = useSelector((state: RootState) => state.favourites.items);
  const isFav = Boolean(favs.find((f) => f.id === item.id));

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>
          {item.teamA} vs {item.teamB}
        </Text>
        <Text style={styles.date}>{new Date(item.date).toLocaleString()}</Text>
        <Text style={styles.status}>Status: {item.status}</Text>
        <View style={styles.buttonContainer}>
          <Button
            title={isFav ? 'Remove from Favourites' : 'Add to Favourites'}
            onPress={() => dispatch(toggleFav(item))}
            color={isFav ? '#FF6B6B' : '#007AFF'}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    height: 220,
    borderRadius: 12,
    margin: 12,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 12,
  },
  date: {
    color: 'gray',
    marginTop: 6,
  },
  status: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    marginTop: 20,
  },
});