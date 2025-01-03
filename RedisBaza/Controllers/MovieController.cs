using Microsoft.AspNetCore.Mvc;
using RedisBaza.Models;
using ServiceStack.Redis;

namespace RedisBaza.Controllers
{
    public class MovieController : Controller
    {
        readonly RedisClient redis = new("redis://localhost:6379");

        private string GetNextMovieID()
        {
            long nextCounterKey = redis.Incr("next:movie:id");
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
            redis.AddItemToSortedSet("movie:ratingsorted", id, 0);
            redis.AddItemToSortedSet("movie:numbersorted", id, 0);
            return Ok(new { id });
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
                var result2 = Convert.ToDouble(redis.Get<string>("movie:" + id + ":rating"));
                var result3 = Convert.ToInt32(redis.Get<string>("movie:" + id + ":numberofratings"));
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

        [HttpGet]
        [Route("GetMoviesRatingSorted")]
        public IActionResult GetMoviesRatingSorted()
        {
            var resultList = redis.GetAllItemsFromSortedSetDesc("movie:ratingsorted");
            List<Movie> movies = new List<Movie>();
            foreach (var id in resultList)
            {
                var result = redis.Get<string>("movie:" + id + ":title");
                var result1 = redis.Get<string>("movie:" + id + ":description");
                var result2 = Convert.ToDouble(redis.Get<string>("movie:" + id + ":rating"));
                var result3 = Convert.ToInt32(redis.Get<string>("movie:" + id + ":numberofratings"));
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
        [HttpGet]
        [Route("GetMoviesNumberSorted")]
        public IActionResult GetMoviesNumberSorted()
        {
            var resultList = redis.GetAllItemsFromSortedSetDesc("movie:numbersorted");
            List<Movie> movies = new List<Movie>();
            foreach (var id in resultList)
            {
                var result = redis.Get<string>("movie:" + id + ":title");
                var result1 = redis.Get<string>("movie:" + id + ":description");
                var result2 = Convert.ToDouble(redis.Get<string>("movie:" + id + ":rating"));
                var result3 = Convert.ToInt32(redis.Get<string>("movie:" + id + ":numberofratings"));
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
        [HttpGet]
        [Route("GetMovie/{movieID}")]
        public IActionResult GetMovie(string movieID)
        {
            var result = redis.Get<string>("movie:" + movieID + ":title");
            var result1 = redis.Get<string>("movie:" + movieID + ":description");
            var result2 = Convert.ToDouble(redis.Get<string>("movie:" + movieID + ":rating"));
            var result3 = Convert.ToInt32(redis.Get<string>("movie:" + movieID + ":numberofratings"));
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
    }

}
