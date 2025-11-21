import type { AppDispatch } from '../store';

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  image: string;
  sport: 'Football' | 'Cricket' | 'Swimming';
  league?: string;
}
// Updated User interface for Auth0
export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  email_verified?: boolean;
  accessToken: string;
  refreshToken?: string;
}

export interface Match {
  id: string;
  teamA: string;
  teamB: string;
  date: string;
  status: 'ongoing' | 'upcoming' | 'completed';
  image: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

export interface MatchesState {
  items: Match[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

export interface FavouritesState {
  items: Match[];
  isDark: boolean;
}

export interface RootState {
  auth: AuthState;
  matches: MatchesState;
  favourites: FavouritesState;
}

export type { AppDispatch };