-- Intern Training Tracker - repeatable seed data
-- Run: mysql -u root -p InternTracker < Database/seed.sql
-- All three demo accounts use the password listed in README.md (stored only as an ASP.NET Core Identity hash).
-- Due dates are fixed (Nov 2026); edit them if the demo date moves.
USE InternTracker;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE Assignments;
TRUNCATE TABLE Users;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO Users (Id, Name, Email, PasswordHash, Role) VALUES
 (1, 'Anita',        'anita@example.com', 'AQAAAAEAACcQAAAAEBVN5aoVEnr99G9A8L2wAAAuDqmiZ1WtW6MRUNFpxUzOj3A7ZJFpWIhWn5NoUXitmQ==', 'Trainer'),
 (2, 'Priya Sharma', 'priya@example.com', 'AQAAAAEAACcQAAAAEBVN5aoVEnr99G9A8L2wAAAuDqmiZ1WtW6MRUNFpxUzOj3A7ZJFpWIhWn5NoUXitmQ==', 'Trainee'),
 (3, 'Rahul Verma',  'rahul@example.com', 'AQAAAAEAACcQAAAAEBVN5aoVEnr99G9A8L2wAAAuDqmiZ1WtW6MRUNFpxUzOj3A7ZJFpWIhWn5NoUXitmQ==', 'Trainee');

-- Priya: Total 5, Not Started 2, In Progress 1, Completed 2, Overdue 1 (SQL Joins), completion 40%
INSERT INTO Assignments (TraineeId, CreatedByTrainerId, Topic, VideoUrl, Notes, DueDate, Status) VALUES
 (2, 1, 'HTML and CSS Basics',   NULL, 'Finish the layout exercises.', '2026-11-15', 'Completed'),
 (2, 1, 'Git Workflow',          NULL, 'Practice branching and merging.', '2026-11-18', 'Completed'),
 (2, 1, 'SQL Joins',             NULL, 'Practice INNER and LEFT joins.', '2026-11-20', 'Not Started'),
 (2, 1, 'JavaScript Fundamentals', NULL, NULL, '2026-12-05', 'Not Started'),
 (2, 1, 'React Basics', 'https://react.dev/learn', 'Build a small React app that renders a list and a form.', '2026-11-25', 'In Progress');

-- Rahul: one assignment so ownership checks can be demonstrated
INSERT INTO Assignments (TraineeId, CreatedByTrainerId, Topic, VideoUrl, Notes, DueDate, Status) VALUES
 (3, 1, 'REST API Basics', 'https://learn.microsoft.com/aspnet/core/web-api/', 'Read the overview and list the HTTP verbs.', '2026-11-27', 'In Progress');
