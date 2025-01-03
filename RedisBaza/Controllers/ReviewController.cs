using Microsoft.AspNetCore.Mvc;
using RedisBaza.Models;
using ServiceStack.Redis;
using static ServiceStack.Diagnostics.Events;

namespace RedisBaza.Controllers
{
    public class ReviewController : Controller
    {
        readonly RedisClient redis = new("redis://localhost:6379");

        private string GetNextReviewID()
        {
            long nextCounterKey = redis.Incr("next:review:id");
            return nextCounterKey.ToString("x");
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
        [HttpGet]
        [Route("GetReviewsSorted/{movieID}")]
        public IActionResult GetReviewsSorted(string movieID)
        {
            var reviews = redis.GetAllItemsFromSortedSetDesc("movie:" + movieID + ":reviewssorted");
            return Ok(new { reviews });
        }
        [HttpPut]
        [Route("EditReview/{reviewID}/{text}/{rating}/{authorID}")]
        public IActionResult EditReview(string reviewID, string text, int rating, string authorID)
        {
            var review = redis.Get<Review>("review:" + reviewID + ":review");
            if (review.AuthorID != authorID)
            {
                return BadRequest("You cant edit a review that you haven't created");
            }

            var oldrating = redis.Get<Double>("movie:" + review.MovieID + ":rating");
            redis.Set<Double>("movie:" + review.MovieID + ":rating", oldrating - review.Rating + rating);
            review.Text = text;
            review.Rating = rating;
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
            var rating = redis.Get<Double>("movie:" + review.MovieID + ":rating");
            redis.Set<Double>("movie:" + review.MovieID + ":rating", rating - review.Rating);
            redis.Decr("movie:" + review.MovieID + ":numberofratings");
            redis.Remove("review:" + reviewID + ":review");
            redis.RemoveItemFromList("movie:" + review.MovieID + ":review", reviewID);
            redis.RemoveItemFromSortedSet("movie:" + review.MovieID + ":reviewssorted", reviewID);



            return Ok("mz");
        }
        [HttpGet]
        [Route("GetReview/{reviewID}")]
        public IActionResult GetReview(string reviewID)
        {
            var review = redis.Get<Review>("review:" + reviewID + ":review");

            //var ratings = redis.GetAllItemsFromList("review:" + reviewID + ":rating");
            return Ok(new { review });
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




            redis.IncrBy("movie:" + movieID + ":rating", rating);
            redis.Incr("movie:" + movieID + ":numberofratings");
            var totalrating = redis.Get<double>("movie:" + movieID + ":rating");
            var totalnumber = redis.Get<int>("movie:" + movieID + ":numberofratings");
            redis.RemoveItemFromSortedSet("movie:ratingsorted", movieID);
            redis.RemoveItemFromSortedSet("movie:numbersorted", movieID);
            redis.AddItemToSortedSet("movie:ratingsorted", movieID, totalrating / totalnumber);
            redis.AddItemToSortedSet("movie:numbersorted", movieID, totalnumber);

            return Ok("Congrats, you've added a movie!");
        }


        [HttpPost]
        [Route("AddUpvote/{authorID}/{reviewID}/{number}")]
        public IActionResult AddUpvote(string authorID, string reviewID, int number)
        {

            var d = redis.Get<int>(authorID + ":" + reviewID + ":clicku");

            if (number > 0 && d == 0)
            {
                redis.Set(authorID + ":" + reviewID + ":clicku", 1);
                redis.IncrBy("review:" + reviewID + ":upvotes", number);
                var result = redis.Get<Review>("review:" + reviewID + ":review");
                result.Upvotes++;
                redis.Set<Review>("review:" + reviewID + ":review", result);
                redis.RemoveItemFromSortedSet("movie:" + result.MovieID + ":reviewssorted", reviewID);
                redis.AddItemToSortedSet("movie:" + result.MovieID + ":reviewssorted", reviewID, (result.Upvotes - result.Downvotes));
                return Ok(result.Upvotes + " mz " + result.Downvotes);
            }
            if (number < 0 && d == 1)
            {
                redis.Set(authorID + ":" + reviewID + ":clicku", 0);
                redis.IncrBy("review:" + reviewID + ":upvotes", number);
                var result = redis.Get<Review>("review:" + reviewID + ":review");
                result.Upvotes--;
                redis.Set<Review>("review:" + reviewID + ":review", result);
                redis.RemoveItemFromSortedSet("movie:" + result.MovieID + ":reviewssorted", reviewID);
                redis.AddItemToSortedSet("movie:" + result.MovieID + ":reviewssorted", reviewID, (result.Upvotes - result.Downvotes));
                return Ok(result.Upvotes + " mz " + result.Downvotes);
            }
            return Ok("Greska!");
        }
        [HttpPost]
        [Route("AddDownvote/{authorID}/{reviewID}/{number}")]
        public IActionResult AddDownvote(string authorID, string reviewID, int number)
        {

            var d = redis.Get<int>(authorID + ":" + reviewID + ":clickd");


            if (number > 0 && d == 0)
            {
                redis.Set(authorID + ":" + reviewID + ":clickd", 1);
                redis.IncrBy("review:" + reviewID + ":downvotes", number);
                var result = redis.Get<Review>("review:" + reviewID + ":review");
                result.Downvotes++;
                redis.Set<Review>("review:" + reviewID + ":review", result);
                redis.RemoveItemFromSortedSet("movie:" + result.MovieID + ":reviewssorted", reviewID);
                redis.AddItemToSortedSet("movie:" + result.MovieID + ":reviewssorted", reviewID, (result.Upvotes - result.Downvotes));
                return Ok(result.Upvotes + " mz " + result.Downvotes);
            }
            if (number < 0 && d == 1)
            {
                redis.Set(authorID + ":" + reviewID + ":clickd", 0);
                redis.IncrBy("review:" + reviewID + ":downvotes", number);
                var result = redis.Get<Review>("review:" + reviewID + ":review");
                result.Downvotes--;
                redis.Set<Review>("review:" + reviewID + ":review", result);
                redis.RemoveItemFromSortedSet("movie:" + result.MovieID + ":reviewssorted", reviewID);
                redis.AddItemToSortedSet("movie:" + result.MovieID + ":reviewssorted", reviewID, (result.Upvotes - result.Downvotes));
                return Ok(result.Upvotes + " mz " + result.Downvotes);
            }

            return Ok("Greska");
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
            return Ok(new { upvotes, downvotes, clicku, clickd });
        }

    }
}
