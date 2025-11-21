import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailsScreen from '../screens/DetailsScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Feather } from '@expo/vector-icons';
import type { RouteProp } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{ headerTitle: 'Sportiz Matches' }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ headerTitle: 'Match Details' }}
      />
    </Stack.Navigator>
  );
}

function FavouritesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="FavouritesList"
        component={FavouritesScreen}
        options={{ headerTitle: 'My Favourites' }}
      />
      <Stack.Screen
        name="FavDetails"
        component={DetailsScreen}
        options={{ headerTitle: 'Match Details' }}
      />
    </Stack.Navigator>
  );
}

interface TabScreenOptions {
  route: RouteProp<any>;
  color: string;
  size: number;
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<any> }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }: { color: string; size: number }) => {
          let iconName: React.ComponentProps<typeof Feather>['name'] = 'home';

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Favourites') iconName = 'heart';
          else if (route.name === 'Settings') iconName = 'settings';

          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#999',
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Favourites" component={FavouritesStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}