using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs.Chat;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Exceptions;
using Portfolio.Domain.Repositories;
using System.Security.Claims;

namespace Portfolio.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly IChatRepository _chatRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ChatController(
        IChatRepository chatRepository,
        IUnitOfWork unitOfWork)
    {
        _chatRepository = chatRepository;
        _unitOfWork = unitOfWork;
    }

    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    [HttpGet("conversations")]
    public async Task<ActionResult<IEnumerable<ChatConversationDto>>> GetConversations(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var conversations = await _chatRepository.GetConversationsByUserIdAsync(userId, cancellationToken);

        var result = conversations.Select(c => new ChatConversationDto(
            c.Id,
            c.Title,
            c.CreatedAt,
            c.Messages.Select(m => new ChatMessageDto(m.Id, m.Role, m.Content, m.Timestamp)).ToList()
        ));

        return Ok(result);
    }

    [HttpGet("conversation/{id}")]
    public async Task<ActionResult<ChatConversationDto>> GetConversation(int id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var conversation = await _chatRepository.GetConversationByIdAsync(id, cancellationToken);

        if (conversation == null || conversation.UserId != userId)
        {
            throw new NotFoundException("Conversation", id);
        }

        var result = new ChatConversationDto(
            conversation.Id,
            conversation.Title,
            conversation.CreatedAt,
            conversation.Messages
                .OrderBy(m => m.Timestamp)
                .Select(m => new ChatMessageDto(m.Id, m.Role, m.Content, m.Timestamp))
                .ToList()
        );

        return Ok(result);
    }

    [HttpPost("message")]
    public async Task<ActionResult<ChatResponseDto>> SendMessage(
        [FromBody] ChatRequestDto dto,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        ChatConversation conversation;

        if (dto.ConversationId.HasValue)
        {
            var existingConversation = await _chatRepository.GetConversationByIdAsync(dto.ConversationId.Value, cancellationToken);

            if (existingConversation == null || existingConversation.UserId != userId)
            {
                throw new NotFoundException("Conversation", dto.ConversationId.Value);
            }

            conversation = existingConversation;
        }
        else
        {
            // Create new conversation
            conversation = new ChatConversation
            {
                Title = dto.Message.Length > 50 ? dto.Message[..50] + "..." : dto.Message,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };

            await _chatRepository.AddConversationAsync(conversation, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        // Save user message
        var userMessage = new ChatMessage
        {
            Role = "user",
            Content = dto.Message,
            ConversationId = conversation.Id,
            Timestamp = DateTime.UtcNow
        };

        await _chatRepository.AddMessageAsync(userMessage, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Generate AI response (mock - in production would call OpenAI API)
        var aiResponse = GenerateAIResponse(dto.Message);

        var aiMessage = new ChatMessage
        {
            Role = "assistant",
            Content = aiResponse,
            ConversationId = conversation.Id,
            Timestamp = DateTime.UtcNow
        };

        await _chatRepository.AddMessageAsync(aiMessage, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Ok(new ChatResponseDto(
            conversation.Id,
            new ChatMessageDto(userMessage.Id, userMessage.Role, userMessage.Content, userMessage.Timestamp),
            new ChatMessageDto(aiMessage.Id, aiMessage.Role, aiMessage.Content, aiMessage.Timestamp)
        ));
    }

    private static string GenerateAIResponse(string userMessage)
    {
        // Mock AI responses - in production, this would call OpenAI API or similar
        var lowerMessage = userMessage.ToLower();

        if (lowerMessage.Contains("diversificar") || lowerMessage.Contains("diversificação"))
        {
            return "A diversificação é fundamental! Recomendo manter entre 60-70% em renda fixa para segurança e 30-40% em renda variável para crescimento. Considere variar entre setores diferentes como tecnologia, financeiro e energia.";
        }

        if (lowerMessage.Contains("tesouro") || lowerMessage.Contains("selic"))
        {
            return "O Tesouro Selic é ótimo para reserva de emergência por ter liquidez diária e baixo risco. Com a Selic em alta, é um dos melhores investimentos de renda fixa atualmente.";
        }

        if (lowerMessage.Contains("dividendo"))
        {
            return "Para receber dividendos consistentes, foque em empresas com histórico de pagamentos regulares. Setores como energia elétrica e bancos costumam ter bons dividend yields.";
        }

        return "Entendo sua dúvida sobre investimentos. Posso ajudar com análise da sua carteira, sugestões de diversificação, ou explicar conceitos financeiros. Como posso ajudar mais especificamente?";
    }
}
