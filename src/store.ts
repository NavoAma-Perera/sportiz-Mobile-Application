import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import favouritesReducer from './features/favourites/favouritesSlice';
import matchesReducer from './features/matches/matchesSlice';
import type { RootState } from './types';

const store = configureStore({
  reducer: {
    auth: authReducer,
    matches: matchesReducer,
    favourites: favouritesReducer,
  },
  
});

export type AppDispatch = typeof store.dispatch;
export type { RootState };

export default store;  // ← THIS IS IMPORTANT!