using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs.FixedIncome;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Exceptions;
using Portfolio.Domain.Repositories;
using System.Security.Claims;
using System.Text.Json;

namespace Portfolio.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FixedIncomeController : ControllerBase
{
    private readonly IFixedIncomeAssetRepository _assetRepository;
    private readonly IUnitOfWork _unitOfWork;

    public FixedIncomeController(
        IFixedIncomeAssetRepository assetRepository,
        IUnitOfWork unitOfWork)
    {
        _assetRepository = assetRepository;
        _unitOfWork = unitOfWork;
    }

    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    [HttpGet]
    public async Task<ActionResult<IEnumerable<FixedIncomeAssetDto>>> GetAll(
        [FromQuery] int? walletId,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        
        var assets = walletId.HasValue
            ? await _assetRepository.GetByWalletIdAsync(walletId.Value, cancellationToken)
            : await _assetRepository.GetByUserIdAsync(userId, cancellationToken);

        var result = assets.Select(a => new FixedIncomeAssetDto(
            a.Id,
            a.Name,
            a.Type,
            a.InvestedValue,
            a.CurrentValue,
            a.InterestRate,
            a.Index,
            a.PurchaseDate,
            a.MaturityDate,
            a.Liquidity,
            a.WalletId,
            a.Wallet?.Name
        ));

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FixedIncomeAssetDto>> Get(int id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var asset = await _assetRepository.GetByIdAsync(id, cancellationToken);

        if (asset == null || asset.UserId != userId)
        {
            throw new NotFoundException("FixedIncomeAsset", id);
        }

        return Ok(new FixedIncomeAssetDto(
            asset.Id,
            asset.Name,
            asset.Type,
            asset.InvestedValue,
            asset.CurrentValue,
            asset.InterestRate,
            asset.Index,
            asset.PurchaseDate,
            asset.MaturityDate,
            asset.Liquidity,
            asset.WalletId,
            asset.Wallet?.Name
        ));
    }

    [HttpPost]
    public async Task<ActionResult<FixedIncomeAssetDto>> Create(
        CreateFixedIncomeDto request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();

        var asset = new FixedIncomeAsset
        {
            Name = request.Name,
            Type = request.Type,
            InvestedValue = request.InvestedValue,
            CurrentValue = request.InvestedValue,
            InterestRate = request.InterestRate,
            Index = request.Index,
            PurchaseDate = request.PurchaseDate ?? DateTime.UtcNow,
            MaturityDate = request.MaturityDate ?? DateTime.UtcNow.AddYears(1),
            Liquidity = request.Liquidity,
            UserId = userId,
            WalletId = request.WalletId
        };

        await _assetRepository.AddAsync(asset, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var result = new FixedIncomeAssetDto(
            asset.Id,
            asset.Name,
            asset.Type,
            asset.InvestedValue,
            asset.CurrentValue,
            asset.InterestRate,
            asset.Index,
            asset.PurchaseDate,
            asset.MaturityDate,
            asset.Liquidity,
            asset.WalletId,
            null
        );

        return CreatedAtAction(nameof(Get), new { id = asset.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(
        int id,
        UpdateFixedIncomeDto request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var asset = await _assetRepository.GetByIdAsync(id, cancellationToken);

        if (asset == null || asset.UserId != userId)
        {
            throw new NotFoundException("FixedIncomeAsset", id);
        }

        asset.Name = request.Name;
        asset.Type = request.Type;
        asset.InvestedValue = request.InvestedValue;
        asset.InterestRate = request.InterestRate;
        asset.Index = request.Index;
        asset.PurchaseDate = request.PurchaseDate ?? asset.PurchaseDate;
        asset.MaturityDate = request.MaturityDate ?? asset.MaturityDate;
        asset.WalletId = request.WalletId;

        _assetRepository.Update(asset);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var asset = await _assetRepository.GetByIdAsync(id, cancellationToken);

        if (asset == null || asset.UserId != userId)
        {
            throw new NotFoundException("FixedIncomeAsset", id);
        }

        _assetRepository.Delete(asset);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return NoContent();
    }
}
