using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.DTOs;
using PortfolioAPI.Models;
using System.Security.Claims;

namespace PortfolioAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WalletController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public WalletController(PortfolioDbContext context)
    {
        _context = context;
    }

    // GET: api/wallet
    [HttpGet]
    public async Task<ActionResult<IEnumerable<WalletDto>>> GetWallets()
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var wallets = await _context.Wallets
            .Where(w => w.UserId == userId)
            .OrderBy(w => w.Name)
            .Select(w => new WalletDto
            {
                Id = w.Id,
                Name = w.Name,
                Broker = w.Broker,
                OwnerName = w.OwnerName,
                Color = w.Color,
                CreatedAt = w.CreatedAt
            })
            .ToListAsync();

        return Ok(wallets);
    }

    // GET: api/wallet/5
    [HttpGet("{id}")]
    public async Task<ActionResult<WalletDto>> GetWallet(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var wallet = await _context.Wallets
            .Where(w => w.UserId == userId && w.Id == id)
            .Select(w => new WalletDto
            {
                Id = w.Id,
                Name = w.Name,
                Broker = w.Broker,
                OwnerName = w.OwnerName,
                Color = w.Color,
                CreatedAt = w.CreatedAt
            })
            .FirstOrDefaultAsync();

        if (wallet == null)
        {
            return NotFound();
        }

        return Ok(wallet);
    }

    // POST: api/wallet
    [HttpPost]
    public async Task<ActionResult<WalletDto>> CreateWallet(CreateWalletDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var wallet = new Wallet
        {
            UserId = userId,
            Name = dto.Name,
            Broker = dto.Broker,
            OwnerName = dto.OwnerName,
            Color = dto.Color
        };

        _context.Wallets.Add(wallet);
        await _context.SaveChangesAsync();

        var resultDto = new WalletDto
        {
            Id = wallet.Id,
            Name = wallet.Name,
            Broker = wallet.Broker,
            OwnerName = wallet.OwnerName,
            Color = wallet.Color,
            CreatedAt = wallet.CreatedAt
        };

        return CreatedAtAction(nameof(GetWallet), new { id = wallet.Id }, resultDto);
    }

    // PUT: api/wallet/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWallet(int id, UpdateWalletDto dto)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var wallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId && w.Id == id);

        if (wallet == null)
        {
            return NotFound();
        }

        wallet.Name = dto.Name;
        wallet.Broker = dto.Broker;
        wallet.OwnerName = dto.OwnerName;
        wallet.Color = dto.Color;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/wallet/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWallet(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var wallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId && w.Id == id);

        if (wallet == null)
        {
            return NotFound();
        }

        _context.Wallets.Remove(wallet);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("{id}/analytics")]
    public async Task<ActionResult<WalletAnalyticsDto>> GetAnalytics(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var wallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId && w.Id == id);

        if (wallet == null) return NotFound();

        var fixedIncome = await _context.FixedIncomeAssets
            .Where(a => a.WalletId == id)
            .ToListAsync();

        var variableIncome = await _context.VariableIncomeAssets
            .Include(v => v.Transactions)
            .Where(a => a.WalletId == id)
            .ToListAsync();

        var response = new WalletAnalyticsDto();
        
        // Calculate Fixed Income
        foreach (var asset in fixedIncome)
        {
            response.Assets.Add(new AssetSummaryDto
            {
                Id = asset.Id,
                Name = asset.Name,
                Type = "Renda Fixa",
                Invested = asset.InvestedValue,
                Current = asset.CurrentValue,
                Profit = asset.CurrentValue - asset.InvestedValue
            });
        }

        // Calculate Variable Income
        foreach (var asset in variableIncome)
        {
            decimal currentVal = asset.Quantity * asset.AveragePrice; // Simplification, normally strictly current price API
            // Ideally we need a current price service. For now using AvgPrice or a dummy logic?
            // Let's assume AveragePrice is "Cost Basis" and we lack real-time price.
            // Requirement says "Quantity x Current Price". Let's assume AvgPrice for now or 0 profit if no price feed.
            // Actually, let's use AveragePrice as Invested and same for Current for now unless we have price.
            
            decimal invested = asset.Quantity * asset.AveragePrice;

            response.Assets.Add(new AssetSummaryDto
            {
                Id = asset.Id,
                Name = asset.Ticker,
                Type = "Renda Variável",
                Invested = invested,
                Current = invested, // Placeholder until price feed
                Profit = 0
            });
        }

        response.TotalInvested = response.Assets.Sum(a => a.Invested);
        response.TotalCurrent = response.Assets.Sum(a => a.Current);
        response.TotalProfit = response.TotalCurrent - response.TotalInvested;
        
        // Mocking monthly return for demo
        response.MonthlyReturnPercentage = 1.2m; 

        return Ok(response);
    }

    [HttpGet("{id}/evolution")]
    public ActionResult<List<WalletEvolutionDto>> GetEvolution(int id)
    {
         // This would normally aggregate historical data from a daily snapshot table.
         // Generating mock data for the requested chart.
         var data = new List<WalletEvolutionDto>();
         var baseValue = 10000m;
         var random = new Random();

         for (int i = 0; i < 30; i++)
         {
             baseValue *= (1 + (decimal)(random.NextDouble() * 0.02 - 0.005)); // Random daily fluctuation
             data.Add(new WalletEvolutionDto
             {
                 Date = DateTime.UtcNow.AddDays(-30 + i),
                 TotalValue = Math.Round(baseValue, 2)
             });
         }
         
         return Ok(data);
    }
    [HttpGet("{id}/history")]
    public async Task<ActionResult<IEnumerable<AuditLog>>> GetHistory(int id)
    {
        var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

        var wallet = await _context.Wallets
            .FirstOrDefaultAsync(w => w.UserId == userId && w.Id == id);

        if (wallet == null) return NotFound();

        // Find all assets in this wallet
        var fixedIncomeIds = await _context.FixedIncomeAssets
            .Where(a => a.WalletId == id)
            .Select(a => a.Id)
            .ToListAsync();

        var variableIncomeIds = await _context.VariableIncomeAssets
            .Where(a => a.WalletId == id)
            .Select(a => a.Id)
            .ToListAsync();

        // Fetch logs for these assets
        var logs = await _context.AuditLogs
            .Where(l => 
                (l.EntityType == "FixedIncome" && fixedIncomeIds.Contains(l.EntityId)) ||
                (l.EntityType == "VariableIncome" && variableIncomeIds.Contains(l.EntityId))
            )
            .OrderByDescending(l => l.Timestamp)
            .Take(50) // Limit to last 50
            .ToListAsync();

        return Ok(logs);
    }
}
