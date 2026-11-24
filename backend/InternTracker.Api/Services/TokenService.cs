using System.Security.Claims;
using System.Text;
using InternTracker.Api.Models;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;

namespace InternTracker.Api.Services;

/// <summary>Creates the signed JWT carrying user id (sub), name and role.</summary>
public class TokenService
{
    private readonly IConfiguration _config;
    public TokenService(IConfiguration config) => _config = config;

    public (string Token, DateTime ExpiresAt) Create(User user)
    {
        var jwt = _config.GetSection("Jwt");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Secret"]!));
        var minutes = int.TryParse(jwt["ExpiryMinutes"], out var m) ? m : 480;
        var expires = DateTime.UtcNow.AddMinutes(minutes);

        var descriptor = new SecurityTokenDescriptor
        {
            Issuer = jwt["Issuer"],
            Audience = jwt["Audience"],
            Expires = expires,
            SigningCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256),
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("sub", user.Id.ToString()),
                new Claim("name", user.Name),
                new Claim("role", user.Role)
            })
        };

        return (new JsonWebTokenHandler().CreateToken(descriptor), expires);
    }
}
