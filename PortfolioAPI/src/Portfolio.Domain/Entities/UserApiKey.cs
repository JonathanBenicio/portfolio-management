namespace Portfolio.Domain.Entities;

public class UserApiKey
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public User? User { get; set; }

    public string Provider { get; set; } = "OpenAI"; // OpenAI, Anthropic, Google, etc.
    public string EncryptedApiKey { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? LastUsedAt { get; set; }
    public bool IsActive { get; set; } = true;
}
