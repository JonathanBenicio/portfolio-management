# Migrations Automáticas no Docker

## Como Funciona

O sistema está configurado para executar automaticamente as migrations do Entity Framework Core quando o container do backend inicia.

## Configurações Implementadas

### 1. Health Check no PostgreSQL (`docker-compose.yml`)

O banco de dados PostgreSQL agora possui um health check que verifica se está pronto para aceitar conexões:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 5s
  timeout: 5s
  retries: 5
```

- **Intervalo**: Verifica a cada 5 segundos
- **Timeout**: Aguarda até 5 segundos por resposta
- **Retries**: Tenta até 5 vezes antes de considerar falha

### 2. Dependência com Condição (`docker-compose.yml`)

O backend agora aguarda o banco estar **saudável** antes de iniciar:

```yaml
depends_on:
  db:
    condition: service_healthy
```

Isso garante que o PostgreSQL esteja completamente pronto antes do backend tentar conectar.

### 3. Retry Logic no Backend (`Program.cs`)

O código de migration possui lógica de retry que:

- **Tenta conectar até 10 vezes**
- **Aguarda 3 segundos entre tentativas**
- **Loga cada tentativa** para facilitar debug
- **Falha graciosamente** se não conseguir após todas as tentativas

```csharp
var retryCount = 0;
const int maxRetries = 10;
const int delayMilliseconds = 3000;

while (retryCount < maxRetries)
{
    try
    {
        context.Database.CanConnect();
        context.Database.Migrate();
        break;
    }
    catch (Exception ex)
    {
        // Retry logic...
    }
}
```

## Como Usar

### Iniciar os Containers

```bash
docker compose up --build
```

### Verificar os Logs

Para ver as migrations sendo aplicadas:

```bash
docker logs teste_antigravity-backend-1
```

Você verá mensagens como:
```
Attempting to connect to database and apply migrations... (Attempt 1/10)
Database migrations applied successfully!
```

### Criar Nova Migration

1. Adicione ou modifique suas entidades no código
2. Crie a migration:
   ```bash
   dotnet ef migrations add NomeDaMigration
   ```
3. Reconstrua o container:
   ```bash
   docker compose up --build
   ```

A migration será aplicada automaticamente na inicialização!

## Vantagens

✅ **Automático**: Não precisa rodar comandos manualmente  
✅ **Confiável**: Retry logic garante que funcione mesmo se o banco demorar  
✅ **Rastreável**: Logs detalhados de cada tentativa  
✅ **Seguro**: Aguarda o banco estar saudável antes de tentar  

## Troubleshooting

### Backend não inicia

1. Verifique se o banco está saudável:
   ```bash
   docker ps
   ```
   O status deve mostrar `healthy` para o container do banco

2. Verifique os logs do banco:
   ```bash
   docker logs teste_antigravity-db-1
   ```

3. Verifique os logs do backend:
   ```bash
   docker logs teste_antigravity-backend-1
   ```

### Migrations não aplicadas

Se as migrations não forem aplicadas automaticamente:

1. Entre no container:
   ```bash
   docker exec -it teste_antigravity-backend-1 /bin/bash
   ```

2. Execute manualmente:
   ```bash
   dotnet ef database update
   ```

### Resetar o Banco

Para começar do zero:

```bash
docker compose down -v
docker compose up --build
```

O `-v` remove os volumes, deletando todos os dados do banco.
