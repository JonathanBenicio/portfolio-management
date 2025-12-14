using System.ComponentModel.DataAnnotations;

namespace PortfolioAPI.Models;

public class UserApiKey
{
    public int Id { get; set; }
    
    [Required]
    public int UserId { get; set; }
    public User? User { get; set; }
    
    [Required]
    public string Provider { get; set; } = "OpenAI"; // OpenAI, Anthropic, etc.
    
    [Required]
    public string EncryptedApiKey { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? LastUsedAt { get; set; }
    
    public bool IsActive { get; set; } = true;
}
