using Dapper;
using InternTracker.Api.Data;
using InternTracker.Api.Dtos;
using InternTracker.Api.Models;

namespace InternTracker.Api.Repositories;

/// <summary>All SQL for the Users table. Parameterized Dapper queries only.</summary>
public class UserRepository
{
    private readonly DbConnectionFactory _db;
    public UserRepository(DbConnectionFactory db) => _db = db;

    public async Task<User?> GetByEmailAsync(string email)
    {
        await using var conn = _db.Create();
        return await conn.QuerySingleOrDefaultAsync<User>(
            "SELECT Id, Name, Email, PasswordHash, Role FROM Users WHERE Email = @email",
            new { email });
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        await using var conn = _db.Create();
        var count = await conn.ExecuteScalarAsync<int>(
            "SELECT COUNT(1) FROM Users WHERE Email = @email", new { email });
        return count > 0;
    }

    public async Task<bool> IsTraineeAsync(int id)
    {
        await using var conn = _db.Create();
        var count = await conn.ExecuteScalarAsync<int>(
            "SELECT COUNT(1) FROM Users WHERE Id = @id AND Role = 'Trainee'", new { id });
        return count > 0;
    }

    public async Task<List<TraineeDto>> ListTraineesAsync()
    {
        await using var conn = _db.Create();
        var rows = await conn.QueryAsync<TraineeDto>(
            "SELECT Id, Name, Email FROM Users WHERE Role = 'Trainee' ORDER BY Name");
        return rows.ToList();
    }

    public async Task<int> InsertAsync(User user)
    {
        await using var conn = _db.Create();
        return await conn.ExecuteScalarAsync<int>(
            @"INSERT INTO Users (Name, Email, PasswordHash, Role)
              VALUES (@Name, @Email, @PasswordHash, @Role);
              SELECT LAST_INSERT_ID();",
            user);
    }
}
