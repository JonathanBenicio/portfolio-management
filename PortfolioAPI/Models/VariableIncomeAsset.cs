using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PortfolioAPI.Models;

public class VariableIncomeAsset
{
    public int Id { get; set; }
    
    [Required]
    public string Ticker { get; set; } = string.Empty;
    
    public string Type { get; set; } = string.Empty; // Ação, FII, ETF, BDR
    
    public int Quantity { get; set; }
    
    public decimal AveragePrice { get; set; }
    
    public int UserId { get; set; }
    public User? User { get; set; }

    public int? WalletId { get; set; }
    [ForeignKey("WalletId")]
    public Wallet? Wallet { get; set; }
    
    public List<Transaction> Transactions { get; set; } = new();
    public List<Dividend> Dividends { get; set; } = new();
}
