namespace RAA.Services.AuthServices

{
    using Microsoft.EntityFrameworkCore;
    using RAA.Databases;
    using RAA.Interfaces;
    using RAA.Models.AuthModels;
    using RAA.ProjectDtos;
    using System.Threading.Tasks;

    public class AuthService : IService
    {
        private readonly ApplicationDbContext _db;
        private readonly IEmailService _emailService;
        private readonly IHelperService _helperService;

        public AuthService(ApplicationDbContext db, IEmailService emailService, IHelperService helperService)
        {
            _db = db;
            _emailService = emailService;
            _helperService = helperService;
        }
        // <summary>
        // Получение всех пользователей
        // </summary>    
        public async Task<List<Users>?> getAll(string email)
        {
            var access = await _helperService.FindUser(email);
            if (access != null && access.isAdmin != false)
            {
                return _db.Users.ToList();
            }
            else return null;
        }

        // <summary>
        // Регистрация
        // </summary>
        public async Task<string?> Registration(UserRegDto userRegDTO)
        {
            if (await _db.Users.AnyAsync(x => x.Login == userRegDTO.Login))
            {
                return null;
            }
            var newPerson = new Users(userRegDTO.Login, _helperService.HashPass(userRegDTO.Password), userRegDTO.Email);
            await _db.Users.AddAsync(newPerson);
            await _db.SaveChangesAsync();
            var MailSent = await AuthEmail(newPerson.Email);
            if (!MailSent) return null;
            return newPerson.Email;
        }
        // <summary>
        // Авторизация
        // </summary>
        public async Task<string?> Authorization(UserAuthDto UserAuthDTO)
        {
            return await _helperService.Auth(UserAuthDTO);
        }

        // <summary>
        // Авторизация почты
        // </summary>
        public async Task<bool> AuthEmail(string email)
        {
            var currentUser = await _helperService.FindUser(email);
            if (currentUser is null) return false;
            var TryToken = _helperService.Generate();
            currentUser.VerificationCode = TryToken;
            await _db.SaveChangesAsync();
            var mailSender = await _emailService.SendAsync(email, "Token", _helperService.MimeMessage(TryToken));
            if (!mailSender) { return false; }
            return true;
        }

        // <summary>
        // Отправка токена на почту
        // </summary>
        public async Task<bool> AuthToken(UserAuthTokenDto userAuthTokenlDTO)
        {
            var currentUser = await _helperService.FindUser(userAuthTokenlDTO.Email);
            if (currentUser is null) return false;
            if (userAuthTokenlDTO.Token.ToString() == currentUser.VerificationCode)
            {

                currentUser.VerificationCode = null;
                currentUser.EmailConfirmed = true;
                await _db.SaveChangesAsync();
                return true;
            }
            else return false;
        }

        // <summary>
        // Замена пароля
        // </summary>
        public async Task<string?> ForgotPass(UserForgotPassDto userForgotPassDTO)
        {
            var currentUser = await _helperService.FindUser(userForgotPassDTO.Email);
            if (currentUser is null) return null;
            if (userForgotPassDTO.Token.ToString() == currentUser.VerificationCode)
            {
                await _helperService.ChangePass(userForgotPassDTO.Password, currentUser);
                currentUser.VerificationCode = null;
                await _db.SaveChangesAsync();
                return currentUser.Email;
            }
            else return null;
        }
    }
}
