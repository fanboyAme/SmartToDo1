namespace RAA.ProjectDTO
{
    public class UserForgotPassDTO
    {
        public string Email { get; set; }
        public int Token { get; set; }

        public string Password { get; set; }

        public UserForgotPassDTO(string email, int token, string password) { Email = email; Token = token; Password = password; }
    }
}
