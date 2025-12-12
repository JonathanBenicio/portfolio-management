using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.Models;
using System.Security.Claims;

namespace PortfolioAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DividendController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public DividendController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<Dividend>>> GetAll()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        var dividends = await _context.Dividends
            .Include(d => d.VariableIncomeAsset)
            .Where(d => d.VariableIncomeAsset!.UserId == userId)
            .OrderByDescending(d => d.PaymentDate)
            .ToListAsync();

        return Ok(dividends);
    }

    [HttpPost]
    public async Task<ActionResult<Dividend>> Create([FromBody] Dividend dividend)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        var asset = await _context.VariableIncomeAssets
            .FirstOrDefaultAsync(a => a.Id == dividend.VariableIncomeAssetId && a.UserId == userId);

        if (asset == null)
            return NotFound("Asset not found");

        _context.Dividends.Add(dividend);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = dividend.Id }, dividend);
    }

    [HttpGet("summary")]
    public async Task<ActionResult<object>> GetSummary()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        var dividends = await _context.Dividends
            .Include(d => d.VariableIncomeAsset)
            .Where(d => d.VariableIncomeAsset!.UserId == userId)
            .ToListAsync();

        var thisMonth = dividends
            .Where(d => d.PaymentDate.Month == DateTime.Now.Month && d.PaymentDate.Year == DateTime.Now.Year)
            .Sum(d => d.Amount);

        var total = dividends.Sum(d => d.Amount);

        return Ok(new
        {
            thisMonth,
            total,
            count = dividends.Count,
            upcoming = dividends.Where(d => d.PaymentDate > DateTime.Now).OrderBy(d => d.PaymentDate).Take(5)
        });
    }
}
