namespace RedisBaza.Models
{
    public class User
    {
        public string Id { get; set; }

        public string Username { get; set; }

        public string Password { get; set; }

        public int Role { get; set; }
    }
}
