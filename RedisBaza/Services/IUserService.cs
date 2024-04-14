using System.Security.Claims;

namespace RedisBaza.Services
{
    public interface IUserService
    {
        string GetMyName();
        string GetMyRole();
    }
}
