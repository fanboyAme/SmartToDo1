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
            if (person != null) return Ok(person);
            return BadRequest("You are not an admin or your account not created ");
        }
        [HttpPost("Registration")]
        public async Task<IActionResult> Registration(UserRegistrationDto userRegDto) 
        {
            var reg = await _service.Registration(userRegDto);
            if (reg == null) return BadRequest();
            return Ok(new { userRegDto.Email });
        }
        [HttpPost("Auth")]
        public async Task<IActionResult> Authorization(UserAuthDto userAuthDto)
        {
            var auth = await _service.Authorization(userAuthDto);
            if (auth is null) return BadRequest();
            return Ok(new { auth.AccessToken, auth.RefreshToken });
        }
        [HttpPost("AuthToken")]
        public async Task<IActionResult> AuthToken(UserAuthTokenDto userAuthTokenlDto)
        {
            var authToken = await _service.VerifyEmailToken(userAuthTokenlDto);
            if (authToken) return Ok();
            return BadRequest();  
        }

        [HttpPost("CodeGeneration")]
        public async Task<IActionResult> CodeGen(string email)
        {
            var codeGen = await _service.AuthEmail(email);
            if (codeGen) return Ok();
            return BadRequest(codeGen);
        }
        [HttpPost("ForgotPass")]
        public async Task<IActionResult> ForgotPass(UserForgotPassDto userForgotPassDto)
        {
            var forgot = await _service.ForgotPass(userForgotPassDto);
            if (forgot != null) return Ok(new { forgot });
            return BadRequest($"You dont have a token.");
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
            if (refreshToken is null) return Unauthorized();
            return Ok(new {refreshToken});

        }
    }
}
