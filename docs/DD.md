**INTERN TRAINING TRACKER**

**Detailed Design Document**

*Screen-level design, workflows, database, API and implementation notes*

| **Document Control**  | **Value**                                                                                  |
|-----------------------|--------------------------------------------------------------------------------------------|
| **Document Type**     | Detailed Design Document                                                                   |
| **Project**           | Intern Training Tracker                                                                    |
| **Version / Date**    | 1.3 / 23 November 2026 (aligned to approved UI design S1–S6)                               |
| **Prepared for**      | Training Lead and Project Reviewer                                                         |
| **Status**            | Practice project – delivery-focused scope                                                  |
| **Target completion** | Tuesday morning, 24 November 2026                                                          |
| **Technology**        | React + TypeScript + Redux Toolkit │ ASP.NET Core Web API (.NET 10) │ MySQL + Dapper │ JWT |

# 1. Executive Summary

The Intern Training Tracker is a minimal full-stack practice application. Trainer creates intern accounts and learning assignments; each trainee views their own work, updates status and sees their own completion progress. The build is deliberately limited to six pages and one transient save-confirmation state, plus a shared top bar and sidebar. This version of the document is written from the six approved design images (S1–S6), which are embedded in section 4.

# 2. Scope and Design Principles

- Build only the core trainer-to-trainee workflow required for the demo.

- Match the approved design: cards, tables, status chips, icons, top bar and sidebar. Avoid animations and complex design systems.

- Use one reusable shell (top bar + role-based sidebar) for every signed-in screen; the login screen has no shell.

- Keep loading, empty, validation and error feedback inside the relevant page.

- Complete backend persistence and access control before optional visual polish.

# 3. System Architecture

React + TypeScript renders pages. Redux Toolkit stores session and fetched feature data. API service functions call ASP.NET Core endpoints with the JWT bearer token. Controllers call services; services validate business rules and call Dapper repositories. MySQL stores users and assignments. The technical details, DTOs and schema are in the TRD.

# 4. Screen Inventory and Detailed UI Design

| **ID** | **Screen**         | **Role** | **Route**                | **Sidebar highlight**                                     |
|--------|--------------------|----------|--------------------------|-----------------------------------------------------------|
| S1     | Login              | Both     | /login                   | No shell                                                  |
| S2     | Trainer Dashboard  | Trainer  | /trainer                 | Dashboard (Interns / Assignments when jumping to a panel) |
| S3     | Add Intern         | Trainer  | /trainer/interns/new     | Interns                                                   |
| S4     | Create Assignment  | Trainer  | /trainer/assignments/new | Assignments                                               |
| S5     | Trainee Dashboard  | Trainee  | /trainee                 | My Dashboard (My Assignments when jumping to the list)    |
| S6     | Assignment Details | Trainee  | /trainee/assignments/:id | My Assignments                                            |

The Saved Confirmation is a transient success alert/toast after a successful save, not a separate route or page. Loading, empty, validation, and error messages are states within the relevant screen, not additional screens. Thus the agreed build contains 6 pages/screens and 1 reusable confirmation state.

## 4.1 Application Shell (S2–S6)

| **Area**           | **Design and behavior**                                                                                                                                                                                                                                                                                                              |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Top bar**        | White bar across the page. Left: graduation-cap logo and “Intern Training Tracker”. Right: “Role • Name” label with a small chevron (for example “Trainer • Anita”, “Trainee • Priya”) and an outlined Sign Out button. The label and chevron are informational in this release (no menu). Sign Out clears the session and opens S1. |
| **Sidebar**        | Left column on a light background. Trainer items: Dashboard, Interns, Assignments. Trainee items: My Dashboard, My Assignments. Each item has an icon; the active item has a light-blue pill with blue text. Interns, Assignments and My Assignments jump to the matching panel on the dashboard (no extra screens).                 |
| **Content area**   | Light page background; page heading (S2 and S5) or “← Back to Dashboard” link (S3, S4, S6) above white rounded cards with soft shadow.                                                                                                                                                                                               |
| **Narrow screens** | Sidebar collapses behind a menu button; summary cards wrap; the two dashboard panels stack; form labels sit above inputs.                                                                                                                                                                                                            |

## 4.2 S1 Login

