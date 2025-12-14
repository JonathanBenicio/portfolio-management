using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Repositories;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Repositories;

public class DesignSystemConfigRepository : IDesignSystemConfigRepository
{
    private readonly PortfolioDbContext _context;

    public DesignSystemConfigRepository(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<DesignSystemConfig?> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await _context.DesignSystemConfigs
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);
    }

    public async Task AddAsync(DesignSystemConfig config, CancellationToken cancellationToken = default)
    {
        await _context.DesignSystemConfigs.AddAsync(config, cancellationToken);
    }

    public void Update(DesignSystemConfig config)
    {
        _context.DesignSystemConfigs.Update(config);
    }

    public void Delete(DesignSystemConfig config)
    {
        _context.DesignSystemConfigs.Remove(config);
    }
}
