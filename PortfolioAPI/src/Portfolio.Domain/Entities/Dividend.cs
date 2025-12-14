namespace Portfolio.Domain.Entities;

public class Dividend
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime PaymentDate { get; set; }
    public string Type { get; set; } = "Dividend"; // Dividend, JCP

    public int VariableIncomeAssetId { get; set; }
    public VariableIncomeAsset? VariableIncomeAsset { get; set; }
}
