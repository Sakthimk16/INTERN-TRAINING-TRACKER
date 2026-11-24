export type Role = 'Trainer' | 'Trainee';
export type Status = 'Not Started' | 'In Progress' | 'Completed';
export const STATUSES: Status[] = ['Not Started', 'In Progress', 'Completed'];

export interface UserProfile { id: number; name: string; email: string; role: Role }
export interface LoginResponse { token: string; expiresAt: string; user: UserProfile }

export interface Trainee { id: number; name: string; email: string }

export interface AssignmentListItem {
  id: number; traineeId: number; traineeName: string; topic: string;
  status: Status; dueDate: string | null; isOverdue: boolean;
}
export interface MyAssignmentItem {
  id: number; topic: string; status: Status; dueDate: string | null; isOverdue: boolean;
}
export interface AssignmentDetail {
  id: number; traineeId: number; traineeName: string; topic: string;
  notes: string | null; videoUrl: string | null; dueDate: string | null;
  status: Status; isOverdue: boolean; createdAt: string; updatedAt: string;
}

export interface TrainerSummary {
  role: 'Trainer'; internCount: number; totalAssignments: number;
  notStarted: number; inProgress: number; completed: number; overdue: number;
}
export interface TraineeSummary {
  role: 'Trainee'; total: number; notStarted: number; inProgress: number;
  completed: number; overdue: number; completionPercent: number;
}
export type DashboardSummary = TrainerSummary | TraineeSummary;

/** Error shape every failed thunk rejects with: a readable message plus per-field messages. */
export interface ApiFailure { message: string; fieldErrors: Record<string, string> }

export interface CreateAssignmentInput {
  traineeId: number; topic: string; videoUrl?: string; notes?: string; dueDate?: string;
}
