import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, toFailure } from '../../services/api';
import { clearSession, loadSession, saveSession } from '../../services/session';
import type { ApiFailure, Role, UserProfile } from '../../services/types';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
}

const saved = loadSession();
const initialState: AuthState = {
  user: saved?.user ?? null,
  token: saved?.token ?? null,
  loading: false,
  error: null,
  fieldErrors: {},
};

export const login = createAsyncThunk<
  { token: string; user: UserProfile },
  { email: string; password: string; role: Role },
  { rejectValue: ApiFailure }
>('auth/login', async ({ email, password, role }, { rejectWithValue }) => {
  try {
    const res = await api.login(email.trim(), password, role);
    saveSession(res.token, res.user, res.expiresAt);
    return { token: res.token, user: res.user };
  } catch (e) {
    return rejectWithValue(toFailure(e));
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      clearSession();
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.fieldErrors = {};
    },
    clearAuthError(state) {
      state.error = null;
      state.fieldErrors = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; state.fieldErrors = {}; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message ?? 'Something went wrong. Please try again.';
        state.fieldErrors = action.payload?.fieldErrors ?? {};
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
