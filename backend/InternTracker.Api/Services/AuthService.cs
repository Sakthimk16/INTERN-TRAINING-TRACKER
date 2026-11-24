using InternTracker.Api.Dtos;
using InternTracker.Api.Models;
using InternTracker.Api.Repositories;
using Microsoft.AspNetCore.Identity;

namespace InternTracker.Api.Services;

public class AuthService
{
    private const string InvalidLogin = "Invalid email or password.";

    private readonly UserRepository _users;
    private readonly IPasswordHasher<User> _hasher;
    private readonly TokenService _tokens;

    public AuthService(UserRepository users, IPasswordHasher<User> hasher, TokenService tokens)
    {
        _users = users;
        _hasher = hasher;
        _tokens = tokens;
    }

    public async Task<ServiceResult<LoginResponse>> LoginAsync(LoginRequest req)
    {
        var errors = new FieldErrors();
        Validators.Email(errors, req.Email);
        if (string.IsNullOrEmpty(req.Password)) errors.Add("password", "Password is required.");
        if (errors.Any) return ServiceResult<LoginResponse>.Invalid(errors);

        // Wrong email, wrong password and wrong role all return the same generic 401 (TRD TR-F-01).
        var user = await _users.GetByEmailAsync(Validators.NormalizeEmail(req.Email!));
        if (user is null) return ServiceResult<LoginResponse>.Unauthorized(InvalidLogin);

        var verify = _hasher.VerifyHashedPassword(user, user.PasswordHash, req.Password!);
        if (verify == PasswordVerificationResult.Failed) return ServiceResult<LoginResponse>.Unauthorized(InvalidLogin);

        if (!string.Equals(user.Role, req.Role, StringComparison.Ordinal))
            return ServiceResult<LoginResponse>.Unauthorized(InvalidLogin);

        var (token, expiresAt) = _tokens.Create(user);
        return ServiceResult<LoginResponse>.Ok(new LoginResponse
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = new UserProfile { Id = user.Id, Name = user.Name, Email = user.Email, Role = user.Role }
        });
    }
}
