using Portfolio.Domain.Entities;

namespace Portfolio.Domain.Repositories;

public interface IWalletRepository
{
    Task<Wallet?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Wallet>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task AddAsync(Wallet wallet, CancellationToken cancellationToken = default);
    void Update(Wallet wallet);
    void Delete(Wallet wallet);
}
