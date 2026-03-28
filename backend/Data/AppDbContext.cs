using Microsoft.EntityFrameworkCore;
using ReincrewBackend.Models;

namespace ReincrewBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Candidate> Candidates { get; set; }
        public DbSet<InterviewSession> InterviewSessions { get; set; }
        public DbSet<EvaluationResult> EvaluationResults { get; set; }
        public DbSet<WarningEvent> WarningEvents { get; set; }
        public DbSet<AdminProfile> AdminProfiles { get; set; }
        public DbSet<EnterpriseRequest> EnterpriseRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships
            modelBuilder.Entity<InterviewSession>()
                .HasOne(s => s.Candidate)
                .WithMany()
                .HasForeignKey(s => s.CandidateId);

            modelBuilder.Entity<InterviewSession>()
                .HasMany(s => s.Results)
                .WithOne()
                .HasForeignKey(r => r.InterviewSessionId);

            modelBuilder.Entity<InterviewSession>()
                .HasMany(s => s.Warnings)
                .WithOne()
                .HasForeignKey(w => w.InterviewSessionId);
                
            // PostgreSQL specific: handle string lists if needed
            // In .NET 8+, EF Core handles primitive collections automatically.
        }
    }
}
