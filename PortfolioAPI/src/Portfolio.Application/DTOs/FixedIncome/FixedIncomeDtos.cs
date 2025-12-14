using System.ComponentModel.DataAnnotations;

namespace Portfolio.Application.DTOs.FixedIncome;

public record FixedIncomeAssetDto(
    int Id,
    string Name,
    string Type,
    decimal InvestedValue,
    decimal CurrentValue,
    decimal InterestRate,
    string Index,
    DateTime PurchaseDate,
    DateTime MaturityDate,
    string Liquidity,
    int? WalletId,
    string? WalletName
);

public record CreateFixedIncomeDto(
    [Required] string Name,
    [Required] string Type,
    [Required] decimal InvestedValue,
    decimal InterestRate,
    string Index = "CDI",
    DateTime? PurchaseDate = null,
    DateTime? MaturityDate = null,
    string Liquidity = "Vencimento",
    int? WalletId = null
);

public record UpdateFixedIncomeDto(
    [Required] string Name,
    [Required] string Type,
    [Required] decimal InvestedValue,
    decimal InterestRate,
    string Index = "CDI",
    DateTime? PurchaseDate = null,
    DateTime? MaturityDate = null,
    string Liquidity = "Vencimento",
    int? WalletId = null
);
