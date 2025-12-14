using System.ComponentModel.DataAnnotations;

namespace Portfolio.Application.DTOs.Chat;

public record ChatConversationDto(
    int Id,
    string Title,
    DateTime CreatedAt,
    List<ChatMessageDto> Messages
);

public record ChatMessageDto(
    int Id,
    string Role,
    string Content,
    DateTime Timestamp
);

public record ChatRequestDto(
    [Required] string Message,
    int? ConversationId = null
);

public record ChatResponseDto(
    int ConversationId,
    ChatMessageDto UserMessage,
    ChatMessageDto AiMessage
);
