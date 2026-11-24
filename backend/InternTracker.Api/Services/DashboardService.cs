using InternTracker.Api.Models;
using InternTracker.Api.Repositories;

namespace InternTracker.Api.Services;

public class DashboardService
{
    private readonly AssignmentRepository _assignments;
    public DashboardService(AssignmentRepository assignments) => _assignments = assignments;

    /// <summary>Returns the role-specific summary payload (TRD section 7.2).</summary>
    public async Task<object> GetSummaryAsync(int userId, string role) =>
        role == Roles.Trainer
            ? await _assignments.GetTrainerSummaryAsync(userId)
            : await _assignments.GetTraineeSummaryAsync(userId);
}
