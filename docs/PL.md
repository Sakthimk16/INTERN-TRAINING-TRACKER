**INTERN TRAINING TRACKER**

**Project Plan**

*One-person, deadline-driven implementation plan*

| **Document Control**  | **Value**                                                                                  |
|-----------------------|--------------------------------------------------------------------------------------------|
| **Document Type**     | Project Plan                                                                               |
| **Project**           | Intern Training Tracker                                                                    |
| **Version / Date**    | 1.3 / 23 November 2026 (aligned to approved UI design S1–S6)                               |
| **Prepared for**      | Training Lead and Project Reviewer                                                         |
| **Status**            | Practice project – delivery-focused scope                                                  |
| **Target completion** | Tuesday morning, 24 November 2026                                                          |
| **Technology**        | React + TypeScript + Redux Toolkit │ ASP.NET Core Web API (.NET 10) │ MySQL + Dapper │ JWT |

# 1. Purpose and Positioning

This is a short practice project to be completed by one intern/developer by Tuesday morning, 24 November 2026. The target is a working demonstration, not a production-ready enterprise system. The six-screen scope is fixed, together with the shared top bar and sidebar shown in the approved design; optional work is deferred.

# 2. Delivery Scope

- Must deliver: login with role selector, app shell (top bar and sidebar), trainer add-intern, trainer create-assignment, trainee view with completion progress, trainee status update, summaries, MySQL persistence and role/ownership checks.

- Use React + TypeScript + Redux Toolkit, ASP.NET Core Web API (.NET 10), MySQL + Dapper and JWT.

- Local execution only; no cloud deployment requirement.

- UI follows the approved design: cards, tables, status chips, icons and simple alerts; no animations.

# 3. Screen Plan

| **Order** | **Screen / component**                                                    | **Estimated build time** | **Notes**                    |
|-----------|---------------------------------------------------------------------------|--------------------------|------------------------------|
| 1         | App shell: top bar, sidebar, route guards, StatusChip, SummaryCard, Toast | 45 min                   | New; built once and reused   |
| 2         | S1 Login (including Trainer / Trainee selector)                           | 50 min                   | Was 45 min                   |
| 3         | S2 Trainer Dashboard                                                      | 60 min                   |                              |
| 4         | S3 Add Intern                                                             | 30 min                   | Inline duplicate-email error |
| 5         | S4 Create Assignment                                                      | 45 min                   |                              |
| 6         | S5 Trainee Dashboard (including completion progress bar)                  | 70 min                   | Was 60 min                   |
| 7         | S6 Assignment Details                                                     | 45 min                   |                              |
|           | Total                                                                     | 345 min (5.75 h)         |                              |

Additional reusable states: loading, empty, validation, error and save-success toast. These are not separate screens.

# 4. Effort Estimate

| **Activity**                                          | **Hours** | **Priority** |
|-------------------------------------------------------|-----------|--------------|
| Scope freeze and environment check                    | 0.5       | Must         |
| Database schema and seed data                         | 1.0       | Must         |
| API login (with role check), roles and core endpoints | 3.0       | Must         |
| React app shell and screens S1–S6 (section 3)         | 5.75      | Must         |
| Redux state and API client                            | 1.0       | Must         |
| API integration and dashboard calculations            | 1.5       | Must         |
| End-to-end testing and fixes                          | 1.5       | Must         |
| Final demo and handoff notes                          | 1.0       | Must         |
| TOTAL                                                 | 15.25     |              |

> *v1.2 listed 12.0 hours, but its own screen times added up to 4.75 hours against 3.5 hours for “React screens and Redux state”. The estimate is corrected and the shell, role selector and progress bar are included. If 15.25 hours does not fit before Tuesday morning, cut polish first (see section 6), not authentication, persistence or ownership checks.*

# 5. Execution Sequence

