using Dapper;
using InternTracker.Api.Data;
using InternTracker.Api.Dtos;

namespace InternTracker.Api.Repositories;

/// <summary>All SQL for the Assignments table. Overdue is never stored; it is calculated here (TRD section 6).</summary>
public class AssignmentRepository
{
    // One overdue rule used by every query: due date passed, not completed. Due today is NOT overdue.
    private const string Overdue =
        "(a.DueDate IS NOT NULL AND a.DueDate < CURDATE() AND a.Status <> 'Completed')";

    private const string DueDateText = "DATE_FORMAT(a.DueDate, '%Y-%m-%d')";

    private readonly DbConnectionFactory _db;
    public AssignmentRepository(DbConnectionFactory db) => _db = db;

    public async Task<List<AssignmentListItem>> ListAllAsync()
    {
        await using var conn = _db.Create();
        var rows = await conn.QueryAsync<AssignmentListItem>($@"
            SELECT a.Id, a.TraineeId, u.Name AS TraineeName, a.Topic, a.Status,
                   {DueDateText} AS DueDate, {Overdue} AS IsOverdue
            FROM Assignments a
            JOIN Users u ON u.Id = a.TraineeId
            ORDER BY a.CreatedAt DESC, a.Id DESC");
        return rows.ToList();
    }

    public async Task<List<MyAssignmentItem>> ListForTraineeAsync(int traineeId)
    {
        await using var conn = _db.Create();
        var rows = await conn.QueryAsync<MyAssignmentItem>($@"
            SELECT a.Id, a.Topic, a.Status, {DueDateText} AS DueDate, {Overdue} AS IsOverdue
            FROM Assignments a
            WHERE a.TraineeId = @traineeId
            ORDER BY a.CreatedAt DESC, a.Id DESC",
            new { traineeId });
        return rows.ToList();
    }

    /// <summary>traineeId = null means no ownership filter (trainer). Otherwise the row must belong to that trainee.</summary>
    public async Task<AssignmentDetail?> GetDetailAsync(int id, int? traineeId)
    {
        await using var conn = _db.Create();
        return await conn.QuerySingleOrDefaultAsync<AssignmentDetail>($@"
            SELECT a.Id, a.TraineeId, u.Name AS TraineeName, a.Topic, a.Notes, a.VideoUrl,
                   {DueDateText} AS DueDate, a.Status, {Overdue} AS IsOverdue,
                   a.CreatedAt, a.UpdatedAt
            FROM Assignments a
            JOIN Users u ON u.Id = a.TraineeId
            WHERE a.Id = @id AND (@traineeId IS NULL OR a.TraineeId = @traineeId)",
            new { id, traineeId });
    }

    public async Task<int> InsertAsync(int traineeId, int trainerId, string topic, string? videoUrl, string? notes, string? dueDate)
    {
        await using var conn = _db.Create();
        return await conn.ExecuteScalarAsync<int>(@"
            INSERT INTO Assignments (TraineeId, CreatedByTrainerId, Topic, VideoUrl, Notes, DueDate, Status)
            VALUES (@traineeId, @trainerId, @topic, @videoUrl, @notes, @dueDate, 'Not Started');
            SELECT LAST_INSERT_ID();",
            new { traineeId, trainerId, topic, videoUrl, notes, dueDate });
    }

    /// <summary>The trainee id is part of the WHERE clause, so another trainee's row can never be updated.</summary>
    public async Task<int> UpdateStatusAsync(int id, int traineeId, string status)
    {
        await using var conn = _db.Create();
        return await conn.ExecuteAsync(
            "UPDATE Assignments SET Status = @status WHERE Id = @id AND TraineeId = @traineeId",
            new { id, traineeId, status });
    }

    // ---- Dashboard counts ----
    private const string CountColumns = @"
        COUNT(*) AS Total,
        CAST(COALESCE(SUM(a.Status = 'Not Started'), 0) AS SIGNED) AS NotStarted,
        CAST(COALESCE(SUM(a.Status = 'In Progress'), 0) AS SIGNED) AS InProgress,
        CAST(COALESCE(SUM(a.Status = 'Completed'), 0) AS SIGNED) AS Completed,
        CAST(COALESCE(SUM(a.DueDate IS NOT NULL AND a.DueDate < CURDATE() AND a.Status <> 'Completed'), 0) AS SIGNED) AS Overdue";

    public async Task<TraineeSummary> GetTraineeSummaryAsync(int traineeId)
    {
        await using var conn = _db.Create();
        var s = await conn.QuerySingleAsync<TraineeSummary>(
            $"SELECT {CountColumns} FROM Assignments a WHERE a.TraineeId = @traineeId",
            new { traineeId });
        s.CompletionPercent = s.Total == 0 ? 0 : (int)Math.Round(s.Completed * 100.0 / s.Total, MidpointRounding.AwayFromZero);
        return s;
    }

    public async Task<TrainerSummary> GetTrainerSummaryAsync(int trainerId)
    {
        await using var conn = _db.Create();
        var counts = await conn.QuerySingleAsync<TraineeSummary>(
            $"SELECT {CountColumns} FROM Assignments a WHERE a.CreatedByTrainerId = @trainerId",
            new { trainerId });
        var interns = await conn.ExecuteScalarAsync<int>("SELECT COUNT(1) FROM Users WHERE Role = 'Trainee'");
        return new TrainerSummary
        {
            InternCount = interns,
            TotalAssignments = counts.Total,
            NotStarted = counts.NotStarted,
            InProgress = counts.InProgress,
            Completed = counts.Completed,
            Overdue = counts.Overdue
        };
    }
}
