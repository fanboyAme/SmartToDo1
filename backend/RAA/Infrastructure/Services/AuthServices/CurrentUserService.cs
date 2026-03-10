using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace RAA.Infrastructure.Services.AuthServices
{
    public class CurrentUserService
    {
        private readonly IHttpContextAccessor _contextAccessor;
        public CurrentUserService(IHttpContextAccessor contextAccessor)
        {
            _contextAccessor = contextAccessor;
        }
        
        public Guid CurrentUserId()
        {
            if (_contextAccessor.HttpContext is null) throw new UnauthorizedAccessException("Пользователь не авторизован");
            var findFirst = _contextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
            if (findFirst is null) throw new UnauthorizedAccessException("Пользователь не авторизован");
            return Guid.Parse(findFirst.Value);
        }
        public string CurrentUserEmail()
        {
            if (_contextAccessor.HttpContext is null) throw new UnauthorizedAccessException("Пользователь не авторизован");
            var findFirst = _contextAccessor.HttpContext.User.FindFirst(ClaimTypes.Email);
            if (findFirst is null) throw new UnauthorizedAccessException("Пользователь не авторизован");
            return findFirst.Value;
        }
    }
}
