using Microsoft.AspNetCore.Mvc;
using ServiceStack.Redis;

namespace RedisBaza.Controllers
{
    public class AdminController : Controller
    {
        readonly RedisClient redis = new("redis://localhost:6379");

        [HttpDelete]
        [Route("ClearAll")]
        public async Task<IActionResult> ClearAll()
        {
            redis.FlushAll();
            redis.FlushDb();
            return Ok();
        }
    }
}
