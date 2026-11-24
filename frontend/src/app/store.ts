import { configureStore } from '@reduxjs/toolkit';
import auth from '../features/auth/authSlice';
import trainees from '../features/trainees/traineesSlice';
import assignments from '../features/assignments/assignmentsSlice';
import dashboard from '../features/dashboard/dashboardSlice';

export const store = configureStore({
  reducer: { auth, trainees, assignments, dashboard },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
