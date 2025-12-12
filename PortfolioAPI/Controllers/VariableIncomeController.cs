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
    public async Task<ActionResult<List<VariableIncomeAsset>>> GetAll()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return await _context.VariableIncomeAssets
            .Include(v => v.Transactions)
            .Where(a => a.UserId == userId)
            .ToListAsync();
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
            UserId = userId
        };

        _context.VariableIncomeAssets.Add(asset);
        await _context.SaveChangesAsync();

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
            // Average price doesn't change on sell
        }

        _context.Transactions.Add(transaction);
        await _context.SaveChangesAsync();

        return Ok(transaction);
    }
}
