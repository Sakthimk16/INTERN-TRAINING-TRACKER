using MySqlConnector;

namespace InternTracker.Api.Data;

/// <summary>Creates a new MySQL connection per call (connection pooling is handled by MySqlConnector).</summary>
public class DbConnectionFactory
{
    private readonly string _connectionString;

    public DbConnectionFactory(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("Default")
            ?? throw new InvalidOperationException("ConnectionStrings:Default is not configured.");
        if (string.IsNullOrWhiteSpace(_connectionString))
            throw new InvalidOperationException("ConnectionStrings:Default is empty. Set it in appsettings.Development.json.");
    }

    public MySqlConnection Create() => new(_connectionString);
}
