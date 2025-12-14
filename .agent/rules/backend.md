---
trigger: always_on
---

# Agent Rules - Portfolio Management

## Backend (.NET)

Ao trabalhar no backend (`PortfolioAPI/`), **sempre** seguir:

### Arquitetura Clean Architecture + DDD

- **Nunca** colocar código na camada errada:
  - `Portfolio.Domain` → Entidades, Interfaces de Repositórios, Exceções
  - `Portfolio.Application` → DTOs (records), Services, Interfaces
  - `Portfolio.Infrastructure` → DbContext, Repositórios, Serviços externos
  - `Portfolio.WebAPI` → Controllers, Middlewares

### Regras Obrigatórias

1. **Repository Pattern**: Nunca usar `DbContext` diretamente em Controllers/Services
2. **CancellationToken**: Sempre incluir em métodos assíncronos
3. **Exceções de Domínio**: Usar `NotFoundException`, `ValidationException` - nunca try-catch em Controllers
4. **DTOs como Records**: Usar `record` para DTOs imutáveis
5. **Sufixos obrigatórios**:
   - DTOs: `*Dto` (ex: `UserDto`, `CreateUserDto`)
   - Interfaces: `I*` (ex: `IUserService`, `IUserRepository`)
   - Repositórios: `*Repository`
   - Controllers: `*Controller`
   - Services: `*Service`

### Ao Criar Nova Feature

1. **Domain**: Entidade + Interface `I[Nome]Repository`
2. **Application**: DTOs (`[Nome]Dto`, `Create[Nome]Dto`)
3. **Infrastructure**: `[Nome]Repository` + registrar no `DependencyInjection.cs`
4. **WebAPI**: `[Nome]Controller`

### Comandos

```bash
# Build
dotnet build Portfolio.sln

# Rodar
dotnet run --project src/Portfolio.WebAPI

# Migration
dotnet ef migrations add [Nome] --project src/Portfolio.Infrastructure --startup-project src/Portfolio.WebAPI
```

---

## Frontend (Next.js)

- TypeScript obrigatório
- Componentes em `src/components/`
- Hooks em `src/hooks/`
- Services/API em `src/lib/`
