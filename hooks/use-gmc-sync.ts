/**
 * Hook para integração com o serviço de sincronização Google Merchant Center
 *
 * Este hook fornece funções para interagir com a sincronização GMC no client-side.
 */

import { useState, useCallback, useEffect } from 'react';
import { GmcSyncStatus } from '@/types';

// Interface para o status de sincronização de um produto
export interface ProductSyncStatus {
  status: GmcSyncStatus;
  gmcProductId?: string;
  gmcLastSync?: string;
  gmcError?: string;
  retryCount: number;
  lastRetry?: string;
  queueItems: Array<{
    id: string;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    status: GmcSyncStatus;
    retryCount: number;
    createdAt: string;
  }>;
  logs: Array<{
    id: string;
    action: string;
    status: GmcSyncStatus;
    message?: string;
    timestamp: string;
  }>;
}

// Interface para estatísticas da fila
export interface SyncQueueStats {
  totalItems: number;
  pending: number;
  processing: number;
  synced: number;
  error: number;
  disabled: number;
  averageRetryCount: number;
}

// Interface para resultado de processamento
export interface ProcessBatchResult {
  success: boolean;
  processed: number;
  succeeded: number;
  failed: number;
  errors: Array<{ itemId: string; error: string }>;
  timestamp: string;
}

/**
 * Hook para gerenciamento da sincronização GMC
 */
export function useGmcSync() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Obtém o status de sincronização de um produto
   */
  const getProductSyncStatus = useCallback(async (productId: string): Promise<ProductSyncStatus | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/gmc/sync/${productId}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao buscar status de sincronização');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar status GMC:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Força reprocessamento de um produto
   */
  const forceRetryProduct = useCallback(async (productId: string, priority: number = 1): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/gmc/sync/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priority }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao forçar reprocessamento');
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao forçar reprocessamento GMC:', err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Atualiza configurações de sincronização de um produto
   */
  const updateProductSyncSettings = useCallback(async (
    productId: string,
    action: 'ENABLE' | 'DISABLE',
    reason?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/gmc/sync/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro ao ${action.toLowerCase()} sincronização`);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error(`Erro ao ${action.toLowerCase()} sincronização GMC:`, err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Desabilita sincronização de um produto
   */
  const disableProductSync = useCallback(async (productId: string, reason?: string): Promise<boolean> => {
    return updateProductSyncSettings(productId, 'DISABLE', reason);
  }, [updateProductSyncSettings]);

  /**
   * Habilita sincronização de um produto
   */
  const enableProductSync = useCallback(async (productId: string): Promise<boolean> => {
    return updateProductSyncSettings(productId, 'ENABLE');
  }, [updateProductSyncSettings]);

  /**
   * Processa um batch de sincronização
   */
  const processBatch = useCallback(async (batchSize?: number, force?: boolean): Promise<ProcessBatchResult | null> => {
    setIsLoading(true);
    setError(null);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/gmc/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batchSize, force }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          setIsProcessing(true);
          throw new Error('Processamento já em andamento');
        }
        throw new Error(errorData.error || 'Erro ao processar batch');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao processar batch GMC:', err);
      return null;
    } finally {
      setIsLoading(false);
      setIsProcessing(false);
    }
  }, []);

  /**
   * Obtém estatísticas da fila de sincronização
   */
  const getSyncStats = useCallback(async (): Promise<SyncQueueStats | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/gmc/sync');

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao buscar estatísticas');
      }

      const data = await response.json();
      return data.stats as SyncQueueStats;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar estatísticas GMC:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Obtém logs de sincronização
   */
  const getSyncLogs = useCallback(async (options?: {
    productId?: string;
    status?: GmcSyncStatus;
    startDate?: string;
    endDate?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    logs: Array<{
      id: string;
      productId: string;
      action: string;
      status: GmcSyncStatus;
      message?: string;
      timestamp: string;
    }>;
    total: number;
  } | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options?.productId) params.append('productId', options.productId);
      if (options?.status) params.append('status', options.status);
      if (options?.startDate) params.append('startDate', options.startDate);
      if (options?.endDate) params.append('endDate', options.endDate);
      if (options?.limit) params.append('limit', options.limit.toString());
      if (options?.offset) params.append('offset', options.offset.toString());

      const response = await fetch(`/api/gmc/sync/logs?${params.toString()}`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao buscar logs');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('Erro ao buscar logs GMC:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Verifica se um produto está sincronizado
   */
  const isProductSynced = useCallback(async (productId: string): Promise<boolean> => {
    const status = await getProductSyncStatus(productId);
    return status?.status === 'SYNCED';
  }, [getProductSyncStatus]);

  /**
   * Obtém o status de sincronização de um produto como string legível
   */
  const getSyncStatusLabel = useCallback((status: GmcSyncStatus): string => {
    const labels: Record<GmcSyncStatus, string> = {
      PENDING: 'Pendente',
      PROCESSING: 'Processando',
      SYNCED: 'Sincronizado',
      ERROR: 'Erro',
      DISABLED: 'Desabilitado',
    };
    return labels[status] || status;
  }, []);

  /**
   * Obtém a cor do status para exibição
   */
  const getSyncStatusColor = useCallback((status: GmcSyncStatus): string => {
    const colors: Record<GmcSyncStatus, string> = {
      PENDING: 'bg-yellow-500 text-white',
      PROCESSING: 'bg-blue-500 text-white',
      SYNCED: 'bg-green-500 text-white',
      ERROR: 'bg-red-500 text-white',
      DISABLED: 'bg-gray-500 text-white',
    };
    return colors[status] || 'bg-gray-500 text-white';
  }, []);

  return {
    // States
    isLoading,
    error,
    isProcessing,

    // Funções para produtos individuais
    getProductSyncStatus,
    forceRetryProduct,
    enableProductSync,
    disableProductSync,
    isProductSynced,

    // Funções para gerenciamento da fila
    processBatch,
    getSyncStats,
    getSyncLogs,

    // Utilitários
    getSyncStatusLabel,
    getSyncStatusColor,

    // Clear error
    clearError: () => setError(null),
  };
}

// Tipos para exportação
export type { GmcSyncStatus };
