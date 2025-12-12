using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using System.Security.Claims;

namespace PortfolioAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PortfolioController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public PortfolioController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet("summary")]
    public async Task<ActionResult<object>> GetSummary()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var fixedIncome = await _context.FixedIncomeAssets
            .Where(a => a.UserId == userId)
            .ToListAsync();

        var variableIncome = await _context.VariableIncomeAssets
            .Where(a => a.UserId == userId)
            .ToListAsync();

        var totalFixedIncome = fixedIncome.Sum(a => a.CurrentValue);
        var totalVariableIncome = variableIncome.Sum(a => a.Quantity * a.AveragePrice);
        var totalEquity = totalFixedIncome + totalVariableIncome;

        return Ok(new
        {
            totalEquity,
            totalFixedIncome,
            totalVariableIncome,
            fixedIncomePercentage = totalEquity > 0 ? (totalFixedIncome / totalEquity) * 100 : 0,
            variableIncomePercentage = totalEquity > 0 ? (totalVariableIncome / totalEquity) * 100 : 0,
            fixedIncomeCount = fixedIncome.Count,
            variableIncomeCount = variableIncome.Count
        });
    }

    [HttpGet("evolution")]
    public async Task<ActionResult<object>> GetEvolution()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Mock data for demonstration - in production, this would be historical snapshots
        var evolution = new[]
        {
            new { date = DateTime.Now.AddMonths(-6).ToString("yyyy-MM-dd"), value = 100000m },
            new { date = DateTime.Now.AddMonths(-5).ToString("yyyy-MM-dd"), value = 105000m },
            new { date = DateTime.Now.AddMonths(-4).ToString("yyyy-MM-dd"), value = 110000m },
            new { date = DateTime.Now.AddMonths(-3).ToString("yyyy-MM-dd"), value = 115000m },
            new { date = DateTime.Now.AddMonths(-2).ToString("yyyy-MM-dd"), value = 125000m },
            new { date = DateTime.Now.AddMonths(-1).ToString("yyyy-MM-dd"), value = 140000m },
            new { date = DateTime.Now.ToString("yyyy-MM-dd"), value = 152450m }
        };

        return Ok(evolution);
    }

    [HttpGet("allocation")]
    public async Task<ActionResult<object>> GetAllocation()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var fixedIncome = await _context.FixedIncomeAssets
            .Where(a => a.UserId == userId)
            .GroupBy(a => a.Type)
            .Select(g => new { type = g.Key, value = g.Sum(a => a.CurrentValue) })
            .ToListAsync();

        var variableIncome = await _context.VariableIncomeAssets
            .Where(a => a.UserId == userId)
            .GroupBy(a => a.Type)
            .Select(g => new { type = g.Key, value = g.Sum(a => a.Quantity * a.AveragePrice) })
            .ToListAsync();

        var allocation = fixedIncome.Concat(variableIncome).ToList();

        return Ok(allocation);
    }
}
