**INTERN TRAINING TRACKER**

**Technical Requirements Document**

*Technology, architecture, data, API and security requirements*

| **Document Control**  | **Value**                                                                                  |
|-----------------------|--------------------------------------------------------------------------------------------|
| **Document Type**     | Technical Requirements Document                                                            |
| **Project**           | Intern Training Tracker                                                                    |
| **Version / Date**    | 1.3 / 23 November 2026 (aligned to approved UI design S1–S6)                               |
| **Prepared for**      | Training Lead and Project Reviewer                                                         |
| **Status**            | Practice project – delivery-focused scope                                                  |
| **Target completion** | Tuesday morning, 24 November 2026                                                          |
| **Technology**        | React + TypeScript + Redux Toolkit │ ASP.NET Core Web API (.NET 10) │ MySQL + Dapper │ JWT |

# 1. Purpose

This document defines a minimal technical implementation for Intern Training Tracker, aligned to the six approved UI screens. The application uses the agreed stack: React, TypeScript, Redux Toolkit, ASP.NET Core Web API on .NET 10, MySQL, Dapper and JWT.

# 2. Architecture

Three tiers: React client; ASP.NET Core Web API; MySQL database. React dispatches Redux Toolkit async actions. Requests to protected endpoints include a bearer JWT. The API validates token and role, applies business rules, then uses Dapper parameterized SQL to access MySQL. Responses update Redux state and the visible dashboard.

Flow: React screen → Redux async thunk/service → HTTP API + bearer token → controller/service validation and authorization → Dapper repository → MySQL → response DTO → Redux state → UI.

# 3. Technology Stack

| **Layer**          | **Technology**                                                | **Use**                                                                                                 |
|--------------------|---------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| **Frontend**       | React + TypeScript + Vite                                     | Six screens and reusable forms/tables.                                                                  |
| **Routing**        | React Router                                                  | Role-guarded routes for S1–S6 (see section 9).                                                          |
| **State**          | Redux Toolkit                                                 | Session, loading/error states, trainees, assignments and dashboard summary.                             |
| **UI details**     | Plain CSS (or CSS modules) + an icon set such as lucide-react | Cards, chips, sidebar and icons shown in the design. Suggested, not mandated; no UI framework required. |
| **Backend**        | ASP.NET Core Web API (.NET 10)                                | REST endpoints, validation and business rules.                                                          |
| **Authentication** | JWT Bearer                                                    | Signed token with user ID, name and role claims.                                                        |
| **Database**       | MySQL 8.0.16 or later                                         | Users and assignments (CHECK constraints require 8.0.16+).                                              |
| **Data access**    | Dapper + MySqlConnector                                       | Parameterized SQL and object mapping.                                                                   |
| **Tools**          | Visual Studio / VS Code, Node.js, .NET SDK, MySQL client      | Development and local testing.                                                                          |

# 4. Functional Technical Requirements

| **ID**      | **Requirement**                                                                                                                                                                                                                   |
|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **TR-F-01** | POST /api/auth/login validates email, password and the selected role, and returns a JWT plus a safe profile. Wrong credentials and a role mismatch return the same generic 401.                                                   |
| **TR-F-02** | Trainer can create and list trainee accounts. Email is trimmed, lower-cased and unique.                                                                                                                                           |
| **TR-F-03** | Trainer can create and list assignments. New assignments start as Not Started.                                                                                                                                                    |
| **TR-F-04** | Trainee can retrieve only their own assignments.                                                                                                                                                                                  |
| **TR-F-05** | Owning trainee can update assignment status.                                                                                                                                                                                      |
| **TR-F-06** | Dashboard summary returns role-specific counts (section 7.2): trainer – interns, assignments, not started, in progress, completed, overdue; trainee – total, not started, in progress, completed, overdue and completion percent. |
| **TR-F-07** | All changes persist in MySQL.                                                                                                                                                                                                     |
| **TR-F-08** | The login response and stored session provide name and role for the top-bar label “Role • Name”; the client guards routes by role and sends unauthenticated users to S1.                                                          |
| **TR-F-09** | Validation and conflict responses identify the field so the UI can show inline messages (for example the duplicate-email message under Email on S3).                                                                              |
| **TR-F-10** | Assignment responses include a server-calculated isOverdue flag so list, details and counts use one overdue rule.                                                                                                                 |

