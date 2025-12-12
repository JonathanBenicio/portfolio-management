using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.DTOs;
using PortfolioAPI.Models;
using System.Security.Claims;

namespace PortfolioAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DesignSystemController : ControllerBase
    {
        private readonly PortfolioDbContext _context;

        public DesignSystemController(PortfolioDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get design system configuration for the current user
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<DesignSystemConfigDto>> GetConfig()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var config = await _context.DesignSystemConfigs
                .FirstOrDefaultAsync(c => c.UserId == userId);
            
            if (config == null)
            {
                // Return default configuration
                return Ok(GetDefaultConfig());
            }
            
            return Ok(MapToDto(config));
        }

        /// <summary>
        /// Update design system configuration for the current user
        /// </summary>
        [HttpPut]
        public async Task<ActionResult<DesignSystemConfigDto>> UpdateConfig(DesignSystemConfigDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            
            var config = await _context.DesignSystemConfigs
                .FirstOrDefaultAsync(c => c.UserId == userId);
            
            if (config == null)
            {
                config = new DesignSystemConfig { UserId = userId };
                _context.DesignSystemConfigs.Add(config);
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
            
            await _context.SaveChangesAsync();
            
            return Ok(MapToDto(config));
        }

        /// <summary>
        /// Reset design system configuration to default
        /// </summary>
        [HttpDelete]
        public async Task<ActionResult<DesignSystemConfigDto>> ResetToDefault()
        {
            var userId = int.Parse(User.FindFirst("userId")?.Value ?? "0");
            
            var config = await _context.DesignSystemConfigs
                .FirstOrDefaultAsync(c => c.UserId == userId);
            
            if (config != null)
            {
                _context.DesignSystemConfigs.Remove(config);
                await _context.SaveChangesAsync();
            }
            
            return Ok(GetDefaultConfig());
        }

        private DesignSystemConfigDto GetDefaultConfig()
        {
            return new DesignSystemConfigDto
            {
                PrimaryMain = "#009963",
                PrimaryLight = "#33AD7F",
                PrimaryDark = "#006B45",
                SecondaryMain = "#0066CC",
                SecondaryLight = "#3385D6",
                SecondaryDark = "#00478F",
                FontFamily = "Inter, Roboto, Helvetica, Arial, sans-serif",
                H1FontSize = 96,
                H2FontSize = 60,
                H3FontSize = 48,
                H4FontSize = 34,
                H5FontSize = 24,
                H6FontSize = 20,
                BodyFontSize = 16,
                SpacingUnit = 8,
                BorderRadius = 8
            };
        }

        private DesignSystemConfigDto MapToDto(DesignSystemConfig config)
        {
            return new DesignSystemConfigDto
            {
                PrimaryMain = config.PrimaryMain,
                PrimaryLight = config.PrimaryLight,
                PrimaryDark = config.PrimaryDark,
                SecondaryMain = config.SecondaryMain,
                SecondaryLight = config.SecondaryLight,
                SecondaryDark = config.SecondaryDark,
                FontFamily = config.FontFamily,
                H1FontSize = config.H1FontSize,
                H2FontSize = config.H2FontSize,
                H3FontSize = config.H3FontSize,
                H4FontSize = config.H4FontSize,
                H5FontSize = config.H5FontSize,
                H6FontSize = config.H6FontSize,
                BodyFontSize = config.BodyFontSize,
                SpacingUnit = config.SpacingUnit,
                BorderRadius = config.BorderRadius
            };
        }
    }
}
