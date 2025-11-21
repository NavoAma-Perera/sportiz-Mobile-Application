// src/features/matches/matchesSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAllUpcomingEvents } from '../../api/api';
import type { Match } from '../../types';

interface MatchesState {
  items: Match[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: MatchesState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchMatches = createAsyncThunk('matches/fetchAll', async () => {
  const events = await getAllUpcomingEvents();

  return events.map((e: any) => ({
    id: e.idEvent,
    teamA: e.strHomeTeam || e.strEvent?.split(' vs ')[0] || 'Team A',
    teamB: e.strAwayTeam || e.strEvent?.split(' vs ')[1] || 'Team B',
    date: `${e.dateEvent}T${e.strTime || '18:00:00'}`,
    status: 'upcoming' as const,
    image: e.strThumb || `https://via.placeholder.com/600x400/007AFF/white?text=${e.strSport || 'Sport'}`,
    sport: e.strSport === 'Soccer' ? 'Football' : (e.strSport || 'Swimming'),
    league: e.strLeague,
  }));
});

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => { state.status = 'loading'; })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed';
      });
  },
});

export default matchesSlice.reducer;