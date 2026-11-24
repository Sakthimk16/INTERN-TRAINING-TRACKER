using System.Globalization;
using InternTracker.Api.Dtos;
using InternTracker.Api.Models;
using InternTracker.Api.Repositories;

namespace InternTracker.Api.Services;

public class AssignmentService
{
    private readonly AssignmentRepository _assignments;
    private readonly UserRepository _users;

    public AssignmentService(AssignmentRepository assignments, UserRepository users)
    {
        _assignments = assignments;
        _users = users;
    }

    public Task<List<AssignmentListItem>> ListAllAsync() => _assignments.ListAllAsync();

    public Task<List<MyAssignmentItem>> ListMineAsync(int traineeId) => _assignments.ListForTraineeAsync(traineeId);

    /// <summary>Trainer sees any assignment; a trainee only their own (others return 404).</summary>
    public async Task<ServiceResult<AssignmentDetail>> GetAsync(int id, int userId, string role)
    {
        int? ownerFilter = role == Roles.Trainee ? userId : null;
        var detail = await _assignments.GetDetailAsync(id, ownerFilter);
        return detail is null ? ServiceResult<AssignmentDetail>.NotFound() : ServiceResult<AssignmentDetail>.Ok(detail);
    }

    public async Task<ServiceResult<AssignmentDetail>> CreateAsync(CreateAssignmentRequest req, int trainerId)
    {
        var errors = new FieldErrors();

        if (req.TraineeId is null or <= 0 || !await _users.IsTraineeAsync(req.TraineeId.Value))
            errors.Add("traineeId", "Select a trainee.");

        var topic = req.Topic?.Trim();
        if (string.IsNullOrWhiteSpace(topic)) errors.Add("topic", "Topic is required.");
        else if (topic.Length > 200) errors.Add("topic", "Topic must be 200 characters or fewer.");

        var videoUrl = string.IsNullOrWhiteSpace(req.VideoUrl) ? null : req.VideoUrl.Trim();
        if (videoUrl is not null)
        {
            var ok = videoUrl.Length <= 1000
                     && Uri.TryCreate(videoUrl, UriKind.Absolute, out var uri)
                     && (uri.Scheme == Uri.UriSchemeHttp || uri.Scheme == Uri.UriSchemeHttps);
            if (!ok) errors.Add("videoUrl", "Enter a valid http:// or https:// link.");
        }

        var notes = string.IsNullOrWhiteSpace(req.Notes) ? null : req.Notes.Trim();
        if (notes is not null && notes.Length > 2000) errors.Add("notes", "Notes are too long.");

        string? dueDate = null;
        if (!string.IsNullOrWhiteSpace(req.DueDate))
        {
            if (DateOnly.TryParseExact(req.DueDate.Trim(), "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var d))
                dueDate = d.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
            else
                errors.Add("dueDate", "Enter a valid date.");
        }

        if (errors.Any) return ServiceResult<AssignmentDetail>.Invalid(errors);

        var id = await _assignments.InsertAsync(req.TraineeId!.Value, trainerId, topic!, videoUrl, notes, dueDate);
        var detail = await _assignments.GetDetailAsync(id, null);
        return ServiceResult<AssignmentDetail>.Created(detail!);
    }

    public async Task<ServiceResult<AssignmentDetail>> UpdateStatusAsync(int id, int traineeId, UpdateStatusRequest req)
    {
        if (req.Status is null || !Statuses.All.Contains(req.Status))
        {
            var errors = new FieldErrors();
            errors.Add("status", "Select a valid status.");
            return ServiceResult<AssignmentDetail>.Invalid(errors);
        }

        var affected = await _assignments.UpdateStatusAsync(id, traineeId, req.Status);
        if (affected == 0) return ServiceResult<AssignmentDetail>.NotFound();

        var detail = await _assignments.GetDetailAsync(id, traineeId);
        return detail is null ? ServiceResult<AssignmentDetail>.NotFound() : ServiceResult<AssignmentDetail>.Ok(detail);
    }
}
