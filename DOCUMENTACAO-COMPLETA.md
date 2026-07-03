# 📚 **DOCUMENTAÇÃO COMPLETA DO SISTEMA DOMINUS TECH**

**Versão**: 2.0  
**Data**: 02 de Julho de 2025  
**Autor**: Mistral Vibe

## 📖 ÍNDICE

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Autenticação e Segurança](#3-autenticação-e-segurança)
4. [Sincronização GMC](#4-sincronização-gmc)
5. [API Endpoints](#5-api-endpoints)
6. [Banco de Dados](#6-banco-de-dados)
7. [Deploy](#7-deploy)
8. [Monitoramento](#8-monitoramento)
9. [Solução de Problemas](#9-solução-de-problemas)

---

## 1. VISÃO GERAL

### Stack Tecnológica
- **Framework**: Next.js 16 (App Router)
- **Linguagem**: TypeScript 5.x
- **Banco**: Turso (SQLite Edge)
- **Estilos**: Tailwind CSS 4.x
- **Autenticação**: JWT + bcrypt
- **UI**: Radix UI Components

### Arquitetura
```
Cliente (Browser) → Next.js API Routes → Services → Turso Database
                                     ↘
                                    GMC Sync Service → Google Merchant Center
```

---

## 2. ARQUITETURA DO SISTEMA

### 2.1 Estrutura de Pastas
```
project/
├── app/
│   ├── api/                    # API Endpoints
│   │   ├── products/           # Produtos API
│   │   ├── admin/              # Admin API
│   │   └── gmc/                # GMC Sync API
│   ├── admin/                  # Admin Pages
│   └── [public pages]
├── lib/
│   ├── services/              # Serviços
│   │   └── gmc-sync-service.ts # Serviço GMC
│   ├── errors/                 # Tratamento de erros
│   │   └── api-error-handler.ts
│   ├── auth-utils.ts           # Utilitários de autenticação
│   └── turso.ts                # Configuração do banco
├── hooks/                     # React Hooks
│   └── use-gmc-sync.ts         # Hook de sincronização
└── types/                     # Tipos TypeScript
    └── index.ts                # Interface de Produto
```

### 2.2 Fluxo Principal
1. Usuário interage com frontend
2. Frontend chama API routes
3. API valida autenticação (middleware)
4. API processa requisição
5. Dados persistidos no Turso
6. Sincronização GMC enfileirada (assíncrona)
7. Worker processa fila de sincronização

---

## 3. AUTENTICAÇÃO E SEGURANÇA

### 3.1 JWT Authentication
- **Algoritmo**: HS256
- **Expiração**: 7 dias
- **Chave Secreta**: Configurada via `ADMIN_SECRET_KEY`
- **Armazenamento**: Cookie httpOnly, secure, sameSite=strict

### 3.2 Credenciais Padrão
- **Requeridas via variáveis de ambiente**:
  - `ADMIN_DEFAULT_USERNAME` (padrão: "admin")
  - `ADMIN_DEFAULT_PASSWORD` (**OBRIGATÓRIO**)
  - `ADMIN_DEFAULT_EMAIL` (padrão: "admin@dominustech.com")

### 3.3 Reset de Senha
- Token de 32 bytes, válido por 1 hora
- Uso único (marcado como usado após reset)
- Senha mínima: 8 caracteres
- Nunca expõe token na resposta API

### 3.4 Headers de Segurança
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; ...
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 3.5 Vulnerabilidades Corrigidas
- ✅ Hardcoded JWT Secret removido
- ✅ Credenciais padrão protegidas
- ✅ SQL Injection prevenida
- ✅ Tokens não expostos
- ✅ Headers de segurança adicionados
- ✅ Cookies seguros
- ✅ Tratamento de erros seguro

---

## 4. SINCRONIZAÇÃO GMC

### 4.1 Visão Geral
Arquitetura **assíncrona e rastreável**:
- API principal não bloqueia aguardando Google
- Produtos marcados como PENDING ao criar/atualizar
- Worker processa fila em background
- Status completo: PENDING → PROCESSING → SYNCED/ERROR

### 4.2 Status de Sincronização
| Status | Descrição | Cor | Ação |
|--------|-----------|-----|------|
| PENDING | Aguardando | 🟡 | Aguardar |
| PROCESSING | Processando | 🔵 | Aguardar |
| SYNCED | Sincronizado | 🟢 | OK |
| ERROR | Falha | 🔴 | Ver logs |
| DISABLED | Desabilitado | ⚫ | Reativar |

### 4.3 Estratégia de Retry
- **Tentativas**: 5 máximas
- **Intervalos**: 1s, 5s, 30s, 5m, 15m (progressivos)
- **Após limite**: Marca como ERROR definitivamente

### 4.4 Tabelas do Banco
- `gmc_sync_queue`: Fila de sincronização
- `gmc_sync_logs`: Logs de todas as operações

### 4.5 Campos Adicionados a Produtos
```typescript
interface Product {
  // ... campos existentes
  gmcProductId?: string;    // ID no Google Merchant Center
  gmcSyncStatus?: GmcSyncStatus;
  gmcLastSync?: string;     // Timestamp da última sync
  gmcError?: string;        // Mensagem de erro
  retryCount?: number;      // Tentativas de retry
  lastRetry?: string;       // Última tentativa
}
```

### 4.6 API Endpoints GMC
| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/gmc/sync` | Estatísticas da fila |
| POST | `/api/gmc/sync` | Processa batch |
| GET | `/api/gmc/sync/:id` | Status do produto |
| POST | `/api/gmc/sync/:id` | Força reprocessamento |
| PUT | `/api/gmc/sync/:id` | Habilita/desabilita |
| DELETE | `/api/gmc/sync/:id` | Desabilita |
| GET | `/api/gmc/sync/logs` | Logs de sincronização |

### 4.7 Hook React
```typescript
import { useGmcSync } from '@/hooks/use-gmc-sync';

const {
  getProductSyncStatus,
  forceRetryProduct,
  enableProductSync,
  disableProductSync,
  processBatch,
  getSyncStats,
  getSyncLogs
} = useGmcSync();
```

---

## 5. API ENDPOINTS

### 5.1 Autenticação
| Método | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/admin/auth` | `{username, password}` | Token (cookie) |
| POST | `/api/admin/logout` | - | `{success: true}` |
| POST | `/api/admin/forgot-password` | `{email}` | `{success, message}` |
| GET | `/api/admin/reset-password?token=xxx` | - | `{valid, message}` |
| POST | `/api/admin/reset-password` | `{token, newPassword}` | `{success, message}` |

### 5.2 Produtos
| Método | Endpoint | Query/Body | Response |
|--------|----------|-----------|----------|
| GET | `/api/products` | `?categoryId=xxx` ou `?departmentId=xxx` | Lista de produtos |
| POST | `/api/products` | `{name, description, price, image, departmentId, categoryId}` | Produto criado |
| GET | `/api/products/:id` | - | Produto |
| PUT | `/api/products/:id` | `{name, price, ...}` | Produto atualizado |
| DELETE | `/api/products/:id` | - | `{success: true}` |

### 5.3 Departamentos e Categorias
| Método | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/departments` | - | Lista de departamentos |
| POST | `/api/departments` | `{name, slug}` | Departamento criado |
| GET | `/api/categories` | - | Lista de categorias |
| POST | `/api/categories` | `{name, slug}` | Categoria criada |

### 5.4 Carrinho
| Método | Endpoint | Body | Response |
|--------|----------|------|----------|
| GET | `/api/cart` | - | Itens do carrinho |
| POST | `/api/cart` | `{productId, quantity}` | `{success: true}` |
| PUT | `/api/cart/:productId` | `{quantity}` | `{success: true}` |
| DELETE | `/api/cart/:productId` | - | `{success: true}` |
| DELETE | `/api/cart` | - | Limpa carrinho |

---

## 6. BANCO DE DADOS

### 6.1 Configuração (Turso)
```typescript
// lib/turso.ts
import { createClient } from "@libsql/client";

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

### 6.2 Tabelas Principais
- `departments`: Departamentos
- `categories`: Categorias
- `products`: Produtos (com campos GMC)
- `admins`: Administradores
- `password_resets`: Tokens de reset
- `gmc_sync_queue`: Fila de sincronização GMC
- `gmc_sync_logs`: Logs de sincronização GMC
- `cart`: Carrinho de compras
- `analytics`: Analytics de produtos

### 6.3 Migrações
```bash
# Executar migrações
npm run db:migrate
# ou
pnpm db:migrate
```

---

## 7. DEPLOY

### 7.1 Variáveis de Ambiente Obrigatórias
```bash
# Banco de dados
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJFZFNTQSIsInR5cCI6IkpXVCJ9...

# Autenticação
ADMIN_SECRET_KEY=your_strong_secret_key  # openssl rand -hex 32
ADMIN_DEFAULT_PASSWORD=YourPassword123
ADMIN_DEFAULT_EMAIL=admin@yourdomain.com
ADMIN_DEFAULT_USERNAME=admin

# Aplicação
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 7.2 Vercel
1. Conectar repositório
2. Configurar variáveis de ambiente no dashboard
3. Deploy automatico

### 7.3 Vercel Cron Jobs (Recomendado)
```json
// vercel.json
{
  "cronJobs": [{
    "path": "/api/gmc/sync",
    "schedule": "*/5 * * * *",
    "method": "POST"
  }]
}
```

### 7.4 Outras Plataformas
- Railway, AWS, Docker - ver documentação específica

---

## 8. MONITORAMENTO

### 8.1 Estatísticas da Fila
```bash
curl /api/gmc/sync
```

### 8.2 Status de Produto
```bash
curl /api/gmc/sync/prod_123
```

### 8.3 Logs de Sincronização
```bash
curl /api/gmc/sync/logs?productId=prod_123
curl /api/gmc/sync/logs?status=ERROR
curl /api/gmc/sync/logs?startDate=2025-07-01&endDate=2025-07-02
```

### 8.4 Headers de Segurança
Verificar em: https://securityheaders.com

---

## 9. SOLUÇÃO DE PROBLEMAS

### 9.1 Autenticação
| Problema | Solução |
|----------|---------|
| "Não autorizado" | Fazer login novamente |
| "Credenciais inválidas" | Verificar usuário/senha |
| "ADMIN_SECRET_KEY não está definida" | Configurar variável de ambiente |

### 9.2 Sincronização GMC
| Problema | Solução |
|----------|---------|
| Produtos não sincronizando | Verificar status: `curl /api/gmc/sync` |
| Itens presos em PROCESSING | Forçar reprocessamento ou verificar logs |
| Muitos erros | Analisar logs: `curl /api/gmc/sync/logs?status=ERROR` |
| Fila não processando | Configurar Cron Job ou worker |

### 9.3 Banco de Dados
| Problema | Solução |
|----------|---------|
| "Database connection failed" | Verificar TURSO_DATABASE_URL e TURSO_AUTH_TOKEN |
| Migrações não executando | Configurar ADMIN_DEFAULT_PASSWORD |

---

## 📚 DOCUMENTAÇÃO RELACIONADA
- [GMC-SYNC-ARCHITECTURE.md](./GMC-SYNC-ARCHITECTURE.md) - Arquitetura detalhada GMC
- [SECURITY-AUDIT-REPORT.md](./SECURITY-AUDIT-REPORT.md) - Relatório de segurança
- [SECURITY-FIXES.md](./SECURITY-FIXES.md) - Detalhes das correções

---

**Versão**: 2.0 | **Data**: 02/07/2025 | **Status**: ✅ COMPLETO