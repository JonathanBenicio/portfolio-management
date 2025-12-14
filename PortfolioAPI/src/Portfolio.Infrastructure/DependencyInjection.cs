using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Repositories;
using Portfolio.Infrastructure.Data;
using Portfolio.Infrastructure.Repositories;
using Portfolio.Infrastructure.Services;

namespace Portfolio.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // DbContext
        services.AddDbContext<PortfolioDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // Unit of Work
        services.AddScoped<IUnitOfWork>(provider => provider.GetRequiredService<PortfolioDbContext>());

        // Repositories
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IWalletRepository, WalletRepository>();
        services.AddScoped<IFixedIncomeAssetRepository, FixedIncomeAssetRepository>();
        services.AddScoped<IVariableIncomeAssetRepository, VariableIncomeAssetRepository>();
        services.AddScoped<IChatRepository, ChatRepository>();
        services.AddScoped<IUserApiKeyRepository, UserApiKeyRepository>();
        services.AddScoped<IDesignSystemConfigRepository, DesignSystemConfigRepository>();

        // Services
        services.AddSingleton<IEncryptionService, EncryptionService>();

        return services;
    }
}
