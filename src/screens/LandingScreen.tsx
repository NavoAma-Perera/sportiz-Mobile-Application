// src/screens/LandingScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../types';
import { Colors } from '../constants/colors';

export default function LandingScreen({ navigation }: any) {
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);

  const spinValue = new Animated.Value(0);
  const scaleValue = new Animated.Value(0.3);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      )
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('AppNavigator');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleValue }] }]}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Feather name="activity" size={80} color={theme.primary} />
        </Animated.View>
      </Animated.View>

      <Text style={[styles.title, { color: theme.primary }]}>Sportiz</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Track Your Favorite Sports</Text>

      <View style={styles.dots}>
        {[0, 1, 2].map(i => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: theme.primary },
              {
                opacity: spinValue.interpolate({
                  inputRange: [0, 0.33, 0.66, 1],
                  outputRange: i === 0 ? [1, 0.3, 0.3, 1] : i === 1 ? [0.3, 1, 0.3, 0.3] : [0.3, 0.3, 1, 0.3]
                })
              }
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: { marginBottom: 30 },
  title: { fontSize: 48, fontWeight: '800', letterSpacing: -1 },
  subtitle: { fontSize: 18, marginTop: 8, fontWeight: '500' },
  dots: { flexDirection: 'row', marginTop: 50, gap: 10 },
  dot: { width: 12, height: 12, borderRadius: 6 },
});