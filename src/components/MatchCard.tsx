import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import type { Match } from '../types';

interface MatchCardProps {
  item: Match;
  onPress?: (item: Match) => void;
  onToggleFav?: (item: Match) => void;
  isFav: boolean;
}

const { width } = Dimensions.get('window');

export default function MatchCard({ item, onPress, onToggleFav, isFav }: MatchCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(item)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.body}>
        <Text numberOfLines={1} style={styles.title}>
          {item.teamA} vs {item.teamB}
        </Text>
        <Text numberOfLines={1} style={styles.date}>
          {new Date(item.date).toLocaleString()}
        </Text>
        <View style={styles.row}>
          <Text style={styles.status}>{item.status}</Text>
          <TouchableOpacity onPress={() => onToggleFav?.(item)}>
            <Feather
              name={isFav ? 'heart' : 'heart'}
              size={20}
              color={isFav ? 'tomato' : 'gray'}
              fill={isFav ? 'tomato' : 'none'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: width * 0.36,
    height: 100,
  },
  body: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  date: {
    fontSize: 13,
    color: 'gray',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  status: {
    fontSize: 12,
    color: 'gray',
  },
});