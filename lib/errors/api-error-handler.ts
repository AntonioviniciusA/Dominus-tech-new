/**
 * Handler de Erros para API
 *
 * Trata erros de forma segura, evitando exposure de informações sensíveis
 * e garantindo respostas consistentes para o cliente.
 */

import { NextResponse } from "next/server";

/**
 * Tipos de erros padronizados
 */
export enum ApiErrorCode {
  // Erros de validação (400)
  VALIDATION_ERROR = "VALIDATION_ERROR",
  INVALID_INPUT = "INVALID_INPUT",
  MISSING_REQUIRED_FIELD = "MISSING_REQUIRED_FIELD",

  // Erros de autenticação (401)
  UNAUTHORIZED = "UNAUTHORIZED",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  TOKEN_EXPIRED = "TOKEN_EXPIRED",
  INVALID_TOKEN = "INVALID_TOKEN",

  // Erros de autorização (403)
  FORBIDDEN = "FORBIDDEN",
  INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
  ACCOUNT_DISABLED = "ACCOUNT_DISABLED",

  // Erros de recurso (404)
  NOT_FOUND = "NOT_FOUND",
  RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND",

  // Erros de conflitos (409)
  CONFLICT = "CONFLICT",
  DUPLICATE_ENTRY = "DUPLICATE_ENTRY",

  // Erros de rate limiting (429)
  RATE_LIMITED = "RATE_LIMITED",
  TOO_MANY_REQUESTS = "TOO_MANY_REQUESTS",

  // Erros internos (500)
  INTERNAL_ERROR = "INTERNAL_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  SERVICE_UNAVAILABLE = "SERVICE_UNAVAILABLE"
}

/**
 * Interface para erros API padronizados
 */
export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: string;
    timestamp: string;
    requestId?: string;
  };
}

/**
 * Gera um ID único para cada requisição (para rastreamento)
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Trata erros de forma segura e consistente
 *
 * @param error - O erro a ser tratados
 * @param context - Contexto opcional (ex: nome do endpoint)
 * @returns NextResponse com o erro formatado
 */
