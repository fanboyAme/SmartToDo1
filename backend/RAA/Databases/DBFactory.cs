using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace RAA.Databases
{
    public class DBFactory : IDesignTimeDbContextFactory<DB>
    {
        public DB CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString =
                configuration.GetConnectionString("DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<DB>();
            optionsBuilder.UseSqlServer(connectionString);

            return new DB(optionsBuilder.Options);
        }
    }
}
