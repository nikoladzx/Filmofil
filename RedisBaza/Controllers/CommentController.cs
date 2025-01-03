using Microsoft.AspNetCore.Mvc;
using RedisBaza.Models;
using ServiceStack.Redis;

namespace RedisBaza.Controllers
{
    public class CommentController : Controller
    {
        readonly RedisClient redis = new("redis://localhost:6379");

        private string GetNextCommentID()
        {
            long nextCounterKey = redis.Incr("next:comment:id");
            return nextCounterKey.ToString("x");
        }

        [HttpGet]
        [Route("GetComments/{reviewID}")]
        public IActionResult GetComments(string reviewID)
        {
            var comments = redis.GetAllItemsFromList("review:" + reviewID + ":comment");
            return Ok(new { comments });
        }
        [HttpGet]
        [Route("GetCommentsSorted/{reviewID}")]
        public IActionResult GetCommentsSorted(string reviewID)
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
            redis.RemoveItemFromSortedSet("review:" + comment.ReviewID + ":commentsorted", commentID);

            return Ok("Obrisano");
        }

        [HttpPost]
        [Route("AddComment/{reviewID}/{authorID}/{text}")]
        public IActionResult AddComment(string reviewID, string authorID, string text)
        {
            var id = GetNextCommentID();
            Comment comment = new Comment
            {
                ID = id,
                AuthorID = authorID,
                Text = text,
                ReviewID = reviewID,
                Time = DateTime.Now,
                Upvotes = 0,
                Downvotes = 0,


            };
            redis.Set<Comment>("comment:" + id + ":comment", comment);
            redis.PushItemToList("review:" + reviewID + ":comment", id);
            redis.AddItemToSortedSet("review:" + reviewID + ":commentsorted", id, comment.Upvotes - comment.Downvotes);

            return Ok("Uspesno");
        }
    }
}
