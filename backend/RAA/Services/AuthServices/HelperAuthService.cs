using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace RAA.Services.AuthServices

{
    using BCrypt.Net;
    using RAA.Databases;
    using RAA.Interfaces;
    using RAA.Models.AuthModels;
    using RAA.ProjectDtos;

    public class HelperAuthService: IHelperService
    {
        private readonly ApplicationDbContext _db;
        private readonly JwtService _jwtService;
        public HelperAuthService(ApplicationDbContext db, JwtService jwtService) {  _db = db; _jwtService = jwtService; }

        // <summary>
        // Проверка данных пользователя
        // </summary>
        public async Task<string?> Auth(UserAuthDto UserAuthDto)
        {
            if (UserAuthDto is null) 
                return null;
            var currentUser = await _db.Users.SingleOrDefaultAsync(x => x.Login == UserAuthDto.Login);
            if (currentUser is null || !currentUser.EmailConfirmed) 
                return null;
            if (!BCrypt.Verify(UserAuthDto.Password, currentUser.Password)) 
                return null;
                return _jwtService.GenerateJwtToken(currentUser.Email, currentUser.Id);

        }
        // <summary>
        // Замена пароля
        // </summary>
        public async Task<bool> ChangePass(string pass, Users? currentUser)
        {
            if (currentUser is null) return false;
            try { currentUser.Password = BCrypt.HashPassword(pass); }
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
        // Поиск пользователя по email
        // </summary>
        public async Task<Users?> FindUser(string email)
        {
            var currentUser = await _db.Users.SingleOrDefaultAsync(x => x.Email == email);
            if (currentUser is null) return null;
            return currentUser;
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
