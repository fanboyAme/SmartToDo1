using RAA.Models.AuthModels;
using RAA.ProjectDtos;

namespace RAA.Interfaces
{
    public interface IService
    {
        public Task<List<Users>?> getAll(string email);
        public Task<string?> Registration(UserRegDto userRegDto);
        public Task<string?> Authorization(UserAuthDto UserAuthDto);
        public Task<bool> AuthEmail(string email);
        public Task<bool> AuthToken(UserAuthTokenDto userAuthTokenlDto);
        public Task<string?> ForgotPass(UserForgotPassDto userForgotPassDto);
    }
}