using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RAA.Application.Interfaces.Auth;
using RAA.Application.ProjectDtos.UserDtos;
namespace RAA.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController: ControllerBase
    {
        private readonly IAuthService _service;
        public UsersController(IAuthService service)
        {
            _service = service;
        }
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var person = await _service.GetAllUsers();
            return Ok(person);
        }
        [HttpPost("Registration")]
        public async Task<IActionResult> Registration(UserRegistrationDto userRegDto) 
        {
            var reg = await _service.Registration(userRegDto);
            return Ok(new { userRegDto.Email });
        }
        [HttpPost("Auth")]
        public async Task<IActionResult> Authorization(UserAuthDto userAuthDto)
        {
            var auth = await _service.Authorization(userAuthDto);
            return Ok(new { auth.AccessToken, auth.RefreshToken });
        }
        [HttpPost("AuthToken")]
        public async Task<IActionResult> AuthToken(UserAuthTokenDto userAuthTokenlDto)
        {
            var authToken = await _service.VerifyEmailToken(userAuthTokenlDto);
            return Ok(); 
        }

        [HttpPost("CodeGeneration")]
        public async Task<IActionResult> CodeGen(string email)
        {
            await _service.AuthEmail(email);
            return Ok();
        }
        [HttpPost("ForgotPass")]
        public async Task<IActionResult> ForgotPass(UserForgotPassDto userForgotPassDto)
        {
            var forgot = await _service.ForgotPass(userForgotPassDto);
            return Ok(new { forgot });
        }
        [Authorize]
        [HttpGet("sercer")]
        public string secret()
        {
            return "secret";
        }
        [HttpPost]
        public async Task<IActionResult> Refresh(string refreshtoken)
        {
            var refreshToken = _service.RefreshToken(refreshtoken);
            return Ok(new {refreshToken});

        }
    }
}
