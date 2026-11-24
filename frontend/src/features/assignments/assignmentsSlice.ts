import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api, toFailure } from '../../services/api';
import { logout } from '../auth/authSlice';
import type {
  ApiFailure, AssignmentDetail, AssignmentListItem, CreateAssignmentInput, MyAssignmentItem, Status,
} from '../../services/types';

interface AssignmentsState {
  all: AssignmentListItem[];       // trainer list (S2)
  allLoading: boolean;
  allError: string | null;
  mine: MyAssignmentItem[];        // trainee list (S5)
  mineLoading: boolean;
  mineError: string | null;
  current: AssignmentDetail | null; // S6
  currentLoading: boolean;
  currentError: string | null;
  saving: boolean;
}

const initialState: AssignmentsState = {
  all: [], allLoading: false, allError: null,
  mine: [], mineLoading: false, mineError: null,
  current: null, currentLoading: false, currentError: null,
  saving: false,
};

type Cfg = { rejectValue: ApiFailure };

export const fetchAllAssignments = createAsyncThunk<AssignmentListItem[], void, Cfg>(
  'assignments/fetchAll',
  async (_, { rejectWithValue }) => {
    try { return await api.listAssignments(); } catch (e) { return rejectWithValue(toFailure(e)); }
  },
);

export const fetchMyAssignments = createAsyncThunk<MyAssignmentItem[], void, Cfg>(
  'assignments/fetchMine',
  async (_, { rejectWithValue }) => {
    try { return await api.listMine(); } catch (e) { return rejectWithValue(toFailure(e)); }
  },
);

export const fetchAssignment = createAsyncThunk<AssignmentDetail, number, Cfg>(
  'assignments/fetchOne',
  async (id, { rejectWithValue }) => {
    try { return await api.getAssignment(id); } catch (e) { return rejectWithValue(toFailure(e)); }
  },
);

export const createAssignment = createAsyncThunk<AssignmentDetail, CreateAssignmentInput, Cfg>(
  'assignments/create',
  async (input, { rejectWithValue }) => {
    try { return await api.createAssignment(input); } catch (e) { return rejectWithValue(toFailure(e)); }
  },
);

export const updateAssignmentStatus = createAsyncThunk<AssignmentDetail, { id: number; status: Status }, Cfg>(
  'assignments/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try { return await api.updateStatus(id, status); } catch (e) { return rejectWithValue(toFailure(e)); }
  },
);

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAssignments.pending, (s) => { s.allLoading = true; s.allError = null; })
      .addCase(fetchAllAssignments.fulfilled, (s, a) => { s.allLoading = false; s.all = a.payload; })
      .addCase(fetchAllAssignments.rejected, (s, a) => { s.allLoading = false; s.allError = a.payload?.message ?? 'Could not load assignments.'; })

      .addCase(fetchMyAssignments.pending, (s) => { s.mineLoading = true; s.mineError = null; })
      .addCase(fetchMyAssignments.fulfilled, (s, a) => { s.mineLoading = false; s.mine = a.payload; })
      .addCase(fetchMyAssignments.rejected, (s, a) => { s.mineLoading = false; s.mineError = a.payload?.message ?? 'Could not load assignments.'; })

      .addCase(fetchAssignment.pending, (s) => { s.currentLoading = true; s.currentError = null; s.current = null; })
      .addCase(fetchAssignment.fulfilled, (s, a) => { s.currentLoading = false; s.current = a.payload; })
      .addCase(fetchAssignment.rejected, (s, a) => { s.currentLoading = false; s.currentError = a.payload?.message ?? 'Could not load the assignment.'; })

      .addCase(createAssignment.pending, (s) => { s.saving = true; })
      .addCase(createAssignment.fulfilled, (s) => { s.saving = false; })
      .addCase(createAssignment.rejected, (s) => { s.saving = false; })

      .addCase(updateAssignmentStatus.pending, (s) => { s.saving = true; })
      .addCase(updateAssignmentStatus.fulfilled, (s, a) => {
        s.saving = false;
        s.current = a.payload; // chip updates in place
        const row = s.mine.find((m) => m.id === a.payload.id);
        if (row) { row.status = a.payload.status; row.isOverdue = a.payload.isOverdue; }
      })
      .addCase(updateAssignmentStatus.rejected, (s) => { s.saving = false; })

      .addCase(logout, () => initialState);
  },
});

export default assignmentsSlice.reducer;
