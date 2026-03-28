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

                return Ok(new { token = "dummy-candidate-token", candidateId = candidate.Id, name = candidate.Name, email = candidate.Email });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message, detail = ex.InnerException?.Message });
            }
        }

        [HttpPost("register/admin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] AdminRegistrationDto dto)
        {
            // Check if there's an approved enterprise request for this email
            var enterpriseApproved = await _context.EnterpriseRequests.AnyAsync(er =>
                er.Email == dto.Email && er.Status == EnterpriseStatus.Approved);

            if (!enterpriseApproved)
            {
                return BadRequest("Admin registration is restricted to verified enterprise partners. Please purchase an enterprise package and wait for app owner verification.");
            }

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

        // --- Enterprise Registration Endpoints ---

        [HttpPost("register/enterprise")]
        public async Task<IActionResult> RegisterEnterprise([FromBody] EnterpriseRegistrationDto dto)
        {
            if (await _context.EnterpriseRequests.AnyAsync(e => e.Email == dto.Email && e.Status != EnterpriseStatus.Rejected))
                return BadRequest("A request with this email already exists.");

            if (await _context.AdminProfiles.AnyAsync(a => a.Email == dto.Email))
                return BadRequest("An account with this email already exists.");

            var request = new EnterpriseRequest
            {
                CompanyName = dto.CompanyName,
                ContactName = dto.ContactName,
                Email = dto.Email,
                Phone = dto.Phone,
                TeamSize = dto.TeamSize,
                PasswordHash = HashPassword(dto.Password),
                Status = EnterpriseStatus.Pending
            };

            _context.EnterpriseRequests.Add(request);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Enterprise request submitted. You will be notified once reviewed." });
        }

        [HttpGet("enterprise-requests")]
        public async Task<IActionResult> GetEnterpriseRequests()
        {
            var requests = await _context.EnterpriseRequests
                .OrderByDescending(e => e.CreatedAt)
                .Select(e => new
                {
                    e.Id,
                    e.CompanyName,
                    e.ContactName,
                    e.Email,
                    e.Phone,
                    e.TeamSize,
                    status = e.Status.ToString(),
                    e.CreatedAt,
                    e.ReviewedAt,
                    e.ReviewNotes
                })
                .ToListAsync();

            return Ok(requests);
        }

        [HttpPut("enterprise-requests/{id}/approve")]
        public async Task<IActionResult> ApproveEnterprise(int id)
        {
            var request = await _context.EnterpriseRequests.FindAsync(id);
            if (request == null) return NotFound("Request not found.");
            if (request.Status != EnterpriseStatus.Pending) return BadRequest("Request already reviewed.");

            request.Status = EnterpriseStatus.Approved;
            request.ReviewedAt = DateTime.UtcNow;

            // Create an admin account for the approved enterprise
            if (!await _context.AdminProfiles.AnyAsync(a => a.Email == request.Email))
            {
                var admin = new AdminProfile
                {
                    Username = request.CompanyName,
                    Email = request.Email,
                    PasswordHash = request.PasswordHash
                };
                _context.AdminProfiles.Add(admin);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Enterprise request approved. Account created." });
        }

        [HttpPut("enterprise-requests/{id}/reject")]
        public async Task<IActionResult> RejectEnterprise(int id, [FromBody] RejectDto? dto = null)
        {
            var request = await _context.EnterpriseRequests.FindAsync(id);
            if (request == null) return NotFound("Request not found.");
            if (request.Status != EnterpriseStatus.Pending) return BadRequest("Request already reviewed.");

            request.Status = EnterpriseStatus.Rejected;
            request.ReviewedAt = DateTime.UtcNow;
            request.ReviewNotes = dto?.Notes;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Enterprise request rejected." });
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

    public class EnterpriseRegistrationDto
    {
        public string CompanyName { get; set; } = string.Empty;
        public string ContactName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public int TeamSize { get; set; }
        public string Password { get; set; } = string.Empty;
    }

    public class RejectDto
    {
        public string? Notes { get; set; }
    }
}
