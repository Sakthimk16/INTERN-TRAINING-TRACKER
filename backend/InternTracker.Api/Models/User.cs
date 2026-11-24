namespace InternTracker.Api.Models;

/// <summary>Database entity for the Users table.</summary>
public class User
{
    public int Id { get; set; }
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    public string Role { get; set; } = "";
}

public static class Roles
{
    public const string Trainer = "Trainer";
    public const string Trainee = "Trainee";
}

public static class Statuses
{
    public const string NotStarted = "Not Started";
    public const string InProgress = "In Progress";
    public const string Completed = "Completed";

    public static readonly string[] All = { NotStarted, InProgress, Completed };
}
