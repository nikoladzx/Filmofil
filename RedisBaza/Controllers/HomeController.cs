using Microsoft.AspNetCore.Mvc;
using RedisBaza.Models;
using ServiceStack.Redis;

namespace RedisBaza.Controllers
{
    public class HomeController : Controller
    {
        readonly RedisClient redis = new("redis://localhost:6379");


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


        [HttpPost]
        [Route("CreateMovie/{title}/{description}/{pictureurl}")]
        public IActionResult CreateMovie(string title, string description, string pictureUrl)
        {
            string id = GetNextMovieID();
            redis.Set("movie:" + id + ":title", title);
            redis.Set("movie:" + id + ":description", description);
            redis.Set("movie:" + id + ":rating", 0);
            redis.Set("movie:" + id + ":numberofratings", 0);
            redis.Set("movie" + id + ":pictureUrl", pictureUrl);
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
                var result4 = redis.Get<string>("movie:" + id + ":pictureUrl");

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
        [Route("CreateUser/{username}/{role}")]
        public IActionResult CreateUser(string username, string password, bool Role)
        {
            string id = GetNextUserID();
            redis.Set("user:" + id + ":username", username);
            redis.Set("user:" + id + ":password", password);
            if (Role == false)
                redis.Set("user:" + id + ":role", 0);
            if (Role == true)
                redis.Set("user:" + id + ":role", 1);
            return Ok(new { id });
        }
        [HttpGet]
        [Route("GetUsername/{userID}")]
        public IActionResult GetUserUsername(string userID)
        {
            var username = redis.Get<string>("user:" + userID + ":username");

            return Ok(new { username });
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




            redis.IncrBy("movie" + movieID + ":rating", rating);
            redis.Incr("movie" + movieID + ":numberofratings");

            return Ok("MZ");
        }
        [HttpGet]
        [Route("GetReview/{reviewID}")]
        public IActionResult GetReview(string reviewID)
        {
            var review = redis.Get<Review>("review:" + reviewID + ":review");

            //var ratings = redis.GetAllItemsFromList("review:" + reviewID + ":rating");
            return Ok(new { review });
        }
    }

}
