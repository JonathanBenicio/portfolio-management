using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Repositories;
using Portfolio.Infrastructure.Data;

namespace Portfolio.Infrastructure.Repositories;

public class ChatRepository : IChatRepository
{
    private readonly PortfolioDbContext _context;

    public ChatRepository(PortfolioDbContext context)
    {
        _context = context;
    }

    public async Task<ChatConversation?> GetConversationByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _context.ChatConversations
            .Include(c => c.Messages.OrderBy(m => m.Timestamp))
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<ChatConversation>> GetConversationsByUserIdAsync(int userId, CancellationToken cancellationToken = default)
    {
        return await _context.ChatConversations
            .Include(c => c.Messages.OrderByDescending(m => m.Timestamp).Take(1))
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task AddConversationAsync(ChatConversation conversation, CancellationToken cancellationToken = default)
    {
        await _context.ChatConversations.AddAsync(conversation, cancellationToken);
    }

    public async Task AddMessageAsync(ChatMessage message, CancellationToken cancellationToken = default)
    {
        await _context.ChatMessages.AddAsync(message, cancellationToken);
    }

    public void UpdateConversation(ChatConversation conversation)
    {
        _context.ChatConversations.Update(conversation);
    }

    public void DeleteConversation(ChatConversation conversation)
    {
        _context.ChatConversations.Remove(conversation);
    }
}
