using Portfolio.Domain.Entities;

namespace Portfolio.Domain.Repositories;

public interface IDesignSystemConfigRepository
{
    Task<DesignSystemConfig?> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task AddAsync(DesignSystemConfig config, CancellationToken cancellationToken = default);
    void Update(DesignSystemConfig config);
    void Delete(DesignSystemConfig config);
}