| **Phase**                 | **Work**                                                                              | **Exit condition**                                    |
|---------------------------|---------------------------------------------------------------------------------------|-------------------------------------------------------|
| **1. Setup**              | Verify .NET, Node, MySQL; create schema and seed accounts and the sample assignments. | Database connects; seeded users can be queried.       |
| **2. Backend**            | Implement login/JWT with role check, trainer endpoints, trainee endpoints, summaries. | Endpoints pass basic API tests and enforce ownership. |
| **3. Shell and frontend** | Build the shell, then the six screens with Redux Toolkit.                             | Each page renders in the shell and forms validate.    |
| **4. Integration**        | Connect API, persist data, refresh summaries and the progress bar.                    | Trainer-to-trainee flow works end to end.             |
| **5. Review**             | Test roles, status values, overdue logic, empty/error states and the design match.    | No critical blocker remains for demo.                 |
| **6. Handoff**            | Update documents, add setup notes and prepare walkthrough.                            | Reviewer can follow demo sequence.                    |

# 6. Time Management Rules

- Work in the order above; do not start with visual polish.

- Use one shared API client and consistent DTOs to reduce integration work.

- If a phase overruns, remove optional polish—not authentication, persistence or ownership checks.

- Polish to cut first: decorative background circles on the login page, sidebar collapse on narrow screens, icon refinements, toast animation.

- Do not implement search, edit/delete, charts, notifications or uploads for this deadline.

- Keep a short buffer for local configuration and demo-data reset.

# 7. Risks and Mitigations

| **Risk**                                      | **Impact** | **Mitigation**                                                                             |
|-----------------------------------------------|------------|--------------------------------------------------------------------------------------------|
| Feature creep                                 | High       | Freeze six screens; reject optional requests until core demo works.                        |
| MySQL/.NET configuration                      | High       | Test database connection and seed script first.                                            |
| Frontend/API mismatch                         | High       | Agree request/response DTOs (TRD section 7) and API base URL early.                        |
| Incorrect trainee access                      | High       | Test ownership and the role check on API endpoints, not just hidden UI.                    |
| Time lost to styling and icons                | Medium     | Build the shell, chip and card once; use simple consistent forms, tables and cards.        |
| Design and document drift                     | Medium     | Documents v1.3 follow the design; confirm the assumed items listed in the gap report.      |
| Inconsistent sample data in the design images | Low        | Use the TRD seed data as the demo reference.                                               |
| Demo data missing or stale (fixed due dates)  | Medium     | Keep a repeatable seed script and test accounts; adjust seed dates if the demo date moves. |

# 8. Demo Checklist

1.  Start MySQL, API and React client.

2.  On the sign-in screen keep Trainer selected; sign in; show the dashboard cards, intern list and assignment list.

3.  Add a trainee (show the duplicate-email message once); create an assignment for that trainee.

4.  Sign out; select Trainee and sign in as the seeded trainee; show the cards, progress bar and assignment list.

5.  Open an assignment; show notes and resource link; update status and show the toast.

6.  Return to the dashboard; show the changed counts and percentage.

7.  Sign out and back in as trainer; confirm the updated status and summary.

8.  Show the Overdue chip (SQL Joins) and an empty-state if demo data supports it.

9.  Try the trainee account with Trainer selected to show the role check.

10. Explain that notifications, uploads, advanced reports and deployment are intentionally excluded.

# 9. Sign-Off

| **Role**                        | **Name / signature**                                     | **Date**                 |
|---------------------------------|----------------------------------------------------------|--------------------------|
| **Project learner / developer** | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ | \_\_\_\_\_\_\_\_\_\_\_\_ |
| **Training lead / reviewer**    | \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_ | \_\_\_\_\_\_\_\_\_\_\_\_ |

# Revision Notes (v1.3)

Version 1.3 aligns this document with the six approved UI design screens (S1–S6). Changes from v1.2:

- Added the app shell, role selector and progress bar to scope, screen plan and demo checklist.

- Corrected the effort estimate (12.0 h to 15.25 h) because v1.2 screen times did not add up to its own frontend total.

- Added a polish-cut list, design-drift and sample-data risks, and seed-date note.
