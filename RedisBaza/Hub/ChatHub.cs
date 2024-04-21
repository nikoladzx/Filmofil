using Microsoft.AspNetCore.SignalR;
using RedisBaza.Models;
using ServiceStack.Redis;
using System.Text.Json;
using System.Threading.Channels;

namespace RedisBaza.Hubs
{
    public class ChatHub : Hub
    {
        private readonly static Dictionary<string, string> connections = new Dictionary<string, string>();
        readonly RedisClient redis = new("redis://localhost:6379");

        IRedisSubscription subscription;




        public async Task JoinChat(UserConnection conn)
        {
            await Clients.All
                .SendAsync("ReceiveMessage", "admin", $"{conn.Username} has joined");
        }

        public async Task JoinSpecificChatRoom(UserConnection conn)
        {
              if (!connections.ContainsKey(conn.Username) || !connections[conn.Username].Contains(conn.ChatRoom))
            {
                Subscribe(conn.Username, conn.ChatRoom);
                await Groups.AddToGroupAsync(Context.ConnectionId, conn.ChatRoom);

            }
                
            
            
            
            await Clients.Group(conn.ChatRoom)
              .SendAsync("JoinSpecificChatRoom", "admin", $"{conn.Username} has joined {conn.ChatRoom}");
        }

        public async Task SendMessage(UserConnection conn, string msg)
        {

            await Clients.Group(conn.ChatRoom)
                .SendAsync("ReceiveSpecificMessage", conn.Username, msg);

            redis.PublishMessage(conn.ChatRoom, msg);
        }

        public void Subscribe(string username, string chatroom)
        {
            connections[username] = chatroom;
        }

        public void Unsubscribe(string username)
        {
            connections.Remove(username);
        }
    }
}
