namespace RAA.Interfaces
{
    public interface IGenerateToken
    {
        public string Generate();
        public string MimeMessage(string token);

    }
}
