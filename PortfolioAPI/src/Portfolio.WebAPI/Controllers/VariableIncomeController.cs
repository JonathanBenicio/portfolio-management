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
public class VariableIncomeController : ControllerBase
{
    private readonly IVariableIncomeAssetRepository _assetRepository;
    private readonly IUnitOfWork _unitOfWork;

    public VariableIncomeController(
        IVariableIncomeAssetRepository assetRepository,
        IUnitOfWork unitOfWork)
    {
        _assetRepository = assetRepository;
        _unitOfWork = unitOfWork;
    }

    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    [HttpGet]
    public async Task<ActionResult<IEnumerable<VariableIncomeAssetDto>>> GetAll(
        [FromQuery] int? walletId,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();

        var assets = walletId.HasValue
            ? await _assetRepository.GetByWalletIdAsync(walletId.Value, cancellationToken)
            : await _assetRepository.GetByUserIdAsync(userId, cancellationToken);

        var result = assets.Select(a => new VariableIncomeAssetDto(
            a.Id,
            a.Ticker,
            a.Type,
            a.Quantity,
            a.AveragePrice,
            a.WalletId,
            a.Wallet?.Name,
            a.Transactions.Select(t => new TransactionDto(t.Id, t.Type, t.Quantity, t.Price, t.Date)).ToList(),
            a.Dividends.Select(d => new DividendDto(d.Id, d.Amount, d.PaymentDate, d.Type)).ToList()
        ));

        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<VariableIncomeAssetDto>> Create(
        CreateVariableIncomeDto request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();

        var asset = new VariableIncomeAsset
        {
            Ticker = request.Ticker,
            Type = request.Type,
            Quantity = request.Quantity,
            AveragePrice = request.AveragePrice,
            UserId = userId,
            WalletId = request.WalletId
        };

        await _assetRepository.AddAsync(asset, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var result = new VariableIncomeAssetDto(
            asset.Id,
            asset.Ticker,
            asset.Type,
            asset.Quantity,
            asset.AveragePrice,
            asset.WalletId,
            null,
            new List<TransactionDto>(),
            new List<DividendDto>()
        );

        return CreatedAtAction(nameof(GetAll), new { id = asset.Id }, result);
    }

    [HttpPost("transaction")]
    public async Task<ActionResult<TransactionDto>> AddTransaction(
        CreateTransactionDto request,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var asset = await _assetRepository.GetByIdAsync(request.VariableIncomeAssetId, cancellationToken);

        if (asset == null || asset.UserId != userId)
        {
            throw new NotFoundException("VariableIncomeAsset", request.VariableIncomeAssetId);
        }

        var transaction = new Transaction
        {
            Type = request.Type,
            Quantity = request.Quantity,
            Price = request.Price,
            Date = request.Date,
            VariableIncomeAssetId = request.VariableIncomeAssetId
        };

        // Update asset quantity and average price
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

        asset.Transactions.Add(transaction);
        _assetRepository.Update(asset);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Ok(new TransactionDto(
            transaction.Id,
            transaction.Type,
            transaction.Quantity,
            transaction.Price,
            transaction.Date
        ));
    }
}
