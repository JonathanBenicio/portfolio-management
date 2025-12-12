# Portfolio Management Platform - README

## 🌟 Visão Geral

Plataforma completa de gerenciamento de investimentos construída com **.NET 10** e **Next.js 14**, usando **Material-UI** para interface moderna e **PostgreSQL** como banco de dados.

### Funcionalidades Implementadas

✅ **Autenticação JWT** - Login/Registro seguro  
✅ **Dashboard Completo** - Visão geral do patrimônio  
✅ **Renda Fixa** - Gestão de CDB, LCI, LCA, Tesouro, Debêntures  
✅ **Renda Variável** - Ações, FIIs, ETFs, BDRs com histórico  
✅ **Análise Detalhada** - Comparação com índices (Ibovespa, CDI, IPCA)  
✅ **Importação de Dados** - Upload de CSV/Excel  
✅ **IA Chat** - Assistente virtual para dúvidas sobre investimentos  
✅ **Configurações** - Perfil, preferências, metas de alocação, exportação  
✅ **Docker Ready** - Totalmente containerizado

---

## 🚀 Como Executar

### Pré-requisitos
- **Docker Desktop** instalado e em execução
- Portas disponíveis: 3000 (frontend), 5000 (backend), 5432 (database)

### Comandos

```powershell
# 1. Navegar até o diretório do projeto
cd c:\Users\Jonathan\Documents\Developer\GitHub\teste_antigravity

# 2. Iniciar todos os serviços (primeira vez use --build)
docker compose up --build

# 3. Acessar a aplicação
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000

# 4. Parar os serviços
docker compose down
```

---

## 📁 Estrutura do Projeto

```
teste_antigravity/
├── PortfolioManagement.sln          # Solution .NET
├── PortfolioAPI/                     # Backend (.NET 10)
│   ├── Controllers/                  # Endpoints da API
│   │   ├── AuthController.cs
│   │   ├── PortfolioController.cs
│   │   ├── FixedIncomeController.cs
│   │   ├── VariableIncomeController.cs
│   │   ├── DividendController.cs
│   │   ├── AnalysisController.cs
│   │   └── ChatController.cs
│   ├── Models/                       # Entidades do banco
│   ├── Data/                         # DbContext
│   └── DTOs/                         # Data Transfer Objects
├── portfolio-app/                    # Frontend (Next.js 14)
│   ├── src/
│   │   ├── app/                      # App Router Pages
│   │   │   ├── (auth)/               # Login/Register
│   │   │   └── (dashboard)/          # Páginas protegidas
│   │   │       ├── page.tsx          # Dashboard principal
│   │   │       ├── fixed-income/
│   │   │       ├── variable-income/
│   │   │       ├── analysis/
│   │   │       ├── import/
│   │   │       ├── chat/
│   │   │       └── settings/
│   │   ├── components/               # Componentes reutilizáveis
│   │   └── lib/                      # Utilidades (theme, API)
│   └── package.json
├── docker-compose.yml                # Orquestração dos containers
├── theme.css                         # Tema customizado
└── base.md                           # Especificação original

```

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **.NET 10** - Framework web moderno
- **Entity Framework Core** - ORM para PostgreSQL
- **JWT Bearer Authentication** - Segurança
- **BCrypt** - Hash de senhas
- **Npgsql** - Driver PostgreSQL

### Frontend
- **Next.js 14** - React framework com App Router
- **Material-UI (MUI) v5** - Biblioteca de componentes
- **TypeScript** - Tipagem estática
- **Recharts** - Gráficos interativos
- **Axios** - Cliente HTTP
- **React Hook Form + Zod** - Validação de formulários

### Infraestrutura
- **Docker + Docker Compose** - Containerização
- **PostgreSQL 15** - Banco de dados relacional

---

## 🎨 Tema Customizado

O projeto utiliza um tema personalizado (`theme.css`) que define uma paleta de cores verde/neutra para toda a aplicação. As variáveis CSS são mapeadas tanto para o Material-UI quanto para estilos globais.

---

## 📊 Endpoints da API (Exemplos)

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Login (retorna JWT)

### Portfolio
- `GET /api/portfolio/summary` - Resumo geral
- `GET /api/portfolio/evolution` - Evolução histórica
- `GET /api/portfolio/allocation` - Alocação por tipo

### Assets
- `GET /api/fixedincome` - Listar renda fixa
- `POST /api/fixedincome` - Adicionar ativo
- `POST /api/variableincome/transaction` - Registrar compra/venda

### Análise
- `GET /api/analysis/benchmarks` - Dados de índices
- `GET /api/analysis/sectors` - Alocação por setor

### Chat IA
- `POST /api/chat/message` - Enviar mensagem
- `GET /api/chat/conversations` - Histórico

---

## 🔐 Segurança

- Senhas hashadas com **BCrypt**
- Autenticação via **JWT** com expiração de 1 dia
- CORS configurado no backend
- Validação de dados no frontend e backend

---

## 📝 Próximos Passos (Opcional)

- [ ] Integração com APIs de cotação (B3, Yahoo Finance)
- [ ] Integração real com OpenAI para o Chat IA
- [ ] Gráficos Recharts funcionais (atualmente placeholders)
- [ ] Testes automatizados (unit, integration)
- [ ] Deploy em produção (Vercel + Azure/AWS)

---

## 🐳 Estrutura Docker

### Serviços
1. **db** - PostgreSQL com volume persistente
2. **backend** - API .NET na porta 5000
3. **frontend** - Next.js na porta 3000

### Variáveis de Ambiente
Definidas no `docker-compose.yml`:
- Backend se conecta ao banco via `Host=db`
- Frontend faz chamadas para `http://backend:8080` (inter-container)

---

## 💡 Dicas

- Para acessar logs: `docker compose logs -f [service]`
- Para rebuild completo: `docker compose build --no-cache`
- Para acessar o banco: Use cliente PostgreSQL em `localhost:5432`
  - User: `postgres`
  - Password: `postgres`
  - Database: `PortfolioDB`

---

## 👨‍💻 Desenvolvimento Local (sem Docker)

### Backend
```powershell
cd PortfolioAPI
dotnet run
```

### Frontend (requer Node.js instalado)
```powershell
cd portfolio-app
npm install
npm run dev
```

---

**Desenvolvido com ❤️ usando .NET 10 e Next.js 14**
