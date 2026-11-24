**INTERN TRAINING TRACKER**

**Product Requirements Document**

*Features, user stories, acceptance criteria and priorities*

| **Document Control**  | **Value**                                                                                  |
|-----------------------|--------------------------------------------------------------------------------------------|
| **Document Type**     | Product Requirements Document                                                              |
| **Project**           | Intern Training Tracker                                                                    |
| **Version / Date**    | 1.3 / 23 November 2026 (aligned to approved UI design S1–S6)                               |
| **Prepared for**      | Training Lead and Project Reviewer                                                         |
| **Status**            | Practice project – delivery-focused scope                                                  |
| **Target completion** | Tuesday morning, 24 November 2026                                                          |
| **Technology**        | React + TypeScript + Redux Toolkit │ ASP.NET Core Web API (.NET 10) │ MySQL + Dapper │ JWT |

# 1. Objective

Deliver a minimal web application that enables a trainer to create interns and assign learning work, while trainees view and update their own assignments and see their own progress. The release is intended for a local practice demonstration by Tuesday morning, 24 November 2026.

# 2. Success Metrics

| **Measure**             | **Target**                                                                                              |
|-------------------------|---------------------------------------------------------------------------------------------------------|
| **Trainer workflow**    | Trainer can create an intern and create an assignment.                                                  |
| **Trainee visibility**  | Trainee sees topic, optional resource, notes, due date and status for own assignments.                  |
| **Progress accuracy**   | Counts, the completion percentage and the progress bar refresh after a status update.                   |
| **Deadline visibility** | Past-due incomplete assignments show the Overdue label.                                                 |
| **Design fidelity**     | All six screens match the approved design: top bar, sidebar, summary cards, status chips, form layouts. |
| **Demo readiness**      | Both roles can complete their main flows with seeded data.                                              |

# 3. Users and Assumptions

- Trainer: manages trainee accounts and assignments.

- Trainee (shown as “Intern” on trainer screens): views and updates own assignments.

- One trainer account is sufficient for the first release; no public sign-up.

- Local React app, .NET 10 API and MySQL database are used for the demo.

# 4. Screen Requirements

