using RAA.Models;
using RAA.ProjectDTO;

namespace RAA.Interfaces
{
    public interface IHelperService
    {
        public Task<bool> Auth(UserAuthDTO UserAuthDTO);
        public string HashPass(string pass);
        public Task<bool> ChangePass(string pass, Users? currentUser);
        public Task<Users?> FindUser(string email);
        public string Generate();
        public string MimeMessage(string token);
    }
}
