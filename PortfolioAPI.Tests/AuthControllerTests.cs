using PortfolioAPI.Controllers;
using PortfolioAPI.Data;
using PortfolioAPI.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace PortfolioAPI.Tests
{
    public class AuthControllerTests
    {
        private PortfolioDbContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<PortfolioDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            
            return new PortfolioDbContext(options);
        }

        [Fact]
        public async Task Register_ValidUser_ReturnsOk()
        {
            // Arrange
            var context = GetInMemoryContext();
            var controller = new AuthController(context, null!);
            var registerDto = new RegisterDto
            {
                Name = "Test User",
                Email = "test@example.com",
                Password = "password123"
            };

            // Act
            var result = await controller.Register(registerDto);

            // Assert
            Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task Register_DuplicateEmail_ReturnsBadRequest()
        {
            // Arrange
            var context = GetInMemoryContext();
            var controller = new AuthController(context, null!);
            var registerDto = new RegisterDto
            {
                Name = "Test User",
                Email = "test@example.com",
                Password = "password123"
            };

            // First registration
            await controller.Register(registerDto);

            // Act - Try to register again with same email
            var result = await controller.Register(registerDto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsToken()
        {
            // Arrange
            var context = GetInMemoryContext();
            var configuration = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
                .AddInMemoryCollection(new Dictionary<string, string>
                {
                    { "Jwt:Key", "test_key_for_testing_purposes_at_least_32_bytes_long" }
                }!)
                .Build();
            
            var controller = new AuthController(context, configuration);
            
            // Register user first
            await controller.Register(new RegisterDto
            {
                Name = "Test",
                Email = "test@example.com",
                Password = "password123"
            });

            // Act - Try to login
            var loginDto = new LoginDto
            {
                Email = "test@example.com",
                Password = "password123"
            };
            
            var result = await controller.Login(loginDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var response = Assert.IsType<LoginResponseDto>(okResult.Value);
            Assert.NotNull(response.Token);
            Assert.Equal("test@example.com", response.Email);
        }
    }
}
