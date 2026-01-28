using Microsoft.EntityFrameworkCore;
using RAA.Models;

namespace RAA.Databases;
    public class DB : DbContext
    {
    public DB(DbContextOptions<DB> options) : base(options) { }
     public DbSet<Users> Users { get; set; }

    }
