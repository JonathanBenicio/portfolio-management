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
public class VariableIncomeController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public VariableIncomeController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<VariableIncomeAsset>>> GetAll([FromQuery] int? walletId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var query = _context.VariableIncomeAssets
            .Include(v => v.Transactions)
            .Where(a => a.UserId == userId);

        if (walletId.HasValue)
        {
            query = query.Where(a => a.WalletId == walletId.Value);
        }

        return await query.ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<VariableIncomeAsset>> Create(CreateVariableIncomeDto request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var asset = new VariableIncomeAsset
        {
            Ticker = request.Ticker,
            Type = request.Type,
            Quantity = request.Quantity,
            AveragePrice = request.AveragePrice,
            UserId = userId,
            WalletId = request.WalletId
        };

        _context.VariableIncomeAssets.Add(asset);
        await _context.SaveChangesAsync();

        await LogChange(userId, asset.Id, "Create", System.Text.Json.JsonSerializer.Serialize(asset));

        return CreatedAtAction(nameof(GetAll), new { id = asset.Id }, asset);
    }
    
    [HttpPost("transaction")]
    public async Task<ActionResult<Transaction>> AddTransaction(CreateTransactionDto request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var asset = await _context.VariableIncomeAssets.FirstOrDefaultAsync(a => a.Id == request.VariableIncomeAssetId && a.UserId == userId);

        if (asset == null)
            return NotFound("Asset not found");

        var transaction = new Transaction
        {
            Type = request.Type,
            Quantity = request.Quantity,
            Price = request.Price,
            Date = request.Date,
            VariableIncomeAssetId = request.VariableIncomeAssetId
        };
        
        // Update asset quantity and average price logic here if needed
        if (request.Type == "BUY")
        {
            var totalValue = (asset.Quantity * asset.AveragePrice) + (request.Quantity * request.Price);
            asset.Quantity += request.Quantity;
            asset.AveragePrice = asset.Quantity > 0 ? totalValue / asset.Quantity : 0;
        }
        else if (request.Type == "SELL")
        {
            asset.Quantity -= request.Quantity;
        }

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return Ok(transaction);
    }
    
    // Average price doesn't change on sell
    private async Task LogChange(int userId, int entityId, string action, string changes)
    {
        var log = new AuditLog
        {
            UserId = userId,
            EntityType = "VariableIncome",
            EntityId = entityId,
            Action = action,
            Changes = changes,
            Timestamp = DateTime.UtcNow
        };
        _context.AuditLogs.Add(log);
        await _context.SaveChangesAsync();
    }
}