<table>
<colgroup>
<col style="width: 18%" />
<col style="width: 81%" />
</colgroup>
<thead>
<tr class="header">
<th><strong>ID / Screen</strong></th>
<th><strong>Requirements</strong></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>S1 Login</strong></td>
<td><p>Centered card with graduation-cap logo, “Sign in to your account” heading, and project name in the top-left corner.</p>
<p>Trainer / Trainee role selector (two-option toggle, Trainer selected by default).</p>
<p>Email and Password fields with leading icons; Sign In button; “or” divider; “New here? Contact your admin” text (no registration page).</p>
<p>Required-field and email-format validation; generic invalid-credentials message (also shown when the credentials do not belong to the selected role); route to S2 (Trainer) or S5 (Trainee).</p></td>
</tr>
<tr class="even">
<td><strong>S2 Trainer Dashboard</strong></td>
<td><p>Top bar, left sidebar (Dashboard, Interns, Assignments) and “Dashboard” heading.</p>
<p>Four summary cards: Interns, Assignments, In Progress, Overdue.</p>
<p>Interns panel: name and email columns, + Add Intern button (opens S3).</p>
<p>Assignments panel: topic, trainee, status chip and due date columns, + Create Assignment button (opens S4).</p>
<p>Empty state in each panel with a short message and the relevant next action.</p></td>
</tr>
<tr class="odd">
<td><strong>S3 Add Intern</strong></td>
<td><p>Back to Dashboard link; card titled “Add Intern”.</p>
<p>Name*, Email* and Initial Password* (masked) with leading icons; required validation.</p>
<p>Duplicate email shows “An account with this email already exists” under the Email field; entered values are kept.</p>
<p>Save (primary) and Cancel (secondary); on success show a toast and return to S2.</p></td>
</tr>
<tr class="even">
<td><strong>S4 Create Assignment</strong></td>
<td><p>Back to Dashboard link; card titled “Create Assignment”.</p>
<p>Trainee* dropdown (placeholder “Select a trainee”) and Topic* required.</p>
<p>Video URL (optional, placeholder https://…), Notes (optional, multi-line), Due Date (optional, date picker).</p>
<p>URL validation (HTTP/HTTPS only); Save/Cancel; on success show a toast and return to S2.</p></td>
</tr>
<tr class="odd">
<td><strong>S5 Trainee Dashboard</strong></td>
<td><p>Top bar, left sidebar (My Dashboard, My Assignments) and “My Dashboard” heading.</p>
<p>Five summary cards: Total, Not Started, In Progress, Completed, Overdue.</p>
<p>Completion progress bar with percentage value (for example 40%).</p>
<p>My Assignments table: topic, status chip, due date, Open action that opens S6. Empty state when there are none.</p></td>
</tr>
<tr class="even">
<td><strong>S6 Assignment Details</strong></td>
<td><p>Back to Dashboard link; topic as the card title with the current status chip beside it.</p>
<p>Due date (calendar icon), Notes, and Resource link with link and open-in-new-tab icons. Missing values show “No due date”, “No notes” or no Resource section.</p>
<p>Update status dropdown (Not Started, In Progress, Completed) with Save.</p>
<p>On success show a toast and update the chip and dashboard data in place; the trainee returns to S5 using Back to Dashboard. On failure show an error and keep the selection.</p></td>
</tr>
</tbody>
</table>

The Saved Confirmation is a transient success alert/toast after a successful save, not a separate route or page. Loading, empty, validation, and error messages are states within the relevant screen, not additional screens. Thus the agreed build contains 6 pages/screens and 1 reusable confirmation state.

## 4.1 Shared Elements

| **Element**         | **Requirement**                                                                                                                                                                               |
|---------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Top bar**         | Graduation-cap logo and “Intern Training Tracker”; right side shows “Role • Name” (for example “Trainer • Anita”) and an outlined Sign Out button. The name/role label is informational only. |
| **Sidebar**         | Trainer: Dashboard, Interns, Assignments. Trainee: My Dashboard, My Assignments. The active item is highlighted. Interns/Assignments/My Assignments reuse the dashboards (no extra screens).  |
| **Status chip**     | Pill label: Not Started (grey), In Progress (blue), Completed (green), Overdue (orange). Always text-labelled; never color only.                                                              |
| **Summary card**    | Icon, label and number. Counts come from saved data.                                                                                                                                          |
| **Toast**           | Brief success message after a save: “Intern added”, “Assignment created”, “Status updated”. Never shown when the save fails.                                                                  |
| **Required marker** | A red asterisk after the label of required fields; optional fields say “(optional)”.                                                                                                          |

# 5. User Stories

- As a trainer, I want to add an intern so I can assign work to that person.

- As a trainer, I want to create a topic assignment with optional link, notes and due date.

- As a trainer, I want to see intern and assignment progress, including overdue items, so I can follow up.

- As a trainee, I want to see my assigned topics and resources in one list.

- As a trainee, I want to update my status so the trainer can see my progress.

- As a trainee, I want to see my completion percentage so I know how much work remains.

- As a user, I want to pick my role on the sign-in screen so I land on the right dashboard.

# 6. Functional Requirements

| **ID** | **Requirement**                        | **Priority** | **Acceptance criterion**                                                                                                                                                                  |
|--------|----------------------------------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| FR-01  | Authenticate and route users by role.  | Must         | Valid credentials for the selected role return JWT and the correct landing screen; credentials that do not match the selected role are rejected with the generic error.                   |
| FR-02  | Create trainee account.                | Must         | Name, valid unique email and initial password (min 8 characters) validated; password hash stored.                                                                                         |
| FR-03  | Create assignment.                     | Must         | Trainee and topic required; optional fields saved when supplied; starts as Not Started.                                                                                                   |
| FR-04  | List assignments for trainee.          | Must         | API scopes results to authenticated trainee ID.                                                                                                                                           |
| FR-05  | Update assignment status.              | Must         | Only owning trainee can set one of the three allowed statuses.                                                                                                                            |
| FR-06  | Show dashboard summary.                | Must         | Counts are calculated from persisted assignment records; trainer cards = Interns, Assignments, In Progress, Overdue; trainee cards = Total, Not Started, In Progress, Completed, Overdue. |
| FR-07  | Calculate overdue.                     | Must         | Due date before today and status not Completed; shown as an Overdue label.                                                                                                                |
| FR-08  | Search/filter lists.                   | Could        | Only if core flow is complete.                                                                                                                                                            |
| FR-09  | Edit/delete records.                   | Out of scope | Not required for tomorrow’s practice delivery.                                                                                                                                            |
| FR-10  | Shared top bar and role-based sidebar. | Must         | Same shell on S2–S6; correct items per role; active item highlighted; Sign Out clears the session.                                                                                        |
| FR-11  | Show completion percentage.            | Must         | Trainee dashboard shows a progress bar and percentage = round(completed ÷ total × 100); 0% when there are no assignments.                                                                 |
| FR-12  | Form feedback.                         | Must         | Inline field errors, specific duplicate-email message, success toast only after a successful save.                                                                                        |
| FR-13  | Status chips and date display.         | Must         | Chip text per status; Overdue replaces the status label on overdue rows; dates shown as “25 Nov” in lists and “25 Nov 2026” on details.                                                   |

# 7. Acceptance Criteria

- No assignments means total 0 and completion 0%, with an empty-state message.

- A completed item is excluded from overdue count even when its due date has passed.

- Card values satisfy Not Started + In Progress + Completed = Total; Overdue is counted separately.

- Unauthenticated requests to protected endpoints are rejected.

- A trainee cannot read or update another trainee’s assignments, even by changing an ID in the request.

- Selecting the wrong role on the sign-in screen does not sign the user in.

- Passwords are never stored or returned in plaintext.

- Invalid forms show clear validation feedback and do not save; entered values are kept.

- Adding an intern with an existing email shows “An account with this email already exists” and creates no record.

- Changes remain after sign-out and sign-in because records are stored in MySQL.

- External resource links open in a new browser tab.

- The sidebar highlights Interns on S3, Assignments on S4 and My Assignments on S6.

# 8. Out of Scope

- Password recovery, public registration (the “Contact your admin” text is informational), notifications, uploads, certificates, advanced reporting, SSO/MFA and native mobile apps.

- Assignment editing/deletion, bulk import, multi-trainer permissions and production deployment.

- Profile menu behind the name/role label; separate Interns and Assignments list pages.

# 9. Delivery Plan, Decisions and Open Questions

| **Milestone**             | **Outcome**                                                     | **Target**         |
|---------------------------|-----------------------------------------------------------------|--------------------|
| **M1 Scope and setup**    | Scope, schema and six-screen plan frozen.                       | 23 Nov             |
| **M2 Trainer workflow**   | Login, app shell, add intern and create assignment.             | 23 Nov             |
| **M3 Trainee workflow**   | View own assignment and update status.                          | 23 Nov             |
| **M4 Integration review** | Dashboard calculations, persistence and access checks verified. | Before 24 Nov demo |
| **M5 Handoff**            | Documents, sample data and demo steps ready.                    | 24 Nov morning     |

**Defaults:** one trainer; trainer-created trainee accounts; no evidence/review workflow; local deployment only; topic and trainee required; notes, link and due date optional.

**Decisions made to close design gaps** (confirm or change before build):

- The role selector on S1 is verified by the API, not only the UI.

- Sidebar Interns / Assignments / My Assignments reuse S2 and S5 instead of adding screens.

- After saving a status on S6 the trainee stays on S6 (toast and chip update); Back to Dashboard returns to S5.

- Minimum password length is 8; past due dates are allowed; assignments are listed newest first and interns by name.

# 10. Requirements Traceability

| **BRD** | **PRD**      | **TRD** | **Screens**    | **Verified by**                          |
|---------|--------------|---------|----------------|------------------------------------------|
| BR-01   | FR-01        | TR-F-01 | S1             | Valid/invalid login; wrong-role login    |
| BR-02   | FR-02        | TR-F-02 | S3, S2         | Add intern; duplicate email              |
| BR-03   | FR-03        | TR-F-03 | S4, S2         | Create assignment; missing topic/trainee |
| BR-04   | FR-04        | TR-F-04 | S5             | Ownership test                           |
| BR-05   | FR-05        | TR-F-05 | S6, S5         | Status update persists                   |
| BR-06   | FR-06, FR-07 | TR-F-06 | S2, S5         | Counts and overdue rule                  |
| BR-07   | —            | TR-F-07 | All            | Sign out / sign in persistence           |
| BR-09   | FR-10        | TR-F-08 | S2–S6          | Role-based navigation check              |
| BR-10   | FR-11        | TR-F-06 | S5             | Progress bar equals percentage           |
| BR-11   | FR-12, FR-13 | TR-F-09 | S1, S3, S4, S6 | Validation, toast and chip checks        |

# 11. Conclusion

The product is successful when the trainer can assign work, the trainee can update it, and both views accurately summarize progress in the approved design. Optional features must not delay these outcomes.

# Revision Notes (v1.3)

Version 1.3 aligns this document with the six approved UI design screens (S1–S6). Changes from v1.2:

- Screen requirements rewritten from the six design images (logo, role selector, sidebar, cards, progress bar, form layouts, chips).

- Added FR-10 to FR-13 (shell and navigation, completion progress, form feedback, chip and date display) and extended FR-01, FR-02, FR-03 and FR-06.

- Added shared element definitions, new user stories, extra acceptance criteria and the status spelling used in the design.

- Recorded decisions that close design gaps (role check, sidebar behavior, S6 save behavior, password length) and added a traceability table.