# 5. Non-Functional Requirements

- Usability: simple desktop-first layout that remains usable on a phone-sized viewport; the sidebar collapses and panels stack on narrow screens.

- Reliability: show loading and error states; do not show success when API/database save fails; disable Save while a request is running.

- Maintainability: separate React components, Redux slices, API services, controllers/services and Dapper queries.

- Performance: small local dataset; avoid unnecessary pagination/caching complexity.

- Security: hashed passwords, JWT validation, role checks, ownership checks and parameterized SQL.

- Accessibility basics: every input has a label, status is conveyed by text as well as color, and Sign Out and links are keyboard reachable.

# 6. Database Design

Use two core tables for the practice version. One trainee may have zero or more assignments. Each assignment belongs to one trainee and records the trainer who created it. Because there is one trainer, “trainer creates trainee” is a business relationship only; Users has no creator column.

| **Table**   | **Field**             | **Type / rule**                                                                   |
|-------------|-----------------------|-----------------------------------------------------------------------------------|
| Users       | Id                    | INT primary key, auto increment.                                                  |
| Users       | Name                  | VARCHAR(100), required.                                                           |
| Users       | Email                 | VARCHAR(255), required, unique; stored trimmed and lower-case.                    |
| Users       | PasswordHash          | VARCHAR(255), required; hashed only.                                              |
| Users       | Role                  | VARCHAR(20), Trainer or Trainee (CHECK).                                          |
| Users       | CreatedAt             | DATETIME, required, default current time.                                         |
| Assignments | Id                    | INT primary key, auto increment.                                                  |
| Assignments | TraineeId             | INT FK to Users.Id, required.                                                     |
| Assignments | CreatedByTrainerId    | INT FK to Users.Id, required.                                                     |
| Assignments | Topic                 | VARCHAR(200), required.                                                           |
| Assignments | VideoUrl              | VARCHAR(1000), nullable; HTTP/HTTPS only.                                         |
| Assignments | Notes                 | TEXT, nullable (UI limit 2000 characters, assumed).                               |
| Assignments | DueDate               | DATE, nullable.                                                                   |
| Assignments | Status                | VARCHAR(20), default Not Started; CHECK in (Not Started, In Progress, Completed). |
| Assignments | CreatedAt / UpdatedAt | DATETIME, required; UpdatedAt changes on every update.                            |

- Add a unique index on Users.Email and indexes on Assignments.TraineeId and DueDate.

- Use foreign keys for trainee and creator relationships.

- Use date-only due dates; “today” is the API server’s local date (CURDATE()) so overdue comparisons are predictable.

- Overdue is never stored. Calculate it in queries: DueDate IS NOT NULL AND DueDate \< CURDATE() AND Status \<\> 'Completed'.

## 6.1 Reference schema (Database/schema.sql)

