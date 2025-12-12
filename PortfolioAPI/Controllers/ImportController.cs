using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortfolioAPI.Data;
using PortfolioAPI.Models;
using System.Globalization;

namespace PortfolioAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ImportController : ControllerBase
    {
        private readonly PortfolioDbContext _context;
        private readonly ILogger<ImportController> _logger;

        public ImportController(PortfolioDbContext context, ILogger<ImportController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Upload and import transactions from CSV or Excel file
        /// </summary>
        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            if (!file.FileName.EndsWith(".csv") && !file.FileName.EndsWith(".xlsx"))
                return BadRequest("Only CSV and Excel files are supported");

            if (file.Length > 10 * 1024 * 1024) // 10MB limit
                return BadRequest("File size exceeds 10MB limit");

            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            var imported = 0;

            try
            {
                using var reader = new StreamReader(file.OpenReadStream());
                var headerLine = await reader.ReadLineAsync();
                
                if (headerLine == null)
                    return BadRequest("Empty file");

                while (!reader.EndOfStream)
                {
                    var line = await reader.ReadLineAsync();
                    if (string.IsNullOrWhiteSpace(line)) continue;

                    var values = line.Split(',');
                    if (values.Length < 5) continue;

                    var ticker = values[0].Trim();
                    var type = values[1].Trim();
                    var quantity = int.Parse(values[2].Trim());
                    var price = decimal.Parse(values[3].Trim(), CultureInfo.InvariantCulture);
                    var date = DateTime.Parse(values[4].Trim());

                    // Create transaction based on type
                    if (type.Contains("Ação") || type.Contains("FII"))
                    {
                        // Check if asset exists
                        var asset = _context.VariableIncomeAssets
                            .FirstOrDefault(a => a.Ticker == ticker && a.UserId == userId);

                        if (asset == null)
                        {
                            asset = new VariableIncomeAsset
                            {
                                Ticker = ticker,
                                Type = type.Contains("FII") ? "FII" : "Ação",
                                UserId = userId,
                                Quantity = 0,
                                AveragePrice = 0
                            };
                            _context.VariableIncomeAssets.Add(asset);
                            await _context.SaveChangesAsync();
                        }

                        // Add transaction
                        var transaction = new Transaction
                        {
                            VariableIncomeAssetId = asset.Id,
                            Type = "Compra",
                            Quantity = quantity,
                            Price = price,
                            Date = date
                        };

                        _context.Transactions.Add(transaction);

                        // Update asset
                        var totalCost = (asset.Quantity * asset.AveragePrice) + (quantity * price);
                        asset.Quantity += quantity;
                        asset.AveragePrice = totalCost / asset.Quantity;

                        imported++;
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = $"{imported} transactions imported successfully", count = imported });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error importing file");
                return StatusCode(500, "Error processing file");
            }
        }

        /// <summary>
        /// Download CSV template
        /// </summary>
        [HttpGet("template")]
        [AllowAnonymous]
        public IActionResult GetTemplate()
        {
            var csv = "ticker,type,quantity,price,date\n";
            csv += "PETR4,Ação,100,35.50,2024-01-15\n";
            csv += "VALE3,Ação,50,68.00,2024-02-20\n";
            csv += "MXRF11,FII,200,10.50,2024-03-10\n";

            var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
            return File(bytes, "text/csv", "template.csv");
        }
    }
}
