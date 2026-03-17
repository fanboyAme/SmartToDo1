using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RAA.Application.Interfaces.Auth;
using RAA.Application.Interfaces.Services;
using RAA.Application.Interfaces.Task;
using RAA.Application.Services.AuthServices;
using RAA.Application.Services.TasksServices;
using RAA.Domain.Models.AuthModels;
using RAA.Infrastructure.Databases;
using RAA.Infrastructure.Middleware;
using RAA.Infrastructure.Queries;
using RAA.Infrastructure.Repositories.TaskRepository;
using RAA.Infrastructure.Repositories.UserRepository;
using RAA.Infrastructure.Services.AuthServices;
using RAA.Infrastructure.Services.TasksServices;
using Serilog;
using System.Text;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("Logs.log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
var JwtOptions = builder.Configuration.GetSection("JwtOptions").Get<JwtOptions>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});
builder.Services.AddHttpContextAccessor();
builder.Host.UseSerilog();

builder.Services.AddScoped<TaskQueryBuilder>();
builder.Services.AddScoped<CurrentUserService>();
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<TaskRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IHelperService, HelperAuthService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<ITaskFilterService, TaskFilterService>();
Console.WriteLine(builder.Configuration.GetConnectionString("DefaultConnection"));

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.Configure<SMTP>(
    builder.Configuration.GetSection("Smtp")
);
builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection("JwtOptions")
);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = JwtOptions.Issure,
                        ValidAudience = JwtOptions.Audience,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtOptions.SecretKey))
                    };
                });

var app = builder.Build();


app.UseCors();
app.UseDeveloperExceptionPage();
app.UseSwagger();
app.UseSwaggerUI();
app.UseSerilogRequestLogging();
app.UseCustomExceptionMiddleware();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
