using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Repositories;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Repositories;

public class FixedIncomeAssetRepository : IFixedIncomeAssetRepository
{
    private readonly PortfolioDbContext _context;

    public FixedIncomeAssetRepository(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<FixedIncomeAsset?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.FixedIncomeAssets
            .Include(f => f.User)
            .Include(f => f.Wallet)
            .FirstOrDefaultAsync(f => f.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<FixedIncomeAsset>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await _context.FixedIncomeAssets
            .Include(f => f.Wallet)
            .Where(f => f.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<FixedIncomeAsset>> GetByWalletIdAsync(int walletId, CancellationToken cancellationToken = default)
    {
        return await _context.FixedIncomeAssets
            .Where(f => f.WalletId == walletId)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(FixedIncomeAsset asset, CancellationToken cancellationToken = default)
    {
        await _context.FixedIncomeAssets.AddAsync(asset, cancellationToken);
    }

    public void Update(FixedIncomeAsset asset)
    {
        _context.FixedIncomeAssets.Update(asset);
    }

    public void Delete(FixedIncomeAsset asset)
    {
        _context.FixedIncomeAssets.Remove(asset);
    }
}
