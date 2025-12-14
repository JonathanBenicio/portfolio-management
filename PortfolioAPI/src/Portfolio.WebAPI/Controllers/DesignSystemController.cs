using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs.DesignSystem;
using Portfolio.Domain.Entities;
using Portfolio.Domain.Repositories;
using System.Security.Claims;

namespace Portfolio.WebAPI.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DesignSystemController : ControllerBase
{
    private readonly IDesignSystemConfigRepository _configRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DesignSystemController(
        IDesignSystemConfigRepository configRepository,
        IUnitOfWork unitOfWork)
    {
        _configRepository = configRepository;
        _unitOfWork = unitOfWork;
    }

    private int GetUserId() => int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    /// <summary>
    /// Get design system configuration for the current user
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<DesignSystemConfigDto>> GetConfig(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var config = await _configRepository.GetByUserIdAsync(userId, cancellationToken);

        if (config == null)
        {
            return Ok(GetDefaultConfig());
        }

        return Ok(MapToDto(config));
    }

    /// <summary>
    /// Update design system configuration for the current user
    /// </summary>
    [HttpPut]
    public async Task<ActionResult<DesignSystemConfigDto>> UpdateConfig(
        DesignSystemConfigDto dto,
        CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var config = await _configRepository.GetByUserIdAsync(userId, cancellationToken);

        if (config == null)
        {
            config = new DesignSystemConfig { UserId = userId };
            await _configRepository.AddAsync(config, cancellationToken);
        }

        // Update properties
        config.PrimaryMain = dto.PrimaryMain;
        config.PrimaryLight = dto.PrimaryLight;
        config.PrimaryDark = dto.PrimaryDark;
        config.SecondaryMain = dto.SecondaryMain;
        config.SecondaryLight = dto.SecondaryLight;
        config.SecondaryDark = dto.SecondaryDark;
        config.FontFamily = dto.FontFamily;
        config.H1FontSize = dto.H1FontSize;
        config.H2FontSize = dto.H2FontSize;
        config.H3FontSize = dto.H3FontSize;
        config.H4FontSize = dto.H4FontSize;
        config.H5FontSize = dto.H5FontSize;
        config.H6FontSize = dto.H6FontSize;
        config.BodyFontSize = dto.BodyFontSize;
        config.SpacingUnit = dto.SpacingUnit;
        config.BorderRadius = dto.BorderRadius;
        config.UpdatedAt = DateTime.UtcNow;

        _configRepository.Update(config);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Ok(MapToDto(config));
    }

    /// <summary>
    /// Reset design system configuration to default
    /// </summary>
    [HttpDelete]
    public async Task<ActionResult<DesignSystemConfigDto>> ResetToDefault(CancellationToken cancellationToken)
    {
        var userId = GetUserId();
        var config = await _configRepository.GetByUserIdAsync(userId, cancellationToken);

        if (config != null)
        {
            _configRepository.Delete(config);
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        return Ok(GetDefaultConfig());
    }

    private static DesignSystemConfigDto GetDefaultConfig()
    {
        return new DesignSystemConfigDto();
    }

    private static DesignSystemConfigDto MapToDto(DesignSystemConfig config)
    {
        return new DesignSystemConfigDto(
            config.PrimaryMain,
            config.PrimaryLight,
            config.PrimaryDark,
            config.SecondaryMain,
            config.SecondaryLight,
            config.SecondaryDark,
            config.FontFamily,
            config.H1FontSize,
            config.H2FontSize,
            config.H3FontSize,
            config.H4FontSize,
            config.H5FontSize,
            config.H6FontSize,
            config.BodyFontSize,
            config.SpacingUnit,
            config.BorderRadius
        );
    }
}
