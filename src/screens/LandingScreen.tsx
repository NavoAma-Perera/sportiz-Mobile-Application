// src/screens/LandingScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
          <LinearGradient 
            colors={['#8b5cf6', '#ec4899']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            style={styles.iconGradientBg}
          >
            <Feather name="activity" size={80} color="#fff" />
          </LinearGradient>
        </Animated.View>
      </Animated.View>

      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: theme.text }]}>Sport</Text>
        <Text style={[styles.titleAccent, { color: '#8b5cf6' }]}>i</Text>
        <Text style={[styles.titleAccent, { color: '#ec4899' }]}>z</Text>
      </View>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Track Your Favorite Sports</Text>

      <View style={styles.dots}>
        {[0, 1, 2].map(i => (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { 
                backgroundColor: i === 0 ? '#8b5cf6' : i === 1 ? '#ec4899' : theme.primary
              },
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
  iconGradientBg: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: { 
    fontSize: 48, 
    fontWeight: '800', 
    letterSpacing: -1 
  },
  titleAccent: {
    fontSize: 48,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: { 
    fontSize: 18, 
    marginTop: 8, 
    fontWeight: '500' 
  },
  dots: { 
    flexDirection: 'row', 
    marginTop: 50, 
    gap: 10 
  },
  dot: { 
    width: 12, 
    height: 12, 
    borderRadius: 6 
  },
});