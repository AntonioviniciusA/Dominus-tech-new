import { NextResponse } from "next/server"
import { turso } from "@/lib/turso"

/**
 * Rota de diagnóstico para verificar a conexão com o banco de dados
 */
export async function GET() {
  try {
    // Verifica variáveis de ambiente
    const hasDatabaseUrl = !!process.env.TURSO_DATABASE_URL
    const hasAuthToken = !!process.env.TURSO_AUTH_TOKEN

    if (!hasDatabaseUrl || !hasAuthToken) {
      return NextResponse.json(
        {
          status: "error",
          message: "Variáveis de ambiente não configuradas",
          details: {
            TURSO_DATABASE_URL: hasDatabaseUrl ? "✅ Configurada" : "❌ Não configurada",
            TURSO_AUTH_TOKEN: hasAuthToken ? "✅ Configurada" : "❌ Não configurada",
          },
          solution: "Configure as variáveis TURSO_DATABASE_URL e TURSO_AUTH_TOKEN no arquivo .env.local",
        },
        { status: 500 }
      )
    }

    // Testa a conexão com o banco
    try {
      await turso.execute("SELECT 1")
    } catch (dbError: any) {
      return NextResponse.json(
        {
          status: "error",
          message: "Erro ao conectar com o banco de dados",
          details: dbError.message,
          solution: "Verifique se as credenciais do Turso estão corretas",
        },
        { status: 500 }
      )
    }

    // Verifica se as tabelas existem
    const tables = ["departments", "categories", "products", "cart", "analytics", "preferences", "admins"]
    const missingTables: string[] = []

    for (const table of tables) {
      try {
        await turso.execute(`SELECT COUNT(*) FROM ${table} LIMIT 1`)
      } catch (error: any) {
        if (error.message?.includes("no such table") || error.message?.includes("does not exist")) {
          missingTables.push(table)
        }
      }
    }

    if (missingTables.length > 0) {
      return NextResponse.json(
        {
          status: "warning",
          message: "Algumas tabelas não foram criadas",
          missingTables,
          solution: "Execute as migrações: POST /api/migrations",
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      status: "ok",
      message: "Banco de dados configurado corretamente",
      details: {
        connection: "✅ Conectado",
        tables: `✅ Todas as ${tables.length} tabelas criadas`,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Erro ao verificar o banco de dados",
        details: error.message,
      },
      { status: 500 }
    )
  }
}









