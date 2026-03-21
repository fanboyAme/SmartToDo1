using Microsoft.AspNetCore.Mvc;
using RAA.Application.Exceptions;
using System.Security.Claims;

namespace RAA.Infrastructure.Services.AuthServices
{
    public class CurrentUserService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ILogger<CurrentUserService> _logger;
        public CurrentUserService(IHttpContextAccessor contextAccessor, ILogger<CurrentUserService> logger)
        {
            _contextAccessor = contextAccessor;
            _logger = logger;
        }
        
        public Guid CurrentUserId()
        {
            try
            {
                if (_contextAccessor.HttpContext is null) throw new UnauthorizedException("Пользователь не авторизован");
                var findFirst = _contextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
                if (findFirst is null) throw new UnauthorizedException("Пользователь не авторизован");
                return Guid.Parse(findFirst.Value);
            }
            catch (FormatException ex)
            {
                _logger.LogError(ex, "Неверный формат идентификатора пользователя");
                throw new UnauthorizedException("Неверный формат идентификатора пользователя");
            }
            
        }
        public string CurrentUserEmail()
        {
            try
            {
                if (_contextAccessor.HttpContext is null) throw new UnauthorizedException("Пользователь не авторизован");
                var findFirst = _contextAccessor.HttpContext.User.FindFirst(ClaimTypes.Email);
                if (findFirst is null) throw new UnauthorizedException("Пользователь не авторизован");
                return findFirst.Value;
            }
            catch (FormatException ex)
            {
                _logger.LogError(ex, "Неверный формат идентификатора пользователя");
                throw new UnauthorizedException("Неверный формат идентификатора пользователя");
            }
        }
    }
}