export function handleApiError(
  error: any,
  context?: string
): NextResponse {
  const requestId = generateRequestId();
  const timestamp = new Date().toISOString();

  // Loga o erro completo no servidor (com detalhes sensíveis)
  console.error(`[ERROR] ${timestamp} ${requestId}`, {
    context,
    error: error?.message || String(error),
    stack: process.env.NODE_ENV === 'development' ? error?.stack : '[REDACTED]',
    cause: process.env.NODE_ENV === 'development' ? error?.cause : undefined
  });

  // Determina o tipo de erro e mensagem segura
  let statusCode = 500;
  let errorCode = ApiErrorCode.INTERNAL_ERROR;
  let safeMessage = "Ocorreu um erro interno. Por favor, tente novamente mais tarde.";

  // Trata erros conhecidos de forma específica
  if (error?.name === 'ValidationError' || error?.message?.includes('validation')) {
    statusCode = 400;
    errorCode = ApiErrorCode.VALIDATION_ERROR;
    safeMessage = error.message || "Dados inválidos.";
  }

  if (error?.message?.includes('obrigatório') || error?.message?.includes('required')) {
    statusCode = 400;
    errorCode = ApiErrorCode.MISSING_REQUIRED_FIELD;
    safeMessage = error.message || "Campo obrigatório não preenchido.";
  }

  if (error?.message?.includes('Credenciais inválidas') ||
      error?.message?.includes('Invalid credentials')) {
    statusCode = 401;
    errorCode = ApiErrorCode.INVALID_CREDENTIALS;
    safeMessage = "Credenciais inválidas.";
  }

  if (error?.message?.includes('Unauthorized') ||
      error?.message?.includes('Não autorizado')) {
    statusCode = 401;
    errorCode = ApiErrorCode.UNAUTHORIZED;
    safeMessage = "Não autorizado. Por favor, faça login.";
  }

  if (error?.message?.includes('desativada') ||
      error?.message?.includes('disabled')) {
    statusCode = 403;
    errorCode = ApiErrorCode.ACCOUNT_DISABLED;
    safeMessage = "Conta desativada. Entre em contato com o administrador.";
  }

  if (error?.message?.includes('não encontrado') ||
      error?.message?.includes('not found') ||
      error?.message?.includes('Não encontrado')) {
    statusCode = 404;
    errorCode = ApiErrorCode.NOT_FOUND;
    safeMessage = "Recurso não encontrado.";
  }

  if (error?.message?.includes('Token inválido') ||
      error?.message?.includes('Invalid token')) {
    statusCode = 401;
    errorCode = ApiErrorCode.INVALID_TOKEN;
    safeMessage = "Token de autenticação inválido.";
  }

  if (error?.message?.includes('expirou') ||
      error?.message?.includes('expired')) {
    statusCode = 401;
    errorCode = ApiErrorCode.TOKEN_EXPIRED;
    safeMessage = "Sessão expirada. Por favor, faça login novamente.";
  }

  if (error?.message?.includes('já existe') ||
      error?.message?.includes('already exists') ||
      error?.message?.includes('duplicate')) {
    statusCode = 409;
    errorCode = ApiErrorCode.DUPLICATE_ENTRY;
    safeMessage = "Recurso já existe.";
  }

  if (error?.code === 'SQLITE_CONSTRAINT' ||
      error?.message?.includes('UNIQUE constraint failed')) {
    statusCode = 409;
    errorCode = ApiErrorCode.DUPLICATE_ENTRY;
    safeMessage = "Recurso já existe.";
  }

  // Para erros de banco de dados, não expor detalhes internos
  if (error?.message?.includes('SQLite') ||
      error?.message?.includes('database') ||
      error?.message?.includes('turso') ||
      error?.message?.includes('execute')) {
    statusCode = 500;
    errorCode = ApiErrorCode.DATABASE_ERROR;
    safeMessage = "Erro no banco de dados. Por favor, tente novamente.";
  }

  // Resposta padronizada sem expor detalhes internos
  const response: ApiErrorResponse = {
    error: {
      code: errorCode,
      message: safeMessage,
      timestamp,
      requestId
    }
  };

  // Adiciona detalhes de validação apenas em desenvolvimento
  if (process.env.NODE_ENV === 'development' &&
      (errorCode === ApiErrorCode.VALIDATION_ERROR ||
       errorCode === ApiErrorCode.INVALID_INPUT)) {
    response.error.details = error?.message || String(error);
  }

  return NextResponse.json(response, { status: statusCode });
}

/**
 * Wrapper para endpoints API com tratamento de erros seguro
 *
 * @param handler - Função handler original
 * @returns Função wrapper com tratamento de erros
 */
export function withErrorHandler(
  handler: (req: Request, ...args: any[]) => Promise<NextResponse>
) {
  return async (req: Request, ...args: any[]): Promise<NextResponse> => {
    try {
      return await handler(req, ...args);
    } catch (error: any) {
      return handleApiError(error);
    }
  };
}

/**
 * Cria um erro de validação formatado
 */
export function createValidationError(message: string, details?: string): NextResponse {
  return NextResponse.json({
    error: {
      code: ApiErrorCode.VALIDATION_ERROR,
      message: message,
      details: process.env.NODE_ENV === 'development' ? details : undefined,
      timestamp: new Date().toISOString()
    }
  }, { status: 400 });
}

/**
 * Cria um erro de autenticação formatado
 */
export function createAuthError(message: string = "Não autorizado"): NextResponse {
  return NextResponse.json({
    error: {
      code: ApiErrorCode.UNAUTHORIZED,
      message: message,
      timestamp: new Date().toISOString()
    }
  }, { status: 401 });
}

/**
 * Cria um erro de autorização formatado
 */
export function createForbiddenError(message: string = "Acesso negado"): NextResponse {
  return NextResponse.json({
    error: {
      code: ApiErrorCode.FORBIDDEN,
      message: message,
      timestamp: new Date().toISOString()
    }
  }, { status: 403 });
}

/**
 * Cria um erro de não encontrado formatado
 */
export function createNotFoundError(message: string = "Recurso não encontrado"): NextResponse {
  return NextResponse.json({
    error: {
      code: ApiErrorCode.NOT_FOUND,
      message: message,
      timestamp: new Date().toISOString()
    }
  }, { status: 404 });
}