<img src="media/223e9861930647f669a70903c0634f2b268a9acc.png" title="Figure 1 – S1 Login (approved design)" style="width:4.79167in;height:2.69792in" alt="Figure 1 – S1 Login (approved design)" />

*Figure 1 – S1 Login (approved design)*

| **Element**            | **Design detail (from the image)**                                                        | **Behavior / data**                                                                                                                    |
|------------------------|-------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| **Page**               | Pale-blue background with two large soft circles; logo and project name top-left.         | No shell. Signed-in users are redirected to their landing route.                                                                       |
| **Card header**        | Graduation-cap icon, bold “Sign in”, subtitle “to your account”.                          | —                                                                                                                                      |
| **Role selector**      | Two-option pill: Trainer (selected, blue fill) and Trainee, each with an icon.            | Default Trainer. The selected value is sent as role in the login request; the API rejects credentials that do not belong to that role. |
| **Email**              | Label “Email”; input with envelope icon; placeholder “Enter your email”.                  | Required; valid format; trimmed.                                                                                                       |
| **Password**           | Label “Password”; input with lock icon; placeholder “Enter your password”.                | Required; masked.                                                                                                                      |
| **Sign In**            | Full-width blue button with sign-in icon.                                                 | Validates, calls POST /api/auth/login, stores token and profile, routes Trainer to S2 and Trainee to S5. Disabled while loading.       |
| **Error**              | Not drawn in the design; red text above the button.                                       | Generic “Invalid email or password.” for wrong credentials or role; field messages for empty or malformed input.                       |
| **“or” and help text** | Divider with “or”; “New here? Contact your admin” with the last two words as a blue link. | Informational only; no registration page. May open a mailto to a placeholder address.                                                  |

## 4.3 S2 Trainer Dashboard

<img src="media/6826ac4f2d20dc28e8fb7a2fd61f416193849244.png" title="Figure 2 – S2 Trainer Dashboard (approved design)" style="width:6.25in;height:3.10417in" alt="Figure 2 – S2 Trainer Dashboard (approved design)" />

*Figure 2 – S2 Trainer Dashboard (approved design)*

| **Element**           | **Design detail (from the image)**                                                                                            | **Behavior / data**                                                                                                                                                                                      |
|-----------------------|-------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Heading**           | “Dashboard”.                                                                                                                  | —                                                                                                                                                                                                        |
| **Card: Interns**     | Blue people icon, label “Interns”, number (sample 4).                                                                         | internCount from GET /api/dashboard/summary.                                                                                                                                                             |
| **Card: Assignments** | Blue clipboard icon, “Assignments”, number (sample 12).                                                                       | totalAssignments.                                                                                                                                                                                        |
| **Card: In Progress** | Blue ring icon, “In Progress”, number (sample 5).                                                                             | inProgress (stored status).                                                                                                                                                                              |
| **Card: Overdue**     | Orange warning icon on a warm tint, “Overdue”, number (sample 2).                                                             | overdue (calculated).                                                                                                                                                                                    |
| **Interns panel**     | Title “Interns”; blue “+ Add Intern” button; table with Name and Email columns on a grey header row.                          | GET /api/trainees, name A–Z. Button opens S3. Empty state: “No interns yet” with the Add Intern action.                                                                                                  |
| **Assignments panel** | Title “Assignments”; blue “+ Create Assignment” button; columns Topic, Trainee, Status (chip), Due Date (for example 25 Nov). | GET /api/assignments, newest first. Overdue rows show the orange Overdue chip. Rows are read-only (no Open action for the trainer). Empty state: “No assignments yet” with the Create Assignment action. |
| **Layout**            | Cards in one row; Interns panel narrower on the left, Assignments panel wider on the right.                                   | Panels stack on narrow screens.                                                                                                                                                                          |

> *The sample rows in the image are a subset (2 interns, 3 assignments) of the sample totals (4 and 12). Build the tables to show all records returned by the API.*

## 4.4 S3 Add Intern

<img src="media/0ef4a33f63d3ab75551fb07d6aea5abc74730ed6.png" title="Figure 3 – S3 Add Intern (approved design, duplicate-email error shown)" style="width:6.25in;height:2.53125in" alt="Figure 3 – S3 Add Intern (approved design, duplicate-email error shown)" />

