**INTERN TRAINING TRACKER**

**Business Requirements Document**

*Business purpose, users, workflows, scope and rules*

| **Document Control**  | **Value**                                                                                  |
|-----------------------|--------------------------------------------------------------------------------------------|
| **Document Type**     | Business Requirements Document                                                             |
| **Project**           | Intern Training Tracker                                                                    |
| **Version / Date**    | 1.3 / 23 November 2026 (aligned to approved UI design S1–S6)                               |
| **Prepared for**      | Training Lead and Project Reviewer                                                         |
| **Status**            | Practice project – delivery-focused scope                                                  |
| **Target completion** | Tuesday morning, 24 November 2026                                                          |
| **Technology**        | React + TypeScript + Redux Toolkit │ ASP.NET Core Web API (.NET 10) │ MySQL + Dapper │ JWT |

# 1. Introduction

The Intern Training Tracker is a small internal practice application for assigning learning topics to interns and tracking their completion. It replaces informal follow-up with a shared, simple view for a trainer and each trainee.

**Terminology.** The user interface uses “Intern” on trainer-facing screens and “Trainee” on the sign-in role selector and assignment dropdown. Both mean the same user role (stored as role value Trainee). “Trainer” is the single administrative role; the sign-in screen’s “Contact your admin” text refers to the trainer.

# 2. Business Context and Objectives

- Give the trainer one place to create trainee accounts and assign learning tasks.

- Give each trainee one place to see assigned topics, learning resources, deadlines and personal progress.

- Allow trainees to update progress so the trainer can follow up using current information.

- Complete a demonstrable local prototype by Tuesday morning, 24 November 2026.

# 3. Scope

## 3.1 In Scope

- Trainer and trainee sign-in using seeded/created accounts, with a Trainer / Trainee role selector on the sign-in screen.

- Trainer creates intern accounts and assignments.

- Trainee views only their own assignments and changes assignment status.

- Dashboards: trainer summary cards, intern list and assignment list; trainee summary cards, completion progress bar and own assignment list.

- Shared application shell: top bar (project name, signed-in role and name, Sign Out) and role-based left navigation.

- Status chips (Not Started, In Progress, Completed, Overdue), inline validation messages and a transient save-confirmation message.

- MySQL persistence, JWT authorization and basic validation.

## 3.2 Out of Scope

- Public registration, password reset, multi-trainer administration, HR integration or SSO. The sign-in screen only tells new users to contact their admin; it does not open a registration page.

- Email/SMS notifications, file/video uploads, certificates, chat or real-time collaboration.

- Advanced charts and analytics (the single completion progress bar on the trainee dashboard is included), audit module, mobile apps or production deployment.

- A profile or account menu. The signed-in name/role label in the top bar is informational only.

- Separate Interns or Assignments list pages. Sidebar items for these open the trainer dashboard at the matching section (see 8.1).

# 4. Stakeholders and User Roles

| **Role**             | **Responsibilities**                                                           | **Access**                                                     |
|----------------------|--------------------------------------------------------------------------------|----------------------------------------------------------------|
| **Trainer**          | Create trainee accounts; create and review assignments; view overall progress. | All trainees and assignments created within this practice app. |
| **Trainee**          | Review assigned work and update own status.                                    | Only own assignments and own progress summary.                 |
| **Project reviewer** | Review the workflow and demonstration.                                         | Demo access as agreed; no separate application role.           |

# 5. End-to-End Business Process

1.  Trainer opens the sign-in screen, keeps the Trainer role selected and signs in with trainer credentials.

2.  Trainer adds an intern with name, unique email and initial password.

3.  Trainer creates an assignment by selecting a trainee and entering a topic; video URL, notes and due date are optional.

4.  The trainee selects the Trainee role, signs in and sees the assigned item on the trainee dashboard.

5.  The trainee opens assignment details, reviews the notes and resource link, and changes status to Not Started, In Progress or Completed.

6.  The system saves the status and refreshes the trainee and trainer summaries, including the trainee’s completion percentage.

# 6. Business Requirements

