using RAA.Models;
using RAA.ProjectDtos;

namespace RAA.Interfaces
{
    public interface IHelperService
    {
        public Task<string?> Auth(UserAuthDto UserAuthDto);
        public string HashPass(string pass);
        public Task<bool> ChangePass(string pass, Users? currentUser);
        public Task<Users?> FindUser(string email);
        public string Generate();
        public string MimeMessage(string token);
    }
}
