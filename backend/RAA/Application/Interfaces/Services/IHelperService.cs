using RAA.Application.ProjectDtos.ResponceDto;
using RAA.Application.ProjectDtos.UserDtos;
using RAA.Domain.Models.AuthModels;

namespace RAA.Application.Interfaces.Services
{
    public interface IHelperService
    {
        public Task<AuthResponseDto?> Auth(UserAuthDto UserAuthDto);
        public string HashPass(string pass);
        public Task<bool> ChangePass(string pass, Users? currentUser);
        public Task<Users?> FindUser(string email);
        public string Generate();
        public string MimeMessage(string token);
    }
}
