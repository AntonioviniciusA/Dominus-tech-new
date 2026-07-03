import { NextRequest, NextResponse } from "next/server"

// Importar NFewizard apenas em runtime, nunca durante build
let NFeWizard: any = null

async function initNFeWizard() {
  if (!NFeWizard) {
    try {
      const module = await import("nfewizard-io")
      NFeWizard = module.default
    } catch (error) {
      console.error("Erro ao carregar NFewizard:", error)
      throw new Error("NFewizard não está disponível. Verifique a instalação.")
    }
  }
  return NFeWizard
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      clienteId,
      itens,
      subtotal,
      desconto,
      total,
      formaPagamento,
      clienteNome,
      clienteEmail,
      clienteCPFCNPJ,
    } = body

    // Validar dados obrigatórios
    if (!itens || itens.length === 0) {
      return NextResponse.json({ error: "Nenhum item na venda" }, { status: 400 })
    }

    // Validar variáveis de ambiente
    const requiredEnvVars = [
      "NFEW_CERT_PATH",
      "NFEW_CERT_PASSWORD",
      "NFEW_CNPJ",
      "NFEW_UF",
      "NFEW_CSC_ID",
      "NFEW_CSC_TOKEN",
    ]

    for (const envVar of requiredEnvVars) {
      if (!process.env[envVar]) {
        console.error(`Variável de ambiente ${envVar} não configurada`)
        return NextResponse.json(
          {
            error: `NFewizard não configurado`,
            details: `Variável de ambiente ${envVar} não encontrada. Configure as variáveis NFewizard em .env.local`,
            docs: "/NFEWIZARD-SETUP.md",
          },
          { status: 500 }
        )
      }
    }

    // Carregar NFewizard em runtime
    const NFeWizardClass = await initNFeWizard()
    const nfeWizard = new NFeWizardClass()

    console.log("Inicializando ambiente NFewizard...")

    // Configurar ambiente
    await nfeWizard.NFE_LoadEnvironment({
      config: {
        dfe: {
          baixarXMLDistribuicao: false,
          armazenarXMLAutorizacao: true,
          pathXMLAutorizacao: "tmp/Autorizacao",
          armazenarXMLRetorno: true,
          pathXMLRetorno: "tmp/RequestLogs",
          armazenarXMLConsultaComTagSoap: false,
          armazenarRetornoEmJSON: true,
          pathRetornoEmJSON: "tmp/DistribuicaoDFe",

          pathCertificado: process.env.NFEW_CERT_PATH!,
          senhaCertificado: process.env.NFEW_CERT_PASSWORD!,
          UF: process.env.NFEW_UF!,
          CPFCNPJ: process.env.NFEW_CNPJ!,
        },
        nfe: {
          ambiente: process.env.NFEW_AMBIENTE ? parseInt(process.env.NFEW_AMBIENTE) : 2,
          versaoDF: "4.00",
          idCSC: parseInt(process.env.NFEW_CSC_ID!),
          tokenCSC: process.env.NFEW_CSC_TOKEN!,
        },
        lib: {
          connection: {
            timeout: 30000,
          },
        },
      },
    })

    // Preparar dados da NF-e
    const nfeData = {
      ide: {
        cUF: parseInt(process.env.NFEW_UF_CODE || "35"),
        natOp: "VENDA",
        mod: 55,
        serie: 1,
        nNF: Math.floor(Math.random() * 999999999) + 1,
        dhEmi: new Date().toISOString(),
        tpEmis: 1,
        idDest: 1,
        indFinal: 1,
        indPres: 1,
        procEmi: 0,
        verProc: "1.0",
      },
      emit: {
        CNPJ: process.env.NFEW_CNPJ!,
        xNome: process.env.NFEW_RAZAO_SOCIAL || "Empresa",
        xFant: process.env.NFEW_NOME_FANTASIA || "Empresa",
        enderEmit: {
          xLgr: process.env.NFEW_ENDERECO_RUA || "Rua",
          nro: process.env.NFEW_ENDERECO_NUMERO || "0",
          xBairro: process.env.NFEW_ENDERECO_BAIRRO || "Bairro",
          cMun: parseInt(process.env.NFEW_COD_MUN || "3550308"),
          xMun: process.env.NFEW_MUNICIPIO || "São Paulo",
          UF: process.env.NFEW_UF!,
          CEP: process.env.NFEW_CEP || "00000000",
          cPais: 1058,
          xPais: "Brasil",
        },
        IE: process.env.NFEW_IE || "0",
        CRT: 1,
      },
      dest: {
        CNPJ: clienteCPFCNPJ || "00000000000000",
        xNome: clienteNome || "Consumidor final",
        indIEDest: 9,
        enderDest: {
          xLgr: "Não informado",
          nro: "0",
          xBairro: "Não informado",
          cMun: parseInt(process.env.NFEW_COD_MUN || "3550308"),
          xMun: process.env.NFEW_MUNICIPIO || "São Paulo",
          UF: process.env.NFEW_UF!,
          CEP: "00000000",
          cPais: 1058,
          xPais: "Brasil",
        },
      },
      det: itens.map((item: any, index: number) => ({
        nItem: index + 1,
        prod: {
          code: item.codigo || `PROD${index + 1}`,
          xProd: item.nome,
          NCM: item.ncm || "99999999",
          CFOP: "5102",
          uCom: "UN",
          qCom: item.quantidade,
          vUnCom: item.preco,
          vItem: item.preco * item.quantidade,
          indTot: 1,
        },
        imposto: {
          ICMS: {
            orig: 0,
            CST: "00",
            modBC: 0,
            vBC: item.preco * item.quantidade,
            pICMS: 0,
            vICMS: 0,
          },
          PIS: {
            CST: "07",
          },
          COFINS: {
            CST: "07",
          },
        },
        infAdProd: `Venda PDV - ${new Date().toLocaleDateString("pt-BR")}`,
      })),
      total: {
        ICMSTot: {
          vBC: subtotal,
          vICMS: 0,
          vICMSUEst: 0,
          vST: 0,
          vProd: subtotal,
          vFrete: 0,
          vSeg: 0,
          vDesc: desconto,
          vII: 0,
          vIPI: 0,
          vPIS: 0,
          vCOFINS: 0,
          vOutro: 0,
          vNF: total,
        },
      },
      transp: {
        modFrete: 9,
      },
      pag: {
        detPag: [
          {
            tPag: mapFormaPagamento(formaPagamento),
            vPag: total,
            ...(formaPagamento === "Cartão de Crédito" || formaPagamento === "Cartão de Débito"
              ? {
                  card: {
                    CNPJ: "00000000000000",
                    tBand: formaPagamento === "Cartão de Crédito" ? 1 : 2,
                  },
                }
              : {}),
          },
        ],
      },
      infAdic: {
        infCpl: `Venda realizada no PDV em ${new Date().toLocaleString("pt-BR")}`,
      },
    }

    console.log("Enviando NF-e para autorização...")

    // Emitir NF-e
    const resultado = await nfeWizard.NFE_Autorizacao(nfeData)

    console.log("Resposta da SEFAZ:", resultado)

    return NextResponse.json({
      success: true,
      message: "Nota fiscal emitida com sucesso",
      data: resultado,
    })
  } catch (error) {
    console.error("Erro ao emitir nota fiscal:", error)
    return NextResponse.json(
      {
        error: "Erro ao emitir nota fiscal",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

function mapFormaPagamento(forma: string): string {
  const mapping: Record<string, string> = {
    Dinheiro: "01",
    PIX: "01", // PIX não suportado em algumas SEFAZ, usa dinheiro como fallback
    "Cartão de Crédito": "03",
    "Cartão de Débito": "04",
  }
  return mapping[forma] || "01"
}
