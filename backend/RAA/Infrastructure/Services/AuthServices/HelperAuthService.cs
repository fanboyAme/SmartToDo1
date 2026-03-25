namespace RAA.Infrastructure.Services.AuthServices

{
    using BCrypt.Net;
    using RAA.Application.Interfaces.Auth;
    using RAA.Application.Interfaces.Repositories;
    using RAA.Application.Interfaces.Services;
    using RAA.Domain.Models.AuthModels;

    public class HelperAuthService: IHelperService
    {
        private readonly ILogger<HelperAuthService> _logger;
        private readonly IUserRepository _userRepository;
        private readonly string _templatePath;
        public HelperAuthService(ITokenService jwtService, IUserRepository userRepository, ILogger<HelperAuthService> logger) 
        {  
            _userRepository = userRepository;  
            _logger = logger;
            _templatePath = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "EmailTemplate.html");
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
                _logger.LogInformation($"Успешная смена пароль пользователя: {currentUser.Id}");
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
            var template = File.ReadAllText(_templatePath);

            var html = template
                .Replace("{{TOKEN}}", token)
                .Replace("{{YEAR}}", DateTime.Now.Year.ToString());

            return html;
        }
    }
}
