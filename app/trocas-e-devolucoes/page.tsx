import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { RefreshCw, Shield, Clock, Package } from "lucide-react";

export default function TrocasEDevolucoes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Trocas e Devoluções
          </h1>

          <div className="space-y-8 text-gray-700">
            <section>
              <p className="text-lg mb-6">
                Na Dominus Tech, sua satisfação é nossa prioridade. Oferecemos
                uma política clara e transparente de trocas e devoluções,
                garantindo seus direitos como consumidor.
              </p>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Shield className="w-6 h-6 text-green-600" />
                Direito de Arrependimento
              </h2>

              <p className="text-gray-600 mb-4">
                Conforme o Código de Defesa do Consumidor (CDC), você tem o
                direito de se arrepender da compra em até{" "}
                <strong>7 dias corridos</strong> a contar da data de recebimento
                do produto, sem necessidade de justificativa.
              </p>

              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <p className="text-gray-700">
                  <strong>Importante:</strong> O produto deve estar em perfeitas
                  condições, na embalagem original, com todos os acessórios,
                  manuais e notas fiscais. Não podem apresentar sinais de uso,
                  danos ou violação da embalagem de fábrica.
                </p>
              </div>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <RefreshCw className="w-6 h-6 text-green-600" />
                Como Solicitar Troca ou Devolução
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Entre em Contato
                    </h3>
                    <p className="text-gray-600">
                      Entre em contato conosco através dos nossos canais de
                      atendimento informando o número do pedido e o motivo da
                      troca ou devolução. Nossa equipe irá orientá-lo sobre o
                      processo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Preparação do Produto
                    </h3>
                    <p className="text-gray-600">
                      Embalhe o produto com cuidado na embalagem original,
                      incluindo todos os acessórios, manuais e documentos.
                      Certifique-se de que está bem protegido para evitar danos
                      durante o transporte.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Envio ou Retirada
                    </h3>
                    <p className="text-gray-600">
                      Você pode enviar o produto pelos Correios (custo do frete
                      será reembolsado) ou entregar diretamente em uma de nossas
                      lojas físicas. Nossa equipe fornecerá todas as instruções
                      necessárias.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Análise e Processamento
                    </h3>
                    <p className="text-gray-600">
                      Após recebermos o produto, faremos uma análise para
                      verificar se está em condições de troca ou devolução. O
                      processo leva de 3 a 5 dias úteis.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Aprovação e Resolução
                    </h3>
                    <p className="text-gray-600">
                      Se aprovado, processaremos a troca ou devolução. No caso
                      de troca, enviaremos o novo produto. No caso de devolução,
                      faremos o reembolso conforme o método de pagamento
                      original.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-green-600" />
                Prazos
              </h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Prazo para Solicitação
                  </h3>
                  <p className="text-gray-600">
                    <strong>7 dias corridos</strong> a partir da data de
                    recebimento do produto.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Prazo para Análise
                  </h3>
                  <p className="text-gray-600">
                    <strong>3 a 5 dias úteis</strong> após o recebimento do
                    produto em nossa loja.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Prazo para Reembolso
                  </h3>
                  <p className="text-gray-600">
                    <strong>Até 10 dias úteis</strong> após a aprovação da
                    devolução, creditado conforme o método de pagamento
                    original.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Prazo para Envio de Troca
                  </h3>
                  <p className="text-gray-600">
                    <strong>Até 5 dias úteis</strong> após a aprovação da troca.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-green-600" />
                Condições para Trocas e Devoluções
              </h2>

              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    ✓ Produtos Aceitos
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Produtos em embalagem original fechada</li>
                    <li>Produtos sem uso, sem sinais de manuseio</li>
                    <li>Produtos com todos os acessórios e manuais</li>
                    <li>Produtos com nota fiscal e documentos originais</li>
                  </ul>
                </div>

                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    ✗ Produtos Não Aceitos
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Produtos sem embalagem original ou danificados</li>
                    <li>Produtos com sinais de uso ou danos</li>
                    <li>Produtos com acessórios ou manuais faltando</li>
                    <li>Produtos personalizados ou sob medida</li>
                    <li>
                      Produtos de software com código de ativação utilizado
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Garantia do Fabricante
              </h2>

              <p className="text-gray-600 mb-4">
                Além do direito de arrependimento, todos os produtos
                comercializados pela Dominus Tech possuem garantia do
                fabricante. A garantia cobre defeitos de fabricação e funciona
                conforme as especificações de cada fabricante.
              </p>

              <p className="text-gray-600">
                Em caso de problemas durante o período de garantia, entre em
                contato conosco. Orientaremos você sobre como proceder com a
                assistência técnica autorizada ou diretamente com o fabricante,
                conforme o caso.
              </p>
            </section>

            <section className="bg-yellow-50 p-8 rounded-lg border border-yellow-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Custos de Frete
              </h2>
              <p className="text-gray-700 mb-2">
                <strong>Devolução por arrependimento:</strong> O frete de
                retorno é por conta do cliente, exceto quando houver erro nosso
                ou defeito no produto.
              </p>
              <p className="text-gray-700">
                <strong>Troca por defeito:</strong> Todos os custos de frete são
                por nossa conta.
              </p>
            </section>

            <section className="bg-green-50 p-8 rounded-lg border border-green-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Precisa de Ajuda?
              </h2>
              <p className="text-gray-700 mb-4">
                Nossa equipe está pronta para esclarecer qualquer dúvida sobre
                trocas e devoluções. Entre em contato através dos nossos canais:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>
                  📞 <strong>Telefone:</strong> (61) 8449-7981 (Samambaia Sul)
                  ou (61) 9633-5282 (Águas Lindas)
                </li>
                <li>
                  📧 <strong>E-mail:</strong> dominusassistencia@gmail.com
                </li>
                <li>
                  💬 <strong>WhatsApp:</strong> Disponível no site
                </li>
                <li>
                  🏪 <strong>Lojas Físicas:</strong> Samambaia Sul ou Águas
                  Lindas
                </li>
              </ul>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
