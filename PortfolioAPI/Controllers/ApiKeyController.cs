using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.DTOs;
using PortfolioAPI.Models;
using PortfolioAPI.Services;
using System.Security.Claims;

namespace PortfolioAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ApiKeyController : ControllerBase
{
    private readonly PortfolioDbContext _context;
    private readonly IEncryptionService _encryptionService;

    public ApiKeyController(PortfolioDbContext context, IEncryptionService encryptionService)
    {
        _context = context;
        _encryptionService = encryptionService;
    }

    [HttpGet]
    public async Task<ActionResult<List<ApiKeyResponseDto>>> GetApiKeys()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        var apiKeys = await _context.UserApiKeys
            .Where(k => k.UserId == userId)
            .OrderByDescending(k => k.CreatedAt)
            .ToListAsync();

        var response = apiKeys.Select(k => new ApiKeyResponseDto
        {
            Id = k.Id,
            Provider = k.Provider,
            IsActive = k.IsActive,
            CreatedAt = k.CreatedAt,
            LastUsedAt = k.LastUsedAt,
            MaskedKey = MaskApiKey(k.EncryptedApiKey)
        }).ToList();

        return Ok(response);
    }

    [HttpPost]
    public async Task<ActionResult<ApiKeyResponseDto>> SaveApiKey([FromBody] SaveApiKeyDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        // Deactivate existing keys for this provider
        var existingKeys = await _context.UserApiKeys
            .Where(k => k.UserId == userId && k.Provider == dto.Provider)
            .ToListAsync();

        foreach (var key in existingKeys)
        {
            key.IsActive = false;
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

        _context.UserApiKeys.Add(userApiKey);
        await _context.SaveChangesAsync();

        return Ok(new ApiKeyResponseDto
        {
            Id = userApiKey.Id,
            Provider = userApiKey.Provider,
            IsActive = userApiKey.IsActive,
            CreatedAt = userApiKey.CreatedAt,
            LastUsedAt = userApiKey.LastUsedAt,
            MaskedKey = MaskApiKey(encryptedKey)
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteApiKey(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        var apiKey = await _context.UserApiKeys
            .FirstOrDefaultAsync(k => k.Id == id && k.UserId == userId);

        if (apiKey == null)
            return NotFound();

        _context.UserApiKeys.Remove(apiKey);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpGet("active/{provider}")]
    public async Task<ActionResult<string>> GetActiveApiKey(string provider)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        var apiKey = await _context.UserApiKeys
            .Where(k => k.UserId == userId && k.Provider == provider && k.IsActive)
            .OrderByDescending(k => k.CreatedAt)
            .FirstOrDefaultAsync();

        if (apiKey == null)
            return NotFound(new { message = "No active API key found for this provider" });

        // Update last used timestamp
        apiKey.LastUsedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Decrypt and return the key
        var decryptedKey = _encryptionService.Decrypt(apiKey.EncryptedApiKey);
        
        return Ok(new { apiKey = decryptedKey });
    }

    private string MaskApiKey(string encryptedKey)
    {
        // Show only pattern like "sk-...xyz" for security
        if (string.IsNullOrEmpty(encryptedKey) || encryptedKey.Length < 8)
            return "****";

        return $"****{encryptedKey.Substring(encryptedKey.Length - 4)}";
    }
}
