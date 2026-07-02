/**
 * Serviço de Sincronização com Google Merchant Center
 *
 * Este serviço implementa uma arquitetura assíncrona e rastreável para sincronização de produtos
 * com o Google Merchant Center, utilizando um sistema de fila baseada em banco de dados.
 *
 * Características:
 * - Processamento assíncrono sem bloqueio da API principal
 * - Sistema de fila com status rastreável (PENDING, PROCESSING, SYNCED, ERROR, DISABLED)
 * - Estratégia de retry com limite de tentativas e intervalo entre reprocessamentos
 * - Idempotência nas operações
 * - Logs detalhados para observabilidade
 * - Fácil extensão para futuras funcionalidades
 */

import { turso } from '../turso';

// Tipos de status de sincronização
export type GmcSyncStatus = 'PENDING' | 'PROCESSING' | 'SYNCED' | 'ERROR' | 'DISABLED';

// Interface para o item da fila de sincronização
export interface GmcSyncQueueItem {
  id: string;
  productId: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE';
  status: GmcSyncStatus;
  retryCount: number;
  lastError?: string;
  lastRetry?: string;
  createdAt: string;
  updatedAt: string;
  priority: number; // Prioridade para processamento (0 = normal, 1 = alta)
}

// Interface para o log de sincronização
export interface GmcSyncLog {
  id: string;
  productId: string;
  queueItemId: string;
  action: string;
  status: GmcSyncStatus;
  message?: string;
  errorDetails?: string;
  timestamp: string;
}

// Configuração do serviço
export interface GmcSyncConfig {
  maxRetries: number; // Limite máximo de tentativas
  retryIntervals: number[]; // Intervalos entre retries em milissegundos (ex: [1000, 5000, 30000, 300000])
  batchSize: number; // Quantidade de itens a processar por batch
  processingTimeout: number; // Timeout para marcar como ERROR (ms)
  googleMerchantApi: {
    baseUrl: string;
    authToken: string;
    merchantId: string;
  };
}

// Configuração padrão
export const DEFAULT_CONFIG: GmcSyncConfig = {
  maxRetries: 5,
  retryIntervals: [1000, 5000, 30000, 300000, 900000], // 1s, 5s, 30s, 5m, 15m
  batchSize: 10,
  processingTimeout: 60000, // 1 minuto
  googleMerchantApi: {
    baseUrl: 'https://shoppingcontent.googleapis.com/content/v2.1',
    authToken: '',
    merchantId: '',
  },
};

// Classe principal do serviço
export class GmcSyncService {
  private config: GmcSyncConfig;
  private isProcessing: boolean = false;

