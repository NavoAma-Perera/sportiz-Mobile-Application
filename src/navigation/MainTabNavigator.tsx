// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import type { RootState } from '../types';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack (HomeScreen → DetailsScreen)
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeList" component={HomeScreen} />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
        options={{ headerShown: true, title: 'Match Details' }} 
      />
    </Stack.Navigator>
  );
}

// Favorites Stack (FavouritesScreen → DetailsScreen)
function FavouritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true}}>
      <Stack.Screen name="FavouritesList" component={FavouritesScreen} />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen} 
        options={{ headerShown: true, title: 'Match Details' }} 
      />
    </Stack.Navigator>
  );
}

export default function MainTabNavigator() {
  const isDark = useSelector((state: RootState) => state.favourites.isDark);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? '#a78bfa' : '#6366f1',
        tabBarInactiveTintColor: isDark ? '#64748b' : '#94a3b8',
        tabBarStyle: {
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderTopColor: isDark ? '#334155' : '#e2e8f0',
          height: 60,
          paddingBottom: 8,
        },
        tabBarLabelStyle: { fontWeight: '600', fontSize: 12 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Favourites"
        component={FavouritesStack}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size }) => <Feather name="heart" size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}