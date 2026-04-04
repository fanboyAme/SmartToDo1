using Microsoft.EntityFrameworkCore;
using RAA.Domain.Models.AuthModels;
using RAA.Domain.Models.TaskModels;

namespace RAA.Infrastructure.Databases;
    public class ApplicationDbContext : DbContext
   {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
     public DbSet<Users> Users { get; set; }
    public DbSet<TaskModel> Tasks { get; set; }
    public DbSet<TokenModel> Tokens { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<TaskModel>()
            .HasOne(t => t.User)
            .WithMany(u => u.Tasks)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<TokenModel>()
            .HasOne(t => t.User)
            .WithMany(u => u.Token)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        modelBuilder.Entity<TokenModel>()
            .HasIndex(t => t.RefreshTokenHash)
            .IsUnique();
    }
   }
