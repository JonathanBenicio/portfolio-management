namespace Portfolio.Domain.Entities;

public class FixedIncomeAsset
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // CDB, LCI, LCA, Tesouro, Debêntures
    public decimal InvestedValue { get; set; }
    public decimal CurrentValue { get; set; }
    public decimal InterestRate { get; set; }
    public string Index { get; set; } = "CDI"; // CDI, IPCA, Pré
    public DateTime PurchaseDate { get; set; }
    public DateTime MaturityDate { get; set; }
    public string Liquidity { get; set; } = "Vencimento"; // Diário, Vencimento

    public int UserId { get; set; }
    public User? User { get; set; }

    public int? WalletId { get; set; }
    public Wallet? Wallet { get; set; }
}
