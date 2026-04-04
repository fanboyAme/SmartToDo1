using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using System.Security.Cryptography;
using RAA.Domain.Models.AuthModels;
using RAA.Application.Interfaces.Auth;

namespace RAA.Infrastructure.Services.AuthServices
{
    public class TokenService: ITokenService
    {
        private readonly JwtOptions _options;

        public TokenService(IOptions<JwtOptions> options)
        {
            _options = options.Value;
        }
        public string GenerateAccessToken(string email, Guid userId, string userRole)
        {
            var claims = new[]
            {
                // <summary>
                // Создаем массим с инфой о пользователе
                //</summary>
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Role, userRole)
            };
            // <summary>
            // Создаем ключ из байтов секретного ключа
            //</summary>
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SecretKey));

            // <summary>
            // Добавляем уникальную подпись для токена
            //</summary>
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // <summary>
            // Создаем JWT токен
            //</summary>
            var token = new JwtSecurityToken(
                issuer: _options.Issure, //
                audience: _options.Audience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(_options.TimeAlive),
                signingCredentials: creds
                );

            // <summary>
            // кодируем в base64 и возвращаем пользователю готовую строку JWT
            //</summary>
            return new JwtSecurityTokenHandler().WriteToken(token);

        }
        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];

            using var randomNumberGenerator = RandomNumberGenerator.Create();

            randomNumberGenerator.GetBytes(randomNumber);

            return Convert.ToBase64String(randomNumber);
        } 
        public string HashRefreshToken(string refreshToken)
        {
            using var sha = SHA256.Create();
            var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(refreshToken));
            return Convert.ToBase64String(bytes);
        }
    }
}
