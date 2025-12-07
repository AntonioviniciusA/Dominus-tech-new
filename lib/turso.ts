import { createClient } from "@libsql/client";

// Validação das variáveis de ambiente
if (!process.env.TURSO_DATABASE_URL) {
  console.error(
    "❌ TURSO_DATABASE_URL não está definida. Configure no arquivo .env.local ou nas variáveis de ambiente."
  );
}

if (!process.env.TURSO_AUTH_TOKEN) {
  console.error(
    "❌ TURSO_AUTH_TOKEN não está definida. Configure no arquivo .env.local ou nas variáveis de ambiente."
  );
}

export const turso = createClient({
  url: process.env.TURSO_DATABASE_URL || "",
  authToken: process.env.TURSO_AUTH_TOKEN || "",
});
