namespace InternTracker.Api.Dtos;

// ---- Auth ----
public class LoginRequest
{
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? Role { get; set; }
}

public class UserProfile
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Role { get; set; } = "";
}

public class LoginResponse
{
    public string Token { get; set; } = "";
    public DateTime ExpiresAt { get; set; }
    public UserProfile User { get; set; } = new();
}

// ---- Trainees ----
public class TraineeDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
}

public class CreateTraineeRequest
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? InitialPassword { get; set; }
}

// ---- Assignments ----
public class AssignmentListItem
{
    public int Id { get; set; }
    public int TraineeId { get; set; }
    public string TraineeName { get; set; } = "";
    public string Topic { get; set; } = "";
    public string Status { get; set; } = "";
    public string? DueDate { get; set; }      // yyyy-MM-dd
    public bool IsOverdue { get; set; }
}

public class MyAssignmentItem
{
    public int Id { get; set; }
    public string Topic { get; set; } = "";
    public string Status { get; set; } = "";
    public string? DueDate { get; set; }
    public bool IsOverdue { get; set; }
}

public class AssignmentDetail
{
    public int Id { get; set; }
    public int TraineeId { get; set; }
    public string TraineeName { get; set; } = "";
    public string Topic { get; set; } = "";
    public string? Notes { get; set; }
    public string? VideoUrl { get; set; }
    public string? DueDate { get; set; }
    public string Status { get; set; } = "";
    public bool IsOverdue { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateAssignmentRequest
{
    public int? TraineeId { get; set; }
    public string? Topic { get; set; }
    public string? VideoUrl { get; set; }
    public string? Notes { get; set; }
    public string? DueDate { get; set; }
}

public class UpdateStatusRequest
{
    public string? Status { get; set; }
}

// ---- Dashboard ----
public class TrainerSummary
{
    public string Role { get; set; } = "Trainer";
    public int InternCount { get; set; }
    public int TotalAssignments { get; set; }
    public int NotStarted { get; set; }
    public int InProgress { get; set; }
    public int Completed { get; set; }
    public int Overdue { get; set; }
}

public class TraineeSummary
{
    public string Role { get; set; } = "Trainee";
    public int Total { get; set; }
    public int NotStarted { get; set; }
    public int InProgress { get; set; }
    public int Completed { get; set; }
    public int Overdue { get; set; }
    public int CompletionPercent { get; set; }
}
