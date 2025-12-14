using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Repositories;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Repositories;

public class WalletRepository : IWalletRepository
{
    private readonly PortfolioDbContext _context;

    public WalletRepository(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<Wallet?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.Wallets
            .Include(w => w.User)
            .FirstOrDefaultAsync(w => w.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Wallet>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await _context.Wallets
            .Where(w => w.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(Wallet wallet, CancellationToken cancellationToken = default)
    {
        await _context.Wallets.AddAsync(wallet, cancellationToken);
    }

    public void Update(Wallet wallet)
    {
        _context.Wallets.Update(wallet);
    }

    public void Delete(Wallet wallet)
    {
        _context.Wallets.Remove(wallet);
    }
}
