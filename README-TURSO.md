# 🚀 Configuração do Turso Database

Este projeto foi configurado para usar **Turso** como banco de dados, substituindo completamente o uso de `localStorage`.

## 📋 Pré-requisitos

1. Criar uma conta no [Turso](https://turso.tech)
2. Instalar o Turso CLI (opcional, para gerenciar o banco localmente)

## ⚙️ Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
TURSO_DATABASE_URL=libsql://your-database-url.turso.io
TURSO_AUTH_TOKEN=your-auth-token-here
ADMIN_SECRET_KEY=your-admin-secret-key-here
```

**Como obter as credenciais do Turso:**
1. Acesse [Turso Dashboard](https://turso.tech)
2. Crie um novo banco de dados
3. Copie a **Database URL** (ex: `libsql://seu-banco.turso.io`)
4. Gere um **Auth Token** nas configurações do banco
5. Cole ambas as informações no `.env.local`

### 3. Executar Migrações

As tabelas serão criadas automaticamente na primeira execução. Você também pode executar manualmente:

```bash
curl -X POST http://localhost:3000/api/migrations
```

Ou faça uma requisição POST para `/api/migrations` usando qualquer cliente HTTP.

## 📊 Estrutura do Banco

O sistema cria as seguintes tabelas:

- **departments** - Departamentos da loja
- **categories** - Categorias de produtos
- **products** - Produtos cadastrados
- **cart** - Itens do carrinho (por sessão)
- **analytics** - Dados de cliques nos produtos
- **preferences** - Preferências do usuário (cookies)

## 🔄 Migração do localStorage

Todo o código que usava `localStorage` foi substituído por chamadas à API:

- ✅ `departments` → `/api/departments`
- ✅ `categories` → `/api/categories`
- ✅ `products` → `/api/products`
- ✅ `cart` → `/api/cart`
- ✅ `analytics` → `/api/analytics`
- ✅ `cookiesAccepted` → `/api/preferences`

## 🌐 Deploy no Vercel

### 1. Preparar o Repositório

Certifique-se de que seu código está no GitHub:

```bash
git add .
git commit -m "Configurar Turso Database"
git push origin main
```

### 2. Conectar ao Vercel

1. Acesse [Vercel Dashboard](https://vercel.com)
2. Clique em **Add New Project**
3. Importe seu repositório do GitHub
4. Configure as opções do projeto (Next.js será detectado automaticamente)

### 3. Adicionar Variáveis de Ambiente

No Vercel Dashboard, na página do seu projeto:

1. Vá em **Settings → Environment Variables**
2. Adicione as seguintes variáveis:

   - **Key:** `TURSO_DATABASE_URL`
     - **Value:** `libsql://seu-banco.turso.io` (sua URL do Turso)
     - **Environment:** Production, Preview, Development (selecione todos)

   - **Key:** `TURSO_AUTH_TOKEN`
     - **Value:** (seu token de autenticação do Turso)
     - **Environment:** Production, Preview, Development (selecione todos)

   - **Key:** `ADMIN_SECRET_KEY`
     - **Value:** (sua chave secreta para o painel admin)
     - **Environment:** Production, Preview, Development (selecione todos)

3. Clique em **Save** para cada variável

### 4. Fazer Deploy

Após configurar as variáveis:

1. Vá na aba **Deployments**
2. Clique em **Redeploy** no último deployment (ou faça push novamente)
3. Aguarde o deploy finalizar

### 5. Executar Migrações

Após o deploy estar completo:

1. Acesse a URL do seu app (ex: `https://seu-app.vercel.app`)
2. Execute as migrações fazendo uma requisição POST para:
   ```
   https://seu-app.vercel.app/api/migrations
   ```

   Você pode usar:
   - **cURL:**
     ```bash
     curl -X POST https://seu-app.vercel.app/api/migrations
     ```
   
   - **Postman ou Insomnia**
   
   - **Navegador:** Abra o DevTools → Console e execute:
     ```javascript
     fetch('https://seu-app.vercel.app/api/migrations', { method: 'POST' })
       .then(r => r.json())
       .then(console.log)
     ```

### 6. Verificar se Está Funcionando

1. Acesse `https://seu-app.vercel.app`
2. Verifique se os dados estão sendo carregados
3. Teste adicionar um produto ao carrinho
4. Verifique os logs no Vercel Dashboard se houver erros

### 7. (Opcional) Configurar Domínio Customizado

1. Vá em **Settings → Domains**
2. Adicione seu domínio personalizado
3. Configure o DNS conforme as instruções da Vercel

## 🧪 Testando Localmente

1. Configure o `.env.local` com suas credenciais
2. Execute as migrações
3. Inicie o servidor:

```bash
npm run dev
```

4. Acesse `http://localhost:3000`

## 📝 Notas Importantes

- **Sessões**: O carrinho e preferências são vinculados a um `session_id` armazenado em cookie
- **Performance**: Todas as operações são feitas via API routes do Next.js (serverless)
- **Backup**: O Turso faz backup automático, mas você pode exportar dados manualmente se necessário

## 🆘 Troubleshooting

### Erro: "TURSO_DATABASE_URL não está definida"

- Verifique se o arquivo `.env.local` existe na raiz do projeto
- Certifique-se de que as variáveis estão escritas corretamente
- Reinicie o servidor após adicionar as variáveis

### Erro ao executar migrações

- Verifique se as credenciais do Turso estão corretas
- Certifique-se de que o banco foi criado no dashboard do Turso
- Verifique os logs do servidor para mais detalhes

### Dados não aparecem

- Execute as migrações primeiro
- Verifique se as requisições à API estão funcionando (Network tab do navegador)
- Confira os logs do servidor para erros

## 📚 Recursos

- [Documentação do Turso](https://docs.turso.tech)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)

