using Microsoft.AspNetCore.Mvc;
using RAA.Interfaces;
using RAA.ProjectDtos;

namespace RAA.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController: ControllerBase
    {
        private readonly IService _service;
        public UsersController(IService service)
        {
            _service = service;
        }
        [HttpGet]
        public async Task<IActionResult> getAll(string email)
        {
            var person = await _service.getAll(email);
            if (person != null)
            {
                return Ok(person);
            } else return BadRequest("You are not an admin or your account not created ");
        }
        [HttpPost("api/users/Registration")]
        public async Task<IActionResult> Registration(UserRegDto userRegDto) 
        {
            var reg = await _service.Registration(userRegDto);
            if (reg == null)
            {
                return BadRequest();
            } else return Ok(new { userRegDto.Email });
        }
        [HttpPost("api/users/Auth")]
        public async Task<IActionResult> Authorization(UserAuthDto userAuthDto)
        {
            var auth = await _service.Authorization(userAuthDto);
            if (auth) return Ok(auth); else return BadRequest(auth);
        }
        [HttpPost("api/users/AuthToken")]
        public async Task<IActionResult> AuthToken(UserAuthTokenDto userAuthTokenlDto)
        {
            var authToken = await _service.AuthToken(userAuthTokenlDto);
            if (authToken) return Ok(); else return BadRequest();  
        }

        [HttpPost("api/users/CodeGeneration")]
        public async Task<IActionResult> CodeGen(string email)
        {
            var codeGen = await _service.AuthEmail(email);
            if (codeGen) return Ok(); else return BadRequest(codeGen);
        }
        [HttpPost("api/users/ForgotPass")]
        public async Task<IActionResult> ForgotPass(UserForgotPassDto userForgotPassDto)
        {
            var forgot = await _service.ForgotPass(userForgotPassDto);
            if (forgot != null) return Ok(new {forgot}); else return BadRequest($"You dont have a token.");
        }
    }
}
