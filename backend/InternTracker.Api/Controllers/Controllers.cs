using InternTracker.Api.Dtos;
using InternTracker.Api.Models;
using InternTracker.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace InternTracker.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _auth;
    public AuthController(AuthService auth) => _auth = auth;

    // POST /api/auth/login  (anonymous)
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request) =>
        this.ToResult(await _auth.LoginAsync(request));
}

[ApiController]
[Route("api/trainees")]
[Authorize(Roles = Roles.Trainer)]
public class TraineesController : ControllerBase
{
    private readonly TraineeService _trainees;
    public TraineesController(TraineeService trainees) => _trainees = trainees;

    // GET /api/trainees
    [HttpGet]
    public async Task<IActionResult> List() => Ok(await _trainees.ListAsync());

    // POST /api/trainees
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateTraineeRequest request) =>
        this.ToResult(await _trainees.CreateAsync(request));
}

[ApiController]
[Route("api/assignments")]
[Authorize]
public class AssignmentsController : ControllerBase
{
    private readonly AssignmentService _assignments;
    public AssignmentsController(AssignmentService assignments) => _assignments = assignments;

    // GET /api/assignments  (trainer)
    [HttpGet]
    [Authorize(Roles = Roles.Trainer)]
    public async Task<IActionResult> List() => Ok(await _assignments.ListAllAsync());

    // POST /api/assignments  (trainer)
    [HttpPost]
    [Authorize(Roles = Roles.Trainer)]
    public async Task<IActionResult> Create([FromBody] CreateAssignmentRequest request) =>
        this.ToResult(await _assignments.CreateAsync(request, User.GetUserId()));

    // GET /api/assignments/mine  (trainee) - id comes from the JWT, not the query string
    [HttpGet("mine")]
    [Authorize(Roles = Roles.Trainee)]
    public async Task<IActionResult> Mine() => Ok(await _assignments.ListMineAsync(User.GetUserId()));

    // GET /api/assignments/{id}  (trainer or owning trainee)
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id) =>
        this.ToResult(await _assignments.GetAsync(id, User.GetUserId(), User.GetRole()));

    // PATCH /api/assignments/{id}/status  (owning trainee)
    [HttpPatch("{id:int}/status")]
    [Authorize(Roles = Roles.Trainee)]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusRequest request) =>
        this.ToResult(await _assignments.UpdateStatusAsync(id, User.GetUserId(), request));
}

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboard;
    public DashboardController(DashboardService dashboard) => _dashboard = dashboard;

    // GET /api/dashboard/summary  (role-specific payload)
    [HttpGet("summary")]
    public async Task<IActionResult> Summary() =>
        Ok(await _dashboard.GetSummaryAsync(User.GetUserId(), User.GetRole()));
}
