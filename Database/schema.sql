-- Intern Training Tracker - schema (MySQL 8.0.16+)
-- Run: mysql -u root -p < Database/schema.sql
CREATE DATABASE IF NOT EXISTS InternTracker CHARACTER SET utf8mb4;
USE InternTracker;

DROP TABLE IF EXISTS Assignments;
DROP TABLE IF EXISTS Users;

CREATE TABLE Users (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(100) NOT NULL,
  Email VARCHAR(255) NOT NULL,
  PasswordHash VARCHAR(255) NOT NULL,
  Role VARCHAR(20) NOT NULL,
  CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT UQ_Users_Email UNIQUE (Email),
  CONSTRAINT CK_Users_Role CHECK (Role IN ('Trainer','Trainee'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE Assignments (
  Id INT AUTO_INCREMENT PRIMARY KEY,
  TraineeId INT NOT NULL,
  CreatedByTrainerId INT NOT NULL,
  Topic VARCHAR(200) NOT NULL,
  VideoUrl VARCHAR(1000) NULL,
  Notes TEXT NULL,
  DueDate DATE NULL,
  Status VARCHAR(20) NOT NULL DEFAULT 'Not Started',
  CreatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UpdatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT FK_Assignments_Trainee FOREIGN KEY (TraineeId) REFERENCES Users(Id),
  CONSTRAINT FK_Assignments_Trainer FOREIGN KEY (CreatedByTrainerId) REFERENCES Users(Id),
  CONSTRAINT CK_Assignments_Status CHECK (Status IN ('Not Started','In Progress','Completed')),
  INDEX IX_Assignments_TraineeId (TraineeId),
  INDEX IX_Assignments_DueDate (DueDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