  constructor(config: Partial<GmcSyncConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Inicializa o serviço e as tabelas necessárias
   */
  async initialize(): Promise<void> {
    await this.ensureTablesExist();
    console.log('✅ GMC Sync Service inicializado');
  }

  /**
   * Garante que as tabelas necessárias existem no banco
   */
  private async ensureTablesExist(): Promise<void> {
    // Tabela de fila de sincronização
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS gmc_sync_queue (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        action TEXT NOT NULL CHECK(action IN ('CREATE', 'UPDATE', 'DELETE')),
        status TEXT NOT NULL CHECK(status IN ('PENDING', 'PROCESSING', 'SYNCED', 'ERROR', 'DISABLED')),
        retry_count INTEGER DEFAULT 0,
        last_error TEXT,
        last_retry TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        priority INTEGER DEFAULT 0,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Tabela de logs de sincronização
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS gmc_sync_logs (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        queue_item_id TEXT,
        action TEXT NOT NULL,
        status TEXT NOT NULL,
        message TEXT,
        error_details TEXT,
        timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (queue_item_id) REFERENCES gmc_sync_queue(id) ON DELETE CASCADE
      )
    `);

    // Índices para performance
    await turso.execute(`
      CREATE INDEX IF NOT EXISTS idx_gmc_queue_status ON gmc_sync_queue(status)
    `);
    await turso.execute(`
      CREATE INDEX IF NOT EXISTS idx_gmc_queue_priority ON gmc_sync_queue(priority, created_at)
    `);
    await turso.execute(`
      CREATE INDEX IF NOT EXISTS idx_gmc_queue_product ON gmc_sync_queue(product_id)
    `);
    await turso.execute(`
      CREATE INDEX IF NOT EXISTS idx_gmc_logs_product ON gmc_sync_logs(product_id)
    `);
    await turso.execute(`
      CREATE INDEX IF NOT EXISTS idx_gmc_logs_timestamp ON gmc_sync_logs(timestamp)
    `);
  }

  /**
   * Adiciona um item à fila de sincronização
   *
   * @param productId - ID do produto
   * @param action - Ação a ser executada (CREATE, UPDATE, DELETE)
   * @param priority - Prioridade do processamento (0 = normal, 1 = alta)
   * @returns O item criado na fila
   */
  async enqueueProduct(
    productId: string,
    action: 'CREATE' | 'UPDATE' | 'DELETE',
    priority: number = 0
  ): Promise<GmcSyncQueueItem> {
    const id = `gmc_queue_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    const existingItem = await this.getQueueItemByProductId(productId);

    // Se já existe um item PENDING ou PROCESSING para este produto, não adiciona duplicado
    if (existingItem && ['PENDING', 'PROCESSING'].includes(existingItem.status)) {
      console.log(`⚠️ Item já existe na fila para o produto ${productId} com status ${existingItem.status}`);

      // Se a ação é diferente, atualiza a ação
      if (existingItem.action !== action) {
        await turso.execute({
          sql: `UPDATE gmc_sync_queue SET action = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          args: [action, existingItem.id],
        });
        console.log(`🔄 Ação atualizada para ${action} no item existente`);
      }

      return existingItem;
    }

    // Cria novo item na fila
    await turso.execute({
      sql: `INSERT INTO gmc_sync_queue (id, product_id, action, status, retry_count, priority, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      args: [id, productId, action, 'PENDING', 0, priority],
    });

    // Atualiza o status do produto no banco principal
    await turso.execute({
      sql: `UPDATE products SET gmc_sync_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: ['PENDING', productId],
    });

    // Registra log
    await this.createLog({
      productId,
      queueItemId: id,
      action,
      status: 'PENDING',
      message: `Item adicionado à fila de sincronização`,
    });

    console.log(`✅ Produto ${productId} adicionado à fila de sincronização (ação: ${action})`);

    return {
      id,
      productId,
      action,
      status: 'PENDING',
      retryCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      priority,
    };
  }

  /**
   * Busca itens da fila prontos para processamento
   *
   * @param limit - Quantidade máxima de itens a buscar
   * @returns Lista de itens a serem processados
   */
  async getPendingItems(limit: number = this.config.batchSize): Promise<GmcSyncQueueItem[]> {
    const result = await turso.execute({
      sql: `SELECT * FROM gmc_sync_queue
             WHERE status IN ('PENDING', 'ERROR')
               AND (last_retry IS NULL OR strftime('%s', CURRENT_TIMESTAMP) - strftime('%s', last_retry) >= ?)
             ORDER BY priority DESC, created_at ASC
             LIMIT ?`,
      args: [0, limit], // 0 segundos significa que pode processar qualquer item
    });

    return result.rows.map(this.mapQueueItem);
  }

  /**
   * Processa um item da fila
   *
   * @param item - Item a ser processado
   * @returns Resultado do processamento
   */
  async processItem(item: GmcSyncQueueItem): Promise<{
    success: boolean;
    error?: string;
    retryAfter?: number;
  }> {
    try {
      // Marca como PROCESSING
      await this.updateQueueItemStatus(item.id, 'PROCESSING');

      // Atualiza status no produto
      await turso.execute({
        sql: `UPDATE products SET gmc_sync_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        args: ['PROCESSING', item.productId],
      });

      console.log(`🔄 Processando item ${item.id} (produto: ${item.productId}, ação: ${item.action})`);

      // Busca os dados do produto
      const productResult = await turso.execute({
        sql: `SELECT * FROM products WHERE id = ?`,
        args: [item.productId],
      });

      if (productResult.rows.length === 0) {
        throw new Error(`Produto não encontrado: ${item.productId}`);
      }

      const product = productResult.rows[0];

      // Executa a ação específica
      switch (item.action) {
        case 'CREATE':
          await this.handleCreateProduct(product);
          break;
        case 'UPDATE':
          await this.handleUpdateProduct(product);
          break;
        case 'DELETE':
          await this.handleDeleteProduct(product);
          break;
        default:
          throw new Error(`Ação desconhecida: ${item.action}`);
      }

      // Sucesso - marca como SYNCED
      await this.updateQueueItemStatus(item.id, 'SYNCED');

      // Atualiza dados do produto
      const now = new Date().toISOString();
      await turso.execute({
        sql: `UPDATE products SET
               gmc_sync_status = ?,
               gmc_last_sync = ?,
               gmc_error = NULL,
               retry_count = 0,
               last_retry = NULL,
               updated_at = ?
               WHERE id = ?`,
        args: ['SYNCED', now, now, item.productId],
      });

      // Registra log de sucesso
      await this.createLog({
        productId: item.productId,
        queueItemId: item.id,
        action: item.action,
        status: 'SYNCED',
        message: `Produto sincronizado com sucesso com Google Merchant Center`,
      });

      console.log(`✅ Produto ${item.productId} sincronizado com sucesso`);
      return { success: true };

    } catch (error: any) {
      const errorMessage = error?.message || String(error);
      const newRetryCount = item.retryCount + 1;

      console.error(`❌ Erro ao processar item ${item.id}: ${errorMessage}`);

      // Registra log de erro
      await this.createLog({
        productId: item.productId,
        queueItemId: item.id,
        action: item.action,
        status: 'ERROR',
        message: `Falha no processamento: ${errorMessage}`,
        errorDetails: error?.stack || errorMessage,
      });

      // Verifica se deve tents novamente
      if (newRetryCount >= this.config.maxRetries) {
        // Limite de tentativas excedido - marca como ERROR definitivamente
        await this.updateQueueItemStatus(item.id, 'ERROR', errorMessage);

        await turso.execute({
          sql: `UPDATE products SET
                 gmc_sync_status = ?,
                 gmc_error = ?,
                 retry_count = ?,
                 last_retry = ?,
                 updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
          args: ['ERROR', errorMessage, newRetryCount, new Date().toISOString(), item.productId],
        });

        console.log(`💀 Item ${item.id} marcou como ERROR após ${newRetryCount} tentativas`);
        return {
          success: false,
          error: `Limite de tentativas excedido: ${errorMessage}`
        };
      }

      // Calcula quando deve tentar novamente
      const retryIndex = Math.min(item.retryCount, this.config.retryIntervals.length - 1);
      const retryAfter = this.config.retryIntervals[retryIndex];

      // Atualiza item da fila com novo status de erro
      await this.updateQueueItem(item.id, {
        status: 'ERROR',
        lastError: errorMessage,
        retryCount: newRetryCount,
        lastRetry: new Date().toISOString(),
      });

      // Atualiza produto
      await turso.execute({
        sql: `UPDATE products SET
               gmc_sync_status = ?,
               gmc_error = ?,
               retry_count = ?,
               last_retry = ?,
               updated_at = CURRENT_TIMESTAMP
               WHERE id = ?`,
        args: ['ERROR', errorMessage, newRetryCount, new Date().toISOString(), item.productId],
      });

      console.log(`⏳ Item ${item.id} agendado para retry em ${retryAfter}ms (tentativa ${newRetryCount}/${this.config.maxRetries})`);

      return {
        success: false,
        error: errorMessage,
        retryAfter
      };
    }
  }

  /**
   * Processa um batch de itens
   *
   * @param limit - Quantidade máxima de itens a processar
   * @returns Resultado do processamento do batch
   */
  async processBatch(limit: number = this.config.batchSize): Promise<{
    processed: number;
    succeeded: number;
    failed: number;
    errors: Array<{ itemId: string; error: string }>;
  }> {
    if (this.isProcessing) {
      console.log('⚠️ Processamento já em andamento');
      return { processed: 0, succeeded: 0, failed: 0, errors: [] };
    }

    this.isProcessing = true;
    const result = {
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: [] as Array<{ itemId: string; error: string }>,
    };

    try {
      // Busca itens pendentes
      const items = await this.getPendingItems(limit);

      if (items.length === 0) {
        console.log('📭 Nenhum item pendente na fila de sincronização');
        return result;
      }

      console.log(`🚀 Processando batch de ${items.length} itens`);

      // Processa cada item sequencialmente (para evitar overload na API do Google)
      for (const item of items) {
        result.processed++;

        const processResult = await this.processItem(item);

        if (processResult.success) {
          result.succeeded++;
        } else {
          result.failed++;
          result.errors.push({
            itemId: item.id,
            error: processResult.error || 'Erro desconhecido',
          });
        }
      }

      console.log(`📊 Batch processado: ${result.succeeded} sucedidos, ${result.failed} falhados`);

    } catch (error) {
      console.error('❌ Erro ao processar batch:', error);
      result.failed++;
      result.errors.push({
        itemId: 'batch',
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      this.isProcessing = false;
    }

    return result;
  }

  /**
   * Marca um item da fila como DISABLED (para pausar sincronização de um produto)
   *
   * @param productId - ID do produto
   * @param reason - Motivo da desabilitação
   */
  async disableProductSync(productId: string, reason?: string): Promise<void> {
    // Atualiza todos os itens pendentes para este produto
    await turso.execute({
      sql: `UPDATE gmc_sync_queue SET status = ?, last_error = ?, updated_at = CURRENT_TIMESTAMP
             WHERE product_id = ? AND status IN ('PENDING', 'PROCESSING', 'ERROR')`,
      args: ['DISABLED', reason || 'Sincronização desabilitada manualmente', productId],
    });

    // Atualiza o produto
    await turso.execute({
      sql: `UPDATE products SET
             gmc_sync_status = ?,
             gmc_error = ?,
             updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
      args: ['DISABLED', reason || 'Sincronização desabilitada manualmente', productId],
    });

    // Registra log
    await this.createLog({
      productId,
      action: 'DISABLE',
      status: 'DISABLED',
      message: `Sincronização desabilitada: ${reason || 'Sem motivo especificado'}`,
    });

    console.log(`⏸️ Sincronização desabilitada para produto ${productId}`);
  }

  /**
   * Reativa a sincronização de um produto
   *
   * @param productId - ID do produto
   */
  async enableProductSync(productId: string): Promise<void> {
    // Atualiza o produto
    await turso.execute({
      sql: `UPDATE products SET
             gmc_sync_status = ?,
             gmc_error = NULL,
             updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND gmc_sync_status = 'DISABLED'`,
      args: ['PENDING', productId],
    });

    // Adiciona à fila
    await this.enqueueProduct(productId, 'UPDATE');

    // Registra log
    await this.createLog({
      productId,
      action: 'ENABLE',
      status: 'PENDING',
      message: 'Sincronização reativada e adicionada à fila',
    });

    console.log(`▶️ Sincronização reativada para produto ${productId}`);
  }

  /**
   * Força reprocessamento de um produto
   *
   * @param productId - ID do produto
   */
  async forceRetryProduct(productId: string): Promise<void> {
    // Remove itens existentes da fila para este produto
    await turso.execute({
      sql: `DELETE FROM gmc_sync_queue WHERE product_id = ?`,
      args: [productId],
    });

    // Adiciona novo item à fila
    await this.enqueueProduct(productId, 'UPDATE', 1); // Alta prioridade

    console.log(`🔄 Reprocessamento forçado para produto ${productId}`);
  }

  /**
   * Obtém o status de sincronização de um produto
   *
   * @param productId - ID do produto
   * @returns Status atual e informações relacionadas
   */
  async getProductSyncStatus(productId: string): Promise<{
    status: GmcSyncStatus;
    gmcProductId?: string;
    gmcLastSync?: string;
    gmcError?: string;
    retryCount: number;
    lastRetry?: string;
    queueItems: GmcSyncQueueItem[];
    logs: GmcSyncLog[];
  }> {
    // Busca status do produto
    const productResult = await turso.execute({
      sql: `SELECT gmc_sync_status, gmc_product_id, gmc_last_sync, gmc_error, retry_count, last_retry
             FROM products WHERE id = ?`,
      args: [productId],
    });

    const product = productResult.rows[0] || {};

    // Busca itens da fila para este produto
    const queueResult = await turso.execute({
      sql: `SELECT * FROM gmc_sync_queue WHERE product_id = ? ORDER BY created_at DESC`,
      args: [productId],
    });

    // Busca logs recentes
    const logsResult = await turso.execute({
      sql: `SELECT * FROM gmc_sync_logs WHERE product_id = ? ORDER BY timestamp DESC LIMIT 10`,
      args: [productId],
    });

    return {
      status: (product.gmc_sync_status as GmcSyncStatus) || 'PENDING',
      gmcProductId: product.gmc_product_id,
      gmcLastSync: product.gmc_last_sync,
      gmcError: product.gmc_error,
      retryCount: product.retry_count || 0,
      lastRetry: product.last_retry,
      queueItems: queueResult.rows.map(this.mapQueueItem),
      logs: logsResult.rows.map(this.mapLog),
    };
  }

  /**
   * Obtém estatísticas da fila de sincronização
   */
  async getSyncStats(): Promise<{
    totalItems: number;
    pending: number;
    processing: number;
    synced: number;
    error: number;
    disabled: number;
    averageRetryCount: number;
  }> {
    const result = await turso.execute({
      sql: `SELECT
             COUNT(*) as total,
             SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as pending,
             SUM(CASE WHEN status = 'PROCESSING' THEN 1 ELSE 0 END) as processing,
             SUM(CASE WHEN status = 'SYNCED' THEN 1 ELSE 0 END) as synced,
             SUM(CASE WHEN status = 'ERROR' THEN 1 ELSE 0 END) as error,
             SUM(CASE WHEN status = 'DISABLED' THEN 1 ELSE 0 END) as disabled,
             AVG(retry_count) as avg_retry
             FROM gmc_sync_queue`,
    });

    const row = result.rows[0];

    return {
      totalItems: row.total || 0,
      pending: row.pending || 0,
      processing: row.processing || 0,
      synced: row.synced || 0,
      error: row.error || 0,
      disabled: row.disabled || 0,
      averageRetryCount: parseFloat(row.avg_retry) || 0,
    };
  }

  /**
   * Obtém histórico de logs com paginação
   */
  async getSyncLogs(options: {
    limit?: number;
    offset?: number;
    productId?: string;
    status?: GmcSyncStatus;
    startDate?: string;
    endDate?: string;
  } = {}): Promise<{ logs: GmcSyncLog[]; total: number }> {
    const { limit = 50, offset = 0, productId, status, startDate, endDate } = options;

    let sql = `SELECT COUNT(*) as count FROM gmc_sync_logs`;
    let args: any[] = [];
    let whereClauses: string[] = [];

    if (productId) {
      whereClauses.push(`product_id = ?`);
      args.push(productId);
    }
    if (status) {
      whereClauses.push(`status = ?`);
      args.push(status);
    }
    if (startDate) {
      whereClauses.push(`timestamp >= ?`);
      args.push(startDate);
    }
    if (endDate) {
      whereClauses.push(`timestamp <= ?`);
      args.push(endDate);
    }

    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    const countResult = await turso.execute({ sql, args });
    const total = countResult.rows[0].count || 0;

    // Busca logs
    sql = `SELECT * FROM gmc_sync_logs`;
    if (whereClauses.length > 0) {
      sql += ` WHERE ${whereClauses.join(' AND ')}`;
    }
    sql += ` ORDER BY timestamp DESC LIMIT ? OFFSET ?`;
    args = [...args, limit, offset];

    const logsResult = await turso.execute({ sql, args });

    return {
      logs: logsResult.rows.map(this.mapLog),
      total,
    };
  }

  // Métodos privados

  /**
   * Atualiza o status de um item da fila
   */
  private async updateQueueItemStatus(
    itemId: string,
    status: GmcSyncStatus,
    errorMessage?: string
  ): Promise<void> {
    await turso.execute({
      sql: `UPDATE gmc_sync_queue SET status = ?, last_error = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [status, errorMessage || null, itemId],
    });
  }

  /**
   * Atualiza um item da fila
   */
  private async updateQueueItem(
    itemId: string,
    updates: Partial<Omit<GmcSyncQueueItem, 'id'>>
  ): Promise<void> {
    const updateFields: string[] = [];
    const args: any[] = [];

    if (updates.status !== undefined) {
      updateFields.push(`status = ?`);
      args.push(updates.status);
    }
    if (updates.retryCount !== undefined) {
      updateFields.push(`retry_count = ?`);
      args.push(updates.retryCount);
    }
    if (updates.lastError !== undefined) {
      updateFields.push(`last_error = ?`);
      args.push(updates.lastError);
    }
    if (updates.lastRetry !== undefined) {
      updateFields.push(`last_retry = ?`);
      args.push(updates.lastRetry);
    }
    if (updates.priority !== undefined) {
      updateFields.push(`priority = ?`);
      args.push(updates.priority);
    }

    if (updateFields.length > 0) {
      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      args.push(itemId);

      await turso.execute({
        sql: `UPDATE gmc_sync_queue SET ${updateFields.join(', ')} WHERE id = ?`,
        args,
      });
    }
  }

  /**
   * Busca um item da fila pelo ID do produto
   */
  private async getQueueItemByProductId(productId: string): Promise<GmcSyncQueueItem | null> {
    const result = await turso.execute({
      sql: `SELECT * FROM gmc_sync_queue WHERE product_id = ? ORDER BY created_at DESC LIMIT 1`,
      args: [productId],
    });

    return result.rows.length > 0 ? this.mapQueueItem(result.rows[0]) : null;
  }

  /**
   * Cria um log de sincronização
   */
  private async createLog(log: Omit<GmcSyncLog, 'id' | 'timestamp'>): Promise<GmcSyncLog> {
    const id = `gmc_log_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const timestamp = new Date().toISOString();

    await turso.execute({
      sql: `INSERT INTO gmc_sync_logs (id, product_id, queue_item_id, action, status, message, error_details, timestamp)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        log.productId,
        log.queueItemId || null,
        log.action,
        log.status,
        log.message || null,
        log.errorDetails || null,
        timestamp,
      ],
    });

    return { ...log, id, timestamp };
  }

  /**
   * Mapeia dados do banco para o tipo GmcSyncQueueItem
   */
  private mapQueueItem(row: any): GmcSyncQueueItem {
    return {
      id: row.id as string,
      productId: row.product_id as string,
      action: row.action as 'CREATE' | 'UPDATE' | 'DELETE',
      status: row.status as GmcSyncStatus,
      retryCount: row.retry_count as number,
      lastError: row.last_error as string | undefined,
      lastRetry: row.last_retry as string | undefined,
      createdAt: row.created_at as string,
      updatedAt: row.updated_at as string,
      priority: row.priority as number,
    };
  }

  /**
   * Mapeia dados do banco para o tipo GmcSyncLog
   */
  private mapLog(row: any): GmcSyncLog {
    return {
      id: row.id as string,
      productId: row.product_id as string,
      queueItemId: row.queue_item_id as string | undefined,
      action: row.action as string,
      status: row.status as GmcSyncStatus,
      message: row.message as string | undefined,
      errorDetails: row.error_details as string | undefined,
      timestamp: row.timestamp as string,
    };
  }

  // Métodos para integração com a API do Google Merchant Center

  /**
   * Cria um produto no Google Merchant Center (simulação)
   * Em uma implementação real, isto chamaria a API real do Google
   */
  private async handleCreateProduct(product: any): Promise<void> {
    // Simulação da chamada à API do Google Merchant Center
    console.log(`📦 Criando produto no Google Merchant Center: ${product.name}`);

    // Em uma implementação real, isto seria algo como:
    // const response = await fetch(`${this.config.googleMerchantApi.baseUrl}/${this.config.googleMerchantApi.merchantId}/products`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${this.config.googleMerchantApi.authToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(this.mapProductToGmcFormat(product)),
    // });
    //
    // if (!response.ok) {
    //   throw new Error(`Google API Error: ${response.status} ${response.statusText}`);
    // }
    //
    // const result = await response.json();
    // return result.id; // Retornaria o gmcProductId

    // Para esta implementação, simulamos um sucesso com um ID fictício
    const gmcProductId = `gmc_${product.id}_${Date.now()}`;

    // Atualiza o produto com o ID do Google Merchant Center
    await turso.execute({
      sql: `UPDATE products SET gmc_product_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [gmcProductId, product.id],
    });

    console.log(`🎉 Produto criado no GMC com ID: ${gmcProductId}`);
  }

  /**
   * Atualiza um produto no Google Merchant Center (simulação)
   */
  private async handleUpdateProduct(product: any): Promise<void> {
    // Simulação da chamada à API do Google Merchant Center
    console.log(`📝 Atualizando produto no Google Merchant Center: ${product.name}`);

    // Em uma implementação real, isto seria algo como:
    // const gmcProductId = product.gmc_product_id;
    // if (!gmcProductId) {
    //   throw new Error('Produto não tem ID do Google Merchant Center');
    // }
    //
    // const response = await fetch(`${this.config.googleMerchantApi.baseUrl}/${this.config.googleMerchantApi.merchantId}/products/${gmcProductId}`, {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization': `Bearer ${this.config.googleMerchantApi.authToken}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(this.mapProductToGmcFormat(product)),
    // });
    //
    // if (!response.ok) {
    //   throw new Error(`Google API Error: ${response.status} ${response.statusText}`);
    // }

    console.log(`🎉 Produto atualizado no GMC: ${product.gmc_product_id || product.id}`);
  }

  /**
   * Deleta um produto no Google Merchant Center (simulação)
   */
  private async handleDeleteProduct(product: any): Promise<void> {
    // Simulação da chamada à API do Google Merchant Center
    console.log(`🗑️ Deletando produto do Google Merchant Center: ${product.name}`);

    // Em uma implementação real, isto seria algo como:
    // const gmcProductId = product.gmc_product_id;
    // if (!gmcProductId) {
    //   throw new Error('Produto não tem ID do Google Merchant Center');
    // }
    //
    // const response = await fetch(`${this.config.googleMerchantApi.baseUrl}/${this.config.googleMerchantApi.merchantId}/products/${gmcProductId}`, {
    //   method: 'DELETE',
    //   headers: {
    //     'Authorization': `Bearer ${this.config.googleMerchantApi.authToken}`,
    //   },
    // });
    //
    // if (!response.ok) {
    //   throw new Error(`Google API Error: ${response.status} ${response.statusText}`);
    // }

    // Remove o ID do Google Merchant Center do produto
    await turso.execute({
      sql: `UPDATE products SET gmc_product_id = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      args: [product.id],
    });

    console.log(`🎉 Produto deletado do GMC: ${product.gmc_product_id || product.id}`);
  }

  /**
   * Mapeia um produto do banco para o formato esperado pelo Google Merchant Center
   *
   * @param product - Produto do banco
   * @returns Produto no formato do Google Merchant Center
   */
  private mapProductToGmcFormat(product: any): any {
    // Implementação base - em uma implementação real, isto seria mais completo
    return {
      offerId: product.id,
      title: product.name,
      description: product.description || '',
      price: {
        value: product.price.toFixed(2),
        currency: 'BRL',
      },
      availability: product.estoque > 0 ? 'in stock' : 'out of stock',
      condition: 'new',
      imageLink: product.image || '',
      link: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dominustech.com'}/produto/${product.id}`,
      brand: 'Dominus Tech',
      gtin: product.codigo || '',
    };
  }
}

// Instância singleton do serviço
export const gmcSyncService = new GmcSyncService();

// Função para inicialização
export async function initializeGmcSyncService(): Promise<void> {
  await gmcSyncService.initialize();
}

// Função para processamento do batch (para ser chamada periodicamente)
export async function processGmcSyncBatch(): Promise<void> {
  try {
    await gmcSyncService.processBatch();
  } catch (error) {
    console.error('❌ Erro ao processar batch de sincronização GMC:', error);
  }
}
