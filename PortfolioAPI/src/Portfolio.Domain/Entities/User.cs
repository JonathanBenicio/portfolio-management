namespace Portfolio.Domain.Entities;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public List<FixedIncomeAsset> FixedIncomeAssets { get; set; } = new();
    public List<VariableIncomeAsset> VariableIncomeAssets { get; set; } = new();
    public List<ChatConversation> Conversations { get; set; } = new();
    public List<Wallet> Wallets { get; set; } = new();
    public List<UserApiKey> ApiKeys { get; set; } = new();
}
