// src/navigation/MainTabNavigator.tsx
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CalendarScreen from '../screens/CalendarScreen';
import { Feather } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import type { RootState } from '../types';
import { Colors } from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Shared header style function
const getHeaderStyle = (theme: any, isDark: boolean) => ({
  headerStyle: {
    backgroundColor: theme.primary,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: '700' as const,
    fontSize: 18,
  },
  headerTitleAlign: 'center' as const,
  headerShadowVisible: false,
  headerBackTitleVisible: false,
});

// Custom Back Button Component
function HeaderBackButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginLeft: 8, padding: 8 }}>
      <Feather name="arrow-left" size={24} color="#fff" />
    </TouchableOpacity>
  );
}

// Home Stack (HomeScreen → DetailsScreen)
function HomeStack() {
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeList" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={({ navigation }) => ({
          ...getHeaderStyle(theme, isDark),
          title: 'Match Details',
          headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}

// Favorites Stack (FavouritesScreen → DetailsScreen)
function FavouritesStack() {
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);
  const navigation = useNavigation<any>();

  return (
    <Stack.Navigator screenOptions={getHeaderStyle(theme, isDark)}>
      <Stack.Screen 
        name="FavouritesList" 
        component={FavouritesScreen}
        options={{
          title: 'My Favourites',
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigation.navigate('Home')} />
          ),
        }}
      />
      <Stack.Screen 
        name="Details" 
        component={DetailsScreen}
        options={({ navigation: nav }) => ({
          title: 'Match Details',
          headerLeft: () => <HeaderBackButton onPress={() => nav.goBack()} />,
        })}
      />
    </Stack.Navigator>
  );
}

// Calendar Stack
function CalendarStack() {
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);
  const navigation = useNavigation<any>();

  return (
    <Stack.Navigator screenOptions={getHeaderStyle(theme, isDark)}>
      <Stack.Screen 
        name="CalendarList" 
        component={CalendarScreen}
        options={{
          title: 'Calendar',
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigation.navigate('Home')} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

// Settings Stack
function SettingsStack() {
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);
  const navigation = useNavigation<any>();

  return (
    <Stack.Navigator screenOptions={getHeaderStyle(theme, isDark)}>
      <Stack.Screen 
        name="SettingsList" 
        component={SettingsScreen}
        options={{
          title: 'Settings',
          headerLeft: () => (
            <HeaderBackButton onPress={() => navigation.navigate('Home')} />
          ),
        }}
      />
    </Stack.Navigator>
  );
}

export default function MainTabNavigator() {
  const isDark = useSelector((state: RootState) => state.favourites.isDark);
  const theme = Colors(isDark);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: isDark ? theme.surface : '#ffffff',
          borderTopColor: theme.border,
          height: 70,
          paddingBottom: 12,
        },
        tabBarLabelStyle: { fontWeight: '600', fontSize: 12, marginTop: 4 },
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
        name="Calendar"
        component={CalendarStack}
        options={{
          tabBarLabel: 'Calendar',
          tabBarIcon: ({ color, size }) => <Feather name="calendar" size={size} color={color} />,
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <Feather name="settings" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}