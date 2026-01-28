using RAA.Models;
using RAA.ProjectDTO;

namespace RAA.Interfaces
{
    public interface IService
    {
        public Task<List<Users>?> getAll(string email);
        public Task<string?> Registration(UserRegDTO userRegDTO);
        public Task<bool> Authorization(UserAuthDTO UserAuthDTO);
        public Task<bool> AuthEmail(string email);
        public Task<bool> AuthToken(UserAuthTokenlDTO userAuthTokenlDTO);
        public Task<string?> ForgotPass(UserForgotPassDTO userForgotPassDTO);
    }
}