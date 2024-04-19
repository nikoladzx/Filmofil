﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using RedisBaza.Models;
using RedisBaza.Services;
using ServiceStack.Redis;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace RedisBaza.Controllers
{
    public class HomeController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IUserService _userService;
        private readonly IWebHostEnvironment _hostEnvironment;
        readonly RedisClient redis = new("redis://localhost:6379");
        public HomeController(IConfiguration configuration, IUserService userService, IWebHostEnvironment hostEnvironment)
        {
            _configuration = configuration;
            _userService = userService;
            this._hostEnvironment = hostEnvironment;
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
        private string GetNextReviewID()
        {
            long nextCounterKey = redis.Incr("next:review:id");
            return nextCounterKey.ToString("x");
        }

        private string GetNextUserID()
        {
            long nextCounterKey = redis.Incr("next:user:id");
            return nextCounterKey.ToString("x");
        }



        private string GetNextMovieID()
        {
            long nextCounterKey = redis.Incr("next:movie:id");
            return nextCounterKey.ToString("x");
        }
        private string GetNextCommentID()
        {
            long nextCounterKey = redis.Incr("next:comment:id");
            return nextCounterKey.ToString("x");
        }


        [HttpPost]
        [Route("CreateMovie/{title}/{description}/{pictureurl}")]
        public IActionResult CreateMovie(string title, string description, string pictureurl)
        {
            string id = GetNextMovieID();
            redis.Set("movie:" + id + ":title", title);
            redis.Set("movie:" + id + ":description", description);
            redis.Set("movie:" + id + ":rating", 0);
            redis.Set("movie:" + id + ":numberofratings", 0);
            redis.Set("movie:" + id + ":pictureurl", pictureurl);
            redis.AddItemToSet("movie:all", id);
            return Ok(new { id });
        }
        [HttpDelete]
        [Route("ClearAll")]
        public async Task<IActionResult> ClearAll()
        {
            redis.FlushAll();
            redis.FlushDb();
            return Ok();
        }
        [HttpGet]
        [Route("GetMovies")]
        public IActionResult GetMovies()
        {
            var resultList = redis.GetAllItemsFromSet("movie:all");
            List<Movie> movies = new List<Movie>();
            foreach (var id in resultList)
            {
                var result = redis.Get<string>("movie:" + id + ":title");
                var result1 = redis.Get<string>("movie:" + id + ":description");
                var result2 = Convert.ToDouble(redis.Get<string>("movie" + id + ":rating"));
                var result3 = Convert.ToInt32(redis.Get<string>("movie" + id + ":numberofratings"));
                var result4 = redis.Get<string>("movie:" + id + ":pictureurl");

                if (result3 != 0)
                {
                    double x = result2 / result3;
                    double z = Math.Round(x, 2);


                    movies.Add(new Movie { ID = id, Title = result, Description = result1, Rating = z, NumberOfRatings = result3, PictureUrl = result4 });
                }
                if (result3 == 0)
                {
                    double x = result2 / result3;
                    double z = Math.Round(x, 2);


                    movies.Add(new Movie { ID = id, Title = result, Description = result1, Rating = 0, NumberOfRatings = 0, PictureUrl = result4 });
                }
            }
            return Ok(new { movies });
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
            return Ok(new { User = u,
            token = Token});
        }
        [HttpGet]
        [Route("GetUsername/{userID}")]
        public IActionResult GetUserUsername(string userID)
        {
            var username = redis.Get<string>("user:" + userID + ":username");
            if (username != null)
            {
                return BadRequest("Username doesnt exist");
            }

            return Ok(new { username });
        }

        [HttpGet]
        [Route("GetCurrentUser")]
        public IActionResult GetCurrentUser()
        {
            var username =_userService.GetMyName();
            if (username == null) {
                return BadRequest("No one is logged in!");
            }
            var role = redis.Get<string>(username + ":role:");
            var password = redis.Get<string>(username + ":pw:");
            var id = redis.Get<string>(username + ":id:");
            User u = new User
            {   Id=id,
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
            { Id = id,
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



        [HttpPost]
        [Route("CreateReview/{text}/{authorID}/{movieID}/{rating}")]
        public IActionResult CreateReview(string text, string authorID, string movieID, int rating)
        {
            string id = GetNextReviewID();
            var review = new Review
            {
                ID = id,
                Text = text,
                Time = DateTime.Now,
                AuthorID = authorID,
                Upvotes = 0,
                Downvotes = 0,
                MovieID = movieID,
                Rating = rating
            };
            string r = rating.ToString();
            redis.PushItemToList("movie:" + movieID + ":review", id);
            redis.PushItemToList("movie:" + movieID + ":ratings", r);
            redis.AddItemToSortedSet("movie:" + movieID + ":reviewssorted", id, 0);
            redis.PushItemToList("user:" + authorID + ":review", id);
            redis.Set("review:" + id + ":review", review);
            redis.Set("review:" + id + ":upvotes", 0);
            redis.Set("review:" + id + ":downvotes", 0);




            redis.IncrBy("movie" + movieID + ":rating", rating);
            redis.Incr("movie" + movieID + ":numberofratings");

            return Ok("Congrats, you've added a movie!");
        }


        [HttpPost]
        [Route("AddUpvote/{authorID}/{reviewID}/{number}")]
        public IActionResult AddUpvote( string authorID, string reviewID, int number)
        {
     
            var d = redis.Get<int>(authorID + ":" + reviewID + ":clicku");

            if (number > 0 && d == 0)
            {
                redis.Set(authorID + ":" + reviewID + ":clicku", 1);
                redis.IncrBy("review:" + reviewID + ":upvotes", number);
                return Ok("Congrats you've changed an zm!");
            }
            if (number < 0 && d == 1)
            {
                redis.Set(authorID + ":" + reviewID + ":clicku", 0);
                redis.IncrBy("review:" + reviewID + ":upvotes", number);
                return Ok("Congrats you've changed an mz!");
            }
            return Ok("Caaaaa!");
        }
        [HttpPost]
        [Route("AddDownvote/{authorID}/{reviewID}/{number}")]
        public IActionResult AddDownvote(string authorID, string reviewID, int number)
        {
            
            var d = redis.Get<int>(authorID + ":" + reviewID + ":clickd");

            
            if (number>0 && d==0)
            {
                redis.Set(authorID + ":" + reviewID + ":clickd", 1);
                redis.IncrBy("review:" + reviewID + ":downvotes", number);
                return Ok("Congrats you've changed an downvote!");
            }
            if (number < 0 && d==1)
            {
                redis.Set(authorID + ":" + reviewID + ":clickd", 0);
                redis.IncrBy("review:" + reviewID + ":downvotes", number);
                return Ok("Congrats you've changed an downvote!");
            }

            return Ok("Congrats you've changed an downvote!");
        }
        [HttpGet]
        [Route("GetReview/{reviewID}")]
        public IActionResult GetReview(string reviewID)
        {
            var review = redis.Get<Review>("review:" + reviewID + ":review");

            //var ratings = redis.GetAllItemsFromList("review:" + reviewID + ":rating");
            return Ok(new { review });
        }

        [HttpGet]
        [Route("GetUpDownvotes/{reviewID}/{authorID}")]
        public async Task<ActionResult> GetUpDownvotes(string reviewID, string authorID)
        {
            var clicku = redis.Get<int>(authorID + ":" + reviewID + ":clicku");
            var clickd = redis.Get<int>(authorID + ":" + reviewID + ":clickd");
            var upvotes = redis.Get<int>("review:" + reviewID + ":upvotes");
            var downvotes = redis.Get<int>("review:" + reviewID + ":downvotes");

            //var ratings = redis.GetAllItemsFromList("review:" + reviewID + ":rating");
            return  Ok(new { upvotes, downvotes, clicku, clickd });
        }

        [HttpGet]
        [Route("GetReviews/{movieID}")]
        public IActionResult GetReviews(string movieID)
        {
            var reviews = redis.GetAllItemsFromList("movie:" + movieID + ":review");
            //redis.PushItemToList("movie:" + movieID + ":review", id);
            //var ratings = redis.GetAllItemsFromList("review:" + reviewID + ":rating");
            return Ok(new { reviews });
        }
        [HttpPut]
        [Route("EditReview/{reviewID}/{text}/{authorID}")]
        public IActionResult EditReview(string reviewID, string text, string authorID)
        {
            var review = redis.Get<Review>("review:" + reviewID + ":review");
            if (review.AuthorID != authorID)
            {
                return BadRequest("You cant edit a review that you haven't created");
            }
            review.Text = text;
            redis.Set<Review>("review:" + reviewID + ":review", review);

            return Ok(new { review });
        }

        [HttpDelete]
        [Route("DeleteReview/{reviewID}/{authorID}")]
        public IActionResult DeleteReview(string reviewID, string authorID)
        {
            var review = redis.Get<Review>("review:" + reviewID + ":review");
            if (review.AuthorID != authorID)
            {
                return BadRequest("You cant delete a review that you haven't created");
            }

            redis.Remove("review:" + reviewID + ":review");
            redis.RemoveItemFromList("movie:" + review.MovieID + ":review", reviewID);



            return Ok("mz");
        }
        [HttpGet]
        [Route("GetMovie/{movieID}")]
        public IActionResult GetMovie(string movieID)
        {
            var result = redis.Get<string>("movie:" + movieID + ":title");
            var result1 = redis.Get<string>("movie:" + movieID + ":description");
            var result2 = Convert.ToDouble(redis.Get<string>("movie" + movieID + ":rating"));
            var result3 = Convert.ToInt32(redis.Get<string>("movie" + movieID + ":numberofratings"));
            var result4 = redis.Get<string>("movie:" + movieID + ":pictureurl");

            if (result3 != 0)
            {
                double x = result2 / result3;
                double z = Math.Round(x, 2);


               return Ok(new Movie { ID = movieID, Title = result, Description = result1, Rating = z, NumberOfRatings = result3, PictureUrl = result4 });
            }
            if (result3 == 0)
            {
                double x = result2 / result3;
                double z = Math.Round(x, 2);


                return Ok(new Movie { ID = movieID, Title = result, Description = result1, Rating = 0, NumberOfRatings = 0, PictureUrl = result4 });
            }
            return BadRequest("Movie with that ID doesnt exist at all :(");  
        }
        [HttpGet]
        [Route("GetComments/{reviewID}")]
        public IActionResult GetComments(string reviewID)
        {
            var comments = redis.GetAllItemsFromList("review:" + reviewID + ":comment");
            return Ok(new { comments });
        }
        [HttpGet]
        [Route("GetComment/{commentID}")]
        public IActionResult GetComment(string commentID)
        {
            var comment = redis.Get<Comment>("comment:" + commentID + ":comment");
            return Ok(new { comment });
        }

        [HttpPut]
        [Route("EditComment/{commentID}/{text}/{authorID}")]
        public IActionResult EditComment(string commentID, string text, string authorID)
        {
            var comment = redis.Get<Comment>("comment:" + commentID + ":comment");
            if (comment.AuthorID != authorID)
            {
                return BadRequest("You cant edit a comment that you haven't created");
            }
            comment.Text = text;
            redis.Set<Comment>("comment:" + commentID + ":comment", comment);

            return Ok(new { comment });
        }

        [HttpDelete]
        [Route("DeleteComment/{commentID}/{authorID}")]
        public IActionResult DeleteComment(string commentID, string authorID)
        {
            var comment = redis.Get<Comment>("comment:" + commentID + ":comment");
            if (comment.AuthorID != authorID)
            {
                return BadRequest("You cant delete a comment that you haven't created");
            }
            redis.Remove("comment:" + commentID + ":comment");

            redis.RemoveItemFromList("review:" + comment.ReviewID + ":comment", commentID);

            return Ok("Obrisano");
        }

        [HttpPost]
        [Route("AddComment/{reviewID}/{authorID}/{text}")]
        public IActionResult AddComment(string reviewID, string authorID, string text)
        {
            var id = GetNextCommentID();
            Comment comment= new Comment
                {
                ID = id,
                AuthorID = authorID,
                Text = text,
                ReviewID=reviewID,
                Time = DateTime.Now,
                Upvotes = 0,
                Downvotes = 0,


            };
            redis.Set<Comment>("comment:" + id + ":comment", comment);
            redis.PushItemToList("review:" + reviewID + ":comment", id);

            return Ok("Uspesno");
        }
    }

}
