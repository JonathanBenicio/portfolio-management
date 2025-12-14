using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Repositories;

namespace Portfolio.Infrastructure.Data;

public class PortfolioDbContext : DbContext, IUnitOfWork
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options) { }

    public required DbSet<User> Users { get; set; }
    public required DbSet<FixedIncomeAsset> FixedIncomeAssets { get; set; }
    public required DbSet<VariableIncomeAsset> VariableIncomeAssets { get; set; }
    public required DbSet<Transaction> Transactions { get; set; }
    public required DbSet<Dividend> Dividends { get; set; }
    public required DbSet<ChatConversation> ChatConversations { get; set; }
    public required DbSet<ChatMessage> ChatMessages { get; set; }
    public required DbSet<DesignSystemConfig> DesignSystemConfigs { get; set; }
    public required DbSet<Wallet> Wallets { get; set; }
    public required DbSet<AuditLog> AuditLogs { get; set; }
    public required DbSet<UserApiKey> UserApiKeys { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Settings for decimals
        modelBuilder.Entity<FixedIncomeAsset>()
            .Property(f => f.InvestedValue)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<FixedIncomeAsset>()
            .Property(f => f.CurrentValue)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<FixedIncomeAsset>()
            .Property(f => f.InterestRate)
            .HasColumnType("decimal(18,4)");

        modelBuilder.Entity<VariableIncomeAsset>()
            .Property(f => f.AveragePrice)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Transaction>()
            .Property(f => f.Price)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<Dividend>()
            .Property(f => f.Amount)
            .HasColumnType("decimal(18,2)");

        modelBuilder.Entity<FixedIncomeAsset>()
            .Property(e => e.PurchaseDate)
            .HasConversion(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        modelBuilder.Entity<FixedIncomeAsset>()
            .Property(e => e.MaturityDate)
            .HasConversion(
                v => v.ToUniversalTime(),
                v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        // Relationships
        modelBuilder.Entity<Wallet>()
            .HasOne(w => w.User)
            .WithMany(u => u.Wallets)
            .HasForeignKey(w => w.UserId);

        modelBuilder.Entity<UserApiKey>()
            .HasOne(k => k.User)
            .WithMany(u => u.ApiKeys)
            .HasForeignKey(k => k.UserId);

        modelBuilder.Entity<FixedIncomeAsset>()
            .HasOne(f => f.Wallet)
            .WithMany()
            .HasForeignKey(f => f.WalletId);

        modelBuilder.Entity<VariableIncomeAsset>()
            .HasOne(v => v.Wallet)
            .WithMany()
            .HasForeignKey(v => v.WalletId);
    }
}
