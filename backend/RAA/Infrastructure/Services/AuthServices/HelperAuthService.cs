using Microsoft.EntityFrameworkCore;

namespace RAA.Infrastructure.Services.AuthServices

{
    using BCrypt.Net;
    using RAA.Application.Exceptions;
    using RAA.Application.Interfaces.Services;
    using RAA.Application.ProjectDtos.ResponceDto;
    using RAA.Application.ProjectDtos.UserDtos;
    using RAA.Domain.Models.AuthModels;
    using RAA.Infrastructure.Repositories.UserRepository;

    public class HelperAuthService: IHelperService
    {
        private readonly ILogger<HelperAuthService> _logger;
        private readonly UserRepository _userRepository;
        private readonly TokenService _tokenService;
        public HelperAuthService(TokenService jwtService, UserRepository userRepository, ILogger<HelperAuthService> logger) 
        {  
            _userRepository = userRepository; 
            _tokenService = jwtService; 
            _logger = logger;
        }

        // <summary>
        // Проверка данных пользователя
        // </summary>
        public async Task<AuthResponseDto> Auth(UserAuthDto UserAuthDto)
        {
            var currentUser = await _userRepository.FindUserByLoginAsync(UserAuthDto.Login);
            if (currentUser is null || !currentUser.EmailConfirmed || !BCrypt.Verify(UserAuthDto.Password, currentUser.PasswordHash))
            {
                throw new UnauthorizedException("Неверный логин или пароль");
            }
            var accesToken = _tokenService.GenerateAccessToken(currentUser.Email, currentUser.Id, currentUser.UserRole.ToString());
            var refreshToken = _tokenService.GenerateRefreshToken();
            var refreshTokenHash = _tokenService.HashRefreshToken(refreshToken);

            var tokenEntity = new TokenModel
                (refreshTokenHash, 
                currentUser.Id,
                DateTime.UtcNow.AddMonths(1));

            await _userRepository.AddAsync(tokenEntity);
            await _userRepository.SaveChangesAsync();

            return new AuthResponseDto 
            { 
                AccessToken = accesToken, 
                RefreshToken = refreshToken
            };
        }
        // <summary>
        // Замена пароля
        // </summary>
        public async Task ChangePass(string pass, Users currentUser)
        { 
            try
            {
                currentUser.PasswordHash = BCrypt.HashPassword(pass);
                await _userRepository.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка с хешированием пароля");
                throw;
            } 
        }
        // <summary>
        // Генератор кода
        // </summary>
        public string Generate()
        {
            return new Random().Next(100000, 999999).ToString();
        }

        // <summary>
        // Отправка сообщения пользователю
        // </summary>
        public string MimeMessage(string token)
        {
            var message = $"Hello, your token: {token}";
            return message;
        }
    }
}
