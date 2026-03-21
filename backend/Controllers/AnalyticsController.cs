using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReincrewBackend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReincrewBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly Data.AppDbContext _context;

        public AnalyticsController(Data.AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("sessions")]
        public async Task<ActionResult<IEnumerable<InterviewSession>>> GetSessions()
        {
            var sessions = await _context.InterviewSessions
                .Include(s => s.Candidate)
                .Include(s => s.Results)
                .Include(s => s.Warnings)
                .ToListAsync();
            return Ok(sessions);
        }

        [HttpPost("sessions")]
        public async Task<ActionResult<InterviewSession>> SaveSession([FromBody] InterviewSession session)
        {
            // The database will generate the ID automatically
            _context.InterviewSessions.Add(session);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSessions), new { id = session.Id }, session);
        }
    }
}
