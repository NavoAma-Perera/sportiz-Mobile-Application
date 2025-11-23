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

const determineStatus = (dateTime: string): 'upcoming' | 'ongoing' | 'completed' => {
  const eventDate = new Date(dateTime);
  const now = new Date();
  const diffMs = eventDate.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours > 2) return 'upcoming';
  if (diffHours > -2) return 'ongoing';
  return 'completed';
};

export const fetchMatches = createAsyncThunk('matches/fetchAll', async () => {
  const events = await getAllUpcomingEvents();

  return events.map((e: any): Match => {
    const dateTime = `${e.dateEvent}T${e.strTime || '18:00:00'}`;
    
    return {
      id: e.idEvent,
      teamA: e.strHomeTeam || e.strEvent?.split(' vs ')[0] || 'Team A',
      teamB: e.strAwayTeam || e.strEvent?.split(' vs ')[1] || 'Team B',
      date: dateTime,
      status: determineStatus(dateTime),
      image: e.strThumb || `https://via.placeholder.com/600x400/007AFF/white?text=${e.strSport || 'Sport'}`,
      sport: e.strSport === 'Soccer' ? 'Football' : (e.strSport || 'Swimming'),
      league: e.strLeague,
      leagueId: e.idLeague,
      teamAId: e.idHomeTeam,
      teamBId: e.idAwayTeam,
    };
  });
});

const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => { 
        state.status = 'loading'; 
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch matches';
      });
  },
});

export default matchesSlice.reducer;