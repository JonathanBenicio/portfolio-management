using System.ComponentModel.DataAnnotations;

namespace Portfolio.Application.DTOs.Auth;

public record RegisterDto(
    [Required][EmailAddress] string Email,
    [Required][MinLength(6)] string Password,
    [Required] string Name
);

public record LoginDto(
    [Required][EmailAddress] string Email,
    [Required] string Password
);

public record LoginResponseDto(
    string Token,
    string Name,
    string Email
);

public record UserDto(
    int Id,
    string Email,
    string Name,
    DateTime CreatedAt
);
