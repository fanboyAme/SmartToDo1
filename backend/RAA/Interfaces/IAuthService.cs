using RAA.Models.AuthModels;
using RAA.ProjectDtos;
using RAA.ProjectDtos.ResponceDto;
using RAA.ProjectDtos.UserDtos;

namespace RAA.Interfaces
{
    public interface IAuthService
    {
        public Task<List<Users>?> getAll(string email);
        public Task<string?> Registration(UserRegDto userRegDto);
        public Task<AuthResponceDto?> Authorization(UserAuthDto UserAuthDto);
        public Task<bool> AuthEmail(string email);
        public Task<bool> AuthToken(UserAuthTokenDto userAuthTokenlDto);
        public Task<string?> ForgotPass(UserForgotPassDto userForgotPassDto);
        public Task<AuthResponceDto?> RefreshToken(string refreshToken);
    }
}