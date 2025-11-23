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

// Get all registered users
const getRegisteredUsers = async () => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch {
    return [];
  }
};

// Register User
export const registerUser = createAsyncThunk<User, RegisterPayload, { rejectValue: string }>(
  'auth/register',
  async (payload, thunkAPI) => {
    try {
      const { email, password, username, name } = payload;

      if (!email || !password) {
        return thunkAPI.rejectWithValue('Email and password are required');
      }

      const existingUsers = await getRegisteredUsers();
      const userExists = existingUsers.find(
        (u: any) => u.email === email || u.username === username
      );

      if (userExists) {
        return thunkAPI.rejectWithValue('User with this email or username already exists');
      }

      const newUser = {
        id: `user_${Date.now()}`,
        email,
        username: username || email.split('@')[0],
        name: name || username || email.split('@')[0],
        password,
        createdAt: new Date().toISOString(),
      };

      existingUsers.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(existingUsers));

      const token = `token_${newUser.id}_${Date.now()}`;

      const user: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        username: newUser.username,
        accessToken: token,
      };

      return user;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Registration failed');
    }
  }
);

// Login User 
export const loginUser = createAsyncThunk<User, LoginPayload, { rejectValue: string }>(
  'auth/login',
  async (payload, thunkAPI) => {
    try {
      const { email, password } = payload;
      const users = await getRegisteredUsers();
      const user = users.find(
        (u: any) => u.email === email && u.password === password
      );

      if (!user) {
        return thunkAPI.rejectWithValue('Invalid email or password');
      }

      const token = `token_${user.id}_${Date.now()}`;
      await setItemAsync(TOKEN_KEY, token);

      const authenticatedUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        accessToken: token,
      };

      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(authenticatedUser));

      return authenticatedUser;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Login failed');
    }
  }
);

// Load persisted auth
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

// Update User Name
export const updateUserName = createAsyncThunk<string, string, { rejectValue: string }>(
  'auth/updateName',
  async (newName, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as any;
      const currentUser = state.auth.user;

      if (!currentUser) {
        return thunkAPI.rejectWithValue('No user logged in');
      }

      // Create updated user object
      const updatedUser = { 
        ...currentUser, 
        name: newName 
      };

      // Update in AsyncStorage (current session)
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));

      // Update in users database
      const users = await getRegisteredUsers();
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
      
      if (userIndex !== -1) {
        users[userIndex].name = newName;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      }

      return newName;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to update name');
    }
  }
);

// Update Username
export const updateUsername = createAsyncThunk<string, string, { rejectValue: string }>(
  'auth/updateUsername',
  async (newUsername, thunkAPI) => {
    try {
      const state = thunkAPI.getState() as any;
      const currentUser = state.auth.user;

      if (!currentUser) {
        return thunkAPI.rejectWithValue('No user logged in');
      }

      // Check if username exists
      const users = await getRegisteredUsers();
      const usernameExists = users.some(
        (u: any) => u.username === newUsername && u.id !== currentUser.id
      );

      if (usernameExists) {
        return thunkAPI.rejectWithValue('Username already taken');
      }

      // Create updated user object
      const updatedUser = { 
        ...currentUser, 
        username: newUsername 
      };

      // Update in AsyncStorage (current session)
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));

      // Update in users database
      const userIndex = users.findIndex((u: any) => u.id === currentUser.id);
      
      if (userIndex !== -1) {
        users[userIndex].username = newUsername;
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
      }

      return newUsername;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to update username');
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
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = 'idle';
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload || 'Registration failed';
        state.status = 'failed';
      })

      // Login
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

      // Load persisted auth
      .addCase(loadPersistedAuth.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload;
          state.token = action.payload.accessToken;
        }
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.error = null;
      })

      // Update Name
      .addCase(updateUserName.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        if (state.user) {
          state.user = {
            ...state.user,
            name: action.payload
          };
        }
        state.status = 'idle';
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update name';
        state.status = 'failed';
      })

      // Update Username
      .addCase(updateUsername.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUsername.fulfilled, (state, action) => {
        if (state.user) {
          state.user = {
            ...state.user,
            username: action.payload
          };
        }
        state.status = 'idle';
      })
      .addCase(updateUsername.rejected, (state, action) => {
        state.error = action.payload || 'Failed to update username';
        state.status = 'failed';
      });
  },
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;