*Figure 3 – S3 Add Intern (approved design, duplicate-email error shown)*

| **Element**             | **Design detail (from the image)**                                                               | **Behavior / data**                                                                                                                                                                      |
|-------------------------|--------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Back link**           | Blue “← Back to Dashboard” above the card.                                                       | Returns to S2.                                                                                                                                                                           |
| **Card**                | Heading “Add Intern”; labels on the left, inputs on the right, red asterisks on required labels. | Stacks labels above inputs on narrow screens.                                                                                                                                            |
| **Name \***             | Input with leading icon; placeholder “Enter intern name”.                                        | Required; max 100.                                                                                                                                                                       |
| **Email \***            | Input with envelope icon; placeholder “Enter email address”.                                     | Required; valid format; unique. A 409 response shows “An account with this email already exists” in red with a warning icon directly under the field.                                    |
| **Initial Password \*** | Input with leading icon; placeholder “Enter initial password”.                                   | Required; minimum 8 characters; masked. Hashed by the API.                                                                                                                               |
| **Save / Cancel**       | Blue Save button; outlined Cancel button.                                                        | Save posts POST /api/trainees; success shows the toast “Intern added” and returns to S2 with refreshed lists. Cancel returns to S2 without saving. Entered values are kept on any error. |
| **Sidebar**             | Interns is highlighted.                                                                          | —                                                                                                                                                                                        |

> *The mockup repeats the envelope icon on all three inputs; use a person icon for Name and a lock icon for Password for clarity.*

## 4.5 S4 Create Assignment

<img src="media/68ee96615322b5beb78fb265130a6866fb1982b7.png" title="Figure 4 – S4 Create Assignment (approved design)" style="width:6.25in;height:2.58333in" alt="Figure 4 – S4 Create Assignment (approved design)" />

*Figure 4 – S4 Create Assignment (approved design)*

| **Element**              | **Design detail (from the image)**                        | **Behavior / data**                                                                                                       |
|--------------------------|-----------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------|
| **Back link**            | “← Back to Dashboard”.                                    | Returns to S2.                                                                                                            |
| **Trainee \***           | Dropdown with placeholder “Select a trainee” and chevron. | Loaded from GET /api/trainees. Required.                                                                                  |
| **Topic \***             | Input with document icon; placeholder “Enter topic”.      | Required; max 200.                                                                                                        |
| **Video URL (optional)** | Input; placeholder “https://...”.                         | If entered must be an HTTP/HTTPS URL; max 1000.                                                                           |
| **Notes (optional)**     | Multi-line text area; placeholder “Enter notes...”.       | Max 2000 characters (assumed).                                                                                            |
| **Due Date (optional)**  | Date input with calendar icon; placeholder “Select date”. | Native date picker; past dates accepted; sent as yyyy-MM-dd.                                                              |
| **Save / Cancel**        | Blue Save; outlined Cancel.                               | POST /api/assignments; success shows the toast “Assignment created”, returns to S2. New assignment status is Not Started. |
| **Sidebar**              | Assignments is highlighted.                               | —                                                                                                                         |

## 4.6 S5 Trainee Dashboard

<img src="media/f7dbb9b788f8061af2173ae8be6edacbe9291384.png" title="Figure 5 – S5 Trainee Dashboard (approved design)" style="width:6.25in;height:2.60417in" alt="Figure 5 – S5 Trainee Dashboard (approved design)" />

*Figure 5 – S5 Trainee Dashboard (approved design)*

| **Element**        | **Design detail (from the image)**                                                                                                                              | **Behavior / data**                                                                                                                     |
|--------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| **Heading**        | “My Dashboard”.                                                                                                                                                 | —                                                                                                                                       |
| **Cards**          | Total (5), Not Started (2), In Progress (1), Completed (2), Overdue (1); each with an icon (blue people, grey warning, blue ring, green check, orange warning). | From GET /api/dashboard/summary. Not Started + In Progress + Completed = Total; Overdue is counted separately.                          |
| **Completion**     | Card titled “Completion” with a blue progress bar and the percentage on the right (40%).                                                                        | completionPercent from the summary; bar width equals the percentage; 0% when there are no assignments.                                  |
| **My Assignments** | Panel table with Topic, Status (chip), Due Date and an Action column with a blue “Open \>” link.                                                                | GET /api/assignments/mine, newest first. Overdue rows show the orange Overdue chip. Open goes to S6. Empty state: “No assignments yet.” |
| **Sidebar**        | My Dashboard highlighted; My Assignments below it.                                                                                                              | My Assignments jumps to the list.                                                                                                       |

