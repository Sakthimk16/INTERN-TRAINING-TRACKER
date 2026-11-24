import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, toFailure } from '../../services/api';
import { logout } from '../auth/authSlice';
import type { ApiFailure, Trainee } from '../../services/types';

interface TraineesState {
  items: Trainee[];
  loading: boolean;
  error: string | null;
  saving: boolean;
}

const initialState: TraineesState = { items: [], loading: false, error: null, saving: false };

export const fetchTrainees = createAsyncThunk<Trainee[], void, { rejectValue: ApiFailure }>(
  'trainees/fetch',
  async (_, { rejectWithValue }) => {
    try { return await api.listTrainees(); } catch (e) { return rejectWithValue(toFailure(e)); }
  },
);

export const addTrainee = createAsyncThunk<
  Trainee,
  { name: string; email: string; initialPassword: string },
  { rejectValue: ApiFailure }
>('trainees/add', async ({ name, email, initialPassword }, { rejectWithValue }) => {
  try { return await api.createTrainee(name.trim(), email.trim(), initialPassword); }
  catch (e) { return rejectWithValue(toFailure(e)); }
});

const traineesSlice = createSlice({
  name: 'trainees',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrainees.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTrainees.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchTrainees.rejected, (s, a) => { s.loading = false; s.error = a.payload?.message ?? 'Could not load interns.'; })
      .addCase(addTrainee.pending, (s) => { s.saving = true; })
      .addCase(addTrainee.fulfilled, (s) => { s.saving = false; })
      .addCase(addTrainee.rejected, (s) => { s.saving = false; })
      .addCase(logout, () => initialState);
  },
});

export default traineesSlice.reducer;
