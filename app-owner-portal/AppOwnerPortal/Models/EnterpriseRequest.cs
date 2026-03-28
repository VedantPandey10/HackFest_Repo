using System.ComponentModel.DataAnnotations;

namespace AppOwnerPortal.Models
{
    public enum EnterpriseStatus
    {
        Pending,
        Approved,
        Rejected
    }

    public class EnterpriseRequest
    {
        [Key]
        public int Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string ContactName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public int TeamSize { get; set; }
        public string PasswordHash { get; set; } = string.Empty;
        public EnterpriseStatus Status { get; set; } = EnterpriseStatus.Pending;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ReviewedAt { get; set; }
        public string? ReviewNotes { get; set; }
    }
}
