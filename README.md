# Intern Training Tracker

Trainer assigns learning topics to interns; interns update progress. Six screens (S1-S6) + shell.
Stack: React + TypeScript + Redux Toolkit (Vite) | ASP.NET Core Web API (.NET 10) | MySQL 8 + Dapper | JWT.

```
Database/   schema.sql, seed.sql
backend/    InternTracker.Api  (API, http://localhost:5080)
frontend/   React app          (http://localhost:5173)
docs/       BRD, PRD, TRD, DD, PL      design/  approved screens
```

## 1. Prerequisites
.NET 10 SDK (`dotnet --version`), Node.js 20+ (`node --version`), MySQL 8.0.16+ (server running), mysql command-line client.

## 2. Database  (run from the project root, in Command Prompt)
```
mysql -u root -p < Database\schema.sql
mysql -u root -p InternTracker < Database\seed.sql
```
If `mysql` is not recognised, use the full path, e.g.
`"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < Database\schema.sql`
(or open MySQL Workbench, open each file and run it: schema.sql first, then seed.sql).
Re-running seed.sql resets the demo data. Seed due dates are fixed (Nov 2026) - edit them if the demo date moves.

## 3. API
1. Open `backend\InternTracker.Api\appsettings.Development.json` and put your MySQL password in the connection string.
   (Do not commit this file. Keys: ConnectionStrings:Default, Jwt:Issuer, Jwt:Audience, Jwt:Secret, Jwt:ExpiryMinutes, Cors:AllowedOrigins.)
2. Run:
```
cd backend\InternTracker.Api
dotnet run
```
3. Check http://localhost:5080/health shows `{"status":"ok"}`. `InternTracker.Api.http` has ready-made API test calls.

## 4. Frontend
```
cd frontend
npm install
npm run dev
```
Open http://localhost:5173. (If the API is on another address, copy `.env.example` to `.env` and edit `VITE_API_URL`.)

## Startup order
MySQL -> API -> React client.

## Demo accounts (password for all: `Password@123`)
| Role    | Email              |
|---------|--------------------|
| Trainer | anita@example.com  |
| Trainee | priya@example.com  |
| Trainee | rahul@example.com  |

Priya's dashboard should show: Total 5, Not Started 2, In Progress 1, Completed 2, Overdue 1, 40%.

## Demo walkthrough (PL section 8)
1. Sign in as Trainer (Trainer selected) -> dashboard cards, interns, assignments.
2. Add an intern (try the same email twice -> duplicate message), create an assignment for them.
3. Sign out. Select Trainee, sign in as priya -> cards, progress bar, list; SQL Joins shows Overdue.
4. Open an assignment -> notes + resource link -> change status -> "Status updated" toast.
5. Back to dashboard -> counts and % changed. Sign in as Trainer again -> status updated.
6. Try priya with Trainer selected -> "Invalid email or password." (role check).

## Not included (by design)
Search, edit/delete, charts, notifications, uploads, cloud deployment.

## Troubleshooting
- API stops with "Jwt:Secret must be set" -> check appsettings.Development.json exists and the API runs in Development (`dotnet run` uses launchSettings.json).
- "Access denied for user" / cannot connect -> wrong MySQL password or MySQL not running.
- Only .NET 8/9 installed -> change `<TargetFramework>` in InternTracker.Api.csproj to net8.0 / net9.0 and the `10.0.*` package versions to `8.0.*` / `9.0.*`.
- Browser shows "Cannot reach the server" -> API not running, or CORS origin differs from the Vite URL.
