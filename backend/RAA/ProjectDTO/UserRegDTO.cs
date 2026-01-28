namespace RAA.ProjectDTO
{
    public class UserRegDTO
    {
        public string Login { get; set; }

        public string Password { get; set; }

        public string Email { get; set; }

        public UserRegDTO(string login, string password, string email)
        {
            Login = login;
            Password = password;
            Email = email;
        }
    }
}
