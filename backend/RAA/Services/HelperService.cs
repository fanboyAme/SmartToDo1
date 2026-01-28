using Microsoft.EntityFrameworkCore;


namespace RAA.Services
{
    using BCrypt.Net;
    using RAA.Databases;
    using RAA.Interfaces;
    using RAA.Models;
    using RAA.ProjectDTO;

    public class HelperService: IHelperService
    {
        private readonly DB _db;
        public HelperService(DB db) {  _db = db; }
        public async Task<bool> Auth(UserAuthDTO UserAuthDTO)
        {
            if (UserAuthDTO is null) return false;
            var currentUser = await _db.Users.SingleOrDefaultAsync(x => x.Login == UserAuthDTO.Login);
            if (currentUser is null || !currentUser.EmailConfirmed) return false;
            return BCrypt.Verify(UserAuthDTO.Password, currentUser.Password);
        }
        public async Task<bool> ChangePass(string pass, Users? currentUser)
        {
            if (currentUser is null) return false;
            try { currentUser.Password = BCrypt.HashPassword(pass); }
            catch (Exception ex) { return false; }
            await _db.SaveChangesAsync();
            return true;
        }
        public string HashPass(string pass)
        {
            var Hash = BCrypt.HashPassword(pass);
            return Hash;
        }
        public async Task<Users?> FindUser(string email)
        {
            var currentUser = await _db.Users.SingleOrDefaultAsync(x => x.Email == email);
            if (currentUser is null) return null;
            return currentUser;
        }
        public string Generate()
        {
            return new Random().Next(100000, 999999).ToString();
        }
        public string MimeMessage(string token)
        {
            var message = $"Hello, your token: {token}";
            return message;
        }
    }
}
