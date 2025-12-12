using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.Models;
using System.Security.Claims;

namespace PortfolioAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ChatController : ControllerBase
{
    private readonly PortfolioDbContext _context;

    public ChatController(PortfolioDbContext context)
    {
        _context = context;
    }

    [HttpGet("conversations")]
    public async Task<ActionResult<List<ChatConversation>>> GetConversations()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        var conversations = await _context.ChatConversations
            .Where(c => c.UserId == userId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return Ok(conversations);
    }

    [HttpGet("conversation/{id}")]
    public async Task<ActionResult<ChatConversation>> GetConversation(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        var conversation = await _context.ChatConversations
            .Include(c => c.Messages.OrderBy(m => m.Timestamp))
            .FirstOrDefaultAsync(c => c.Id == id && c.UserId == userId);

        if (conversation == null)
            return NotFound();

        return Ok(conversation);
    }

    [HttpPost("message")]
    public async Task<ActionResult<ChatMessage>> SendMessage([FromBody] SendMessageDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        ChatConversation? conversation;
        
        if (dto.ConversationId.HasValue)
        {
            conversation = await _context.ChatConversations
                .FirstOrDefaultAsync(c => c.Id == dto.ConversationId && c.UserId == userId);
            
            if (conversation == null)
                return NotFound("Conversation not found");
        }
        else
        {
            // Create new conversation
            conversation = new ChatConversation
            {
                Title = dto.Message.Length > 50 ? dto.Message.Substring(0, 50) + "..." : dto.Message,
                UserId = userId,
                CreatedAt = DateTime.UtcNow
            };
            _context.ChatConversations.Add(conversation);
            await _context.SaveChangesAsync();
        }

        // Save user message
        var userMessage = new ChatMessage
        {
            Role = "user",
            Content = dto.Message,
            ConversationId = conversation.Id,
            Timestamp = DateTime.UtcNow
        };
        _context.ChatMessages.Add(userMessage);
        await _context.SaveChangesAsync();

        // Generate AI response (mock - in production would call OpenAI API)
        var aiResponse = GenerateAIResponse(dto.Message);
        
        var aiMessage = new ChatMessage
        {
            Role = "assistant",
            Content = aiResponse,
            ConversationId = conversation.Id,
            Timestamp = DateTime.UtcNow
        };
        _context.ChatMessages.Add(aiMessage);
        await _context.SaveChangesAsync();

        return Ok(new { userMessage, aiMessage, conversationId = conversation.Id });
    }

    private string GenerateAIResponse(string userMessage)
    {
        // Mock AI responses - in production, this would call OpenAI API or similar
        if (userMessage.ToLower().Contains("diversificar") || userMessage.ToLower().Contains("diversificação"))
        {
            return "A diversificação é fundamental! Recomendo manter entre 60-70% em renda fixa para segurança e 30-40% em renda variável para crescimento. Considere variar entre setores diferentes como tecnologia, financeiro e energia.";
        }
        else if (userMessage.ToLower().Contains("tesouro") || userMessage.ToLower().Contains("selic"))
        {
            return "O Tesouro Selic é ótimo para reserva de emergência por ter liquidez diária e baixo risco. Com a Selic em alta, é um dos melhores investimentos de renda fixa atualmente.";
        }
        else if (userMessage.ToLower().Contains("dividendo"))
        {
            return "Para receber dividendos consistentes, foque em empresas com histórico de pagamentos regulares. Setores como energia elétrica e bancos costumam ter bons dividend yields.";
        }
        else
        {
            return "Entendo sua dúvida sobre investimentos. Posso ajudar com análise da sua carteira, sugestões de diversificação, ou explicar conceitos financeiros. Como posso ajudar mais especificamente?";
        }
    }
}

public class SendMessageDto
{
    public string Message { get; set; } = string.Empty;
    public int? ConversationId { get; set; }
}
