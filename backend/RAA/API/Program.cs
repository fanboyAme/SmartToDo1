using RAA.Domain.Models.AuthModels;
using RAA.Infrastructure.Databases;
using RAA.Infrastructure.Middleware;
using Serilog;

var builder = WebApplication.CreateBuilder(args);
var jwtOptions = builder.Configuration
    .GetSection("JwtOptions")
    .Get<JwtOptions>();

builder.Host.UseSerilog();
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddHttpContextAccessor();

builder.Services.AddApplicationServices();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddJwtAuth(jwtOptions);

var app = builder.Build();

await DbSeeder.SeedAsync(app);

app.UseCors();
app.UseSwagger();
app.UseSwaggerUI();
app.UseSerilogRequestLogging();
app.UseCustomExceptionMiddleware();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();