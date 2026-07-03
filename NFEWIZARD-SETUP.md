# NFewizard - Configuração e Emissão de Nota Fiscal Eletrônica

## Visão Geral

Este documento descreve como configurar e usar o sistema de emissão de Notas Fiscais Eletrônicas (NF-e) integrado ao PDV da Dominus Tech através da biblioteca [NFewizard](https://nfewizard-org.github.io/).

## Pré-requisitos

1. **Certificado Digital A1** (arquivo `.pfx`)
   - Obtido através de uma Autoridade Certificadora (AC) credenciada pela ICP-Brasil
   - Deve estar em formato PKCS#12 (.pfx)
   - Válido e não expirado

2. **CSC (Código de Segurança do Contribuinte)**
   - Obtido através do portal da SEFAZ do seu estado
   - Necessário para segurança da emissão de NF-e
   - ID CSC e Token CSC

3. **CNPJ da Empresa** registrado na Receita Federal

4. **Dados da Empresa** (endereço, razão social, IE, etc)

## Configuração Inicial

### 1. Obter Certificado Digital

- Acesse uma AC credenciada (Certsign, Certisign, Serasa, etc)
- Solicite um certificado A1 (válido por 1 ano)
- Você receberá um arquivo `.pfx` com senha

### 2. Obter CSC na SEFAZ

1. Acesse o portal da SEFAZ do seu estado
2. Autentique-se com certificado digital
3. Busque a opção "Gerenciar CSC" ou "Código de Segurança"
4. Gere um novo CSC e anote:
   - ID CSC (geralmente é 1)
   - Token CSC (UUID de 36 caracteres)

### 3. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local` e preencha as variáveis do NFewizard:

```bash
# Certificado Digital
NFEW_CERT_PATH=/path/to/your/certificate.pfx
NFEW_CERT_PASSWORD=your-certificate-password

# Dados da Empresa
NFEW_CNPJ=00000000000000
NFEW_UF=SP
NFEW_UF_CODE=35
NFEW_RAZAO_SOCIAL=Sua Empresa LTDA
NFEW_NOME_FANTASIA=Sua Empresa

# Endereço
NFEW_ENDERECO_RUA=Rua Example
NFEW_ENDERECO_NUMERO=123
NFEW_ENDERECO_BAIRRO=Centro
NFEW_CEP=01310100
NFEW_MUNICIPIO=São Paulo
NFEW_COD_MUN=3550308

# Fiscal
NFEW_IE=00000000000000

# CSC
NFEW_CSC_ID=1
NFEW_CSC_TOKEN=00000000-0000-0000-0000-000000000000

# Ambiente (1 = Teste/Homologação, 2 = Produção)
NFEW_AMBIENTE=2
```

## Como Usar no PDV

### Fluxo de Emissão

1. **Abrir PDV** → `/admin/pdv`
2. **Adicionar produtos** ao carrinho
3. **Selecionar cliente** (opcional - consumidor final por padrão)
4. **Selecionar forma de pagamento**
5. **Clicar em "Finalizar venda"**
6. **Confirmar pagamento**
7. **Escolher opção**:
   - **Emitir Nota** - Emite NF-e (requer certificado configurado)
   - **Salvar Planta** - Salva como rascunho sem emitir NF-e

### Fluxo de Emissão de NF-e

```
PDV → Clica "Emitir Nota"
   ↓
API `/api/pdv/emit-invoice` recebe dados
   ↓
NFewizard processa e valida dados
   ↓
Certificado digital autoriza emissão
   ↓
SEFAZ recebe e autoriza NF-e
   ↓
Número de protocolo retornado
   ↓
NF-e armazenada em `tmp/Autorizacao/`
```

## Estrutura de Dados da NF-e

A NF-e gerada contém:

- **Identificação**: Série, número sequencial, data/hora
- **Emitente**: CNPJ, razão social, fantasia, endereço, IE
- **Destinatário**: Dados do cliente (ou consumidor final)
- **Itens**: Cada produto do carrinho com:
  - Código do produto
  - Descrição
  - Quantidade e preço unitário
  - CFOP (Classificação Fiscal)
  - NCM (Nomenclatura Comum do Mercosul)
  - Impostos (ICMS, PIS, COFINS)
- **Totalizadores**: Subtotal, descontos, impostos, total
- **Pagamento**: Forma e valor
- **Transporte**: Modo de frete

## Tratamento de Erros

### Certificado Não Encontrado
```
Erro: "NFEW_CERT_PATH não configurado"
Solução: Verifique se o caminho do certificado está correto em .env.local
```

### Certificado Expirado
```
Erro: "Certificado inválido ou expirado"
Solução: Renove o certificado digital na AC
```

### CSC Inválido
```
Erro: "CSC token inválido"
Solução: Verifique NFEW_CSC_ID e NFEW_CSC_TOKEN em .env.local
```

### SEFAZ Indisponível
```
Erro: "Timeout ao conectar com SEFAZ"
Solução: Verifique conexão com internet e horário de manutenção da SEFAZ
```

## Ambiente de Teste vs Produção

### Homologação (Teste) - `NFEW_AMBIENTE=1`
- Use para testar o sistema
- Não gera documentos fiscais válidos
- Sem limite de emissões
- Certificado de teste pode ser gratuito

### Produção - `NFEW_AMBIENTE=2`
- Gera documentos fiscais válidos
- Obrigação fiscal perante receita federal
- Certificado de produção (pago)
- Auditória da SEFAZ

**Recomendação**: Comece em homologação para testes antes de ir para produção.

## Armazenamento de XMLs

Os XMLs das NF-es são armazenados em:

```
tmp/
├── Autorizacao/        # XMLs autorizados
├── RequestLogs/        # Logs de requisições
└── DistribuicaoDFe/    # Distribuição
```

## API Endpoint

### POST `/api/pdv/emit-invoice`

Emite uma NF-e com base nos dados da venda.

**Requisição:**
```json
{
  "clienteId": "cliente-123",
  "itens": [
    {
      "id": "prod-1",
      "nome": "Produto A",
      "codigo": "PROD001",
      "quantidade": 2,
      "preco": 100.00,
      "ncm": "12345678"
    }
  ],
  "subtotal": 200.00,
  "desconto": 10.00,
  "total": 190.00,
  "formaPagamento": "PIX",
  "clienteNome": "João Silva",
  "clienteEmail": "joao@email.com",
  "clienteCPFCNPJ": "00000000000000"
}
```

**Resposta de Sucesso (200):**
```json
{
  "success": true,
  "message": "Nota fiscal emitida com sucesso",
  "data": {
    "cStat": 100,
    "xMotivo": "Autorizado",
    "protNFe": "123456789012345"
  }
}
```

**Resposta de Erro (500):**
```json
{
  "error": "Erro ao emitir nota fiscal",
  "details": "Descrição do erro"
}
```

## Campos Obrigatórios de Cliente

Quando o cliente é selecionado no PDV, os seguintes campos são enviados para a NF-e:

- `nome` - Nome ou razão social
- `email` - E-mail (opcional)
- `cpf_cnpj` - CPF (pessoa física) ou CNPJ (pessoa jurídica)
- `telefone` - Telefone (opcional)

**Consumidor Final**: Se nenhum cliente for selecionado, a NF-e é emitida como "Consumidor final" com CNPJ padrão.

## Dicas de Segurança

1. **Não exponha o certificado**: Mantenha o arquivo `.pfx` seguro
2. **Senha forte**: Use uma senha complexa para o certificado
3. **Backup**: Faça backup do certificado em local seguro
4. **Não commit**: Nunca faça commit de `.env.local` com credenciais reais
5. **Acesso restrito**: Limite acesso à funcionalidade de NF-e apenas a usuários autorizados

## Contatos Úteis

- **NFewizard GitHub**: https://github.com/nfewizard-org/nfewizard-io
- **Portal NF-e**: https://www.nfe.fazenda.gov.br/
- **SEFAZ-SP**: https://www.sefaz.sp.gov.br/

## Próximos Passos

1. ✅ Instalar NFewizard (`npm install nfewizard-io`)
2. ✅ Criar API endpoint (`/api/pdv/emit-invoice`)
3. ✅ Integrar com PDV
4. ⏳ Obter certificado digital (você faz)
5. ⏳ Configurar CSC na SEFAZ (você faz)
6. ⏳ Preencher `.env.local` (você faz)
7. ⏳ Testar em homologação
8. ⏳ Ir para produção

## Troubleshooting

**P: Recebo erro "CNPJ inválido"**
R: Verifique se o CNPJ está no formato correto (14 dígitos sem formatação)

**P: A nota não está sendo emitida**
R: Verifique se todas as variáveis de ambiente estão configuradas. Use `NFEW_AMBIENTE=1` para testar.

**P: Qual é o NCM dos produtos?**
R: NCM (Nomenclatura Comum do Mercosul) identifica a classe fiscal do produto. Consulte com seu contador.

**P: Preciso de certificado para cada estado?**
R: Não, um certificado é válido para qualquer estado. O campo UF indica de onde a empresa emite.

## Suporte

Para dúvidas sobre NFewizard, consulte:
- Documentação oficial: https://nfewizard-org.github.io/
- Issues no GitHub: https://github.com/nfewizard-org/nfewizard-io/issues
