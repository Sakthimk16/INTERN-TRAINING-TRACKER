using InternTracker.Api.Dtos;
using InternTracker.Api.Models;
using InternTracker.Api.Repositories;
using Microsoft.AspNetCore.Identity;
using MySqlConnector;

namespace InternTracker.Api.Services;

public class TraineeService
{
    private const string DuplicateEmail = "An account with this email already exists";

    private readonly UserRepository _users;
    private readonly IPasswordHasher<User> _hasher;

    public TraineeService(UserRepository users, IPasswordHasher<User> hasher)
    {
        _users = users;
        _hasher = hasher;
    }

    public async Task<List<TraineeDto>> ListAsync() => await _users.ListTraineesAsync();

    public async Task<ServiceResult<TraineeDto>> CreateAsync(CreateTraineeRequest req)
    {
        var errors = new FieldErrors();

        var name = req.Name?.Trim();
        if (string.IsNullOrWhiteSpace(name)) errors.Add("name", "Name is required.");
        else if (name.Length > 100) errors.Add("name", "Name must be 100 characters or fewer.");

        Validators.Email(errors, req.Email);

        if (string.IsNullOrEmpty(req.InitialPassword)) errors.Add("initialPassword", "Initial password is required.");
        else if (req.InitialPassword.Length < 8 || req.InitialPassword.Length > 100)
            errors.Add("initialPassword", "Use at least 8 characters.");

        if (errors.Any) return ServiceResult<TraineeDto>.Invalid(errors);

        var email = Validators.NormalizeEmail(req.Email!);
        if (await _users.EmailExistsAsync(email))
            return ServiceResult<TraineeDto>.Conflict("email", DuplicateEmail);

        var user = new User { Name = name!, Email = email, Role = Roles.Trainee };
        user.PasswordHash = _hasher.HashPassword(user, req.InitialPassword!);

        try
        {
            var id = await _users.InsertAsync(user);
            return ServiceResult<TraineeDto>.Created(new TraineeDto { Id = id, Name = user.Name, Email = user.Email });
        }
        catch (MySqlException ex) when (ex.ErrorCode == MySqlErrorCode.DuplicateKeyEntry)
        {
            // Two requests raced past the EmailExists check; the unique index still protects us.
            return ServiceResult<TraineeDto>.Conflict("email", DuplicateEmail);
        }
    }
}
