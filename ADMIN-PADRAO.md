# 👤 Sistema de Usuário Admin Padrão

Este documento explica o sistema de autenticação de administradores com usuário padrão criado automaticamente.

## 📋 O que foi implementado

### 1. Tabela de Administradores

Uma nova tabela `admins` foi criada no banco de dados Turso com os seguintes campos:

- `id` - Identificador único do admin
- `username` - Nome de usuário (único)
- `email` - Email do admin (opcional)
- `password_hash` - Hash da senha (SHA-256)
- `is_active` - Status ativo/inativo (1 = ativo, 0 = inativo)
- `created_at` - Data de criação
- `updated_at` - Data de atualização

### 2. Usuário Admin Padrão

Ao executar as migrações, um usuário admin padrão é criado automaticamente:

- **Username:** `admin`
- **Password:** `admin123` (ou definido na variável `ADMIN_DEFAULT_PASSWORD`)
- **Email:** `admin@dominustech.com` (ou definido na variável `ADMIN_DEFAULT_EMAIL`)

### 3. Autenticação Atualizada

A autenticação agora:
- Verifica usuário e senha no banco de dados
- Usa hash SHA-256 para armazenar senhas
- Valida se o usuário está ativo
- Suporta múltiplos usuários admin

## 🚀 Como usar

### 1. Executar Migrações

Primeiro, execute as migrações para criar a tabela e o usuário padrão:

```bash
# Via API
curl -X POST http://localhost:3000/api/migrations

# Ou após deploy na Vercel
curl -X POST https://seu-app.vercel.app/api/migrations
```

### 2. Fazer Login

Acesse `/admin/login` e use as credenciais padrão:

- **Usuário:** `admin`
- **Senha:** `admin123`

### 3. Personalizar Credenciais Padrão (Opcional)

Você pode definir variáveis de ambiente para personalizar o admin padrão:

```env
ADMIN_DEFAULT_PASSWORD=suasenhasuperforte
ADMIN_DEFAULT_EMAIL=admin@seusite.com
```

**⚠️ IMPORTANTE:** Altere a senha padrão após o primeiro login!

## 🔧 Configuração

### Variáveis de Ambiente

- `ADMIN_DEFAULT_PASSWORD` - Senha do usuário admin padrão (padrão: `admin123`)
- `ADMIN_DEFAULT_EMAIL` - Email do usuário admin padrão (padrão: `admin@dominustech.com`)
- `ADMIN_SECRET_KEY` - Chave secreta para tokens de autenticação

## 📝 Estrutura do Código

### Migrações (`lib/db/migrations.ts`)

- Cria a tabela `admins`
- Cria o usuário admin padrão automaticamente
- Verifica se o admin já existe antes de criar

### Autenticação (`app/api/admin/auth/route.ts`)

- Verifica credenciais no banco de dados
- Valida senha usando hash
- Verifica se o usuário está ativo
- Gera token de autenticação

### Login (`app/admin/login/page.tsx`)

- Interface atualizada com campo de usuário
- Validação de formulário
- Exibição de erros

## 🔒 Segurança

- ✅ Senhas armazenadas como hash SHA-256
- ✅ Validação de usuários ativos
- ✅ Tokens com expiração (7 dias)
- ✅ Cookies HTTP-only e secure em produção
- ✅ Proteção contra SQL injection (parâmetros preparados)

## 🆕 Próximos Passos

Para adicionar mais admins ou gerenciar usuários:

1. Criar rotas API para CRUD de admins
2. Interface de gerenciamento de usuários no painel admin
3. Sistema de alteração de senha
4. Sistema de recuperação de senha

## 📚 Recursos

- Tabela `admins` criada automaticamente nas migrações
- Usuário padrão criado na primeira execução das migrações
- Autenticação segura com hash de senha
- Múltiplos usuários admin suportados

---

**Credenciais Padrão:**
- Username: `admin`
- Password: `admin123`

⚠️ **IMPORTANTE:** Altere a senha padrão após o primeiro login em produção!


