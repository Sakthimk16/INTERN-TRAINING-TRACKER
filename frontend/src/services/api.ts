import { getToken } from './session';
import type {
  ApiFailure, AssignmentDetail, AssignmentListItem, CreateAssignmentInput, DashboardSummary,
  LoginResponse, MyAssignmentItem, Role, Status, Trainee,
} from './types';

const BASE_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:5080';

export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string>;
  constructor(status: number, message: string, fieldErrors: Record<string, string> = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) { onUnauthorized = fn; }

/** Turns any thrown value into the shape Redux thunks reject with. */
export function toFailure(e: unknown): ApiFailure {
  if (e instanceof ApiError) return { message: e.message, fieldErrors: e.fieldErrors };
  return { message: 'Something went wrong. Please try again.', fieldErrors: {} };
}

interface RequestOptions { method?: string; body?: unknown; auth?: boolean }

/** The single shared API client: adds the bearer token and normalises errors. */
async function request<T>(path: string, { method = 'GET', body, auth = true }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method, headers, body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check that the API is running and try again.');
  }

  if (res.status === 401 && auth) {
    onUnauthorized?.();
    throw new ApiError(401, 'Your session has expired. Please sign in again.');
  }

  if (!res.ok) {
    let title = '';
    const fieldErrors: Record<string, string> = {};
    try {
      const problem = await res.json();
      title = typeof problem?.title === 'string' ? problem.title : '';
      if (problem?.errors && typeof problem.errors === 'object') {
        for (const [field, messages] of Object.entries(problem.errors as Record<string, string[]>)) {
          if (Array.isArray(messages) && messages.length > 0) fieldErrors[field.charAt(0).toLowerCase() + field.slice(1)] = messages[0];
        }
      }
    } catch { /* body was not JSON */ }
    const fallback = res.status === 403 ? 'You do not have access to this.'
      : res.status === 404 ? 'Not found.'
      : res.status >= 500 ? 'The server had a problem. Please try again.'
      : 'The request could not be completed.';
    throw new ApiError(res.status, title || fallback, fieldErrors);
  }

  return (await res.json()) as T;
}

export const api = {
  login: (email: string, password: string, role: Role) =>
    request<LoginResponse>('/api/auth/login', { method: 'POST', body: { email, password, role }, auth: false }),

  listTrainees: () => request<Trainee[]>('/api/trainees'),
  createTrainee: (name: string, email: string, initialPassword: string) =>
    request<Trainee>('/api/trainees', { method: 'POST', body: { name, email, initialPassword } }),

  listAssignments: () => request<AssignmentListItem[]>('/api/assignments'),
  createAssignment: (input: CreateAssignmentInput) =>
    request<AssignmentDetail>('/api/assignments', { method: 'POST', body: input }),
  listMine: () => request<MyAssignmentItem[]>('/api/assignments/mine'),
  getAssignment: (id: number) => request<AssignmentDetail>(`/api/assignments/${id}`),
  updateStatus: (id: number, status: Status) =>
    request<AssignmentDetail>(`/api/assignments/${id}/status`, { method: 'PATCH', body: { status } }),

  summary: () => request<DashboardSummary>('/api/dashboard/summary'),
};
