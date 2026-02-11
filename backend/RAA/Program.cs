using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using RAA.Databases;
using RAA.Interfaces;
using RAA.Models.AuthModels;
using RAA.Services;
using RAA.Services.AuthServices;
using System.Text;


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

builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IHelperService, HelperAuthService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<IService, AuthService>();
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
app.Use(async (context, next) =>
{
    Console.WriteLine("---- REQUEST ----");
    Console.WriteLine($"Time: {DateTime.Now}");
    Console.WriteLine($"Method: {context.Request.Method}");
    Console.WriteLine($"Path: {context.Request.Path}");
    Console.WriteLine($"Auth header: {context.Request.Headers["Authorization"]}");
    Console.WriteLine("-----------------");

    await next();

    Console.WriteLine("---- RESPONSE ----");
    Console.WriteLine($"Status: {context.Response.StatusCode}");
    Console.WriteLine("------------------");
});
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
