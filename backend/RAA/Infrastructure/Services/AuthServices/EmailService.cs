using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using RAA.Application.Exceptions;
using RAA.Application.Interfaces.Services;
using RAA.Domain.Models.AuthModels;

namespace RAA.Infrastructure.Services.AuthServices
{
    public class EmailService: IEmailService
    {
        private readonly SMTP _smtp;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IOptions<SMTP> options, ILogger<EmailService> logger)
        {
            _smtp = options.Value;
            _logger = logger;
        }

        // <summary>
        // Отправка письма пользователю
        // </summary>
        public async Task<bool> SendAsync(string toEmail, string subject, string htmlBody)
        {
            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(_smtp.Username));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;
            message.Body = new TextPart("html") { Text = htmlBody };

            using var client = new SmtpClient();

            try
            {
                await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_smtp.Username, _smtp.Password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation("Письмо успешно оправлено пользователю с почтой: {Email}", toEmail);

                return true;
            }
            catch (Exception ex)
            {
                await client.DisconnectAsync(true);
                _logger.LogError(ex, "Ошибка отправки письма пользователю с почтой: {Email}", toEmail);
                throw new UserRegistrationException("Ошибка отправки письма");
            }

        }

    }
}
