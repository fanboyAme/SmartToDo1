using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using RAA.Interfaces;
using RAA.Models;

namespace RAA.Services
{
    public class EmailService: IEmailService
    {
        private readonly SMTP _smtp;

        public EmailService(IOptions<SMTP> options)
        {
            _smtp = options.Value;
        }

        // <summary>
        // Отправка письма пользователю
        // </summary>
        public async Task<bool> SendAsync(string toEmail, string subject, string text)
        {
            var message = new MimeMessage();
            message.From.Add(MailboxAddress.Parse(_smtp.Username));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;
            message.Body = new TextPart("plain") { Text = text };

            using var client = new SmtpClient();

            try
            {
                await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(_smtp.Username, _smtp.Password);
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
                return true;
            }
            catch (Exception ex)
            {
                // add log info and add SmtpExc
                await client.DisconnectAsync(true);
                return false;
            }

        }

    }
}
