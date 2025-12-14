# Backend Standards - PortfolioAPI

Este documento define os padrões e convenções que **devem** ser seguidos no desenvolvimento do backend.

---

## 📐 Arquitetura

**Clean Architecture + Domain-Driven Design (DDD)**

A solução deve ser organizada em **projetos separados** (`.csproj`), seguindo a seguinte estrutura:

```
PortfolioAPI/
├── Portfolio.Domain/           # Camada de Domínio
├── Portfolio.Application/      # Camada de Aplicação
├── Portfolio.Infrastructure/   # Camada de Infraestrutura
└── Portfolio.WebAPI/           # Camada de Apresentação (API)
```

### Camadas e Responsabilidades

| Camada | Projeto | Responsabilidade |
|--------|---------|------------------|
| **Domain** | `Portfolio.Domain` | Entidades, Value Objects, Agregados, Interfaces de Repositórios, Domain Events, Exceções de Domínio |
| **Application** | `Portfolio.Application` | Services, DTOs, Validators, Use Cases, Interfaces de Serviços Externos |
| **Infrastructure** | `Portfolio.Infrastructure` | Implementação de Repositórios, DbContext, Migrations, Serviços Externos (Email, APIs, etc.) |
| **WebAPI** | `Portfolio.WebAPI` | Controllers, Middlewares, Filters, Program.cs, Configurações |

### Dependências entre Camadas

```
WebAPI → Application → Domain
           ↓
      Infrastructure → Domain
```

- **Domain**: Não depende de nenhuma outra camada (núcleo isolado)
- **Application**: Depende apenas de Domain
- **Infrastructure**: Depende de Domain (implementa interfaces definidas lá)
- **WebAPI**: Depende de Application e registra Infrastructure via DI

---

## 🗄️ Acesso a Dados

**Entity Framework Core + Repository Pattern**

### Estrutura

```csharp
// Portfolio.Domain/Repositories/IUserRepository.cs
public interface IUserRepository
{
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<User>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(User user, CancellationToken cancellationToken = default);
    void Update(User user);
    void Delete(User user);
}

// Portfolio.Infrastructure/Repositories/UserRepository.cs
public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;
    
    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }
    
    // Implementações...
}
```

### Unit of Work (Opcional)

```csharp
// Portfolio.Domain/Repositories/IUnitOfWork.cs
public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
```

### Regras

- ✅ Repositórios **apenas** para Agregados (Aggregate Roots)
- ✅ Interfaces definidas em `Domain`, implementações em `Infrastructure`
- ✅ Usar `CancellationToken` em todos os métodos assíncronos
- ❌ Nunca expor `IQueryable` fora do repositório
- ❌ Nunca usar `DbContext` diretamente nos Services

---

## 🚨 Tratamento de Erros

**Global Exception Handler via Middleware**

### Estrutura

```csharp
// Portfolio.WebAPI/Middlewares/GlobalExceptionHandlerMiddleware.cs
public class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;

    public GlobalExceptionHandlerMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlerMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "An unhandled exception occurred");

        var (statusCode, message) = exception switch
        {
            NotFoundException => (StatusCodes.Status404NotFound, exception.Message),
            ValidationException => (StatusCodes.Status400BadRequest, exception.Message),
            UnauthorizedException => (StatusCodes.Status401Unauthorized, exception.Message),
            _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred")
        };

        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/json";

        var response = new ErrorResponse
        {
            StatusCode = statusCode,
            Message = message,
            Timestamp = DateTime.UtcNow
        };

        await context.Response.WriteAsJsonAsync(response);
    }
}
```

### Exceções Customizadas (Domain)

```csharp
// Portfolio.Domain/Exceptions/DomainException.cs
public abstract class DomainException : Exception
{
    protected DomainException(string message) : base(message) { }
}

// Portfolio.Domain/Exceptions/NotFoundException.cs
public class NotFoundException : DomainException
{
    public NotFoundException(string entity, object key) 
        : base($"{entity} with key '{key}' was not found.") { }
}

// Portfolio.Domain/Exceptions/ValidationException.cs
public class ValidationException : DomainException
{
    public ValidationException(string message) : base(message) { }
}
```

### Regras

- ✅ Todas as exceções não tratadas são capturadas pelo middleware
- ✅ Logs detalhados no servidor, mensagens genéricas para o cliente (em produção)
- ✅ Retornar sempre um objeto `ErrorResponse` padronizado
- ❌ Nunca usar `try-catch` em Controllers (exceto casos muito específicos)

---

## 📛 Nomenclatura

### Suffixos Obrigatórios

