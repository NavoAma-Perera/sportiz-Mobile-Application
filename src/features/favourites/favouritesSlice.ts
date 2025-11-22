// src/features/favourites/favouritesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Match, FavouritesState } from '../../types';

const FAV_KEY = 'sportiz_favs';
const THEME_KEY = 'sportiz_theme';

const initialState: FavouritesState = {
  items: [],
  isDark: false,
};

const favouritesSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {
    toggleFav(state, action: PayloadAction<Match>) {
      const item = action.payload;
      const existsIndex = state.items.findIndex((i) => i.id === item.id);

      if (existsIndex !== -1) {
        state.items.splice(existsIndex, 1); // Remove
      } else {
        state.items.push(item); // Add
      }

      // Safe async save (fire and forget with error handling)
      (async () => {
        try {
          await AsyncStorage.setItem(FAV_KEY, JSON.stringify(state.items));
        } catch (error) {
          console.error('Failed to save favorites:', error);
        }
      })();
    },

    loadFavs(state, action: PayloadAction<Match[]>) {
      // Payload is REQUIRED now
      state.items = action.payload;
    },

    toggleTheme(state) {
      state.isDark = !state.isDark;

      (async () => {
        try {
          await AsyncStorage.setItem(THEME_KEY, JSON.stringify(state.isDark));
        } catch (error) {
          console.error('Failed to save theme:', error);
        }
      })();
    },

    loadTheme(state, action: PayloadAction<boolean>) {
      // Payload is REQUIRED
      state.isDark = action.payload;
    },
  },
});

export const { toggleFav, loadFavs, toggleTheme, loadTheme } = favouritesSlice.actions;
export default favouritesSlice.reducer;
