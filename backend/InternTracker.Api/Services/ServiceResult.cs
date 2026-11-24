using System.Text.RegularExpressions;

namespace InternTracker.Api.Services;

/// <summary>Collects field-level messages. Keys are camelCase so the UI can show them under the right input.</summary>
public sealed class FieldErrors
{
    private readonly Dictionary<string, List<string>> _errors = new();

    public bool Any => _errors.Count > 0;

    public void Add(string field, string message)
    {
        if (!_errors.TryGetValue(field, out var list))
            _errors[field] = list = new List<string>();
        list.Add(message);
    }

    public Dictionary<string, string[]> ToDictionary() =>
        _errors.ToDictionary(kv => kv.Key, kv => kv.Value.ToArray());
}

/// <summary>What a service returns; the controller turns it into an HTTP response.</summary>
public sealed class ServiceResult<T>
{
    public int Status { get; private init; }
    public T? Value { get; private init; }
    public Dictionary<string, string[]>? Errors { get; private init; }
    public string? Title { get; private init; }

    public static ServiceResult<T> Ok(T value) => new() { Status = 200, Value = value };
    public static ServiceResult<T> Created(T value) => new() { Status = 201, Value = value };
    public static ServiceResult<T> Invalid(FieldErrors e) => new() { Status = 400, Errors = e.ToDictionary() };
    public static ServiceResult<T> Conflict(string field, string message) =>
        new() { Status = 409, Title = message, Errors = new() { [field] = new[] { message } } };
    public static ServiceResult<T> Unauthorized(string title) => new() { Status = 401, Title = title };
    public static ServiceResult<T> NotFound() => new() { Status = 404, Title = "Not found." };
}

public static class Validators
{
    private static readonly Regex EmailPattern = new(@"^[^@\s]+@[^@\s]+\.[^@\s]+$", RegexOptions.Compiled);

    public static void Email(FieldErrors e, string? email)
    {
        if (string.IsNullOrWhiteSpace(email)) e.Add("email", "Email is required.");
        else if (email.Trim().Length > 255 || !EmailPattern.IsMatch(email.Trim())) e.Add("email", "Enter a valid email address.");
    }

    public static string NormalizeEmail(string email) => email.Trim().ToLowerInvariant();
}
