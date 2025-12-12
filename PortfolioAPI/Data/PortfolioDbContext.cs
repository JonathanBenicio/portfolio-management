using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Models;

namespace PortfolioAPI.Data;

public class PortfolioDbContext : DbContext
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<FixedIncomeAsset> FixedIncomeAssets { get; set; }
    public DbSet<VariableIncomeAsset> VariableIncomeAssets { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<Dividend> Dividends { get; set; }
    public DbSet<ChatConversation> ChatConversations { get; set; }
    public DbSet<ChatMessage> ChatMessages { get; set; }
    public DbSet<DesignSystemConfig> DesignSystemConfigs { get; set; }
    public DbSet<Wallet> Wallets { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

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
    }
}
