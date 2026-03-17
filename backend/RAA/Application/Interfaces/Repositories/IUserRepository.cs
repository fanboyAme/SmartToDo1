using RAA.Application.ProjectDtos.UserDtos;
using RAA.Domain.Models.AuthModels;
using System.Threading.Tasks;

namespace RAA.Application.Interfaces.Repositories
{
    public interface IUserRepository
    {
        public Task<Users?> FindUserAsync(string email);
        public Task<List<Users>> GetUsers();
        public Task<bool> IsLoginTakenAsync(UserRegistrationDto userRegistrationDto);
        public Task<bool> IsEmailTakenAsync(UserRegistrationDto userRegistrationDto);
        public Task<bool> AddAsync(Users user);
        public Task<bool> AddAsync(TokenModel tokenModel);
        public Task<bool> SaveChangesAsync();
        public Task<TokenModel?> FindTokenWithUserAsync(string refreshTokenHash);

    }
}