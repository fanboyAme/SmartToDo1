namespace RAA.Models
{ 
    public class Users
    {
        public Guid Id { get; set; }

        public string Login { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }
        public bool isAdmin { get; set; }

        public bool EmailConfirmed { get; set; }

        public string? VerificationCode { get; set;  }
        public Users(string login, string password, string email ) 
        { 
            Id = Guid.NewGuid();
            Email = email;
            Login = login;
            Password = password;
            isAdmin = false;
            EmailConfirmed = false;
            VerificationCode = null;
        }
        public override string ToString()
        {
            return $"{Id}, {Login}, {Password}, {Email} , {isAdmin}";
        }
    }
}
