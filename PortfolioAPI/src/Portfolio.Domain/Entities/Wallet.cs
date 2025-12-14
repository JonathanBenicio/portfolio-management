namespace Portfolio.Domain.Entities;

public class Wallet
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Broker { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string Color { get; set; } = "#000000";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public User? User { get; set; }
}
