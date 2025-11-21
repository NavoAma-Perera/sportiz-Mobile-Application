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
      const exists = state.items.find((i) => i.id === item.id);
      if (exists) {
        state.items = state.items.filter((i) => i.id !== item.id);
      } else {
        state.items.push(item);
      }
      AsyncStorage.setItem(FAV_KEY, JSON.stringify(state.items));
    },
    loadFavs(state, action: PayloadAction<Match[] | undefined>) {
      if (action.payload) {
        state.items = action.payload;
      }
    },
    toggleTheme(state) {
      state.isDark = !state.isDark;
      AsyncStorage.setItem(THEME_KEY, JSON.stringify(state.isDark));
    },
    loadTheme(state, action: PayloadAction<boolean | undefined>) {
      if (typeof action.payload === 'boolean') {
        state.isDark = action.payload;
      }
    },
  },
});

export const { toggleFav, loadFavs, toggleTheme, loadTheme } = favouritesSlice.actions;
export default favouritesSlice.reducer;