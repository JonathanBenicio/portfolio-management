using System.ComponentModel.DataAnnotations;

namespace PortfolioAPI.DTOs;

public class SaveApiKeyDto
{
    [Required]
    public string Provider { get; set; } = "OpenAI";
    
    [Required]
    public string ApiKey { get; set; } = string.Empty;
}

public class ApiKeyResponseDto
{
    public int Id { get; set; }
    public string Provider { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastUsedAt { get; set; }
    public string MaskedKey { get; set; } = string.Empty; // Only shows last 4 characters
}

public class ChatRequestDto
{
    [Required]
    public string Message { get; set; } = string.Empty;
    
    public int? ConversationId { get; set; }
}

public class ChatResponseDto
{
    public int ConversationId { get; set; }
    public ChatMessageDto UserMessage { get; set; } = null!;
    public ChatMessageDto AiMessage { get; set; } = null!;
}

public class ChatMessageDto
{
    public int Id { get; set; }
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
}
