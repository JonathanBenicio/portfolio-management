using System.ComponentModel.DataAnnotations;

namespace Portfolio.Application.DTOs.Wallet;

public record WalletDto(
    int Id,
    string Name,
    string Broker,
    string OwnerName,
    string Color,
    DateTime CreatedAt
);

public record CreateWalletDto(
    [Required] string Name,
    [Required] string Broker,
    [Required] string OwnerName,
    string Color = "#000000"
);

public record UpdateWalletDto(
    [Required] string Name,
    [Required] string Broker,
    [Required] string OwnerName,
    string Color = "#000000"
);

public record WalletAnalyticsDto(
    decimal TotalInvested,
    decimal TotalCurrent,
    decimal TotalProfit,
    decimal MonthlyReturnPercentage,
    List<AssetSummaryDto> Assets
);

public record AssetSummaryDto(
    int Id,
    string Name,
    string Type,
    decimal Invested,
    decimal Current,
    decimal Profit
);

public record WalletEvolutionDto(
    DateTime Date,
    decimal TotalValue
);
