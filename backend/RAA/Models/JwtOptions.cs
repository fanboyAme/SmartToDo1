namespace RAA.Models
{
    public class JwtOptions
    {
        public string Issure { get; set; }
        public string Audience { get; set; }
        public string SecretKey { get; set; }
        public int TimeAlive { get; set; }
    }
}
