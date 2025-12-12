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
public class FixedIncomeController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public FixedIncomeController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<List<FixedIncomeAsset>>> GetAll([FromQuery] int? walletId)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var query = _context.FixedIncomeAssets.Where(a => a.UserId == userId);
        
        if (walletId.HasValue)
        {
            query = query.Where(a => a.WalletId == walletId.Value);
        }

        return await query.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FixedIncomeAsset>> Get(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var asset = await _context.FixedIncomeAssets.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (asset == null)
            return NotFound();

        return asset;
    }

    [HttpPost]
    public async Task<ActionResult<FixedIncomeAsset>> Create(CreateFixedIncomeDto request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var asset = new FixedIncomeAsset
        {
            Name = request.Name,
            Type = request.Type,
            InvestedValue = request.InvestedValue,
            CurrentValue = request.InvestedValue,
            InterestRate = request.InterestRate,
            Index = request.Index,
            PurchaseDate = request.PurchaseDate,
            MaturityDate = request.MaturityDate,
            UserId = userId,
            WalletId = request.WalletId
        };

        _context.FixedIncomeAssets.Add(asset);
        await _context.SaveChangesAsync();

        await LogChange(userId, asset.Id, "Create", System.Text.Json.JsonSerializer.Serialize(asset));

        return CreatedAtAction(nameof(Get), new { id = asset.Id }, asset);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateFixedIncomeDto request)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var asset = await _context.FixedIncomeAssets.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (asset == null)
            return NotFound();

        asset.Name = request.Name;
        asset.Type = request.Type;
        asset.InvestedValue = request.InvestedValue;
        asset.InterestRate = request.InterestRate;
        asset.Index = request.Index;
        asset.PurchaseDate = request.PurchaseDate;
        asset.MaturityDate = request.MaturityDate;
        asset.WalletId = request.WalletId;

        await _context.SaveChangesAsync();

        await LogChange(userId, asset.Id, "Update", System.Text.Json.JsonSerializer.Serialize(asset));

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var asset = await _context.FixedIncomeAssets.FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

        if (asset == null)
            return NotFound();

        _context.FixedIncomeAssets.Remove(asset);
        await _context.SaveChangesAsync();

        await LogChange(userId, id, "Delete", "{}");

        return NoContent();
    }

    private async Task LogChange(int userId, int entityId, string action, string changes)
    {
        var log = new AuditLog
        {
            UserId = userId,
            EntityType = "FixedIncome",
            EntityId = entityId,
            Action = action,
            Changes = changes,
            Timestamp = DateTime.UtcNow
        };
        _context.AuditLogs.Add(log);
        await _context.SaveChangesAsync();
    }
}
