using Microsoft.EntityFrameworkCore;
using RAA.Models;

namespace RAA.Databases;
    public class ApplicationDbContext : DbContext
    {
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
     public DbSet<Users> Users { get; set; }

    }
