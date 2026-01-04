import { turso } from "../turso";
import { hashPassword } from "../auth-utils";

/**
 * Cria todas as tabelas necessárias no banco de dados Turso
 * Execute esta função uma vez para inicializar o banco
 */
export async function runMigrations() {
  try {
    await turso.execute(`
      DROP TABLE admins;
    `);
    // Tabela de departamentos
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS departments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de categorias
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de produtos
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image TEXT,
        department_id TEXT NOT NULL,
        category_id TEXT NOT NULL,
        installments INTEGER,
        installment_price REAL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id),
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    // Tabela de imagens extras dos produtos
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS product_images (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        image_data TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )
    `);

    // Tabela de carrinho (por sessão/usuário)
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS cart (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Tabela de analytics
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS analytics (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        product_name TEXT NOT NULL,
        clicks INTEGER DEFAULT 0,
        last_clicked TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    // Tabela de preferências (para cookies)
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS preferences (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        cookies_accepted INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de administradores
    await turso.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        email TEXT,
        password_hash TEXT NOT NULL,
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar usuário admin padrão se não existir
    await createDefaultAdmin();

    console.log("✅ Migrações executadas com sucesso!");
    return { success: true };
  } catch (error) {
    console.error("❌ Erro ao executar migrações:", error);
    throw error;
  }
}

/**
 * Cria o usuário admin padrão se não existir
 * Credenciais padrão:
 * - Username: admin
 * - Password: admin123 (ou da variável ADMIN_DEFAULT_PASSWORD)
 */
async function createDefaultAdmin() {
  try {
    // Verifica se já existe um admin
    const existing = await turso.execute({
      sql: "SELECT id FROM admins WHERE username = ?",
      args: ["admin"],
    });

    if (existing.rows.length > 0) {
      console.log("✅ Usuário admin padrão já existe");
      return;
    }

    // Credenciais padrão
    const defaultUsername = "admin";
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";
    const defaultEmail =
      process.env.ADMIN_DEFAULT_EMAIL || "admin@dominustech.com";

    // Gera hash da senha
    const passwordHash = hashPassword(defaultPassword);

    // Cria o admin padrão
    const adminId = `admin_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 15)}`;

    await turso.execute({
      sql: "INSERT INTO admins (id, username, email, password_hash, is_active) VALUES (?, ?, ?, ?, ?)",
      args: [adminId, defaultUsername, defaultEmail, passwordHash, 1],
    });

    console.log(`✅ Usuário admin padrão criado com sucesso!`);
    console.log(`   Username: ${defaultUsername}`);
    console.log(`   Password: ${defaultPassword}`);
    console.log(
      `   ⚠️  IMPORTANTE: Altere a senha padrão após o primeiro login!`
    );
  } catch (error) {
    console.error("❌ Erro ao criar usuário admin padrão:", error);
    // Não lança erro para não quebrar as migrações
  }
}
