using Microsoft.EntityFrameworkCore;
using RAA.Models.AuthModels;
using RAA.Models.TaskModels;

namespace RAA.Databases;
    public class ApplicationDbContext : DbContext
    {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
     public DbSet<Users> Users { get; set; }
    public DbSet<TaskModel> Tasks { get; set; }

    }
