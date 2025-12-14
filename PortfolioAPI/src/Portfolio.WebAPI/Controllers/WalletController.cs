using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs.Wallet;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Exceptions;
using Portfolio.Domain.Repositories;
using System.Security.Claims;

namespace Portfolio.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class WalletController : ControllerBase
{
    private readonly IWalletRepository _walletRepository;
    private readonly IFixedIncomeAssetRepository _fixedIncomeRepository;
    private readonly IVariableIncomeAssetRepository _variableIncomeRepository;
    private readonly IUnitOfWork _unitOfWork;

    public WalletController(
        IWalletRepository walletRepository,
        IFixedIncomeAssetRepository fixedIncomeRepository,
        IVariableIncomeAssetRepository variableIncomeRepository,
        IUnitOfWork unitOfWork)
    {
        _walletRepository = walletRepository;
        _fixedIncomeRepository = fixedIncomeRepository;
        _variableIncomeRepository = variableIncomeRepository;
        _unitOfWork = unitOfWork;
    }

    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    [HttpGet]
    public async Task<ActionResult<IEnumerable<WalletDto>>> GetWallets(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var wallets = await _walletRepository.GetByUserIdAsync(userId, cancellationToken);

        var result = wallets.Select(w => new WalletDto(
            w.Id,
            w.Name,
            w.Broker,
            w.OwnerName,
            w.Color,
            w.CreatedAt
        )).OrderBy(w => w.Name);

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<WalletDto>> GetWallet(int id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var wallet = await _walletRepository.GetByIdAsync(id, cancellationToken);

        if (wallet == null || wallet.UserId != userId)
        {
            throw new NotFoundException("Wallet", id);
        }

        return Ok(new WalletDto(
            wallet.Id,
            wallet.Name,
            wallet.Broker,
            wallet.OwnerName,
            wallet.Color,
            wallet.CreatedAt
        ));
    }

    [HttpPost]
    public async Task<ActionResult<WalletDto>> CreateWallet(CreateWalletDto dto, CancellationToken cancellationToken)
    {
        var userId = GetUserId();

        var wallet = new Wallet
        {
            UserId = userId,
            Name = dto.Name,
            Broker = dto.Broker,
            OwnerName = dto.OwnerName,
            Color = dto.Color
        };

        await _walletRepository.AddAsync(wallet, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var resultDto = new WalletDto(
            wallet.Id,
            wallet.Name,
            wallet.Broker,
            wallet.OwnerName,
            wallet.Color,
            wallet.CreatedAt
        );

        return CreatedAtAction(nameof(GetWallet), new { id = wallet.Id }, resultDto);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWallet(int id, UpdateWalletDto dto, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var wallet = await _walletRepository.GetByIdAsync(id, cancellationToken);

        if (wallet == null || wallet.UserId != userId)
        {
            throw new NotFoundException("Wallet", id);
        }

        wallet.Name = dto.Name;
        wallet.Broker = dto.Broker;
        wallet.OwnerName = dto.OwnerName;
        wallet.Color = dto.Color;

        _walletRepository.Update(wallet);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWallet(int id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var wallet = await _walletRepository.GetByIdAsync(id, cancellationToken);

        if (wallet == null || wallet.UserId != userId)
        {
            throw new NotFoundException("Wallet", id);
        }

        _walletRepository.Delete(wallet);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpGet("{id}/analytics")]
    public async Task<ActionResult<WalletAnalyticsDto>> GetAnalytics(int id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var wallet = await _walletRepository.GetByIdAsync(id, cancellationToken);

        if (wallet == null || wallet.UserId != userId)
        {
            throw new NotFoundException("Wallet", id);
        }

        var fixedIncome = await _fixedIncomeRepository.GetByWalletIdAsync(id, cancellationToken);
        var variableIncome = await _variableIncomeRepository.GetByWalletIdAsync(id, cancellationToken);

        var assets = new List<AssetSummaryDto>();

        foreach (var asset in fixedIncome)
        {
            assets.Add(new AssetSummaryDto(
                asset.Id,
                asset.Name,
                "Renda Fixa",
                asset.InvestedValue,
                asset.CurrentValue,
                asset.CurrentValue - asset.InvestedValue
            ));
        }

        foreach (var asset in variableIncome)
        {
            decimal invested = asset.Quantity * asset.AveragePrice;
            assets.Add(new AssetSummaryDto(
                asset.Id,
                asset.Ticker,
                "Renda Variável",
                invested,
                invested, // Placeholder until price feed
                0
            ));
        }

        var result = new WalletAnalyticsDto(
            assets.Sum(a => a.Invested),
            assets.Sum(a => a.Current),
            assets.Sum(a => a.Profit),
            1.2m, // Mock monthly return
            assets
        );

        return Ok(result);
    }

    [HttpGet("{id}/evolution")]
    public ActionResult<List<WalletEvolutionDto>> GetEvolution(int id)
    {
        var data = new List<WalletEvolutionDto>();
        var baseValue = 10000m;
        var random = new Random();

        for (int i = 0; i < 30; i++)
        {
            baseValue *= (1 + (decimal)(random.NextDouble() * 0.02 - 0.005));
            data.Add(new WalletEvolutionDto(
                DateTime.UtcNow.AddDays(-30 + i),
                Math.Round(baseValue, 2)
            ));
        }

        return Ok(data);
    }
}
