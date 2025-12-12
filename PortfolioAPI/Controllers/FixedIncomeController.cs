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
    public async Task<ActionResult<List<FixedIncomeAsset>>> GetAll()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        return await _context.FixedIncomeAssets.Where(a => a.UserId == userId).ToListAsync();
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
            CurrentValue = request.InvestedValue, // Initial value
            InterestRate = request.InterestRate,
            Index = request.Index,
            PurchaseDate = request.PurchaseDate,
            MaturityDate = request.MaturityDate,
            UserId = userId
        };

        _context.FixedIncomeAssets.Add(asset);
        await _context.SaveChangesAsync();

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

        await _context.SaveChangesAsync();

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

        return NoContent();
    }
}
