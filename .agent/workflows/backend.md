---
description: Padrões e convenções para desenvolvimento do backend (PortfolioAPI)
---

# Backend Development Workflow

Antes de fazer qualquer alteração no backend, **sempre** consulte e siga os padrões definidos em:

📄 `PortfolioAPI/BACKEND_STANDARDS.md`

---

## Checklist Obrigatório

### Arquitetura (Clean Architecture + DDD)

1. **Verificar a camada correta** para o código:
   - `Portfolio.Domain` → Entidades, Value Objects, Interfaces de Repositórios, Exceções de Domínio
   - `Portfolio.Application` → Services, DTOs, Validators, Use Cases
   - `Portfolio.Infrastructure` → Repositórios (implementação), DbContext, Serviços Externos
   - `Portfolio.WebAPI` → Controllers, Middlewares, Filters

2. **Respeitar dependências entre camadas**:
   - Domain não depende de nada
   - Application depende apenas de Domain
   - Infrastructure depende de Domain
   - WebAPI depende de Application

---

### Nomenclatura

Sempre usar os sufixos corretos:

| Tipo | Sufixo | Exemplo |
|------|--------|---------|
| DTOs | `Dto` | `UserDto`, `CreateUserDto` |
| Services | `Service` | `UserService` |
| Interfaces | `I` + Nome | `IUserService` |
| Repositories | `Repository` | `UserRepository` |
| Controllers | `Controller` | `UserController` |

---

### Acesso a Dados

1. **Sempre usar Repository Pattern**
2. Interfaces em `Domain/Repositories/`
3. Implementações em `Infrastructure/Repositories/`
4. **Nunca** usar `DbContext` diretamente em Services
5. **Sempre** incluir `CancellationToken` em métodos assíncronos

---

### Tratamento de Erros

1. **Não usar try-catch em Controllers** - usar Global Exception Handler
2. Criar exceções customizadas em `Domain/Exceptions/`
3. Exceções comuns: `NotFoundException`, `ValidationException`, `UnauthorizedException`

---

### Testes (xUnit)

1. Criar testes em `tests/Portfolio.[Camada].Tests/`
2. Nomenclatura: `[Método]_[Cenário]_[ResultadoEsperado]`
3. Usar padrão AAA: Arrange, Act, Assert
4. Bibliotecas: xUnit, FluentAssertions, Moq

---

## Exemplo de Criação de Nova Feature

Para criar uma nova feature (ex: `Wallet`):

1. **Domain**: Criar entidade `Wallet` e interface `IWalletRepository`
2. **Application**: Criar `WalletDto`, `CreateWalletDto`, `IWalletService`, `WalletService`
3. **Infrastructure**: Criar `WalletRepository`
4. **WebAPI**: Criar `WalletController`
5. **Testes**: Criar `WalletServiceTests`

---

## Comandos Úteis

```bash
# Rodar aplicação
// turbo
dotnet run --project Portfolio.WebAPI

# Rodar testes
// turbo
dotnet test

# Criar migration
dotnet ef migrations add [NomeMigration] --project Portfolio.Infrastructure --startup-project Portfolio.WebAPI

# Aplicar migrations
// turbo
dotnet ef database update --project Portfolio.Infrastructure --startup-project Portfolio.WebAPI
```
