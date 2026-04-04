namespace RAA.Application.Interfaces.Auth
{
    public interface ITokenService
    {
        public string GenerateAccessToken(string email, Guid userId, string userRole);
        public string GenerateRefreshToken();
        public string HashRefreshToken(string refreshToken);
    }
}