> *Image check: 2 + 1 + 2 = 5 and 2 ÷ 5 = 40%, so the overdue item (SQL Joins) is also counted in a status card (Not Started). This confirms Overdue is an overlay, not a separate status.*

## 4.7 S6 Assignment Details

<img src="media/cbddb651ee6fe3011188c27b5a0130ea87433efc.png" title="Figure 6 – S6 Assignment Details (approved design)" style="width:6.25in;height:2.5625in" alt="Figure 6 – S6 Assignment Details (approved design)" />

*Figure 6 – S6 Assignment Details (approved design)*

| **Element**       | **Design detail (from the image)**                                                                     | **Behavior / data**                                                                                                                                                                                                                       |
|-------------------|--------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Back link**     | “← Back to Dashboard”.                                                                                 | Returns to S5 with refreshed data.                                                                                                                                                                                                        |
| **Title row**     | Topic in large bold text with the status chip beside it (In Progress).                                 | Chip shows the stored status, or Overdue when isOverdue is true.                                                                                                                                                                          |
| **Due date**      | Calendar icon and “Due date: 25 Nov 2026”.                                                             | Shows “No due date” when empty.                                                                                                                                                                                                           |
| **Notes**         | Bold label “Notes” and the note text.                                                                  | Shows “No notes” when empty. Rendered as plain text.                                                                                                                                                                                      |
| **Resource**      | Bold label “Resource”; blue link with link icon and an open-in-new-tab icon (https://react.dev/learn). | Opens in a new tab (target=\_blank, rel=noopener noreferrer). The section is hidden when there is no video URL.                                                                                                                           |
| **Update status** | Divider, label “Update status”, dropdown showing the current value, blue Save button inline.           | Options: Not Started, In Progress, Completed. Save calls PATCH /api/assignments/{id}/status; success shows the toast “Status updated”, updates the chip in place and refreshes summaries. Failure shows an error and keeps the selection. |
| **Sidebar**       | My Assignments highlighted (none highlighted in the image).                                            | —                                                                                                                                                                                                                                         |

## 4.8 Shared UI States

| **State**      | **Display rule**                                                                                                                       |
|----------------|----------------------------------------------------------------------------------------------------------------------------------------|
| **Loading**    | Show a small text or spinner in the page section being loaded; disable duplicate submit.                                               |
| **Empty**      | Show a short message and relevant next action; do not show fake rows.                                                                  |
| **Validation** | Show field-level message beside invalid input (red text, warning icon for conflicts); retain entered values.                           |
| **Success**    | Brief toast: “Intern added”, “Assignment created”, “Status updated”; no dedicated confirmation route. Never shown when the save fails. |
| **Error**      | Show a readable error message; keep form open and do not clear values. A 401 clears the session and returns to S1.                     |

## 4.9 Visual Guidelines (derived from the design)

- Light page background (about \#F3F7FD), white rounded cards with a soft shadow, readable dark navy text.

- One primary accent: blue (about \#2A6CF6) for primary buttons, links, the selected role and the active sidebar item. Colors are sampled from the mockups; adjust to taste.

- Primary button: filled blue. Secondary button (Cancel, Sign Out): white with a blue outline.

- Simple line icons (graduation cap, people, clipboard, ring, warning, check, calendar, link, envelope, lock).

- Consistent input widths, labels and red required asterisks; one icon per input.

| **Status chip** | **Suggested colors**                            | **Use**                                                |
|-----------------|-------------------------------------------------|--------------------------------------------------------|
| **Not Started** | Light grey fill, dark grey text                 | Stored status.                                         |
| **In Progress** | Light blue fill (about \#D9EBFE), blue text     | Stored status.                                         |
| **Completed**   | Light green fill (about \#DDF6E5), green text   | Stored status.                                         |
| **Overdue**     | Light orange fill (about \#FEEED6), orange text | Calculated; replaces the status label on overdue rows. |

- Chips always carry text; do not rely on color alone.

- Dates: “25 Nov” in lists (year added when not the current year); “25 Nov 2026” on S6.

# 5. Database Design and Relationships

Users(Id, Name, Email, PasswordHash, Role, CreatedAt). Assignments(Id, TraineeId, CreatedByTrainerId, Topic, VideoUrl, Notes, DueDate, Status, CreatedAt, UpdatedAt). Users.Email is unique and stored lower-case. Assignments.TraineeId and CreatedByTrainerId reference Users.Id. Status holds Not Started, In Progress or Completed; Overdue is never stored.

Relationship: one Trainer creates zero or more Trainee users (a business relationship; no column is needed for a single trainer); one Trainee owns zero or more Assignments; each Assignment has exactly one Trainee and one creating Trainer. The full DDL and seed data are in the TRD (sections 6.1 and 6.2).

# 6. Workflow

1.  Open S1, keep Trainer selected, sign in → trainer dashboard (S2).

2.  Add intern (S3) → validate → save trainee → toast → back to S2 with refreshed lists.

3.  Create assignment (S4) → select trainee and topic → validate → save → toast → S2 refreshed.

4.  Sign out; on S1 select Trainee, sign in → trainee dashboard (S5) → Open an assignment (S6).

5.  Review notes and resource → choose status → Save → toast, chip and summaries update.

6.  Back to Dashboard (S5) shows updated cards and progress bar. Sign out clears client session and returns to S1.

# 7. Core Business Algorithms

## 7.1 Completion Percentage

total = count of assignments in the current user’s scope. completed = count where Status = Completed. If total = 0, completionPercent = 0; otherwise completionPercent = round(completed / total × 100). The S5 progress bar width equals completionPercent.

## 7.2 Overdue

An assignment is overdue when DueDate is not null AND DueDate is earlier than today’s date (server local date) AND Status is not Completed. Due today is not overdue. The API returns isOverdue; the UI shows the Overdue chip when it is true.

## 7.3 Trainee Ownership

For every trainee read/update, obtain traineeId from the validated JWT claim and include it in the database predicate. A request containing another trainee’s assignment ID must not bypass this check (return 404).

## 7.4 Summary Card Counts

Status cards count the stored Status; the Overdue card counts the overdue rule. Therefore notStarted + inProgress + completed = total, and an overdue item is counted both in its status card and in Overdue.

## 7.5 Role Check at Sign-In

The API finds the user by email, verifies the password hash and then compares the stored Role with the role sent from the S1 selector. Any failure returns the same 401 message.

# 8. API Design

Use the routes, DTOs, validation messages and access rules defined in the TRD. The frontend should call the API through a single shared API client that adds the bearer token. Keep request/response DTOs separate from database entities.

| **Endpoint**                       | **Screen** | **Purpose**                                         |
|------------------------------------|------------|-----------------------------------------------------|
| POST /api/auth/login               | S1         | Email, password, selected role → token and profile. |
| GET /api/trainees                  | S2, S4     | Intern table; trainee dropdown.                     |
| POST /api/trainees                 | S3         | Create intern.                                      |
| GET /api/assignments               | S2         | Trainer assignment table.                           |
| POST /api/assignments              | S4         | Create assignment.                                  |
| GET /api/assignments/mine          | S5         | Trainee’s own list.                                 |
| GET /api/assignments/{id}          | S6         | Details with ownership check.                       |
| PATCH /api/assignments/{id}/status | S6         | Save status.                                        |
| GET /api/dashboard/summary         | S2, S5     | Role-specific cards and completion percent.         |

# 9. Redux and Frontend Modules

| **Module**            | **Responsibilities**                                                                                                                                   |
|-----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| **authSlice**         | Login/logout, token, user profile (id, name, role), authentication loading/error. The role chosen on S1 is local form state sent with the login thunk. |
| **traineesSlice**     | Trainer trainee list and create operation, including field errors such as duplicate email.                                                             |
| **assignmentsSlice**  | Trainer assignment list, trainee’s own list, selected detail and status update, including save status.                                                 |
| **dashboardSlice**    | Summary values for the cards and completion percent; refetched after create or status update.                                                          |
| **uiSlice (toast)**   | Message and visibility of the transient success toast.                                                                                                 |
| **apiClient**         | Base URL, bearer token header, common error handling (401 → sign out).                                                                                 |
| **Shared components** | AppShell, TopBar, Sidebar, SummaryCard, StatusChip, ProgressBar, Toast, FormField (see TRD 9.2).                                                       |

# 10. Security Design

- Hash initial passwords on the server; do not return password hashes.

- Use JWT bearer authentication and role authorization on protected endpoints; sign-in checks the selected role.

- Use server-side ownership predicates for trainee records.

- Use parameterized SQL with Dapper.

- Validate required values, status enum and HTTP/HTTPS resource URLs.

- Keep local secrets out of source control.

# 11. Deployment and Configuration

- Create MySQL database and run schema.sql then seed.sql.

- Set connection string and JWT signing secret in local API configuration/environment variables.

- Configure development CORS for the React origin.

- Start MySQL, then API, then React client.

- Use a README with actual local ports and seeded demo credentials; never put real passwords/secrets in the shared document.

# 12. Test Plan

| **Test**                                        | **Expected result**                                                                             |
|-------------------------------------------------|-------------------------------------------------------------------------------------------------|
| Trainer valid login (Trainer selected)          | JWT returned; S2 opens; top bar shows “Trainer • name”.                                         |
| Trainee valid login (Trainee selected)          | JWT returned; S5 opens.                                                                         |
| Valid trainee credentials with Trainer selected | Generic error; no protected screen access.                                                      |
| Invalid login or empty fields                   | Generic error or field messages; no protected screen access.                                    |
| Add intern with duplicate email                 | Inline “An account with this email already exists”; no duplicate record.                        |
| Add intern with short password or bad email     | Field validation; nothing saved.                                                                |
| Create assignment with missing topic/trainee    | Validation error; no record saved.                                                              |
| Trainee opens own assignment                    | Details visible; link opens in a new tab.                                                       |
| Trainee requests another user’s assignment      | Not found/forbidden; no data leakage.                                                           |
| Status update                                   | Toast; chip changes; database and dashboard counts update.                                      |
| Overdue calculation                             | Past due incomplete = overdue; completed or due today = not overdue.                            |
| Card arithmetic and progress bar                | Not Started + In Progress + Completed = Total; bar and % match (seed: 5 / 2 / 1 / 2 / 1 / 40%). |
| Empty dashboard                                 | Zero counts, 0% and a clear empty message.                                                      |
| Sidebar and routes                              | Items match the role; active highlight per screen; wrong-role URL redirects.                    |
| Narrow viewport                                 | Sidebar collapses; panels stack; forms remain usable.                                           |
| API failure on save                             | Error shown; no success toast; values kept.                                                     |

# 13. Build Order for One-Day Completion

1.  Create MySQL schema and seed trainer/trainee/sample assignments.

2.  Build .NET login (with role check), role policies and core endpoints.

3.  Test API routes before frontend integration.

4.  Build the app shell (top bar, sidebar, route guards), StatusChip, SummaryCard and Toast.

5.  Build S1 Login and S2/S5 dashboards with basic layout.

6.  Build S3 Add Intern and S4 Create Assignment.

7.  Build S6 Assignment Details and status update.

8.  Connect summary counts and progress bar, test ownership and overdue rules.

9.  Run the complete demo and fix only blocking issues.

# 14. Risks and Clarifications

- If time is short, do not implement search, edit/delete, charts or notifications.

- One trainer role is sufficient; no multi-trainer administration.

- Trainer creates trainee accounts; public registration is disabled.

- Topic and trainee are required; resource link, notes and due date are optional.

- The confirmation message is a state, not a seventh page.

- The profile chevron next to the name is decorative in this release.

- Sample data in the images is illustrative and partly inconsistent; the TRD seed data is the demo reference.

# Revision Notes (v1.3)

Version 1.3 aligns this document with the six approved UI design screens (S1–S6). Changes from v1.2:

- Embedded the six approved design images and added an element-by-element table for each screen.

- Added the application shell (top bar, role-based sidebar), routes, status chips and design-derived visual guidelines.

- Added the S1 role selector and role check, the S5 completion progress bar, inline duplicate-email error, toast messages and S6 save behavior.

- Clarified card counting (Overdue is an overlay), summary payload use, screen-to-API map, uiSlice for toasts and a larger test plan.

- Updated the build order to include the shell.
