# Intern Training Tracker (practice project)

Small internal app: a Trainer assigns learning topics to Interns (role value "Trainee") and tracks completion.

## Source of truth
Read these before coding. If they conflict, the TRD wins for technical details, the DD/design images for UI.
- docs/BRD.md  business rules and scope
- docs/PRD.md  product requirements
- docs/TRD.md  stack, DB schema, seed data, API contract, validation, security, routes
- docs/DD.md   screen-by-screen design (S1-S6)
- docs/PL.md   plan, build order, demo checklist
- design/*.png approved UI screens

## Stack
- Backend: ASP.NET Core Web API (.NET 10), Dapper + MySqlConnector, MySQL 8.0.16+, JWT bearer
- Frontend: React + TypeScript + Vite, Redux Toolkit, React Router, plain CSS, lucide-react
- Layout: backend/ (API), frontend/ (React), Database/schema.sql + Database/seed.sql

## Rules
- Scope is fixed: 6 screens (S1-S6) plus shell. NO search, edit/delete, charts, notifications, uploads.
- Overdue is never stored: DueDate IS NOT NULL AND DueDate < CURDATE() AND Status <> 'Completed'.
- Trainee id always comes from the JWT, never from client input. Enforce role + ownership on the API.
- Hash passwords (ASP.NET PasswordHasher). Never log or return PasswordHash. Parameterized SQL only.
- Secrets (Jwt:Secret, connection string) stay in local config / env vars; never commit them.
- Build order: DB -> backend -> shell -> screens -> integration -> tests. Polish last.
- Work in small steps. After each step run the build/tests and tell me what to run to check it.
- Keep a README.md with startup order, schema/seed command, demo credentials, config keys.
