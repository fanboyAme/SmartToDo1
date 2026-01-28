using Microsoft.AspNetCore.Mvc;
using RAA.Interfaces;
using RAA.ProjectDTO;

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
        [HttpPost("api/users/Reg")]
        public async Task<IActionResult> Registration(UserRegDTO userRegDTO) 
        {
            var reg = await _service.Registration(userRegDTO);
            if (reg == null)
            {
                return BadRequest();
            } else return Ok(new { userRegDTO.Email });
        }
        [HttpPost("api/users/Auth")]
        public async Task<IActionResult> Authorization(UserAuthDTO userAuthDTO)
        {
            var auth = await _service.Authorization(userAuthDTO);
            if (auth) return Ok(auth); else return BadRequest(auth);
        }
        [HttpPost("api/users/AuthToken")]
        public async Task<IActionResult> AuthToken(UserAuthTokenlDTO userAuthTokenlDTO)
        {
            var authToken = await _service.AuthToken(userAuthTokenlDTO);
            if (authToken) return Ok(); else return BadRequest();  
        }

        [HttpPost("api/Users/CodeGen")]
        public async Task<IActionResult> CodeGen(string email)
        {
            var codeGen = await _service.AuthEmail(email);
            if (codeGen) return Ok(); else return BadRequest(codeGen);
        }
        [HttpPost("api/Users/ForgotPass")]
        public async Task<IActionResult> ForgotPass(UserForgotPassDTO userForgotPassDTO)
        {
            var forgot = await _service.ForgotPass(userForgotPassDTO);
            if (forgot != null) return Ok(new {forgot}); else return BadRequest($"You dont have a token.");
        }
    }
}
