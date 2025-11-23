import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface HeroSectionProps {
  imageUri: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ imageUri }) => {
  return (
    <View style={styles.heroContainer}>
      <ImageBackground source={{ uri: imageUri }} style={styles.hero} resizeMode="cover">
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.heroGradient}>
          <View style={styles.heroContent} />
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  heroContainer: { height: 260 },
  hero: { flex: 1 },
  heroGradient: { flex: 1, justifyContent: 'flex-end' },
  heroContent: { padding: 24 },
});