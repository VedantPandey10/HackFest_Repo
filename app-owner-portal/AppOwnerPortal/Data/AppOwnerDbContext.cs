using Microsoft.EntityFrameworkCore;
using AppOwnerPortal.Models;

namespace AppOwnerPortal.Data
{
    public class AppOwnerDbContext : DbContext
    {
        public AppOwnerDbContext(DbContextOptions<AppOwnerDbContext> options) : base(options) { }

        public DbSet<EnterpriseRequest> EnterpriseRequests { get; set; }
        public DbSet<AdminProfile> AdminProfiles { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EnterpriseRequest>().ToTable("EnterpriseRequests");
            modelBuilder.Entity<AdminProfile>().ToTable("AdminProfiles");
        }
    }
}
