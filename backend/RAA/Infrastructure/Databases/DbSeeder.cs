using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using RAA.Domain.Models.AuthModels;

namespace RAA.Infrastructure.Databases
{
    public static class DbSeeder
    {
        public static async Task SeedAsync(WebApplication app)
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            await db.Database.MigrateAsync();

            if (!await db.Users.AnyAsync(u => u.Login == "admin"))
            {
                db.Users.Add(new Users
                {
                    Id = Guid.NewGuid(),
                    Login = "admin",
                    Email = "admin@smarttodo.local",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    UserRole = UserRole.Admin,
                    EmailConfirmed = true,
                    VerificationCode = null,
                    VerificationCodeExpiry = null
                });
            }

            if (!await db.Users.AnyAsync(u => u.Login == "user"))
            {
                db.Users.Add(new Users
                {
                    Id = Guid.NewGuid(),
                    Login = "user",
                    Email = "user@smarttodo.local",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"),
                    UserRole = UserRole.User,
                    EmailConfirmed = true,
                    VerificationCode = null,
                    VerificationCodeExpiry = null
                });
            }

            await db.SaveChangesAsync();
        }
    }
}
