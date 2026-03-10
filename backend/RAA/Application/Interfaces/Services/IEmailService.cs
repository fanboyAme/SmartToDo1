namespace RAA.Application.Interfaces.Services
{
    public interface IEmailService
    {
        public Task<bool> SendAsync(string ToEmail, string subject, string text);
    }
}
