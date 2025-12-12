using System.ComponentModel.DataAnnotations;

namespace PortfolioAPI.Models;

public class ChatConversation
{
    public int Id { get; set; }
    public string Title { get; set; } = "New Conversation";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int UserId { get; set; }
    public User? User { get; set; }
    public List<ChatMessage> Messages { get; set; } = new();
}

public class ChatMessage
{
    public int Id { get; set; }
    public string Role { get; set; } = "user"; // user, assistant
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public int ConversationId { get; set; }
    public ChatConversation? Conversation { get; set; }
}
