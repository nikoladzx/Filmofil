using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using RedisBaza.Models;
using RedisBaza.Services;
using ServiceStack.Redis;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using static ServiceStack.Diagnostics.Events;

namespace RedisBaza.Controllers
{
    [ApiController]
    public class AuthController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        readonly RedisClient redis = new("redis://localhost:6379");

        public AuthController(IConfiguration configuration, IUserService userService)
        {
            _configuration = configuration;
            _userService = userService;
        }

        private string CreateToken(User u, string role)
        {
            List<Claim> claims = new List<Claim>
            {

              // new Claim(ClaimTypes.NameIdentifier, u.Id),
               new Claim(ClaimTypes.Name, u.Username),
               new Claim(ClaimTypes.Expiration, DateTime.Now.AddMinutes(120).ToString()),
               new Claim(ClaimTypes.Role, role),
            };
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                _configuration.GetSection("JWTSettings:TokenKey").Value));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddMinutes(60),
                signingCredentials: creds);

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        private string GetNextUserID()
        {
            long nextCounterKey = redis.Incr("next:user:id");
            return nextCounterKey.ToString("x");
        }

        [HttpPost]
        [Route("CreateUser/{username}/{password}/{role}")]
        public IActionResult CreateUser(string username, string password, bool role)
        {
            string id = GetNextUserID();
            //var users = redis.GetAllItemsFromSet("user:all");
            if (redis.GetAllItemsFromSet(username) == null)
                return BadRequest("User already exists");
            //{ return BadRequest("Vec postoji neko sa tim usernameom"); }
            redis.Set(username + ":pw:", password);
            redis.Set(username + ":id:", id);
            redis.Set("user:" + id + ":username", username);
            var users = redis.GetAllItemsFromSet(username);
            if (role == false)
                redis.Set(username + ":role:", "User");
            if (role == true)
                redis.Set(username + ":role:", "Admin");

            User u = new User
            {
                Username = username,
                Password = password,
                Id = id,
                Role = redis.Get<string>(username + ":role:")
            };
            string Token = CreateToken(u, redis.Get<string>(username + ":role:"));
            return Ok(new
            {
                User = u,
                token = Token
            });
        }
        [HttpGet]
        [Route("GetUsername/{userID}")]
        public IActionResult GetUserUsername(string userID)
        {
            var username = redis.Get<string>("user:" + userID + ":username");
            if (username == null)
            {
                return BadRequest("Username doesnt exist");
            }

            return Ok(new { username });
        }

        [HttpGet]
        [Route("GetCurrentUser")]
        public IActionResult GetCurrentUser()
        {
            var username = _userService.GetMyName();
            if (username == null)
            {
                return BadRequest("No one is logged in!");
            }
            var role = redis.Get<string>(username + ":role:");
            var password = redis.Get<string>(username + ":pw:");
            var id = redis.Get<string>(username + ":id:");
            User u = new User
            {
                Id = id,
                Username = username,
                Password = password,
                Role = role
            };
            string Token = CreateToken(u, role);
            return Ok(new
            {
                Username = username,
                Role = role,
                Token = Token
            });
        }

        [HttpPost]
        [Route("Login/{username}/{password}")]
        public IActionResult Login(string username, string password)
        {
            var pword = redis.Get<string>(username + ":pw:");

            if (pword == null)
                return BadRequest("user with that username doesnt exist");
            if (pword != password)
                return BadRequest("user with that username doesnt have that password");

            var role = redis.Get<string>(username + ":role:");
            var id = redis.Get<string>(username + ":id:");
            User u = new User
            {
                Id = id,
                Username = username,
                Password = password,
                Role = role
            };
            string Token = CreateToken(u, u.Role);

            return Ok(new
            {
                User = u,
                token = Token
            });
        }

    }
}
