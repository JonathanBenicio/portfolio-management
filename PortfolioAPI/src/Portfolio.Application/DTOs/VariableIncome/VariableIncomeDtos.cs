using System.ComponentModel.DataAnnotations;

namespace Portfolio.Application.DTOs.VariableIncome;

public record VariableIncomeAssetDto(
    int Id,
    string Ticker,
    string Type,
    int Quantity,
    decimal AveragePrice,
    int? WalletId,
    string? WalletName,
    List<TransactionDto> Transactions,
    List<DividendDto> Dividends
);

public record CreateVariableIncomeDto(
    [Required] string Ticker,
    [Required] string Type,
    int Quantity,
    decimal AveragePrice,
    int? WalletId = null
);

public record TransactionDto(
    int Id,
    string Type,
    int Quantity,
    decimal Price,
    DateTime Date
);

public record CreateTransactionDto(
    [Required] string Type,
    [Required] int Quantity,
    [Required] decimal Price,
    [Required] DateTime Date,
    [Required] int VariableIncomeAssetId
);

public record DividendDto(
    int Id,
    decimal Amount,
    DateTime PaymentDate,
    string Type
);

public record CreateDividendDto(
    [Required] decimal Amount,
    [Required] DateTime PaymentDate,
    string Type = "Dividend",
    [Required] int VariableIncomeAssetId = 0
);
