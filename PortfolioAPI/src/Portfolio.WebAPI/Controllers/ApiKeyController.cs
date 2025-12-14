using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs.ApiKey;
using Portfolio.Application.Interfaces;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Exceptions;
using Portfolio.Domain.Repositories;
using System.Security.Claims;

namespace Portfolio.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ApiKeyController : ControllerBase
{
    private readonly IUserApiKeyRepository _apiKeyRepository;
    private readonly IEncryptionService _encryptionService;
    private readonly IUnitOfWork _unitOfWork;

    public ApiKeyController(
        IUserApiKeyRepository apiKeyRepository,
        IEncryptionService encryptionService,
        IUnitOfWork unitOfWork)
    {
        _apiKeyRepository = apiKeyRepository;
        _encryptionService = encryptionService;
        _unitOfWork = unitOfWork;
    }

    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApiKeyResponseDto>>> GetApiKeys(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var apiKeys = await _apiKeyRepository.GetByUserIdAsync(userId, cancellationToken);

        var response = apiKeys
            .OrderByDescending(k => k.CreatedAt)
            .Select(k => new ApiKeyResponseDto(
                k.Id,
                k.Provider,
                k.IsActive,
                k.CreatedAt,
                k.LastUsedAt,
                MaskApiKey(k.EncryptedApiKey)
            ));

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<ApiKeyResponseDto>> SaveApiKey(
        [FromBody] SaveApiKeyDto dto,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();

        // Deactivate existing keys for this provider
        var existingKeys = await _apiKeyRepository.GetByUserIdAsync(userId, cancellationToken);
        foreach (var key in existingKeys.Where(k => k.Provider == dto.Provider))
        {
            key.IsActive = false;
            _apiKeyRepository.Update(key);
        }

        // Encrypt and save new key
        var encryptedKey = _encryptionService.Encrypt(dto.ApiKey);

        var userApiKey = new UserApiKey
        {
            UserId = userId,
            Provider = dto.Provider,
            EncryptedApiKey = encryptedKey,
            CreatedAt = DateTime.UtcNow,
            IsActive = true
        };

        await _apiKeyRepository.AddAsync(userApiKey, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Ok(new ApiKeyResponseDto(
            userApiKey.Id,
            userApiKey.Provider,
            userApiKey.IsActive,
            userApiKey.CreatedAt,
            userApiKey.LastUsedAt,
            MaskApiKey(encryptedKey)
        ));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteApiKey(int id, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var apiKey = await _apiKeyRepository.GetByIdAsync(id, cancellationToken);

        if (apiKey == null || apiKey.UserId != userId)
        {
            throw new NotFoundException("ApiKey", id);
        }

        _apiKeyRepository.Delete(apiKey);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    [HttpGet("active/{provider}")]
    public async Task<ActionResult<object>> GetActiveApiKey(string provider, CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var apiKey = await _apiKeyRepository.GetByUserIdAndProviderAsync(userId, provider, cancellationToken);

        if (apiKey == null)
        {
            throw new NotFoundException($"No active API key found for provider: {provider}");
        }

        // Update last used timestamp
        apiKey.LastUsedAt = DateTime.UtcNow;
        _apiKeyRepository.Update(apiKey);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Decrypt and return the key
        var decryptedKey = _encryptionService.Decrypt(apiKey.EncryptedApiKey);

        return Ok(new { apiKey = decryptedKey });
    }

    private static string MaskApiKey(string encryptedKey)
    {
        if (string.IsNullOrEmpty(encryptedKey) || encryptedKey.Length < 8)
            return "****";

        return $"****{encryptedKey[^4..]}";
    }
}
