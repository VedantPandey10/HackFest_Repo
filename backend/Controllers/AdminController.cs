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
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("candidates")]
        public async Task<IActionResult> CreateCandidate([FromBody] AdminCandidateCreationDto dto)
        {
            if (await _context.Candidates.AnyAsync(c => c.Email == dto.Email))
                return BadRequest("Email already registered.");

            if (!string.IsNullOrEmpty(dto.AccessId) && await _context.Candidates.AnyAsync(c => c.AccessId == dto.AccessId))
                return BadRequest("Unique ID (AccessId) already exists.");

            var candidate = new Candidate
            {
                Name = dto.Name,
                Email = dto.Email,
                Position = dto.Position,
                AccessId = string.IsNullOrEmpty(dto.AccessId) ? Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper() : dto.AccessId,
                PasswordHash = HashPassword(dto.Password ?? "Default123!"),
                IsVerified = true // Admin-created candidates are pre-verified
            };

            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Candidate created successfully", candidateId = candidate.Id, accessId = candidate.AccessId });
        }

        [HttpGet("candidates")]
        public async Task<IActionResult> GetCandidates()
        {
            var candidates = await _context.Candidates
                .OrderByDescending(c => c.Id)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Email,
                    c.Position,
                    c.AccessId,
                    c.IsVerified
                })
                .ToListAsync();

            return Ok(candidates);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }

    public class AdminCandidateCreationDto
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Position { get; set; }
        public string? AccessId { get; set; }
        public string? Password { get; set; }
    }
}
