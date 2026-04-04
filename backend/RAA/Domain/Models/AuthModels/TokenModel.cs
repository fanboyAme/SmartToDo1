using System.ComponentModel.DataAnnotations;

namespace RAA.Domain.Models.AuthModels
{
    public class TokenModel
    {
        public Guid Id { get; set; }
        [Required] public string RefreshTokenHash { get; set; } = string.Empty;
        public DateTime Expires {  get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? RevokedAt { get; set; }
        public bool IsExpired => DateTime.UtcNow >= Expires;

        public bool IsRevoked { get; set; }

        public Guid UserId {  get; set; }
        public Users User { get; set; }

        public TokenModel(string refreshTokenHash, Guid userId, DateTime expires)
        {
            Id = Guid.NewGuid();
            RefreshTokenHash = refreshTokenHash;
            Expires = expires;
            CreatedAt = DateTime.UtcNow;
            IsRevoked = false;
            UserId = userId;
        }
    }
}
