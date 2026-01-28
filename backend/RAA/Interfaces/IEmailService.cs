namespace RAA.Interfaces
{
    public interface IEmailService
    {
        public Task<bool> SendAsync(string ToEmail, string subject, string text);
    }
}
