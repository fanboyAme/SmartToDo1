namespace RAA.Application.Interfaces.Auth
{
    public interface IGenerateToken
    {
        public string Generate();
        public string MimeMessage(string token);

    }
}
