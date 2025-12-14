using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Repositories;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Repositories;

public class UserApiKeyRepository : IUserApiKeyRepository
{
    private readonly PortfolioDbContext _context;

    public UserApiKeyRepository(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<UserApiKey?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.UserApiKeys
            .FirstOrDefaultAsync(k => k.Id == id, cancellationToken);
    }

    public async Task<UserApiKey?> GetByUserIdAndProviderAsync(int userId, string provider, CancellationToken cancellationToken = default)
    {
        return await _context.UserApiKeys
            .FirstOrDefaultAsync(k => k.UserId == userId && k.Provider == provider && k.IsActive, cancellationToken);
    }

    public async Task<IEnumerable<UserApiKey>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await _context.UserApiKeys
            .Where(k => k.UserId == userId)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(UserApiKey apiKey, CancellationToken cancellationToken = default)
    {
        await _context.UserApiKeys.AddAsync(apiKey, cancellationToken);
    }

    public void Update(UserApiKey apiKey)
    {
        _context.UserApiKeys.Update(apiKey);
    }

    public void Delete(UserApiKey apiKey)
    {
        _context.UserApiKeys.Remove(apiKey);
    }
}
