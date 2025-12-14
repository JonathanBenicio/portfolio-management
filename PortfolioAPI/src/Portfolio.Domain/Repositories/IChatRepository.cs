using Portfolio.Domain.Entities;

namespace Portfolio.Domain.Repositories;

public interface IChatRepository
{
    Task<ChatConversation?> GetConversationByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IEnumerable<ChatConversation>> GetConversationsByUserIdAsync(int userId, CancellationToken cancellationToken = default);
    Task AddConversationAsync(ChatConversation conversation, CancellationToken cancellationToken = default);
    Task AddMessageAsync(ChatMessage message, CancellationToken cancellationToken = default);
    void UpdateConversation(ChatConversation conversation);
    void DeleteConversation(ChatConversation conversation);
}
