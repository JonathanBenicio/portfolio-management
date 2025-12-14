using System.ComponentModel.DataAnnotations;

namespace PortfolioAPI.DTOs;

public class CreateFixedIncomeDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Type { get; set; } = string.Empty;
    
    [Required]
    public decimal InvestedValue { get; set; }
    
    public decimal InterestRate { get; set; }
    
    public string Index { get; set; } = "CDI";
    
    public DateTime PurchaseDate { get; set; }
    
    public DateTime MaturityDate { get; set; }
    
    public string Liquidity { get; set; } = "Vencimento";

    public int? WalletId { get; set; }
}

public class UpdateFixedIncomeDto : CreateFixedIncomeDto
{
}
