export type FormaPagamento =
  "Dinheiro" | "PIX" | "Cartão de Crédito" | "Cartão de Débito";

export type GmcSyncStatus =
  "PENDING" | "PROCESSING" | "SYNCED" | "ERROR" | "DISABLED";

export interface Produto {
  id: string;
  nome: string;
  codigo: string;
  categoria: string;
  preco: number;
  estoque: number;
  estoqueMinimo: number;
  imagem?: string;
  descricao?: string;
  // Campos para sincronização com Google Merchant Center
  gmcProductId?: string;
  gmcSyncStatus?: GmcSyncStatus;
  gmcLastSync?: string;
  gmcError?: string;
  retryCount?: number;
  lastRetry?: string;
}

export interface ItemCarrinho extends Produto {
  quantidade: number;
}

export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cpf_cnpj?: string;
}

export interface Venda {
  id: string;
  clienteId: string;
  itens: ItemCarrinho[];
  subtotal: number;
  desconto: number;
  total: number;
  formaPagamento: FormaPagamento;
  dataCriacao: Date;
}
