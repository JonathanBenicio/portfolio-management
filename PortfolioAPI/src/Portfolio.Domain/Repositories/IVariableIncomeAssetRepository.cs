using Portfolio.Domain.Entities;

namespace Portfolio.Domain.Repositories;

public interface IVariableIncomeAssetRepository
{
    Task<VariableIncomeAsset?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<VariableIncomeAsset?> GetByTickerAndUserIdAsync(string ticker, int userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<VariableIncomeAsset>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task<IEnumerable<VariableIncomeAsset>> GetByWalletIdAsync(int walletId, CancellationToken cancellationToken = default);
    Task AddAsync(VariableIncomeAsset asset, CancellationToken cancellationToken = default);
    void Update(VariableIncomeAsset asset);
    void Delete(VariableIncomeAsset asset);
}
