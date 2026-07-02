/**
 * Inicialização do serviço de sincronização com Google Merchant Center
 *
 * Este arquivo garante que o serviço de sincronização seja inicializado
 * quando a aplicação iniciar, criando as tabelas necessárias e
 * configurando o processamento periódico.
 */

import { initializeGmcSyncService, processGmcSyncBatch } from './services/gmc-sync-service';

// Flag para evitar inicialização múltipla
let isInitialized = false;

/**
 * Inicializa o serviço de sincronização GMC
 *
 * Esta função deve ser chamada uma vez quando a aplicação iniciar.
 * Ela garante que:
 * 1. As tabelas necessárias sejam criadas
 * 2. O serviço esteja pronto para processamento
 */
export async function initializeGmcSync(): Promise<void> {
  if (isInitialized) {
    console.log('ℹ️ Serviço GMC já inicializado');
    return;
  }

  try {
    console.log('🚀 Inicializando serviço de sincronização GMC...');
    await initializeGmcSyncService();
    isInitialized = true;

    // Configura processamento periódico (em ambiente server-side)
    setupPeriodicProcessing();

    console.log('✅ Serviço GMC inicializado com sucesso');
  } catch (error) {
    console.error('❌ Falha ao inicializar serviço GMC:', error);
    // Não lança erro para não quebrar a inicialização da aplicação
  }
}

/**
 * Configura processamento periódico do batch de sincronização
 *
 * Em produção, seria ideal usar um cron job externo ou um worker.
 * Neste sistema, usamos setInterval como solução simples para ambiente Next.js.
 *
 * ⚠️ Nota: Em ambiente serverless (Vercel), o setInterval pode não persistir
 * entre requisições. Nesses casos, recomenda-se usar:
 * - Vercel Cron Jobs
 * - Um worker externo
 * - Chamadas periódicas via webhook
 */
function setupPeriodicProcessing(): void {
  // Processar a cada 5 minutos (300000 ms) em desenvolvimento
  // Em produção, ajustar conforme necessário
  const interval = process.env.NODE_ENV === 'production' ? 300000 : 60000; // 5 min ou 1 min

  // Somente configura em ambiente server-side
  if (typeof window !== 'undefined') {
    return; // Skip em client-side
  }

  // Processa imediatamente na inicialização
  processGmcSyncBatch().catch(error => {
    console.error('❌ Erro no processamento inicial GMC:', error);
  });

  // Configura intervalo periódico
  const intervalId = setInterval(() => {
    processGmcSyncBatch().catch(error => {
      console.error('❌ Erro no processamento periódico GMC:', error);
    });
  }, interval);

  // Limpeza do intervalo (para ambientes que a requerem)
  if (process.env.NODE_ENV !== 'production') {
    // Em desenvolvimento, permite parar o intervalo
    if (typeof global !== 'undefined') {
      (global as any).__gmcSyncIntervalId = intervalId;
    }
  }

  console.log(`⏰ Processamento periódico GMC configurado (intervalo: ${interval}ms)`);
}

/**
 * Para o processamento periódico (para uso em testes ou shutdown)
 */
export function stopPeriodicProcessing(): void {
  if (typeof global !== 'undefined' && (global as any).__gmcSyncIntervalId) {
    clearInterval((global as any).__gmcSyncIntervalId);
    delete (global as any).__gmcSyncIntervalId;
    console.log('⏹️ Processamento periódico GMC parado');
  }
}

// Exporta a flag de inicialização para verificação
export { isInitialized };
