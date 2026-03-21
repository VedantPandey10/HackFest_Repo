namespace ReincrewBackend.Models
{
    public class Candidate
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Position { get; set; }
        public string? Company { get; set; }
        public string? AccessId { get; set; }
        public string? JobPostId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? IdNumber { get; set; }
        public string? ProfilePhoto { get; set; }
        public string? IdCardImage { get; set; }
        public bool IsVerified { get; set; }
    }
}
