using Microsoft.EntityFrameworkCore;
using RAA.Databases;
using RAA.Interfaces;
using RAA.Models;
using RAA.Services;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IHelperService, HelperService>();
builder.Services.AddScoped<IService, Service>();
Console.WriteLine(builder.Configuration.GetConnectionString("DefaultConnection"));

builder.Services.AddDbContext<DB>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"))
);
builder.Services.Configure<SMTP>(
    builder.Configuration.GetSection("Smtp")
);

var app = builder.Build();

app.UseDeveloperExceptionPage();
app.UseSwagger();
app.UseSwaggerUI();

app.MapControllers();
app.Run();