| **ID** | **Requirement**                                                                                                                                                                             | **Priority** |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------|
| BR-01  | The system shall authenticate Trainer and Trainee users. The user selects Trainer or Trainee on the sign-in screen; sign-in succeeds only when the credentials belong to the selected role. | Must         |
| BR-02  | The trainer shall create trainee accounts with unique email addresses.                                                                                                                      | Must         |
| BR-03  | The trainer shall assign a topic to one selected trainee.                                                                                                                                   | Must         |
| BR-04  | A trainee shall see only their own assignments.                                                                                                                                             | Must         |
| BR-05  | A trainee shall update an assignment status.                                                                                                                                                | Must         |
| BR-06  | Dashboards shall show accurate counts and overdue items.                                                                                                                                    | Must         |
| BR-07  | The application shall retain records in MySQL across sessions.                                                                                                                              | Must         |
| BR-08  | Search/filter may be added only if all must-have flows are complete.                                                                                                                        | Could        |
| BR-09  | Every signed-in screen shall show the same top bar and a role-based left navigation: Trainer – Dashboard, Interns, Assignments; Trainee – My Dashboard, My Assignments.                     | Must         |
| BR-10  | The trainee dashboard shall show the trainee’s completion percentage as a progress bar with the percentage value.                                                                           | Must         |
| BR-11  | Forms shall give clear feedback: inline field validation, a specific message for a duplicate email, and a brief confirmation after each successful save.                                    | Must         |

# 7. Business Rules

- Email is the unique login identifier; trim whitespace and compare case-insensitively (store emails in lower case).

- Email must be a valid address format. Initial password must be at least 8 characters (assumed minimum; confirm with the Training Lead).

- Topic, trainee, intern name, email and initial password are required for their respective forms.

- Video URL, notes and due date are optional. If supplied, a video URL must use HTTP or HTTPS. Past due dates are accepted so overdue behavior can be demonstrated.

- Allowed statuses are exactly: Not Started, In Progress and Completed. A new assignment starts as Not Started.

- Overdue is a derived indicator, not a fourth status. An assignment is overdue when its due date is before the current date and its status is not Completed. Due today is not overdue. Completed assignments are never overdue.

- Where a list row or detail header shows an overdue assignment, the Overdue label replaces the status label for that row; the stored status is still counted in its own status card.

- Summary cards: Not Started + In Progress + Completed = Total. Overdue is a separate count of the items among them that are past due, so it is not added to the total.

- Completion percentage = completed assignments ÷ total assignments × 100, rounded to a whole number; if there are no assignments, show 0%.

- Dates are shown as “25 Nov” in lists (with the year when it is not the current year) and “25 Nov 2026” on assignment details. A missing due date is shown as “No due date”.

- Lists show newest created first for assignments and name A–Z for interns (assumed defaults).

- A trainee’s dashboard and details never display another trainee’s data.

- The API—not just the UI—must enforce role permissions, the role selected at sign-in and trainee ownership.

# 8. Agreed Screen Inventory

The approved UI design contains six screens. Controls below are taken from the design images.

| **ID** | **Screen**         | **Role** | **Main controls / content**                                                                                                                                                                                                                 | **Purpose**                                               |
|--------|--------------------|----------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| S1     | Login              | Both     | Logo and project name; Sign in heading; Trainer / Trainee role selector (Trainer selected by default); Email and Password fields with icons; Sign In button; “or” divider; “New here? Contact your admin” text; validation/error message.   | Authenticate and route by role.                           |
| S2     | Trainer Dashboard  | Trainer  | Top bar and sidebar; Dashboard heading; four summary cards (Interns, Assignments, In Progress, Overdue); Interns panel (name, email) with + Add Intern; Assignments panel (topic, trainee, status chip, due date) with + Create Assignment. | View all trainees and assignments created by the trainer. |
| S3     | Add Intern         | Trainer  | Back to Dashboard link; Name\*, Email\*, Initial Password\* with icons; inline “An account with this email already exists” error; Save and Cancel.                                                                                          | Create trainee login; password is hashed by API.          |
| S4     | Create Assignment  | Trainer  | Back to Dashboard link; Trainee\* dropdown (“Select a trainee”), Topic\*, Video URL (optional), Notes (optional), Due Date (optional, date picker); Save and Cancel.                                                                        | Assign one learning item to one trainee.                  |
| S5     | Trainee Dashboard  | Trainee  | Five summary cards (Total, Not Started, In Progress, Completed, Overdue); Completion progress bar with percentage; My Assignments table (topic, status chip, due date, Open action).                                                        | Show only assignments belonging to the signed-in trainee. |
| S6     | Assignment Details | Trainee  | Back to Dashboard link; topic with status chip; due date; notes; resource link (opens in new tab); Update status dropdown; Save.                                                                                                            | Review learning material and update status.               |

