using Microsoft.EntityFrameworkCore;
using Portfolio.Infrastructure.Data;

namespace Portfolio.WebAPI.Extensions;

public static class DatabaseMigrationExtensions
{
    public static void ApplyMigrations(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var services = scope.ServiceProvider;
        var logger = services.GetRequiredService<ILogger<Program>>();
        var context = services.GetRequiredService<PortfolioDbContext>();

        var retryCount = 0;
        const int maxRetries = 10;
        const int delayMilliseconds = 3000;

        while (retryCount < maxRetries)
        {
            try
            {
                if (retryCount > 0)
                {
                    logger.LogInformation("Attempting to connect to database and apply migrations... (Attempt {RetryCount}/{MaxRetries})", retryCount + 1, maxRetries);
                }
                else
                {
                    logger.LogInformation("Attempting to apply database migrations...");
                }

                context.Database.Migrate();

                logger.LogInformation("Database migrations applied successfully!");
                break;
            }
            catch (Exception ex)
            {
                retryCount++;

                if (retryCount >= maxRetries)
                {
                    logger.LogError(ex, "Failed to apply database migrations after {MaxRetries} attempts. Application will exit.", maxRetries);
                    throw;
                }

                logger.LogWarning(ex, "Failed to connect to database. Retrying in {Delay}ms... (Attempt {RetryCount}/{MaxRetries})", delayMilliseconds, retryCount, maxRetries);
                Thread.Sleep(delayMilliseconds);
            }
        }
    }
}
