using System.ComponentModel.DataAnnotations;

namespace PortfolioAPI.Models;

public class Transaction
{
    public int Id { get; set; }
    
    public string Type { get; set; } = "BUY"; // BUY, SELL
    
    public int Quantity { get; set; }
    
    public decimal Price { get; set; }
    
    public DateTime Date { get; set; }
    
    public int VariableIncomeAssetId { get; set; }
    public VariableIncomeAsset? VariableIncomeAsset { get; set; }
}
