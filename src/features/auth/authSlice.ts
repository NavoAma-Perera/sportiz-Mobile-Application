import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store';
const AUTH_KEY = 'sportiz_auth';
const USERS_KEY = 'sportiz_users';
const TOKEN_KEY = 'sportiz_token';

// Types
export interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
  accessToken: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  username?: string;
  name?: string;
}

// Helper: Get all registered users
const getRegisteredUsers = async () => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch {
    return [];
  }
};

// Register User (Local Storage)
export const registerUser = createAsyncThunk<User, RegisterPayload, { rejectValue: string }>(
  'auth/register',
  async (payload, thunkAPI) => {
    try {
      const { email, password, username, name } = payload;

      // Validation
      if (!email || !password) {
        return thunkAPI.rejectWithValue('Email and password are required');
      }

      // Get existing users
      const existingUsers = await getRegisteredUsers();

      // Check if user already exists
      const userExists = existingUsers.find(
        (u: any) => u.email === email || u.username === username
      );

      if (userExists) {
        return thunkAPI.rejectWithValue('User with this email or username already exists');
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}`,
        email,
        username: username || email.split('@')[0],
        name: name || username || email.split('@')[0],
        password, // Store hashed in production!
        createdAt: new Date().toISOString(),
      };

      // Save to users list
      existingUsers.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));

      // Generate token
      const token = `token_${newUser.id}_${Date.now()}`;

      // Store token securely
      await setItemAsync(TOKEN_KEY, token);

      // Create user object (without password)
      const user: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        username: newUser.username,
        accessToken: token,
      };

      // Store current user
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(user));

      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Login User (Local Storage)
export const loginUser = createAsyncThunk<User, LoginPayload, { rejectValue: string }>(
  'auth/login',
  async (payload, thunkAPI) => {
    try {
      const { email, password } = payload;

      // Get all registered users
      const users = await getRegisteredUsers();

      // Find user with matching credentials
      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!user) {
        return thunkAPI.rejectWithValue('Invalid email or password');
      }

      // Generate token
      const token = `token_${user.id}_${Date.now()}`;

      // Store token securely
      await setItemAsync(TOKEN_KEY, token);

      // Create user object (without password)
      const authenticatedUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        accessToken: token,
      };

      // Store current user
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authenticatedUser));

      return authenticatedUser;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Load persisted auth (on app launch)
export const loadPersistedAuth = createAsyncThunk<User | null>(
  'auth/load',
  async () => {
    try {
      const userJson = await AsyncStorage.getItem(AUTH_KEY);
      const token = await getItemAsync(TOKEN_KEY);

      if (!userJson || !token) {
        return null;
      }

      const user = JSON.parse(userJson);
      user.accessToken = token;

      return user;
    } catch {
      return null;
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk<void>(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await AsyncStorage.removeItem(AUTH_KEY);
      await deleteItemAsync(TOKEN_KEY);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Logout failed');
    }
  }
);

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // === REGISTER ===
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.accessToken;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload || 'Registration failed';
        state.status = 'failed';
      })

      // === LOGIN ===
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.token = action.payload.accessToken;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload || 'Login failed';
        state.status = 'failed';
      })

      // === LOAD PERSISTED ===
      .addCase(loadPersistedAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.token = action.payload.accessToken;
        }
      })

      // === LOGOUT ===
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;