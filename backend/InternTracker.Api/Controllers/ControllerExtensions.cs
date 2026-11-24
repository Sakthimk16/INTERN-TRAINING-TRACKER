using System.Security.Claims;
using InternTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace InternTracker.Api.Controllers;

public static class ControllerExtensions
{
    /// <summary>User id from the validated JWT "sub" claim. Never taken from the request body or query string.</summary>
    public static int GetUserId(this ClaimsPrincipal user) =>
        int.TryParse(user.FindFirst("sub")?.Value, out var id) ? id : 0;

    public static string GetRole(this ClaimsPrincipal user) => user.FindFirst("role")?.Value ?? "";

    /// <summary>Maps a ServiceResult to the status codes and body shapes defined in the TRD (section 7).</summary>
    public static IActionResult ToResult<T>(this ControllerBase c, ServiceResult<T> r) => r.Status switch
    {
        200 => c.Ok(r.Value),
        201 => c.StatusCode(201, r.Value),
        400 or 409 => c.StatusCode(r.Status, new ValidationProblemDetails(r.Errors!)
        {
            Status = r.Status,
            Title = r.Title ?? "One or more validation errors occurred."
        }),
        401 => c.StatusCode(401, new ProblemDetails { Status = 401, Title = r.Title }),
        404 => c.NotFound(new ProblemDetails { Status = 404, Title = r.Title }),
        _ => c.StatusCode(500, new ProblemDetails { Status = 500, Title = "Unexpected error." })
    };
}
