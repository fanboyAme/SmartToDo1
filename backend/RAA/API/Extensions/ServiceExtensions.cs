using RAA.Application.Interfaces.Auth;
using RAA.Application.Interfaces.Repositories;
using RAA.Application.Interfaces.Services;
using RAA.Application.Interfaces.Tasks;
using RAA.Application.Services.AuthServices;
using RAA.Application.Services.TasksServices;
using RAA.Infrastructure.Queries;
using RAA.Infrastructure.Repositories.TaskRepository;
using RAA.Infrastructure.Repositories.UserRepository;
using RAA.Infrastructure.Services.AuthServices;
using RAA.Infrastructure.Services.TasksServices;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<ITokenService, TokenService>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ITaskRepository, TaskRepository>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IHelperService, HelperAuthService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ITaskService, TaskService>();
        services.AddScoped<ITaskFilterService, TaskFilterService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<ITaskQueryBuilder, TaskQueryBuilder>();

        return services;
    }
}