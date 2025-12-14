using Portfolio.Domain.Entities;

namespace Portfolio.Domain.Repositories;

public interface IUserApiKeyRepository
{
    Task<UserApiKey?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<UserApiKey?> GetByUserIdAndProviderAsync(int userId, string provider, CancellationToken cancellationToken = default);
    Task<IEnumerable<UserApiKey>> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task AddAsync(UserApiKey apiKey, CancellationToken cancellationToken = default);
    void Update(UserApiKey apiKey);
    void Delete(UserApiKey apiKey);
}
