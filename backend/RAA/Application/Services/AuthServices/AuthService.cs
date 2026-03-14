namespace RAA.Application.Services.AuthServices

{
    using RAA.Application.Interfaces.Auth;
    using RAA.Application.Interfaces.Services;
    using RAA.Application.ProjectDtos.ResponceDto;
    using RAA.Application.ProjectDtos.UserDtos;
    using RAA.Domain.Models.AuthModels;
    using RAA.Infrastructure.Repositories.UserRepository;
    using RAA.Infrastructure.Services.AuthServices;
    using System.Threading.Tasks;

    public class AuthService : IAuthService
    {
        private readonly UserRepository _usersRepository;
        private readonly IEmailService _emailService;
        private readonly IHelperService _helperService;
        private readonly TokenService _tokenService;

        public AuthService(UserRepository usersRepository, IEmailService emailService, IHelperService helperService, TokenService tokenService)
        {
            _usersRepository = usersRepository;
            _emailService = emailService;
            _helperService = helperService;
            _tokenService = tokenService;
        }
        // <summary>
        // Получение всех пользователей
        // </summary>    
        public async Task<List<Users>?> getAll(string email)
        {
            var access = await _usersRepository.FindUserAsync(email);
            if (access != null && access.IsAdmin != false)
            {
                return await _usersRepository.GetUsers();
            }
            else return null;
        }

        // <summary>
        // Регистрация
        // </summary>
        public async Task<string?> Registration(UserRegistrationDto userRegistrationDto)
        {
            if (await _usersRepository.IsLoginTakenAsync(userRegistrationDto))
            {
                return null;
            }
            var newPerson = new Users(userRegistrationDto.Login, _helperService.HashPass(userRegistrationDto.Password), userRegistrationDto.Email);
            var addNewPerson = await _usersRepository.AddAsync(newPerson);
            if(!addNewPerson)
            {
                throw new Exception("Failed to add new person");
            }
            await _usersRepository.SaveChangesAsync();
            var MailSent = await AuthEmail(newPerson.Email);
            if (!MailSent) return null;
            return newPerson.Email;
        }
        // <summary>
        // Авторизация
        // </summary>
        public async Task<AuthResponseDto?> Authorization(UserAuthDto UserAuthDTO)
        {
            return await _helperService.Auth(UserAuthDTO);
        }

        // <summary>
        // Авторизация почты
        // </summary>
        public async Task<bool> AuthEmail(string email)
        {
            var currentUser = await _usersRepository.FindUserAsync(email);
            if (currentUser is null) return false;
            var TryToken = _helperService.Generate();
            currentUser.VerificationCode = TryToken;
            await _usersRepository.SaveChangesAsync();
            var mailSender = await _emailService.SendAsync(email, "Token", _helperService.MimeMessage(TryToken));
            if (!mailSender) { return false; }
            return true;
        }

        // <summary>
        // Отправка токена на почту
        // </summary>
        public async Task<bool> AuthToken(UserAuthTokenDto userAuthTokenlDTO)
        {
            var currentUser = await _usersRepository.FindUserAsync(userAuthTokenlDTO.Email);
            if (currentUser is null) return false;
            if (userAuthTokenlDTO.Token.ToString() == currentUser.VerificationCode)
            {

                currentUser.VerificationCode = null;
                currentUser.EmailConfirmed = true;
                await _usersRepository.SaveChangesAsync();
                return true;
            }
            else return false;
        }

        // <summary>
        // Замена пароля
        // </summary>
        public async Task<string?> ForgotPass(UserForgotPassDto userForgotPassDTO)
        {
            var currentUser = await _usersRepository.FindUserAsync(userForgotPassDTO.Email);
            if (currentUser is null) return null;
            if (userForgotPassDTO.Token.ToString() == currentUser.VerificationCode)
            {
                await _helperService.ChangePass(userForgotPassDTO.Password, currentUser);
                currentUser.VerificationCode = null;
                await _usersRepository.SaveChangesAsync();
                return currentUser.Email;
            }
            else return null;
        }
        public async Task<AuthResponseDto?> RefreshToken(string refreshToken)
        {
            if(string.IsNullOrWhiteSpace(refreshToken)) return null;
            var refreshTokenHash = _tokenService.HashRefreshToken(refreshToken);
            var currentToken = await _usersRepository.FindTokenWithUserAsync(refreshTokenHash);
            if (currentToken is null)  return null;
            if (currentToken.IsRevoked) return null;
            if(currentToken.IsExpired) return null;

            var currentUser = currentToken.User;

            var newAccessToken = _tokenService.GenerateAccessToken(currentUser.Email, currentUser.Id);

            var newRefreshToken = _tokenService.GenerateRefreshToken();

            currentToken.IsRevoked = true;

            var tokenEntity = new TokenModel
                (_tokenService.HashRefreshToken(newRefreshToken),
                currentUser.Id,
                DateTime.UtcNow.AddMonths(1));

            var addNewPerson = await _usersRepository.AddAsync(tokenEntity);
            if (!addNewPerson)
            {
                throw new Exception("Failed to add new token");
            }

            await _usersRepository.SaveChangesAsync();

            return new AuthResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };

        }
    }
}
