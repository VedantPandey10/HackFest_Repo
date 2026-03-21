using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReincrewBackend.Data;
using ReincrewBackend.Models;
using System.Security.Cryptography;
using System.Text;

namespace ReincrewBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register/candidate")]
        public async Task<IActionResult> RegisterCandidate([FromBody] CandidateRegistrationDto dto)
        {
            if (await _context.Candidates.AnyAsync(c => c.Email == dto.Email))
                return BadRequest("Email already registered.");

            var candidate = new Candidate
            {
                Name = dto.Name,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                Position = dto.Position
            };

            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Registration successful" });
        }

        [HttpPost("login/candidate")]
        public async Task<IActionResult> LoginCandidate([FromBody] LoginDto dto)
        {
            try
            {
                var candidate = await _context.Candidates.FirstOrDefaultAsync(c => c.Email == dto.Email);
                if (candidate == null || !VerifyPassword(dto.Password, candidate.PasswordHash))
                    return Unauthorized("Invalid credentials.");

                return Ok(new { token = "dummy-candidate-token", candidateId = candidate.Id, name = candidate.Name });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, detail = ex.InnerException?.Message });
            }
        }

        [HttpPost("register/admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] AdminRegistrationDto dto)
        {
            if (await _context.AdminProfiles.AnyAsync(a => a.Username == dto.Username || a.Email == dto.Email))
                return BadRequest("Username or Email already exists.");

            var admin = new AdminProfile
            {
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password)
            };

            _context.AdminProfiles.Add(admin);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Admin registered successfully" });
        }

        [HttpPost("login/admin")]
        public async Task<IActionResult> LoginAdmin([FromBody] LoginDto dto)
        {
            // Support both username and email login for admin
            var admin = await _context.AdminProfiles.FirstOrDefaultAsync(a => a.Email == dto.Email || a.Username == dto.Email);
            if (admin == null || !VerifyPassword(dto.Password, admin.PasswordHash))
                return Unauthorized("Invalid credentials.");

            return Ok(new { token = "dummy-admin-token", name = admin.Username });
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        private bool VerifyPassword(string password, string hash)
        {
            return HashPassword(password) == hash;
        }
    }

    public class CandidateRegistrationDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string? Position { get; set; }
    }

    public class AdminRegistrationDto
    {
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class LoginDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
