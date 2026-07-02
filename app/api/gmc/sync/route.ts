/**
 * API Route para processamento da fila de sincronização com Google Merchant Center
 *
 * Este endpoint pode ser chamado:
 * - Manualmente via HTTP POST
 * - Automaticamente via cron job / scheduler
 * - Por um worker em background
 *
 * O endpoint processa um batch de itens da fila de sincronização GMC
 * e retorna o resultado do processamento.
 */

import { NextResponse } from "next/server";
import { gmcSyncService, processGmcSyncBatch } from "@/lib/services/gmc-sync-service";

/**
 * POST /api/gmc/sync
 * Processa um batch de sincronização
 *
 * Body opcional:
 * - batchSize: número de itens a processar (padrão: 10)
 * - force: boolean para forçar processamento mesmo se já estiver em andamento
 */
export async function POST(req: Request) {
  try {
    const { batchSize, force } = await req.json().catch(() => ({}));

    const size = batchSize || 10;

    // Se não for forçado e já estiver processando, retorna status
    if (!force && gmcSyncService['isProcessing']) {
      return NextResponse.json({
        success: false,
        error: "Processamento já em andamento",
        isProcessing: true,
      }, { status: 429 });
    }

    console.log(`🚀 Iniciando processamento do batch GMC (tamanho: ${size})`);

    const result = await gmcSyncService.processBatch(size);

    return NextResponse.json({
      success: true,
      processed: result.processed,
      succeeded: result.succeeded,
      failed: result.failed,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("❌ Erro no endpoint de sincronização GMC:", error);

    return NextResponse.json({
      success: false,
      error: error?.message || "Erro interno ao processar sincronização GMC",
      details: error?.stack || String(error),
    }, { status: 500 });
  }
}

/**
 * GET /api/gmc/sync
 * Retorna o status atual da fila de sincronização
 */
export async function GET() {
  try {
    const stats = await gmcSyncService.getSyncStats();
    const isProcessing = gmcSyncService['isProcessing'];

    return NextResponse.json({
      success: true,
      stats,
      isProcessing,
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error("❌ Erro ao buscar status da sincronização GMC:", error);

    return NextResponse.json({
      success: false,
      error: error?.message || "Erro interno ao buscar status",
    }, { status: 500 });
  }
}

/**
 * DELETE /api/gmc/sync
 * Limpa a fila de sincronização (para uso em desenvolvimento ou reset)
 *
 * ⚠️ Ação perigosa - deve ser protegida em produção
 */
export async function DELETE(req: Request) {
  try {
    // Verificar autorização (em produção, deve ter autenticação)
    const authHeader = req.headers.get('authorization');
    if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json({
        success: false,
        error: "Não autorizado",
      }, { status: 401 });
    }

    // Limpa a fila
    await gmcSyncService['turso'].execute({
      sql: "DELETE FROM gmc_sync_queue",
    });

    // Reseta status dos produtos
    await gmcSyncService['turso'].execute({
      sql: `UPDATE products SET
             gmc_sync_status = 'PENDING',
             gmc_error = NULL,
             retry_count = 0,
             last_retry = NULL,
             updated_at = CURRENT_TIMESTAMP
             WHERE gmc_sync_status IN ('PROCESSING', 'ERROR')`,
    });

    console.log("🧹 Fila de sincronização GMC limpa");

    return NextResponse.json({
      success: true,
      message: "Fila de sincronização limpa com sucesso",
    });

  } catch (error: any) {
    console.error("❌ Erro ao limpar fila GMC:", error);

    return NextResponse.json({
      success: false,
      error: error?.message || "Erro interno ao limpar fila",
    }, { status: 500 });
  }
}
