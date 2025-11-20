import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import store from './src/app/store';
import AppNavigator from './src/navigation/AppNavigator';
import { loadPersistedAuth } from './src/features/auth/authSlice';
import { loadFavs, loadTheme } from './src/features/favourites/favouritesSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

function Root() {
  const dispatch = useDispatch();
  const isDark = useSelector((s) => s.favourites.isDark);

  useEffect(() => {
    dispatch(loadPersistedAuth());
    (async () => {
      const rawFavs = await AsyncStorage.getItem('sportiz_favs');
      const rawTheme = await AsyncStorage.getItem('sportiz_theme');
      if (rawFavs) dispatch(loadFavs(JSON.parse(rawFavs)));
      if (rawTheme) dispatch(loadTheme(JSON.parse(rawTheme)));
    })();
  }, [dispatch]);

  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <Root />
      </SafeAreaProvider>
    </Provider>
  );
}