| Tipo | Sufixo | Exemplo |
|------|--------|---------|
| Data Transfer Objects | `Dto` | `UserDto`, `CreateUserDto`, `UpdateUserDto` |
| Services | `Service` | `UserService`, `PortfolioService` |
| Interfaces | `I` + Nome | `IUserService`, `IUserRepository` |
| Repositories | `Repository` | `UserRepository`, `PortfolioRepository` |
| Controllers | `Controller` | `UserController`, `PortfolioController` |
| Validators | `Validator` | `CreateUserValidator` |
| Middlewares | `Middleware` | `GlobalExceptionHandlerMiddleware` |
| Extensions | `Extensions` | `ServiceCollectionExtensions` |

### Convenções Gerais

```csharp
// ✅ Correto
public class UserDto { }
public interface IUserService { }
public class UserService : IUserService { }
public class UserRepository : IUserRepository { }

// ❌ Incorreto
public class UserDTO { }      // Use "Dto", não "DTO"
public class User_Service { } // Sem underscores
public class UsersService { } // Singular, não plural
```

### Estrutura de DTOs

```csharp
// Para criação
public record CreateUserDto(string Name, string Email);

// Para atualização
public record UpdateUserDto(string? Name, string? Email);

// Para resposta
public record UserDto(Guid Id, string Name, string Email, DateTime CreatedAt);
```

### Estrutura de Pastas por Camada

```
Portfolio.Domain/
├── Entities/
├── ValueObjects/
├── Repositories/          # Interfaces
├── Exceptions/
└── Events/

Portfolio.Application/
├── DTOs/
│   └── User/
│       ├── CreateUserDto.cs
│       ├── UpdateUserDto.cs
│       └── UserDto.cs
├── Services/
│   ├── IUserService.cs
│   └── UserService.cs
└── Validators/

Portfolio.Infrastructure/
├── Data/
│   └── ApplicationDbContext.cs
├── Repositories/
└── Services/              # Serviços externos

Portfolio.WebAPI/
├── Controllers/
├── Middlewares/
├── Filters/
└── Extensions/
```

---

## 🧪 Testes

**Framework: xUnit**

### Estrutura de Projetos de Teste

```
PortfolioAPI/
├── tests/
│   ├── Portfolio.Domain.Tests/
│   ├── Portfolio.Application.Tests/
│   ├── Portfolio.Infrastructure.Tests/
│   └── Portfolio.WebAPI.Tests/
```

### Nomenclatura de Testes

```csharp
// Padrão: [Método]_[Cenário]_[ResultadoEsperado]
public class UserServiceTests
{
    [Fact]
    public async Task GetByIdAsync_WhenUserExists_ReturnsUser()
    {
        // Arrange
        // Act
        // Assert
    }

    [Fact]
    public async Task GetByIdAsync_WhenUserDoesNotExist_ThrowsNotFoundException()
    {
        // Arrange
        // Act
        // Assert
    }
}
```

### Bibliotecas Recomendadas

| Biblioteca | Uso |
|------------|-----|
| **xUnit** | Framework de testes |
| **FluentAssertions** | Assertions legíveis |
| **Moq** ou **NSubstitute** | Mocking |
| **Bogus** | Geração de dados fake |
| **Microsoft.AspNetCore.Mvc.Testing** | Testes de integração |

### Exemplo Completo

```csharp
public class UserServiceTests
{
    private readonly Mock<IUserRepository> _userRepositoryMock;
    private readonly UserService _sut; // System Under Test

    public UserServiceTests()
    {
        _userRepositoryMock = new Mock<IUserRepository>();
        _sut = new UserService(_userRepositoryMock.Object);
    }

    [Fact]
    public async Task GetByIdAsync_WhenUserExists_ReturnsUserDto()
    {
        // Arrange
        var userId = Guid.NewGuid();
        var user = new User { Id = userId, Name = "John Doe", Email = "john@example.com" };
        
        _userRepositoryMock
            .Setup(x => x.GetByIdAsync(userId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(user);

        // Act
        var result = await _sut.GetByIdAsync(userId);

        // Assert
        result.Should().NotBeNull();
        result.Id.Should().Be(userId);
        result.Name.Should().Be("John Doe");
    }
}
```

---

## ✅ Checklist para Code Review

- [ ] Segue a estrutura de camadas (Clean Architecture)
- [ ] Interfaces definidas em Domain, implementações em Infrastructure
- [ ] Nomenclatura correta (sufixos Dto, Service, Repository, etc.)
- [ ] CancellationToken em métodos assíncronos
- [ ] Sem try-catch em Controllers (usar Global Exception Handler)
- [ ] Testes unitários para novos Services
- [ ] DTOs usando `record` quando apropriado

---

## 📚 Referências

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Domain-Driven Design - Eric Evans](https://www.domainlanguage.com/ddd/)
- [Microsoft - Clean Architecture with ASP.NET Core](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures)

---

*Última atualização: 13 de Dezembro de 2025*
