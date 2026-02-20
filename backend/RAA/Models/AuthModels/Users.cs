using RAA.Models.TaskModels;

namespace RAA.Models.AuthModels
{

    public class Users
    {
        public Guid Id { get; set; }

        public string Login { get; set; }

        public string PasswordHash { get; set; }

        public string Email { get; set; }
        public bool IsAdmin { get; set; }

        public bool EmailConfirmed { get; set; }

        public string? VerificationCode { get; set; }

        public List<TaskModel>? Tasks { get; set; } = new();
        public List<TokenModel> Token { get; set; } = new();
        public Users(string login, string password, string email)
        {
            Id = Guid.NewGuid();
            Email = email;
            Login = login;
            PasswordHash = password;
            IsAdmin = false;
            EmailConfirmed = false;
            VerificationCode = null;
        }
        public override string ToString()
        {
            return $"{Id}, {Login}, {PasswordHash}, {Email} , {IsAdmin}";
        }
    }
}
