using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using AppOwnerPortal.Data;
using AppOwnerPortal.Models;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace AppOwnerPortal.Pages
{
    [Authorize]
    public class IndexModel : PageModel
    {
        private readonly AppOwnerDbContext _context;

        public IndexModel(AppOwnerDbContext context)
        {
            _context = context;
        }

        public List<EnterpriseRequest> Requests { get; set; } = new();

        public async Task OnGetAsync()
        {
            Requests = await _context.EnterpriseRequests
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<IActionResult> OnPostApproveAsync(int id)
        {
            var request = await _context.EnterpriseRequests.FindAsync(id);
            if (request == null) return NotFound();

            if (request.Status == EnterpriseStatus.Pending)
            {
                request.Status = EnterpriseStatus.Approved;
                request.ReviewedAt = DateTime.UtcNow;

                // Create AdminProfile if it doesn't exist
                if (!await _context.AdminProfiles.AnyAsync(a => a.Email == request.Email))
                {
                    _context.AdminProfiles.Add(new AdminProfile
                    {
                        Username = request.CompanyName,
                        Email = request.Email,
                        PasswordHash = request.PasswordHash
                    });
                }

                await _context.SaveChangesAsync();
            }

            return RedirectToPage();
        }

        public async Task<IActionResult> OnPostRejectAsync(int id, string? notes)
        {
            var request = await _context.EnterpriseRequests.FindAsync(id);
            if (request == null) return NotFound();

            if (request.Status == EnterpriseStatus.Pending)
            {
                request.Status = EnterpriseStatus.Rejected;
                request.ReviewedAt = DateTime.UtcNow;
                request.ReviewNotes = notes;
                await _context.SaveChangesAsync();
            }

            return RedirectToPage();
        }
    }
}
