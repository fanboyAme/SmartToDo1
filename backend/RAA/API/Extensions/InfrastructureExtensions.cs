using Microsoft.EntityFrameworkCore;
using RAA.Domain.Models.AuthModels;
using RAA.Infrastructure.Databases;

public static class InfrastructureExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseSqlServer(config.GetConnectionString("DefaultConnection"))
        );

        services.Configure<SMTP>(config.GetSection("Smtp"));
        services.Configure<JwtOptions>(config.GetSection("JwtOptions"));

        return services;
    }
}