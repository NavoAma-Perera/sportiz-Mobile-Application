import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import store from './src/store';
import { loadPersistedAuth } from './src/features/auth/authSlice';
import { loadFavs, loadTheme } from './src/features/favourites/favouritesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LandingScreen from './src/screens/LandingScreen';
import AppNavigator from './src/navigation/AppNavigator';
import type { AppDispatch } from './src/store';

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Load persisted data on app start
    const loadPersistedData = async () => {
      try {
        // Load auth
        await dispatch(loadPersistedAuth());

        // Load favorites
        const favsJson = await AsyncStorage.getItem('sportiz_favs');
        if (favsJson) {
          const favs = JSON.parse(favsJson);
          dispatch(loadFavs(favs));
        }

        // Load theme preference
        const themeJson = await AsyncStorage.getItem('sportiz_theme');
        if (themeJson) {
          const isDark = JSON.parse(themeJson);
          dispatch(loadTheme(isDark));
        }
      } catch (error) {
        console.error('Error loading persisted data:', error);
      }
    };

    loadPersistedData();
  }, [dispatch]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="AppNavigator" component={AppNavigator} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}