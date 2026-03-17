using Microsoft.EntityFrameworkCore;
using RAA.Application.Interfaces.Repositories;
using RAA.Application.ProjectDtos.UserDtos;
using RAA.Domain.Models.AuthModels;
using RAA.Infrastructure.Databases;

namespace RAA.Infrastructure.Repositories.UserRepository
{
    public class UserRepository: IUserRepository
    {
        private readonly ApplicationDbContext _db;

        public UserRepository(ApplicationDbContext db)
        {
            _db = db;
        }

        // <summary>
        // Поиск пользователя по email
        // </summary>
        public async Task<Users?> FindUserAsync(string email)
        {
            return await _db.Users.SingleOrDefaultAsync(x => x.Email == email);
        }
        public async Task<List<Users>> GetUsers()
        {
            return await _db.Users.ToListAsync();
        }
        public async Task<bool> IsLoginTakenAsync(UserRegistrationDto userRegistrationDto)
        {
            return await _db.Users.AnyAsync(x => x.Login == userRegistrationDto.Login);
        }
        public async Task<bool> IsEmailTakenAsync(UserRegistrationDto userRegistrationDto)
        {
            return await _db.Users.AnyAsync(x => x.Email == userRegistrationDto.Email);
        }
        public async Task<bool> AddAsync(Users user)
        {
            await _db.Users.AddAsync(user);
            return true;
        }
        public async Task<bool> AddAsync(TokenModel tokenModel)
        {
            await _db.Tokens.AddAsync(tokenModel);
            return true;
        }
        public async Task<bool> SaveChangesAsync()
        {
            await _db.SaveChangesAsync();
            return true;
        }
        public async Task<TokenModel?> FindTokenWithUserAsync(string refreshTokenHash)
        {
            return await _db.Tokens.Include(t => t.User).SingleOrDefaultAsync(t => t.RefreshTokenHash == refreshTokenHash);
        }
    }
}