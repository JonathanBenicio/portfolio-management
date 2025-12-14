using System.ComponentModel.DataAnnotations;

namespace Portfolio.Application.DTOs.ApiKey;

public record SaveApiKeyDto(
    [Required] string Provider,
    [Required] string ApiKey
);

public record ApiKeyResponseDto(
    int Id,
    string Provider,
    bool IsActive,
    DateTime CreatedAt,
    DateTime? LastUsedAt,
    string MaskedKey
);
