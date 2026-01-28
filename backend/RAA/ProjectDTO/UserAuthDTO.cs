namespace RAA.ProjectDTO
{
    public class UserAuthDTO
    {
        public string Login { get; set; }

        public string Password { get; set; }

        public UserAuthDTO(string login, string password)
        {
            Login = login;
            Password = password;
        }
    }
}
