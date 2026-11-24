using System.Text;
using InternTracker.Api.Data;
using InternTracker.Api.Models;
using InternTracker.Api.Repositories;
using InternTracker.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// ---- Configuration (TRD section 10: keys live in appsettings / environment variables) ----
var jwt = builder.Configuration.GetSection("Jwt");
var secret = jwt["Secret"];
if (string.IsNullOrWhiteSpace(secret) || secret.Length < 32)
{
    throw new InvalidOperationException(
        "Jwt:Secret must be set (at least 32 characters) in appsettings.Development.json or the environment variable Jwt__Secret.");
}

// ---- Services ----
builder.Services.AddControllers();
builder.Services.AddProblemDetails();

builder.Services.AddSingleton<DbConnectionFactory>();
builder.Services.AddSingleton<IPasswordHasher<User>, PasswordHasher<User>>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<AssignmentRepository>();
builder.Services.AddSingleton<TokenService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<TraineeService>();
builder.Services.AddScoped<AssignmentService>();
builder.Services.AddScoped<DashboardService>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false; // keep claim names exactly as issued: sub, name, role
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwt["Issuer"],
            ValidateAudience = true,
            ValidAudience = jwt["Audience"],
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(1),
            NameClaimType = "name",
            RoleClaimType = "role"
        };
    });
builder.Services.AddAuthorization();

var origins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
builder.Services.AddCors(o => o.AddDefaultPolicy(p => p.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseExceptionHandler();   // unexpected errors (for example database down) -> 500 problem details
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.Run();
