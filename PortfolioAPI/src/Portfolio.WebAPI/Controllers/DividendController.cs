using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs.VariableIncome;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Exceptions;
using Portfolio.Domain.Repositories;
using System.Security.Claims;

namespace Portfolio.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DividendController : ControllerBase
{
    private readonly IVariableIncomeAssetRepository _assetRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DividendController(
        IVariableIncomeAssetRepository assetRepository,
        IUnitOfWork unitOfWork)
    {
        _assetRepository = assetRepository;
        _unitOfWork = unitOfWork;
    }

    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DividendDto>>> GetAll(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var assets = await _assetRepository.GetByUserIdAsync(userId, cancellationToken);

        var dividends = assets
            .SelectMany(a => a.Dividends.Select(d => new DividendDto(
                d.Id,
                d.Amount,
                d.PaymentDate,
                d.Type
            )))
            .OrderByDescending(d => d.PaymentDate);

        return Ok(dividends);
    }

    [HttpPost]
    public async Task<ActionResult<DividendDto>> Create(
        [FromBody] CreateDividendDto dto,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var asset = await _assetRepository.GetByIdAsync(dto.VariableIncomeAssetId, cancellationToken);

        if (asset == null || asset.UserId != userId)
        {
            throw new NotFoundException("VariableIncomeAsset", dto.VariableIncomeAssetId);
        }

        var dividend = new Dividend
        {
            Amount = dto.Amount,
            PaymentDate = dto.PaymentDate,
            Type = dto.Type,
            VariableIncomeAssetId = dto.VariableIncomeAssetId
        };

        asset.Dividends.Add(dividend);
        _assetRepository.Update(asset);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var result = new DividendDto(dividend.Id, dividend.Amount, dividend.PaymentDate, dividend.Type);
        return CreatedAtAction(nameof(GetAll), new { id = dividend.Id }, result);
    }

    [HttpGet("summary")]
    public async Task<ActionResult<object>> GetSummary(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var assets = await _assetRepository.GetByUserIdAsync(userId, cancellationToken);

        var allDividends = assets.SelectMany(a => a.Dividends).ToList();

        var thisMonth = allDividends
            .Where(d => d.PaymentDate.Month == DateTime.Now.Month && d.PaymentDate.Year == DateTime.Now.Year)
            .Sum(d => d.Amount);

        var total = allDividends.Sum(d => d.Amount);

        var upcoming = allDividends
            .Where(d => d.PaymentDate > DateTime.Now)
            .OrderBy(d => d.PaymentDate)
            .Take(5)
            .Select(d => new DividendDto(d.Id, d.Amount, d.PaymentDate, d.Type));

        return Ok(new
        {
            thisMonth,
            total,
            count = allDividends.Count,
            upcoming
        });
    }
}
