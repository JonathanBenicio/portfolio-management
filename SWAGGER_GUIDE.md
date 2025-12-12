# Guia Rápido do Swagger - Portfolio API

## 🚀 Acessando o Swagger

Após iniciar a aplicação com `docker compose up`, acesse:

**URL:** http://localhost:5000/swagger

ou

**URL:** http://localhost:5000 (Swagger está configurado na raiz)

## 🔐 Como Testar Endpoints com Autenticação

### 1. Registrar um Usuário

1. Localize o endpoint `POST /api/auth/register`
2. Clique em "Try it out"
3. Preencha o JSON:
```json
{
  "email": "teste@email.com",
  "password": "senha123",
  "name": "Usuário Teste"
}
```
4. Clique em "Execute"

### 2. Fazer Login e Obter Token

1. Localize o endpoint `POST /api/auth/login`
2. Clique em "Try it out"
3. Preencha:
```json
{
  "email": "teste@email.com",
  "password": "senha123"
}
```
4. Clique em "Execute"
5. **COPIE o token JWT** da resposta (campo "token")

### 3. Autenticar no Swagger

1. Clique no botão **"Authorize"** no topo da página (ícone de cadeado)
2. No campo "Value", digite: `Bearer SEU_TOKEN_AQUI`
   - Exemplo: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Clique em "Authorize"
4. Clique em "Close"

Agora você pode testar os endpoints protegidos! 🎉

## 📊 Endpoints Disponíveis

### Authentication
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login (retorna JWT token)

### Portfolio
- `GET /api/portfolio/summary` - Resumo geral da carteira
- `GET /api/portfolio/evolution` - Evolução histórica
- `GET /api/portfolio/allocation` - Alocação por tipo de ativo

### Renda Fixa
- `GET /api/fixedincome` - Listar todos os ativos
- `GET /api/fixedincome/{id}` - Obter ativo específico
- `POST /api/fixedincome` - Criar novo ativo
- `PUT /api/fixedincome/{id}` - Atualizar ativo
- `DELETE /api/fixedincome/{id}` - Deletar ativo

### Renda Variável
- `GET /api/variableincome` - Listar ativos
- `POST /api/variableincome` - Criar ativo
- `POST /api/variableincome/transaction` - Registrar transação (compra/venda)

### Dividendos
- `GET /api/dividend` - Listar dividendos
- `POST /api/dividend` - Registrar novo pagamento
- `GET /api/dividend/summary` - Resumo de dividendos

### Análise
- `GET /api/analysis/benchmarks` - Dados de índices (Ibovespa, CDI, IPCA)
- `GET /api/analysis/sectors` - Alocação por setor
- `GET /api/analysis/performance/{assetId}` - Performance de ativo específico

### Chat IA
- `GET /api/chat/conversations` - Listar conversas
- `GET /api/chat/conversation/{id}` - Obter conversa específica
- `POST /api/chat/message` - Enviar mensagem ao assistente

## 💡 Dicas

- **Endpoints com cadeado** 🔒 requerem autenticação (token JWT)
- **Schemas** na parte inferior mostram a estrutura dos objetos
- **Try it out** permite testar diretamente no navegador
- Use **Ctrl+F** para buscar endpoints específicos

## 🎯 Exemplo Completo de Fluxo

```
1. POST /api/auth/register (criar conta)
2. POST /api/auth/login (obter token)
3. Authorize com o token
4. POST /api/fixedincome (adicionar um CDB)
5. GET /api/portfolio/summary (ver resumo atualizado)
```

## 📝 Exemplo de Body para Criar Ativo de Renda Fixa

```json
{
  "name": "CDB Banco Inter",
  "type": "CDB",
  "investedValue": 10000,
  "interestRate": 105,
  "index": "CDI",
  "purchaseDate": "2024-01-15",
  "maturityDate": "2025-06-30"
}
```

## 🐛 Troubleshooting

**401 Unauthorized?**
- Verifique se colocou "Bearer " antes do token
- Certifique-se de que o token não expirou (válido por 1 dia)

**404 Not Found?**
- Verifique se o backend está rodando (http://localhost:5000)
- Confira se o Docker Compose está ativo

---

**Happy Testing! 🚀**
