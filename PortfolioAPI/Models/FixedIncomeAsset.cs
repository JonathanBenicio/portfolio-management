using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PortfolioAPI.Models;

public class FixedIncomeAsset
{
    public int Id { get; set; }
    
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Type { get; set; } = string.Empty; // CDB, LCI, LCA, Tesouro, Debêntures
    
    public decimal InvestedValue { get; set; }
    
    public decimal CurrentValue { get; set; } // Can be calculated or manually updated
    
    public decimal InterestRate { get; set; } // e.g., 10.5 for 10.5% or 100 for 100% CDI
    
    public string Index { get; set; } = "CDI"; // CDI, IPCA, Pré
    
    public DateTime PurchaseDate { get; set; }
    
    public DateTime MaturityDate { get; set; }
    
    public string Liquidity { get; set; } = "Vencimento"; // Diário, Vencimento
    
    public int UserId { get; set; }
    public User? User { get; set; }

    public int? WalletId { get; set; }
    [ForeignKey("WalletId")]
    public Wallet? Wallet { get; set; }
}
