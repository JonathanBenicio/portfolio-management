using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using System.Security.Claims;

namespace PortfolioAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AnalysisController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public AnalysisController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet("benchmarks")]
    public ActionResult<object> GetBenchmarks()
    {
        // Mock benchmark data - in production this would come from a financial API
        var benchmarks = new
        {
            ibovespa = new[]
            {
                new { date = DateTime.Now.AddMonths(-6).ToString("yyyy-MM-dd"), value = 100000m },
                new { date = DateTime.Now.AddMonths(-5).ToString("yyyy-MM-dd"), value = 102000m },
                new { date = DateTime.Now.AddMonths(-4).ToString("yyyy-MM-dd"), value = 105000m },
                new { date = DateTime.Now.AddMonths(-3).ToString("yyyy-MM-dd"), value = 107000m },
                new { date = DateTime.Now.AddMonths(-2).ToString("yyyy-MM-dd"), value = 112000m },
                new { date = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd"), value = 115000m },
                new { date = DateTime.Now.ToString("yyyy-MM-dd"), value = 118000m }
            },
            cdi = new[]
            {
                new { date = DateTime.Now.AddMonths(-6).ToString("yyyy-MM-dd"), value = 100000m },
                new { date = DateTime.Now.AddMonths(-5).ToString("yyyy-MM-dd"), value = 100875m },
                new { date = DateTime.Now.AddMonths(-4).ToString("yyyy-MM-dd"), value = 101750m },
                new { date = DateTime.Now.AddMonths(-3).ToString("yyyy-MM-dd"), value = 102625m },
                new { date = DateTime.Now.AddMonths(-2).ToString("yyyy-MM-dd"), value = 103500m },
                new { date = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd"), value = 104375m },
                new { date = DateTime.Now.ToString("yyyy-MM-dd"), value = 105250m }
            },
            ipca = new[]
            {
                new { date = DateTime.Now.AddMonths(-6).ToString("yyyy-MM-dd"), value = 100000m },
                new { date = DateTime.Now.AddMonths(-5).ToString("yyyy-MM-dd"), value = 100450m },
                new { date = DateTime.Now.AddMonths(-4).ToString("yyyy-MM-dd"), value = 100900m },
                new { date = DateTime.Now.AddMonths(-3).ToString("yyyy-MM-dd"), value = 101350m },
                new { date = DateTime.Now.AddMonths(-2).ToString("yyyy-MM-dd"), value = 101800m },
                new { date = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd"), value = 102250m },
                new { date = DateTime.Now.ToString("yyyy-MM-dd"), value = 102700m }
            }
        };

        return Ok(benchmarks);
    }

    [HttpGet("sectors")]
    public async Task<ActionResult<object>> GetSectorAllocation()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Mock sector data - in a real app, you'd have a Sector field in VariableIncomeAsset
        var sectors = new[]
        {
            new { name = "Financeiro", value = 35000m, percentage = 35 },
            new { name = "Tecnologia", value = 25000m, percentage = 25 },
            new { name = "Energia", value = 20000m, percentage = 20 },
            new { name = "Consumo", value = 15000m, percentage = 15 },
            new { name = "Outros", value = 5000m, percentage = 5 }
        };

        return Ok(sectors);
    }

    [HttpGet("performance/{assetId}")]
    public async Task<ActionResult<object>> GetAssetPerformance(int assetId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var asset = await _context.VariableIncomeAssets
            .FirstOrDefaultAsync(a => a.Id == assetId && a.UserId == userId);

        if (asset == null)
            return NotFound();

        // Mock performance data
        var performance = new
        {
            ticker = asset.Ticker,
            currentPrice = asset.AveragePrice * 1.15m,
            averagePrice = asset.AveragePrice,
            gain = 15.0,
            history = new[]
            {
                new { date = DateTime.Now.AddMonths(-6).ToString("yyyy-MM-dd"), price = asset.AveragePrice * 0.90m },
                new { date = DateTime.Now.AddMonths(-5).ToString("yyyy-MM-dd"), price = asset.AveragePrice * 0.95m },
                new { date = DateTime.Now.AddMonths(-4).ToString("yyyy-MM-dd"), price = asset.AveragePrice * 1.00m },
                new { date = DateTime.Now.AddMonths(-3).ToString("yyyy-MM-dd"), price = asset.AveragePrice * 1.05m },
                new { date = DateTime.Now.AddMonths(-2).ToString("yyyy-MM-dd"), price = asset.AveragePrice * 1.08m },
                new { date = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd"), price = asset.AveragePrice * 1.12m },
                new { date = DateTime.Now.ToString("yyyy-MM-dd"), price = asset.AveragePrice * 1.15m }
            }
        };

        return Ok(performance);
    }
}
