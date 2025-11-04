import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { Truck, MapPin, Clock, Package } from "lucide-react";

export default function PrazosEEntregas() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Prazos e Entregas
          </h1>

          <div className="space-y-8 text-gray-700">
            <section>
              <p className="text-lg mb-6">
                Na Dominus Tech, trabalhamos com as melhores transportadoras
                para garantir que seus produtos cheguem com segurança e no prazo
                combinado. Conheça nossas opções de entrega e prazos.
              </p>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Truck className="w-6 h-6 text-green-600" />
                Opções de Entrega
              </h2>

              <div className="space-y-6">
                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Entrega Padrão
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <strong>Prazo:</strong> 3 a 5 dias úteis após a confirmação
                    do pagamento
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Região:</strong> DF e Região Metropolitana
                  </p>
                  <p className="text-gray-600">
                    <strong>Valor:</strong> R$ 15,00 (grátis para compras acima
                    de R$ 200,00)
                  </p>
                </div>

                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Entrega Expressa
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <strong>Prazo:</strong> 1 a 2 dias úteis após a confirmação
                    do pagamento
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Região:</strong> DF e Região Metropolitana
                  </p>
                  <p className="text-gray-600">
                    <strong>Valor:</strong> R$ 25,00
                  </p>
                </div>

                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Retirada na Loja
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <strong>Prazo:</strong> 1 dia útil após a confirmação do
                    pagamento
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Lojas:</strong> Samambaia Sul ou Águas Lindas
                  </p>
                  <p className="text-gray-600">
                    <strong>Valor:</strong> Grátis
                  </p>
                </div>

                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Entrega para Outras Regiões
                  </h3>
                  <p className="text-gray-600 mb-2">
                    <strong>Prazo:</strong> 5 a 10 dias úteis (varia conforme a
                    região)
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Valor:</strong> Calculado automaticamente no
                    checkout
                  </p>
                  <p className="text-gray-600">
                    Entre em contato conosco para verificar o prazo e valor para
                    sua região.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-green-600" />
                Como Funciona o Processo de Entrega
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Confirmação do Pedido
                    </h3>
                    <p className="text-gray-600">
                      Após a confirmação do pagamento, você receberá um e-mail
                      com o número do pedido e as informações da compra.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Separação e Embalagem
                    </h3>
                    <p className="text-gray-600">
                      Seu pedido é separado com cuidado, embalado de forma
                      segura e preparado para envio.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Envio</h3>
                    <p className="text-gray-600">
                      O produto é enviado pela transportadora selecionada e você
                      recebe o código de rastreamento por e-mail.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Rastreamento
                    </h3>
                    <p className="text-gray-600">
                      Acompanhe seu pedido em tempo real usando o código de
                      rastreamento fornecido.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Entrega
                    </h3>
                    <p className="text-gray-600">
                      O produto é entregue no endereço informado. Certifique-se
                      de que alguém esteja presente para receber.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-green-600" />
                Informações Importantes
              </h2>

              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Presença no Recebimento
                  </h3>
                  <p className="text-gray-700">
                    É necessário que alguém esteja presente no endereço de
                    entrega no horário comercial. Caso não haja ninguém, a
                    transportadora tentará uma nova entrega ou deixará aviso
                    para retirada na agência.
                  </p>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Verificação do Produto
                  </h3>
                  <p className="text-gray-700">
                    Recomendamos verificar o produto na presença do entregador.
                    Se houver qualquer problema, recuse o recebimento e entre em
                    contato conosco imediatamente.
                  </p>
                </div>

                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Endereço Correto
                  </h3>
                  <p className="text-gray-700">
                    Verifique sempre se o endereço de entrega está correto antes
                    de finalizar a compra. Alterações após o envio podem gerar
                    custos adicionais ou atrasos.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-6 h-6 text-green-600" />
                Atrasos na Entrega
              </h2>

              <p className="text-gray-600 mb-4">
                Caso seu pedido atrase além do prazo informado, entre em contato
                conosco imediatamente. Investigaremos o ocorrido e tomaremos as
                medidas necessárias para resolver a situação.
              </p>

              <p className="text-gray-600">
                Fatores externos como greves, condições climáticas extremas ou
                problemas com a transportadora podem afetar os prazos. Nestes
                casos, mantemos você informado sobre qualquer alteração.
              </p>
            </section>

            <section className="bg-green-50 p-8 rounded-lg border border-green-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Dúvidas sobre Entrega?
              </h2>
              <p className="text-gray-700 mb-4">
                Nossa equipe está pronta para ajudar! Entre em contato através
                dos nossos canais:
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
