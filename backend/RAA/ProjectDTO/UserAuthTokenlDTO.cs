namespace RAA.ProjectDTO
{
    public class UserAuthTokenlDTO
    {
        public string Email { get; set; }
        public int Token { get; set; }

        public UserAuthTokenlDTO(string email, int token) {  Email = email;  Token = token; }
    }
}
