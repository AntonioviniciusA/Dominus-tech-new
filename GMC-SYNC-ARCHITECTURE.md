# Arquitetura de Sincronização com Google Merchant Center

## Visão Geral

Este documento descreve a arquitetura assíncrona e rastreável implementada para sincronização de produtos com o Google Merchant Center (GMC). A solução foi projetada para:

- **Desacoplar** o fluxo de criação/edição de produtos da sincronização com o GMC
- **Rastrear** o status de cada produto no processo de sincronização
- **Garantir resiliência** com estratégia de retry e tratamento de erros
- **Manter observabilidade** com logs detalhados
- **Preservar compatibilidade** com a arquitetura existente

## Componentes Principais

### 1. Modelos de Dados

#### 1.1. Campos Adicionados à Tabela `products`

```sql
-- Campos para sincronização com Google Merchant Center
gmc_product_id TEXT,              -- ID do produto no GMC
gmc_sync_status TEXT CHECK(...), -- Status: PENDING, PROCESSING, SYNCED, ERROR, DISABLED
gmc_last_sync TEXT,              -- Timestamp da última sincronização bem-sucedida
gmc_error TEXT,                 -- Mensagem de erro da última falha
retry_count INTEGER DEFAULT 0,   -- Contador de tentativas de retry
last_retry TEXT,                 -- Timestamp da última tentativa de retry
```

#### 1.2. Tabelas Auxiliares

**`gmc_sync_queue`** - Fila de sincronização
- `id`: Identificador único do item na fila
- `product_id`: Referência ao produto
- `action`: CREATE | UPDATE | DELETE
- `status`: PENDING | PROCESSING | SYNCED | ERROR | DISABLED
- `retry_count`: Número de tentativas de processamento
- `last_error`: Mensagem de erro da última falha
- `last_retry`: Timestamp da última tentativa
- `priority`: Prioridade de processamento (0 = normal, 1 = alta)
- `created_at` / `updated_at`: Timestamps

**`gmc_sync_logs`** - Logs de sincronização
- `id`: Identificador único do log
- `product_id`: Referência ao produto
- `queue_item_id`: Referência ao item da fila
- `action`: Ação executada
- `status`: Status no momento do log
- `message`: Mensagem descritiva
- `error_details`: Detalhes do erro (se aplicável)
- `timestamp`: Timestamp do log

### 2. Serviço de Sincronização (`gmc-sync-service.ts`)

#### 2.1. Responsabilidades
- Gerenciamento da fila de sincronização
- Processamento assíncrono de itens da fila
- Estratégia de retry com limites e intervalos configuráveis
- Integração com a API do Google Merchant Center
- Logs e observabilidade

#### 2.2. Configuração

```typescript
const DEFAULT_CONFIG: GmcSyncConfig = {
  maxRetries: 5,                           // Limite máximo de tentativas
  retryIntervals: [1000, 5000, 30000, 300000, 900000], // 1s, 5s, 30s, 5m, 15m
  batchSize: 10,                          // Itens por batch
  processingTimeout: 60000,               // Timeout de processamento (ms)
  googleMerchantApi: {
    baseUrl: 'https://shoppingcontent.googleapis.com/content/v2.1',
    authToken: '',
    merchantId: '',
  },
};
```

#### 2.3. Fluxo Principal

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  CRIAR/ATUALIZAR │────▶│  enqueueProduct  │────▶│  Fila de Sync   │
│    PRODUTO       │     │ (CREATE/UPDATE) │     │ (gmc_sync_queue)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                      │
                                                      ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  PROCESSAR       │────▶│  processBatch   │────▶│   PROCESSAR      │
│  BATCH           │     │  (API endpoint)  │     │   ITEM A ITEM   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                      │
              ┌───────────────────────────────────────────┐
              │                                           │
              ▼                                           ▼
     ┌─────────────────┐                          ┌─────────────────┐
     │  SUCESSO        │                          │   FALHA         │
     │  - SYNCED       │                          │  - ERROR         │
     │  - Atualiza GMC │                          │  - Retry?       │
     │  - Logs         │                          │  - Logs         │
     └─────────────────┘                          └─────────────────┘
