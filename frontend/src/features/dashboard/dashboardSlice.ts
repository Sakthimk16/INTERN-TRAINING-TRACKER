import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, toFailure } from '../../services/api';
import { logout } from '../auth/authSlice';
import type { ApiFailure, DashboardSummary } from '../../services/types';

interface DashboardState {
  summary: DashboardSummary | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = { summary: null, loading: false, error: null };

export const fetchSummary = createAsyncThunk<DashboardSummary, void, { rejectValue: ApiFailure }>(
  'dashboard/fetchSummary',
  async (_, { rejectWithValue }) => {
    try { return await api.summary(); } catch (e) { return rejectWithValue(toFailure(e)); }
  },
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSummary.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchSummary.fulfilled, (s, a) => { s.loading = false; s.summary = a.payload; })
      .addCase(fetchSummary.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message ?? 'Could not load the summary.'; })
      .addCase(logout, () => initialState);
  },
});

export default dashboardSlice.reducer;
