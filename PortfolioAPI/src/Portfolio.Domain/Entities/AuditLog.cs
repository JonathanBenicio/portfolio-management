namespace Portfolio.Domain.Entities;

public class AuditLog
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string EntityType { get; set; } = string.Empty; // FixedIncome, VariableIncome, Wallet
    public int EntityId { get; set; }
    public string Action { get; set; } = string.Empty; // Create, Update, Delete
    public string Changes { get; set; } = "{}"; // JSON storing changed fields
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}