```

#### 2.4. Métodos Principais

- **`enqueueProduct(productId, action, priority)`**: Adiciona um produto à fila
- **`processItem(item)`**: Processa um único item da fila
- **`processBatch(limit)`**: Processa um batch de itens
- **`getPendingItems(limit)`**: Busca itens pendentes para processamento
- **`disableProductSync(productId, reason)`**: Desabilita sincronização de um produto
- **`enableProductSync(productId)`**: Reativa sincronização de um produto
- **`forceRetryProduct(productId)`**: Força reprocessamento de um produto
- **`getProductSyncStatus(productId)`**: Obtém status completo de um produto
- **`getSyncStats()`**: Obtém estatísticas da fila
- **`getSyncLogs(options)`**: Obtém logs com filtros e paginação

### 3. API Endpoints

#### 3.1. `/api/gmc/sync`

- **GET**: Obtém estatísticas da fila de sincronização
- **POST**: Processa um batch de sincronização
  - Body: `{ batchSize?: number, force?: boolean }`
- **DELETE**: Limpa a fila de sincronização (protegido em produção)

#### 3.2. `/api/gmc/sync/:productId`

- **GET**: Obtém status de sincronização de um produto específico
- **POST**: Força reprocessamento de um produto
  - Body: `{ priority?: number }`
- **PUT**: Atualiza configurações de sincronização
  - Body: `{ action: 'ENABLE' | 'DISABLE', reason?: string }`
- **DELETE**: Desabilita sincronização de um produto

#### 3.3. `/api/gmc/sync/logs`

- **GET**: Obtém logs de sincronização com filtros
  - Query params: `productId`, `status`, `startDate`, `endDate`, `limit`, `offset`

### 4. Hook para Client-Side (`use-gmc-sync.ts`)

```typescript
const { 
  isLoading, 
  error, 
  isProcessing,
  getProductSyncStatus,
  forceRetryProduct,
  enableProductSync,
  disableProductSync,
  processBatch,
  getSyncStats,
  getSyncLogs,
  getSyncStatusLabel,
  getSyncStatusColor,
  clearError
} = useGmcSync();
```

### 5. Integração com APIs Existentes

#### 5.1. Criação de Produto (`POST /api/products`)

```typescript
// 1. Cria o produto no banco
INSERT INTO products (...) VALUES (..., 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)

// 2. Adiciona à fila de sincronização
 dernières: await gmcSyncService.enqueueProduct(id, 'CREATE')

// 3. Retorna resposta imediata ao usuário (sem esperar pelo GMC)
return NextResponse.json(product, { status: 201 })
```

#### 5.2. Atualização de Produto (`PUT /api/products/:id`)

```typescript
// 1. Atualiza o produto no banco
UPDATE products SET ..., updated_at = CURRENT_TIMESTAMP WHERE id = ?

// 2. Verifica se campos relevantes foram alterados
const gmcRelevantFields = ['name', 'description', 'price', 'image', 'department_id', 'category_id']
const hasGmcRelevantChanges = updates.some(update => 
  gmcRelevantFields.some(field => update.includes(field))
)

// 3. Se campos relevantes, adiciona à fila
if (hasGmcRelevantChanges) {
  await gmcSyncService.enqueueProduct(id, 'UPDATE')
}

// 4. Retorna resposta imediata
return NextResponse.json(product)
```

#### 5.3. Exclusão de Produto (`DELETE /api/products/:id`)

```typescript
// 1. Adiciona à fila para exclusão no GMC
await gmcSyncService.enqueueProduct(id, 'DELETE')

// 2. Processa imediatamente (para garantir exclusão antes de remover do banco)
await gmcSyncService.processBatch(1)

// 3. Remove do banco local
DELETE FROM products WHERE id = ?

// 4. Retorna resposta imediata
return NextResponse.json({ success: true })
```

### 6. Inicialização e Processamento Automático

#### 6.1. Inicialização (`init-gmc-sync.ts`)

- Chamado no middleware da aplicação
- Garante que tabelas estejam criadas
- Configura processamento periódico

#### 6.2. Processamento Automático

- **Em desenvolvimento**: `setInterval` a cada 1 minuto
- **Em produção**: `setInterval` a cada 5 minutos
- **Recomendado para produção**: Vercel Cron Jobs ou worker externo

### 7. Status de Sincronização

| Status      | Descrição                          | Ação Recomendada                     |
|-------------|------------------------------------|-------------------------------------|
| PENDING     | Aguardando processamento           | Aguardar ou forçar processamento    |
| PROCESSING  | Sendo processado no momento         | Aguardar conclusão                  |
| SYNCED      | Sincronizado com sucesso           | Nenhuma                             |
| ERROR       | Falha no processamento             | Verificar logs e retry ou desabilitar|
| DISABLED    | Sincronização desabilitada         | Reativar quando necessário          |

### 8. Estratégia de Retry

```typescript
// Configuração padrão
maxRetries: 5
retryIntervals: [1000, 5000, 30000, 300000, 900000] // 1s, 5s, 30s, 5m, 15m

