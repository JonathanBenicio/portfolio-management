using System.ComponentModel.DataAnnotations;

namespace PortfolioAPI.DTOs;

public class CreateVariableIncomeDto
{
    [Required]
    public string Ticker { get; set; } = string.Empty;
    
    [Required]
    public string Type { get; set; } = string.Empty;
    
    public int Quantity { get; set; }
    public decimal AveragePrice { get; set; }

    public int? WalletId { get; set; }
}

public class CreateTransactionDto
{
    [Required]
    public string Type { get; set; } = "BUY"; // BUY, SELL
    
    [Required]
    public int Quantity { get; set; }
    
    [Required]
    public decimal Price { get; set; }
    
    [Required]
    public DateTime Date { get; set; }
    
    [Required]
    public int VariableIncomeAssetId { get; set; }
}
