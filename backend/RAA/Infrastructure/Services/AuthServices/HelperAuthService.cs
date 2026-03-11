using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace RAA.Infrastructure.Services.AuthServices

{
    using BCrypt.Net;
    using RAA.Application.Interfaces.Services;
    using RAA.Application.ProjectDtos.ResponceDto;
    using RAA.Application.ProjectDtos.UserDtos;
    using RAA.Domain.Models.AuthModels;
    using RAA.Infrastructure.Databases;

    public class HelperAuthService: IHelperService
    {
        private readonly ApplicationDbContext _db;
        private readonly TokenService _tokenService;
        public HelperAuthService(ApplicationDbContext db, TokenService jwtService) {  _db = db; _tokenService = jwtService; }

        // <summary>
        // Проверка данных пользователя
        // </summary>
        public async Task<AuthResponseDto?> Auth(UserAuthDto UserAuthDto)
        {
            if (UserAuthDto is null) 
                return null;
            var currentUser = await _db.Users.SingleOrDefaultAsync(x => x.Login == UserAuthDto.Login);
            if (currentUser is null || !currentUser.EmailConfirmed) 
                return null;
            if (!BCrypt.Verify(UserAuthDto.Password, currentUser.PasswordHash)) 
                return null;
            var accesToken = _tokenService.GenerateAccessToken(currentUser.Email, currentUser.Id);
            var refreshToken = _tokenService.GenerateRefreshToken();
            var refreshTokenHash = _tokenService.HashRefreshToken(refreshToken);

            var tokenEntity = new TokenModel
                (refreshTokenHash, 
                currentUser.Id, 
                DateTime.UtcNow.AddMonths(1));
            _db.Tokens.Add(tokenEntity);

            _db.SaveChanges();

            return new AuthResponseDto 
            { 
                AccessToken = accesToken, 
                RefreshToken = refreshToken
            };
        }
        // <summary>
        // Замена пароля
        // </summary>
        public async Task<bool> ChangePass(string pass, Users? currentUser)
        {
            if (currentUser is null) return false;
            try { currentUser.PasswordHash = BCrypt.HashPassword(pass); }
            catch (Exception ex) { return false; }
            await _db.SaveChangesAsync();
            return true;
        }

        // <summary>
        // Хэширование пароля
        // </summary>
        public string HashPass(string pass)
        {
            var Hash = BCrypt.HashPassword(pass);
            return Hash;
        }

        // <summary>
        // Генератор кода
        // </summary>
        public string Generate()
        {
            return new Random().Next(100000, 999999).ToString();
        }

        // <summary>
        // Отправка сообщения пользователю
        // </summary>
        public string MimeMessage(string token)
        {
            var message = $"Hello, your token: {token}";
            return message;
        }

    }
}