// Lógica de retry
1. Tentativa 1: 1 segundo após a falha
2. Tentativa 2: 5 segundos após a falha
3. Tentativa 3: 30 segundos após a falha
4. Tentativa 4: 5 minutos após a falha
5. Tentativa 5: 15 minutos após a falha
6. Apósa 5 tentativas: Marca como ERROR definitivamente
```

### 9. Idempotência

- **Fila de sincronização**: Se um item já existir com status PENDING/PROCESSING, não adiciona duplicado
- **API do Google**: As operações são projetadas para serem idempotentes (mesmo ID = mesma operação)
- **Status do produto**: O status reflete o estado atual, não histórico

### 10. Observabilidade

#### 10.1. Logs
- Todos os eventos importantes são registrados em `gmc_sync_logs`
- Inclui: timestamp, productId, action, status, message, errorDetails
- Filtros disponíveis por: productId, status, data, etc.

#### 10.2. Métricas
- Estatísticas da fila: total, pending, processing, synced, error, disabled
- Média de tentativas de retry
- Histórico de processamento

#### 10.3. Monitoramento
- Endpoints de API para verificar status
- Hook React para integração com UI
- Logs no console para debug

### 11. Tratamento de Erros

#### 11.1. Erros Transientes
- Erros de rede ou timeout
- Rate limiting da API do Google
- Problemas temporários de conectividade
- **Solução**: Retry automático com intervalos progressivos

#### 11.2. Erros Permanentes
- Dados inválidos (validação da API do Google)
- Produto não encontrado
- Erros de autenticação/autorização
- **Solução**: Marca como ERROR com mensagem detalhada

#### 11.3. Limite de Tentativas
- Após 5 tentativas sem sucesso: marca como ERROR definitivamente
- Registra detalhes do erro para análise
- Permite intervenção manual (retry forçado ou correção de dados)

### 12. Segurança

- **API Endpoints**: Protegidos por autenticação existentes
- **Processamento**: Não bloqueia a API principal
- **Limite de Retry**: Evita loops infinitos
- **Timeout**: Evita processamento muito longo

### 13. Desempenho

- **Batch Processing**: Processa 10 itens por vez (configurável)
- **Sequencial**: Processa itens sequencialmente para evitar overload na API do Google
- **Índices**: Tabelas otimizadas com índices para queries rápidas
- **Cache**: Navegador cachea respostas quando apropriado

### 14. Extensibilidade

A arquitetura foi projetada para ser fácilmente extensível:

- **Novos campos de produto**: Adicionar ao tipo Product e às queries SQL
- **Novos status**: Adicionar ao enum GmcSyncStatus
- **Novas ações**: Adicionar ao tipo de ação e implementar handler correspondente
- **Nova API externa**: Substituir métodos de integração com Google por outra API
- **Processamento em lote**: Ajustar batchSize conforme necessário

### 15. Configuração para Produção

#### 15.1. Variáveis de Ambiente

```bash
# Configuração da API do Google Merchant Center
GMC_API_BASE_URL=https://shoppingcontent.googleapis.com/content/v2.1
GMC_API_AUTH_TOKEN=your_bearer_token
GMC_MERCHANT_ID=your_merchant_id

# Configuração do serviço (opcional)
GMC_SYNC_MAX_RETRIES=5
GMC_SYNC_BATCH_SIZE=10
GMC_SYNC_INTERVAL=300000  # 5 minutos
```

#### 15.2. Vercel Cron Jobs

Criar arquivo `vercel.json`:

```json
{
  "cronJobs": [
    {
      "path": "/api/gmc/sync",
      "schedule": "*/5 * * * *",  // A cada 5 minutos
      "method": "POST"
    }
  ]
}
```

#### 15.3. Worker Externo (Recomendado)

Para produção em larga escala, recomenda-se usar um worker externo:
- AWS Lambda
- Cloudflare Workers
- Serviço dedicado com Node.js

Exemplo de worker:

```typescript
import { gmcSyncService } from './lib/services/gmc-sync-service';

async function main() {
  await gmcSyncService.initialize();
  
  setInterval(async () => {
    await gmcSyncService.processBatch(20); // Processa 20 itens por vez
  }, 30000); // A cada 30 segundos
}

main().catch(console.error);
```

### 16. Testes

#### 16.1. Teste de Criação de Produto

```bash
# 1. Criar produto
curl -X POST /api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Product", "price": 99.99, "departmentId": "dept_1", "categoryId": "cat_1"}'

# 2. Verificar status de sincronização
curl /api/gmc/sync/<product_id>

