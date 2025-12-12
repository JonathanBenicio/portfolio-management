using System.ComponentModel.DataAnnotations;

namespace PortfolioAPI.Models;

public class User
{
    public int Id { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    public string Name { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public List<FixedIncomeAsset> FixedIncomeAssets { get; set; } = new();
    public List<VariableIncomeAsset> VariableIncomeAssets { get; set; } = new();
    public List<ChatConversation> Conversations { get; set; } = new();
}
