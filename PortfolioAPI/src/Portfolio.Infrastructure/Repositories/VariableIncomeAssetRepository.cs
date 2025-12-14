using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Repositories;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Repositories;

public class VariableIncomeAssetRepository : IVariableIncomeAssetRepository
{
    private readonly PortfolioDbContext _context;

    public VariableIncomeAssetRepository(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<VariableIncomeAsset?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.VariableIncomeAssets
            .Include(v => v.User)
            .Include(v => v.Wallet)
            .Include(v => v.Transactions)
            .Include(v => v.Dividends)
            .FirstOrDefaultAsync(v => v.Id == id, cancellationToken);
    }

    public async Task<VariableIncomeAsset?> GetByTickerAndUserIdAsync(string ticker, int userId, CancellationToken cancellationToken = default)
    {
        return await _context.VariableIncomeAssets
            .Include(v => v.Transactions)
            .Include(v => v.Dividends)
            .FirstOrDefaultAsync(v => v.Ticker == ticker && v.UserId == userId, cancellationToken);
    }

    public async Task<IEnumerable<VariableIncomeAsset>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await _context.VariableIncomeAssets
            .Include(v => v.Wallet)
            .Include(v => v.Transactions)
            .Include(v => v.Dividends)
            .Where(v => v.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<VariableIncomeAsset>> GetByWalletIdAsync(int walletId, CancellationToken cancellationToken = default)
    {
        return await _context.VariableIncomeAssets
            .Include(v => v.Transactions)
            .Include(v => v.Dividends)
            .Where(v => v.WalletId == walletId)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(VariableIncomeAsset asset, CancellationToken cancellationToken = default)
    {
        await _context.VariableIncomeAssets.AddAsync(asset, cancellationToken);
    }

    public void Update(VariableIncomeAsset asset)
    {
        _context.VariableIncomeAssets.Update(asset);
    }

    public void Delete(VariableIncomeAsset asset)
    {
        _context.VariableIncomeAssets.Remove(asset);
    }
}
