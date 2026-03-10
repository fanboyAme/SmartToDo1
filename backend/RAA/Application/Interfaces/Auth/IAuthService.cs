using RAA.Application.ProjectDtos.ResponceDto;
using RAA.Application.ProjectDtos.UserDtos;
using RAA.Domain.Models.AuthModels;

namespace RAA.Application.Interfaces.Auth
{
    public interface IAuthService
    {
        public Task<List<Users>?> getAll(string email);
        public Task<string?> Registration(UserRegistrationDto userRegDto);
        public Task<AuthResponseDto?> Authorization(UserAuthDto UserAuthDto);
        public Task<bool> AuthEmail(string email);
        public Task<bool> AuthToken(UserAuthTokenDto userAuthTokenlDto);
        public Task<string?> ForgotPass(UserForgotPassDto userForgotPassDto);
        public Task<AuthResponseDto?> RefreshToken(string refreshToken);
    }
}