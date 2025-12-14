using Portfolio.Domain.Entities;

namespace Portfolio.Domain.Repositories;

public interface IFixedIncomeAssetRepository
{
    Task<FixedIncomeAsset?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<FixedIncomeAsset>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<FixedIncomeAsset>> GetByWalletIdAsync(int walletId, CancellationToken cancellationToken = default);
    Task AddAsync(FixedIncomeAsset asset, CancellationToken cancellationToken = default);
    void Update(FixedIncomeAsset asset);
    void Delete(FixedIncomeAsset asset);
}
