/**
 * API Route para gerenciamento individual de sincronização GMC por produto
 *
 * Endpoints para:
 * - GET: Obter status de sincronização de um produto
 * - POST: Forçar reprocessamento de um produto
 * - PUT: Atualizar configurações de sincronização
 * - DELETE: Desabilitar sincronização de um produto
 */

import { NextResponse } from "next/server";
import { gmcSyncService } from "@/lib/services/gmc-sync-service";

/**
 * GET /api/gmc/sync/:productId
 * Obtém o status de sincronização de um produto específico
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: "ID do produto é obrigatório",
      }, { status: 400 });
    }

    const status = await gmcSyncService.getProductSyncStatus(productId);

    return NextResponse.json({
      success: true,
      productId,
      ...status,
    });

  } catch (error: any) {
    console.error(`❌ Erro ao buscar status GMC para produto ${(await params).productId}:`, error);

    return NextResponse.json({
      success: false,
      error: error?.message || "Erro interno ao buscar status do produto",
    }, { status: 500 });
  }
}

/**
 * POST /api/gmc/sync/:productId
 * Força reprocessamento de um produto específico
 *
 * Body opcional:
 * - priority: prioridade do reprocessamento (0 = normal, 1 = alta)
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const { priority = 1 } = await req.json().catch(() => ({}));

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: "ID do produto é obrigatório",
      }, { status: 400 });
    }

    await gmcSyncService.forceRetryProduct(productId);

    // Processa imediatamente se solicitado
    if (priority === 1) {
      await gmcSyncService.processBatch(1); // Processa apenas este item
    }

    const status = await gmcSyncService.getProductSyncStatus(productId);

    return NextResponse.json({
      success: true,
      message: "Reprocessamento forçado iniciado",
      productId,
      status,
    });

  } catch (error: any) {
    console.error(`❌ Erro ao forçar reprocessamento GMC para produto ${(await params).productId}:`, error);

    return NextResponse.json({
      success: false,
      error: error?.message || "Erro interno ao forçar reprocessamento",
    }, { status: 500 });
  }
}

/**
 * PUT /api/gmc/sync/:productId
 * Atualiza configurações de sincronização de um produto
 *
 * Body:
 * - action: 'ENABLE' | 'DISABLE'
 * - reason: motivo (opcional, para DISABLE)
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const { action, reason } = await req.json();

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: "ID do produto é obrigatório",
      }, { status: 400 });
    }

    if (!action) {
      return NextResponse.json({
        success: false,
        error: "Ação é obrigatória (ENABLE ou DISABLE)",
      }, { status: 400 });
    }

    switch (action.toUpperCase()) {
      case 'ENABLE':
        await gmcSyncService.enableProductSync(productId);
        break;
      case 'DISABLE':
        await gmcSyncService.disableProductSync(productId, reason);
        break;
      default:
        return NextResponse.json({
          success: false,
          error: "Ação inválida. Use ENABLE ou DISABLE",
        }, { status: 400 });
    }

    const status = await gmcSyncService.getProductSyncStatus(productId);

    return NextResponse.json({
      success: true,
      message: `Sincronização ${action.toLowerCase()}d com sucesso`,
      productId,
      status,
    });

  } catch (error: any) {
    console.error(`❌ Erro ao atualizar sincronização GMC para produto ${(await params).productId}:`, error);

    return NextResponse.json({
      success: false,
      error: error?.message || "Erro interno ao atualizar sincronização",
    }, { status: 500 });
  }
}

/**
 * DELETE /api/gmc/sync/:productId
 * Remove um produto da fila de sincronização e marca como DISABLED
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const { reason } = await req.json().catch(() => ({}));

    if (!productId) {
      return NextResponse.json({
        success: false,
        error: "ID do produto é obrigatório",
      }, { status: 400 });
    }

    await gmcSyncService.disableProductSync(productId, reason || "Removido manualmente");

    const status = await gmcSyncService.getProductSyncStatus(productId);

    return NextResponse.json({
      success: true,
      message: "Sincronização desabilitada para o produto",
      productId,
      status,
    });

  } catch (error: any) {
    console.error(`❌ Erro ao desabilitar sincronização GMC para produto ${(await params).productId}:`, error);

    return NextResponse.json({
      success: false,
      error: error?.message || "Erro interno ao desabilitar sincronização",
    }, { status: 500 });
  }
}
