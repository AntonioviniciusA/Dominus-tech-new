# 🔧 Troubleshooting - Erros 500 nas APIs

Este guia ajuda a resolver os erros 500 que estão aparecendo nas rotas da API.

## 🚨 Problema: Erros 500 em todas as rotas API

Se você está vendo erros 500 em rotas como:
- `/api/departments`
- `/api/categories`
- `/api/products`
- `/api/cart`
- `/api/analytics`
- `/api/preferences`

## 🔍 Diagnóstico Rápido

Primeiro, acesse a rota de diagnóstico:

```
GET http://localhost:3000/api/health
```

Esta rota vai verificar:
- ✅ Variáveis de ambiente configuradas
- ✅ Conexão com o banco de dados
- ✅ Tabelas criadas

## 📋 Soluções Comuns

### 1. Variáveis de Ambiente Não Configuradas

**Sintoma:** Erro ao iniciar ou erro "TURSO_DATABASE_URL não está definida"

**Solução:**

1. Crie um arquivo `.env.local` na raiz do projeto:

```env
TURSO_DATABASE_URL=libsql://seu-banco.turso.io
TURSO_AUTH_TOKEN=seu-token-aqui
ADMIN_SECRET_KEY=sua-chave-secreta
```

2. Obtenha as credenciais do Turso:
   - Acesse https://turso.tech
   - Crie um banco de dados
   - Copie a Database URL
   - Gere um Auth Token

3. Reinicie o servidor:
```bash
npm run dev
```

### 2. Tabelas Não Criadas (Migrações Não Executadas)

**Sintoma:** Erro "no such table" ou "table does not exist"

**Solução:**

Execute as migrações:

```bash
# Via cURL
curl -X POST http://localhost:3000/api/migrations

# Ou no navegador/Postman
POST http://localhost:3000/api/migrations
```

Após executar, você verá no console:
```
✅ Migrações executadas com sucesso!
✅ Usuário admin padrão criado com sucesso!
```

### 3. Erro na Conexão com Turso

**Sintoma:** Erro de conexão ou timeout

**Soluções:**

1. Verifique se as credenciais estão corretas
2. Verifique se o banco de dados foi criado no Turso Dashboard
3. Verifique sua conexão com a internet
4. Tente regenerar o Auth Token no Turso Dashboard

### 4. Pacote @libsql/client Não Instalado

**Sintoma:** Erro "Cannot find module '@libsql/client'"

**Solução:**

```bash
npm install @libsql/client
```

## 🔍 Verificação Passo a Passo

### Passo 1: Verificar Variáveis de Ambiente

Verifique se o arquivo `.env.local` existe e contém:

```env
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

### Passo 2: Verificar Conexão

Acesse: `http://localhost:3000/api/health`

Você deve ver uma resposta como:

```json
{
  "status": "ok",
  "message": "Banco de dados configurado corretamente"
}
```

Se ver erro, siga as instruções na resposta.

### Passo 3: Executar Migrações

Se as tabelas não foram criadas, execute:

```bash
curl -X POST http://localhost:3000/api/migrations
```

### Passo 4: Testar uma Rota

Teste a rota de departamentos:

```bash
curl http://localhost:3000/api/departments
```

Deve retornar um array vazio `[]` se não houver dados, ou erro 500 se ainda houver problema.

## 📝 Logs Úteis

Verifique os logs do servidor para mensagens como:

- `✅ Migrações executadas com sucesso!`
- `✅ Usuário admin padrão criado!`
- `❌ Erro ao conectar com o banco...`

## 🆘 Ainda com Problemas?

1. Verifique os logs do console do servidor
2. Verifique a aba Network no DevTools do navegador
3. Verifique se o banco Turso está acessível
4. Tente criar um novo banco no Turso e use as novas credenciais

## 📚 Recursos

- [Documentação do Turso](https://docs.turso.tech)
- [README-TURSO.md](./README-TURSO.md) - Guia completo de configuração
- [ADMIN-PADRAO.md](./ADMIN-PADRAO.md) - Informações sobre o admin padrão

---

**Comandos Rápidos:**

```bash
# Verificar saúde do sistema
curl http://localhost:3000/api/health

# Executar migrações
curl -X POST http://localhost:3000/api/migrations

# Testar rota
curl http://localhost:3000/api/departments
```









