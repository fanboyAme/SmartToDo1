using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using RAA.Models;
using Microsoft.Extensions.Options;

namespace RAA.Services
{
    public class JwtService
    {
        private readonly JwtOptions _options;

        public JwtService(IOptions<JwtOptions> options)
        {
            _options = options.Value;
        }
        public string GenerateJwtToken(string email, Guid userId)
        {
            var claims = new[]
            {
                // <summary>
                // Создаем массим с инфой о пользователе
                //</summary>
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email),
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
                expires: DateTime.UtcNow.AddHours(_options.TimeAlive),
                signingCredentials: creds
                );

            // <summary>
            // кодируем в base64 и возвращаем пользователю готовую строку JWT
            //</summary>
            return new JwtSecurityTokenHandler().WriteToken(token);

        }
    }
}