# 3. Verificar estatísticas da fila
curl /api/gmc/sync

# 4. Processar batch manualmente
curl -X POST /api/gmc/sync \
  -H "Content-Type: application/json" \
  -d '{"batchSize": 1}'
```

#### 16.2. Teste de Atualização de Produto

```bash
# 1. Atualizar produto com campo relevante para GMC
curl -X PUT /api/products/<product_id> \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Product Name"}'

# 2. Verificar que foi adicionado à fila
curl /api/gmc/sync/<product_id>
```

#### 16.3. Teste de Retry

```bash
# 1. Forçar reprocessamento
curl -X POST /api/gmc/sync/<product_id> \
  -H "Content-Type: application/json" \
  -d '{"priority": 1}'

# 2. Verificar logs
curl /api/gmc/sync/logs?productId=<product_id>
```

### 17. Solução de Problemas

#### 17.1. Itens Presos na Fila

```bash
# Verificar itens com status PROCESSING por muito tempo
# Solução: Reinicar o serviço ou forçar reprocessamento
```

#### 17.2. Muitos Erros

```bash
# Verificar logs de erro
curl /api/gmc/sync/logs?status=ERROR

# Analisar mensagens de erro para identificar padrão
```

#### 17.3. Desempenho Lentos

```bash
# Aumentar batch size
curl -X POST /api/gmc/sync -d '{"batchSize": 20}'

# Ou diminuir intervalo de processamento
```

### 18. migrações

As migrações necessárias serão executadas automaticamente na primeira inicialização do serviço. Elas incluem:

1. Adição dos campos de sincronização à tabela `products`
2. Criação da tabela `gmc_sync_queue`
3. Criação da tabela `gmc_sync_logs`
4. Criação de índices para performance

### 19. Compatibilidade

- **Next.js 16**: Compatível com App Router
- **Turso/SQLite**: Banco de dados usado
- **TypeScript**: Tipagem completa
- **React 19**: Hooks compatíveis
- **Edge Runtime**: Funciona em ambiente edge (com ajustes)

### 20. Limitações e Considerações

1. **Serverless**: Em ambiente serverless (Vercel), `setInterval` pode não persistir entre requisições
2. **Cron Jobs**: Para produção, recomenda-se usar cron jobs externos
3. **API do Google**: A implementação atual simula a API do Google - precisa ser substituída pela integração real
4. **Autenticação**: O endpoint DELETE da fila é protegido, mas pode precisar de mais segurança em produção
5. **Rate Limiting**: A API do Google tem limites - considerar implementar rate limiting
6. **Timeout**: Operações longas podem precisar de ajustes no timeout

### 21. Próximos Passos

1. **Implementar integração real com a API do Google Merchant Center**
2. **Configurar autenticação adequada para endpoints sensíveis**
3. **Implementar rate limiting para chamadas à API do Google**
4. **Configurar cron jobs em produção**
5. **Adicionar dashboard de monitoramento**
6. **Implementar notificações de erro (email, webhook, etc.)**
7. **Testes automatizados para a fila de sincronização**

---

## Resumo da Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      Aplicação Next.js                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   API Routes │    │  Middleware  │    │   Pages      │  │
│  │  /api/products│    │   (init)     │    │   (admin)    │  │
│  └──────┬───────┘    └──────┬───────┘    └──────┬───────┘  │
│         │                  │                 │             │
│         ▼                  ▼                 ▼             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                 Serviço GMC Sync                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │ gmc-service │  │  Queue       │  │   Worker     │  │   │
│  │  │  - enqueue  │  │  - gmc_sync_ │  │   - process  │  │   │
│  │  │  - process  │  │    queue    │  │   - batch    │  │   │
│  │  │  - retry    │  │             │  │             │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                    │                           │
│                                    ▼                           │
│                     ┌──────────────────────┐                  │
│                     │      Banco de Dados   │                  │
│                     │  ┌────────────────┐  │                  │
│                     │  │    products     │  │                  │
│                     │  │    gmc_sync_    │  │                  │
│                     │  │    _queue       │  │                  │
│                     │  │    gmc_sync_    │  │                  │
│                     │  │    _logs       │  │                  │
│                     │  └────────────────┘  │                  │
│                     └──────────────────────┘                  │
└─────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
                          ┌──────────────────────┐
                          │   Google Merchant     │
                          │   Center API          │
                          └──────────────────────┘
```

---

**Status**: ✅ Implementação Completa
**Versão**: 1.0
**Data**: 2025-07-02
**Arquitetura**: Assíncrona, Rastreável, Resiliente, Observável, Extensível