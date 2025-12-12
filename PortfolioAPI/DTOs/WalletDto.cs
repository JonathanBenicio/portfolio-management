using System.ComponentModel.DataAnnotations;

namespace PortfolioAPI.DTOs;

public class WalletDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Broker { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateWalletDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Broker { get; set; } = string.Empty;
    
    [Required]
    public string OwnerName { get; set; } = string.Empty;
    
    public string Color { get; set; } = "#000000";
}

public class UpdateWalletDto
{
    [Required]
    public string Name { get; set; } = string.Empty;
    
    [Required]
    public string Broker { get; set; } = string.Empty;
    
    [Required]
    public string OwnerName { get; set; } = string.Empty;
    
    public string Color { get; set; } = "#000000";
}

public class WalletAnalyticsDto
{
    public decimal TotalInvested { get; set; }
    public decimal TotalCurrent { get; set; }
    public decimal TotalProfit { get; set; }
    public decimal MonthlyReturnPercentage { get; set; }
    public List<AssetSummaryDto> Assets { get; set; } = new();
}

public class AssetSummaryDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Fixed / Variable
    public decimal Invested { get; set; }
    public decimal Current { get; set; }
    public decimal Profit { get; set; }
}

public class WalletEvolutionDto
{
    public DateTime Date { get; set; }
    public decimal TotalValue { get; set; }
}
