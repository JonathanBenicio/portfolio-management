# Test Guide - Portfolio Management Platform

## 🧪 Guia Completo de Testes

### Preparation
1. Certifique-se de que o Docker está rodando:
```powershell
docker compose ps
```

2. Se não estiver, inicie:
```powershell
docker compose up --build
```

---

## Test 1: Authentication Flow

### 1.1 User Registration
1. Acesse http://localhost:3000
2. Clique em "Cadastre-se"
3. Preencha o formulário:
   - Nome: `Test User`
   - Email: `test@example.com`
   - Senha: `password123`
   - Confirmar Senha: `password123`
4. Clique "Criar Conta"
5. ✅ **Esperado**: Redirecionamento para `/login` com mensagem de sucesso

### 1.2 User Login
1. Na página de login, entre com:
   - Email: `test@example.com`
   - Senha: `password123`
2. Clique "Entrar"
3. ✅ **Esperado**: Redirecionamento para `/dashboard`

### 1.3 Protected Routes
1. Sem fazer login, tente acessar diretamente: http://localhost:3000/dashboard
2. ✅ **Esperado**: Redirecionamento automático para `/login`

### 1.4 Logout
1. No dashboard, clique no avatar (canto superior direito)
2. Clique "Sair"
3. ✅ **Esperado**: Redirecionamento para `/login`, token removido

---

##Test 2: Backend API via Swagger

### 2.1 Access Swagger
1. Abra http://localhost:5000
2. ✅ **Esperado**: Swagger UI carregado com todos os endpoints

### 2.2 Register via API
1. Expanda `POST /api/auth/register`
2. Click "Try it out"
3. Body:
```json
{
  "name": "API User",
  "email": "api@example.com",
  "password": "api123"
}
```
4. Execute
5. ✅ **Esperado**: Status 200, mensagem de sucesso

### 2.3 Login via API
1. Expanda `POST /api/auth/login`
2. Try it out
3. Body:
```json
{
  "email": "api@example.com",
  "password": "api123"
}
```
4. Execute
5. ✅ **Esperado**: Status 200, objeto com `token`, `name`, `email`
6. **COPIE O TOKEN**

### 2.4 Authenticate in Swagger
1. Clique no botão "Authorize" (🔒)
2. Digite: `Bearer {SEU_TOKEN}`
3. Authorize e Close
4. ✅ **Esperado**: Cadeado aparece fechado nos endpoints

### 2.5 Test Protected Endpoints
**Portfolio Summary:**
1. `GET /api/portfolio/summary`
2. Execute
3. ✅ **Esperado**: Dados do portfolio (pode ser vazio inicialmente)

**Fixed Income List:**
1. `GET /api/fixedincome`
2. Execute
3. ✅ **Esperado**: Array de ativos (vazio ou com dados)

**Chat Message:**
1. `POST /api/chat/message`
2. Body:
```json
{
  "message": "Olá, como vai?",
  "conversationId": null
}
```
3. Execute
4. ✅ **Esperado**: Resposta com `aiMessage` e `conversationId`

---

## Test 3: Frontend Pages

### 3.1 Dashboard
1. Login e acesse `/dashboard`
2. Verifique:
   - ✅ Cards de resumo aparecem
   - ✅ Sidebar com menu
   - ✅ Gráficos (placeholders)
   - ✅ Abrir console: verificar chamada para `/api/portfolio/summary`

### 3.2 Fixed Income
1. Clique "Renda Fixa" no menu
2. Verifique:
   - ✅ Tabela de ativos carrega
   - ✅ Filtros funcionam
   - ✅ Botão "Adicionar" está presente
   - ✅ Console: chamada para `/api/fixedincome`

### 3.3 Variable Income
1. Clique "Renda Variável"
2. Verifique:
   - ✅ Tabela com ações/FIIs
   - ✅ Cálculos de ganho/perda
   - ✅ Seção de dividendos

### 3.4 Analysis
1. Clique "Análise"
2. Verifique:
   - ✅ Seletores de ativo e período
   - ✅ Placeholders de gráficos
   - ✅ Cards de estatísticas

### 3.5 Chat IA
1. Clique "IA Chat"
2. Digite uma mensagem: "Olá"
3. Pressione Enter
4. Verifique:
   - ✅ Mensagem enviada aparece (lado direito, azul)
   - ✅ Loading spinner aparece
   - ✅ Resposta da IA aparece (lado esquerdo, branco)
   - ✅ Console: chamada para `/api/chat/message`

### 3.6 Settings
1. Clique "Configurações"
2. Verifique:
   - ✅ Formulário de perfil
   - ✅ Switches de preferências
   - ✅ Tabela de metas de alocação
   - ✅ Botões de exportação

---

## Test 4: Error Handling

### 4.1 Wrong Credentials
1. Logout
2. Tente login com senha errada
3. ✅ **Esperado**: Alerta vermelho de erro

### 4.2 Network Error
1. Pare o backend: `docker compose stop backend`
2. No frontend, tente acessar dashboard
3. ✅ **Esperado**: Snackbar de erro
4. Reinicie: `docker compose start backend`

### 4.3 Token Expiration
1. No console do navegador:
```javascript
localStorage.setItem('token', 'invalid')
```
2. Recarregue a página
3. Tente acessar endpoint protegido
4. ✅ **Esperado**: Redirecionamento para login

---

## Test 5: Database Persistence

### 5.1 Create User via Frontend
1. Registre novo usuário
2. Pare o Docker: `docker compose down`
3. Inicie novamente: `docker compose up`
4. Tente fazer login com o mesmo usuário
5. ✅ **Esperado**: Login bem-sucedido (dados persistidos)

---

## Test 6: Responsive Design

### 6.1 Mobile View
1. Abra DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Selecione "iPhone 12 Pro"
4. Verifique:
   - ✅ Sidebar vira drawer (hamburguer menu)
   - ✅ Cards empilham verticalmente
   - ✅ Tabelas rolam horizontalmente

---

## Common Issues & Solutions

### Issue: Frontend não carrega
**Solution:**
```powershell
docker compose logs frontend
docker compose restart frontend
```

### Issue: 401 Unauthorized
**Solution:**
- Verifique se fez login
- Copie token corretamente no Swagger
- Format: `Bearer {token}` (com espaço)

### Issue: Database empty
**Solution:**
- Backend cria tabelas automaticamente
- Se não criou, verifique logs:
```powershell
docker compose logs backend
```

### Issue: CORS Error
**Solution:**
- Backend já configurado com `AllowAll`
- Verifique se backend está rodando na porta 5000

---

## Success Criteria

✅ **Testes passam se:**
1. Registro e login funcionam
2. Redirecionamentos automáticos funcionam
3. Todas as páginas carregam sem erros
4. API responde via Swagger
5. Chat IA envia e recebe mensagens
6. Notificações (Snackbar) aparecem
7. Loading states aparecem durante chamadas

---

**Last Updated:** 2025-12-12
**Version:** 1.0