> CREATE TABLE Users (
>
> Id INT AUTO_INCREMENT PRIMARY KEY,
>
> Name VARCHAR(100) NOT NULL,
>
> Email VARCHAR(255) NOT NULL,
>
> PasswordHash VARCHAR(255) NOT NULL,
>
> Role VARCHAR(20) NOT NULL,
>
> CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
>
> CONSTRAINT UQ_Users_Email UNIQUE (Email),
>
> CONSTRAINT CK_Users_Role CHECK (Role IN ('Trainer','Trainee'))
>
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
>
> CREATE TABLE Assignments (
>
> Id INT AUTO_INCREMENT PRIMARY KEY,
>
> TraineeId INT NOT NULL,
>
> CreatedByTrainerId INT NOT NULL,
>
> Topic VARCHAR(200) NOT NULL,
>
> VideoUrl VARCHAR(1000) NULL,
>
> Notes TEXT NULL,
>
> DueDate DATE NULL,
>
> Status VARCHAR(20) NOT NULL DEFAULT 'Not Started',
>
> CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
>
> UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
>
> ON UPDATE CURRENT_TIMESTAMP,
>
> CONSTRAINT FK_Assignments_Trainee FOREIGN KEY (TraineeId) REFERENCES Users(Id),
>
> CONSTRAINT FK_Assignments_Trainer FOREIGN KEY (CreatedByTrainerId) REFERENCES Users(Id),
>
> CONSTRAINT CK_Assignments_Status
>
> CHECK (Status IN ('Not Started','In Progress','Completed')),
>
> INDEX IX_Assignments_TraineeId (TraineeId),
>
> INDEX IX_Assignments_DueDate (DueDate)
>
> ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

## 6.2 Seed data (Database/seed.sql)

Provide a versioned, repeatable seed script. Passwords are hashed by a seed helper or the API; do not store plaintext passwords in the script or this document (demo credentials go in the README). The sample values below follow the design images:

| **Seed item**                          | **Content**                                                                                                                                                                                                                                                                                                                                                                                                                            |
|----------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Trainer**                            | Anita (one Trainer account).                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Trainees**                           | Priya Sharma (priya@example.com) and Rahul Verma (rahul@example.com); more trainees optional.                                                                                                                                                                                                                                                                                                                                          |
| **Priya’s assignments (reproduce S5)** | React Basics – In Progress – due 25 Nov 2026 – notes “Build a small React app that renders a list and a form.” – link https://react.dev/learn; SQL Joins – Not Started – due 20 Nov 2026 (shows Overdue); Git Workflow – Completed – due 18 Nov 2026; plus one more Completed and one more Not Started assignment with a future or no due date. Result: Total 5, Not Started 2, In Progress 1, Completed 2, Overdue 1, completion 40%. |
| **Rahul’s assignments**                | At least one assignment, so the trainer lists and ownership checks can be demonstrated.                                                                                                                                                                                                                                                                                                                                                |

> *The design images show SQL Joins under Rahul on S2 but under Priya on S5, and trainer card values (4 / 12 / 5 / 2) that do not match the rows shown. The seed above is internally consistent; the images are treated as illustrative. Seed due dates are fixed, so re-run the seed or adjust dates if the demo date changes.*

# 7. API Design

## 7.1 Endpoints

| **Method and route**               | **Access**               | **Request / response**                                                                                                                                                        |
|------------------------------------|--------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| POST /api/auth/login               | Anonymous                | Request {email, password, role}. 200 {token, expiresAt, user {id, name, email, role}}. 400 missing fields; 401 invalid credentials or role mismatch (same message).           |
| GET /api/trainees                  | Trainer                  | 200 \[{id, name, email}\] ordered by name; never return password hashes.                                                                                                      |
| POST /api/trainees                 | Trainer                  | Request {name, email, initialPassword}. 201 {id, name, email}; 400 validation; 409 duplicate email.                                                                           |
| GET /api/assignments               | Trainer                  | 200 \[{id, traineeId, traineeName, topic, status, dueDate, isOverdue}\] newest first.                                                                                         |
| POST /api/assignments              | Trainer                  | Request {traineeId, topic, videoUrl?, notes?, dueDate?}. 201 assignment detail; 400 validation.                                                                               |
| GET /api/assignments/mine          | Trainee                  | 200 \[{id, topic, status, dueDate, isOverdue}\] for the user ID in the JWT, newest first; not from the query string.                                                          |
| GET /api/assignments/{id}          | Trainer / owning Trainee | 200 detail {id, traineeId, traineeName, topic, notes, videoUrl, dueDate, status, isOverdue, createdAt, updatedAt}; 404 if missing or not owned. The UI uses this for S6 only. |
| PATCH /api/assignments/{id}/status | Owning Trainee           | Request {status}. 200 updated detail; 400 invalid status; 404 not owned.                                                                                                      |
| GET /api/dashboard/summary         | Trainer / Trainee        | 200 role-specific summary (7.2).                                                                                                                                              |

Use consistent HTTP responses: 200 for successful reads/updates, 201 for creation, 400 for validation errors, 401 for missing/invalid token or failed sign-in, 403 for role denial, 404 for unavailable/not-owned records, and 409 for duplicate email.

## 7.2 Dashboard summary payloads

> Trainer: { "role": "Trainer", "internCount": 4, "totalAssignments": 12,
>
> "notStarted": 5, "inProgress": 5, "completed": 2, "overdue": 2 }
>
> Trainee: { "role": "Trainee", "total": 5, "notStarted": 2, "inProgress": 1,
>
> "completed": 2, "overdue": 1, "completionPercent": 40 }

Trainer cards show internCount, totalAssignments, inProgress and overdue. Status counts use the stored status; overdue is counted separately, so notStarted + inProgress + completed = total. Trainer values cover assignments created by the signed-in trainer and all trainees. The example numbers are illustrative.

## 7.3 Validation rules and messages

| **Field**                 | **Rule**                                              | **Message**                                                                                         |
|---------------------------|-------------------------------------------------------|-----------------------------------------------------------------------------------------------------|
| Email (login, add intern) | Required; valid format; max 255; unique on create     | “Email is required.” / “Enter a valid email address.” / “An account with this email already exists” |
| Password (login)          | Required                                              | “Password is required.”                                                                             |
| Initial password          | Required; 8–100 characters (assumed)                  | “Initial password is required.” / “Use at least 8 characters.”                                      |
| Name                      | Required; max 100                                     | “Name is required.”                                                                                 |
| Role (login)              | Trainer or Trainee                                    | Generic sign-in error on mismatch                                                                   |
| traineeId                 | Required; must be an existing Trainee user            | “Select a trainee.”                                                                                 |
| Topic                     | Required; max 200                                     | “Topic is required.”                                                                                |
| Video URL                 | Optional; absolute http/https; max 1000               | “Enter a valid http:// or https:// link.”                                                           |
| Notes                     | Optional; max 2000 (assumed)                          | “Notes are too long.”                                                                               |
| Due date                  | Optional; valid date (yyyy-MM-dd); past dates allowed | “Enter a valid date.”                                                                               |
| Status                    | Not Started, In Progress or Completed                 | “Select a valid status.”                                                                            |

Error body: use ASP.NET Core ValidationProblemDetails — {title, status, errors: {fieldName: \[messages\]}}. A duplicate email returns 409 with errors.email so the client can show it under the Email field. Sign-in failures return 401 with title “Invalid email or password.”

# 8. Security Requirements

- Use a vetted password hasher such as ASP.NET Core PasswordHasher; never store or log plaintext passwords.

- Keep JWT signing secret and DB credentials in local configuration/environment variables; do not commit them.

- Validate token signature, issuer, audience and expiry as configured. Token lifetime is a configuration value (suggested 8 hours for the demo). On a 401 the client clears the session and returns to S1.

- Use role policies for Trainer and Trainee endpoints. Sign-in succeeds only when the user’s stored role equals the role sent from the S1 selector.

- Derive trainee ID from validated JWT claims; never trust a client-supplied trainee ID for ownership.

- Use parameterized Dapper queries; validate inputs and allow only HTTP/HTTPS URLs.

- Render Notes and Topic as text (React escapes by default); open resource links with rel="noopener noreferrer".

- Do not include PasswordHash in response DTOs or logs.

# 9. Frontend Technical Design

## 9.1 Routes

| **Route**                    | **Screen** | **Role**  | **Notes**                                                     |
|------------------------------|------------|-----------|---------------------------------------------------------------|
| **/login**                   | S1         | Anonymous | Signed-in users are redirected to their landing route.        |
| **/trainer**                 | S2         | Trainer   | Optional \#interns / \#assignments anchors for sidebar items. |
| **/trainer/interns/new**     | S3         | Trainer   | Sidebar highlights Interns.                                   |
| **/trainer/assignments/new** | S4         | Trainer   | Sidebar highlights Assignments.                               |
| **/trainee**                 | S5         | Trainee   | Optional \#assignments anchor for My Assignments.             |
| **/trainee/assignments/:id** | S6         | Trainee   | Sidebar highlights My Assignments.                            |

A role guard redirects unauthenticated users to /login and sends a signed-in user who opens the other role’s route to their own landing route.

## 9.2 Shared components

| **Component**   | **Responsibility**                                                   |
|-----------------|----------------------------------------------------------------------|
| **AppShell**    | Top bar + sidebar + content area for S2–S6; login uses no shell.     |
| **TopBar**      | Logo/project name, “Role • Name” label, outlined Sign Out button.    |
| **Sidebar**     | Role-based items with active highlight; collapses on narrow screens. |
| **SummaryCard** | Icon, label, number.                                                 |
| **StatusChip**  | Pill by status; renders Overdue when isOverdue is true.              |
| **ProgressBar** | Completion bar with percentage (S5).                                 |
| **Toast**       | Transient success message; auto-dismiss.                             |
| **FormField**   | Label, required marker, icon, input and inline error.                |

# 10. Integration and Deployment

- Video links are external links; no video provider API or upload is included.

- No email, SMS, calendar, HR, analytics or external identity integration.

- Run frontend, API and MySQL locally for the deadline demo.

- Document frontend/API/database startup order, schema/seed command, API base URL, CORS origin and placeholder configuration in README. Configuration keys: ConnectionStrings:Default, Jwt:Issuer, Jwt:Audience, Jwt:Secret, Jwt:ExpiryMinutes, Cors:AllowedOrigins.

- Public hosting is optional and excluded from the delivery critical path.

# 11. Minimal Project Structure

| **Area**     | **Suggested folders/files**                                                                                                                                                                                                                                                                                                                                      |
|--------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Frontend** | src/app/store.ts; src/app/routes.tsx; src/features/auth; src/features/trainees; src/features/assignments; src/features/dashboard; src/pages (Login, TrainerDashboard, AddIntern, CreateAssignment, TraineeDashboard, AssignmentDetails); src/components (AppShell, TopBar, Sidebar, SummaryCard, StatusChip, ProgressBar, Toast, FormField); src/services/api.ts |
| **Backend**  | Controllers; Services; Repositories; DTOs; Models; Program.cs; appsettings.Development.json (local only)                                                                                                                                                                                                                                                         |
| **Database** | Database/schema.sql; Database/seed.sql                                                                                                                                                                                                                                                                                                                           |

# 12. Testing Requirements

- Login succeeds for trainer and trainee with the matching role selected; invalid credentials and a wrong role selection are rejected with the same message.

- Trainer can create trainee and assignment; duplicate email (any letter case) is rejected with the inline message.

- Trainee sees only own assignments and cannot access another trainee’s record.

- All three status values save; dashboard counts and the progress percentage refresh correctly.

- Past-due incomplete item is overdue; completed item and an item due today are not.

- Missing required fields, short passwords and invalid URLs are rejected.

- API/database failure is visible and never presented as a successful save.

- Routes are role-guarded; sidebar items and active highlights match the design.

# Revision Notes (v1.3)

Version 1.3 aligns this document with the six approved UI design screens (S1–S6). Changes from v1.2:

- Login contract now includes the selected role (TR-F-01); added TR-F-08 to TR-F-10 for the top-bar profile, field-level errors and the isOverdue flag.

- Added DTO shapes, summary payloads, validation messages and error body format that the screens need.

- Added reference schema (with CHECK constraints and indexes), seed data that reproduces the S5 design numbers, route table and shared components (shell, chip, progress bar, toast).

- Standardized status values to Not Started / In Progress / Completed.

- Items marked “assumed” or “suggested” (password length, notes limit, token lifetime, UI libraries) need confirmation.