The Saved Confirmation is a transient success alert/toast after a successful save, not a separate route or page. Loading, empty, validation, and error messages are states within the relevant screen, not additional screens. Thus the agreed build contains 6 pages/screens and 1 reusable confirmation state.

## 8.1 Navigation

| **Role**    | **Sidebar item**   | **Behavior**                                                                      |
|-------------|--------------------|-----------------------------------------------------------------------------------|
| **Trainer** | Dashboard          | Opens S2 at the top. Active on S2.                                                |
| **Trainer** | Interns            | Opens S2 scrolled to the Interns panel. Shown active on S3 Add Intern.            |
| **Trainer** | Assignments        | Opens S2 scrolled to the Assignments panel. Shown active on S4 Create Assignment. |
| **Trainee** | My Dashboard       | Opens S5 at the top. Active on S5.                                                |
| **Trainee** | My Assignments     | Opens S5 scrolled to the My Assignments list. Shown active on S6.                 |
| **Both**    | Sign Out (top bar) | Ends the session and returns to S1.                                               |

> *Design decision: the sidebar’s Interns, Assignments and My Assignments items reuse the dashboards so the agreed scope stays at six screens.*

# 9. Assumptions and Dependencies

- One trainer role and at least one trainee demo account are sufficient.

- The application runs locally using an available .NET 10 SDK, Node.js and MySQL instance.

- The same API and database serve both roles; deployment is optional.

- The project is a practice prototype using fictional data. Names, emails and values shown in the design images (for example Anita, Priya Sharma, Rahul Verma, example.com addresses and the card counts) are illustrative samples.

- The signed-in label in the top bar shows the role and the user’s name.

# 10. Success Measures

- Trainer can sign in, add an intern and create an assignment without manual database edits.

- Trainee can sign in, view only assigned work and save a status update.

- Trainer and trainee dashboards reflect the saved data and overdue rule, and the trainee progress bar matches the completion percentage.

- A complete demo can be performed using seeded credentials and setup instructions.

# 11. Risks and Constraints

| **Risk / constraint**                                                                                           | **Mitigation**                                                                         |
|-----------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| **Short deadline**                                                                                              | Freeze the six-screen scope; defer optional features.                                  |
| **Database/API setup delay**                                                                                    | Use one concise SQL schema and seed script; verify connectivity early.                 |
| **Incorrect access control**                                                                                    | Enforce role and ownership checks in API queries and endpoints.                        |
| **Design details (sidebar, icons, chips) consume time**                                                         | Build the shared shell and status chip once and reuse them on every screen.            |
| **Design sample data is inconsistent (for example the SQL Joins owner and card counts differ between mockups)** | Treat samples as illustrative; the seed data in the TRD is the reference for the demo. |

# 12. Conclusion

The practice release is complete when the trainer-to-trainee assignment workflow works end to end, status updates persist, and both dashboards show accurate progress. The six screens above, with their shared top bar and sidebar, are the agreed minimum UI scope.

# Revision Notes (v1.3)

Version 1.3 aligns this document with the six approved UI design screens (S1–S6). Changes from v1.2:

- Added the Trainer / Trainee role selector and the “Contact your admin” text on the sign-in screen (BR-01, S1).

- Added the shared top bar and role-based sidebar, and defined how sidebar items map to the six screens (BR-09, section 8.1).

- Added the trainee completion progress bar (BR-10) and clarified that Overdue is a derived label counted separately from the three stored statuses.

- Standardized status spelling to Not Started / In Progress / Completed to match the design.

- Added validation, date-format, ordering and password rules that the design implies but v1.2 did not state; items marked “assumed” need confirmation.

- Added terminology (Intern = Trainee) and a risk about inconsistent sample data in the design images.
