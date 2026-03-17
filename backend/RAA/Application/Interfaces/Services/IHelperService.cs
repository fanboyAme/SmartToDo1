using RAA.Application.ProjectDtos.ResponceDto;
using RAA.Application.ProjectDtos.UserDtos;
using RAA.Domain.Models.AuthModels;

namespace RAA.Application.Interfaces.Services
{
    public interface IHelperService
    {
        public Task<AuthResponseDto> Auth(UserAuthDto UserAuthDto);
        Task ChangePass(string pass, Users currentUser);
        public string Generate();
        public string MimeMessage(string token);
    }
}
