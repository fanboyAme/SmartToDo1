namespace RAA.Application.Services.AuthServices

{
    using BCrypt.Net;
    using RAA.Application.Exceptions;
    using RAA.Application.Interfaces.Auth;
    using RAA.Application.Interfaces.Repositories;
    using RAA.Application.Interfaces.Services;
    using RAA.Application.ProjectDtos.ResponceDto;
    using RAA.Application.ProjectDtos.UserDtos;
    using RAA.Domain.Models.AuthModels;
    using System.Threading.Tasks;

    public class AuthService : IAuthService
    {
        private readonly ILogger<AuthService> _logger;
        private readonly IUserRepository _usersRepository;
        private readonly IEmailService _emailService;
        private readonly IHelperService _helperService;
        private readonly ITokenService _tokenService;

        public AuthService(IUserRepository usersRepository, IEmailService emailService, IHelperService helperService, ITokenService tokenService, ILogger<AuthService> logger)
        {
            _usersRepository = usersRepository;
            _emailService = emailService;
            _helperService = helperService;
            _tokenService = tokenService;
            _logger = logger;
        }
        // <summary>
        // Получение всех пользователей
        // </summary>    
        public async Task<List<Users>> GetAllUsers()
        {
            _logger.LogInformation("Получение списка всех пользователей");
            return await _usersRepository.GetUsers();
        }

        // <summary>
        // Регистрация
        // </summary>
        public async Task<string?> Registration(UserRegistrationDto userRegistrationDto)
        {
            if (await _usersRepository.IsLoginTakenAsync(userRegistrationDto) || await _usersRepository.IsEmailTakenAsync(userRegistrationDto))
            {
                _logger.LogError("Ошибка создания пользователя. Логин {UserLogin} или почта {UserEmail} уже заняты", 
                    userRegistrationDto.Login, 
                    userRegistrationDto.Email);
                throw new ConflictException("Логин или почта уже занят");
            }
            var newPerson = new Users(userRegistrationDto.Login, BCrypt.HashPassword(userRegistrationDto.Password), userRegistrationDto.Email);
            var addNewPerson = await _usersRepository.AddAsync(newPerson);
            if(!addNewPerson)
            {
                _logger.LogError("Ошибка создания пользователя {UserId}", 
                    newPerson.Id);
                throw new UserRegistrationException("Ошибка создания пользователя");
            }
            await _usersRepository.SaveChangesAsync();
            await AuthEmail(newPerson.Email);

            _logger.LogInformation("Пользователь {UserId} успешно создан", 
                newPerson.Id);

            return newPerson.Email;
        }
        // <summary>
        // Авторизация
        // </summary>
        public async Task<AuthResponseDto?> Authorization(UserAuthDto userAuthDTO)
        {
            var currentUser = await _usersRepository.FindUserByLoginAsync(userAuthDTO.Login);
            if (currentUser is null || !BCrypt.Verify(userAuthDTO.Password, currentUser.PasswordHash))
            {
                _logger.LogError("Неверный логин или пароль");
                throw new UnauthorizedException("Неверный логин или пароль");
            }
            if (!currentUser.EmailConfirmed)
            {
                await AuthEmail(currentUser.Email);
                _logger.LogWarning("Пользователь {UserId} попытался войти в аккаунт без подтверждения почты. Отправлен новый токен", currentUser.Id);
                throw new ForbiddenException("Аккаунт не подтвержден, код отправлен повторно");
            }
            var accesToken = _tokenService.GenerateAccessToken(currentUser.Email, currentUser.Id, currentUser.UserRole.ToString());
            var refreshToken = _tokenService.GenerateRefreshToken();
            var refreshTokenHash = _tokenService.HashRefreshToken(refreshToken);

            var tokenEntity = new TokenModel
                (refreshTokenHash,
                currentUser.Id,
                DateTime.UtcNow.AddMonths(1));

            await _usersRepository.AddAsync(tokenEntity);
            await _usersRepository.SaveChangesAsync();

            _logger.LogInformation($"Успешная авторизация пользователя: {currentUser.Id}");

            return new AuthResponseDto
            {
                AccessToken = accesToken,
                RefreshToken = refreshToken
            };
        }

        // <summary>
        // Авторизация почты
        // </summary>
        public async Task AuthEmail(string email)
        {
            var currentUser = await _usersRepository.FindUserAsync(email) ?? throw new NotFoundException($"Пользователь с почтой {email} не найден");
                try
                {
                    var currentToken = _helperService.Generate();
                    currentUser.VerificationCode = currentToken;
                    currentUser.VerificationCodeExpiry = DateTime.UtcNow.AddMinutes(15);
                    await _usersRepository.SaveChangesAsync();
                    await _emailService.SendAsync(email, "Token", _helperService.MimeMessage(currentToken));
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Ошибка отправки письма для {Email}", email);
                    throw new BadRequestException("Не удалось отправить код подтверждения");
                }
        }

        // <summary>
        // Отправка токена на почту
        // </summary>
        public async Task<bool> VerifyEmailToken(UserAuthTokenDto userAuthTokenDTO)
        {
            var currentUser = await _usersRepository.FindUserAsync(userAuthTokenDTO.Email) 
                ?? throw new NotFoundException($"Пользователь с почтой {userAuthTokenDTO.Email} не был найден");

            if (string.IsNullOrEmpty(userAuthTokenDTO.Token.ToString())){
                _logger.LogError("Отсутсвует токен пользователя: {Email}", currentUser.Email);
                throw new BadRequestException("Код не найден");
            }

            if(currentUser.VerificationCodeExpiry < DateTime.UtcNow)
            {
                _logger.LogError("Введенный токен пользователя {Email} истек", currentUser.Email);
                throw new BadRequestException("Срок действия кода истек. Запросите новый");
            }
            
            if(userAuthTokenDTO.Token.ToString() != currentUser.VerificationCode)
            {
                _logger.LogError(
                "Неверный код подтверждения для пользователя {UserEmail}. Ожидался код: {ExpectedCode}, получен: {ReceivedCode}",
                    currentUser?.Email ?? userAuthTokenDTO.Email ?? "Неизвестный пользователь",
                    currentUser?.VerificationCode ?? "Отсутствует",
                    userAuthTokenDTO.Token.ToString());
                throw new BadRequestException("Неверный код подтверждения");
            }

            currentUser.VerificationCode = null;
            currentUser.VerificationCodeExpiry = null;
            currentUser.EmailConfirmed = true;


            await _usersRepository.SaveChangesAsync();

            _logger.LogInformation("Email пользователя {UserEmail} успешно подтвержден", currentUser.Email);

            return true;
        }

        // <summary>
        // Замена пароля
        // </summary>
        public async Task<string?> ForgotPass(UserForgotPassDto userForgotPassDTO)
        {
            var currentUser = await _usersRepository.FindUserAsync(userForgotPassDTO.Email) 
                ?? throw new NotFoundException($"Пользователь с почтой {userForgotPassDTO.Email} не найден");
            
            if (currentUser.VerificationCodeExpiry < DateTime.UtcNow)
            {
                _logger.LogError("Введенный токен пользователя {Email} истек", currentUser.Email);
                throw new BadRequestException("Срок действия кода истек. Запросите новый");
            }

            if (currentUser.VerificationCode is null ||
                userForgotPassDTO.Token.ToString() != currentUser.VerificationCode)
            {
                _logger.LogError(
            "Неверный код подтверждения для пользователя {UserEmail}. Ожидался код: {ExpectedCode}, получен: {ReceivedCode}",
            currentUser?.Email ?? userForgotPassDTO.Email ?? "Неизвестный пользователь",
            currentUser?.VerificationCode ?? "Отсутствует",
            userForgotPassDTO.Token.ToString());
                throw new BadRequestException("Неверный код подтверждения");
            }
            await _helperService.ChangePass(userForgotPassDTO.Password, currentUser);
            currentUser.VerificationCode = null;
            currentUser.VerificationCodeExpiry = null;

            await _usersRepository.SaveChangesAsync();

            _logger.LogInformation("Пароль пользователя {UserEmail} успешно изменен", currentUser.Email);

            return currentUser.Email;
        }
        public async Task<AuthResponseDto?> RefreshToken(string refreshToken)
        {
            if(string.IsNullOrWhiteSpace(refreshToken)) throw new UnauthorizedException("RefreshToken обязателен");
            var refreshTokenHash = _tokenService.HashRefreshToken(refreshToken);
            var currentToken = await _usersRepository.FindTokenWithUserAsync(refreshTokenHash);
            if (currentToken is null || currentToken.IsRevoked || currentToken.IsExpired) 
            { 
                _logger.LogError("Refresh token: {refreshToken} пользователя {currentToken.UserId} недействителен", 
                    refreshToken, 
                    currentToken?.UserId.ToString() ?? "Неизвестный пользователь");
                throw new UnauthorizedException("RefreshToken недействителен"); 
            }


            var currentUser = currentToken.User;

            var newAccessToken = _tokenService.GenerateAccessToken(currentUser.Email, currentUser.Id, currentUser.UserRole.ToString());

            var newRefreshToken = _tokenService.GenerateRefreshToken();

            currentToken.IsRevoked = true;

            var tokenEntity = new TokenModel
                (
                _tokenService.HashRefreshToken(newRefreshToken),
                currentUser.Id,
                DateTime.UtcNow.AddMonths(1)
                );

            var addNewPerson = await _usersRepository.AddAsync(tokenEntity);
            if (!addNewPerson)
            {
                _logger.LogError("Ошибка добавления токена: {RefreshTokenHash} пользователю: {UserId}", 
                    tokenEntity.RefreshTokenHash, 
                    tokenEntity.UserId);
                throw new UserRegistrationException("Failed to add new token");
            }

            await _usersRepository.SaveChangesAsync();

            _logger.LogInformation("Токен: {RefreshTokenHash} добавлен пользователю: {UserId}", 
                tokenEntity.RefreshTokenHash, 
                tokenEntity.UserId);

            return new AuthResponseDto
            {
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken
            };

        }
    }
}
