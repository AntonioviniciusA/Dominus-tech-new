import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import {
  ShoppingCart,
  CreditCard,
  Truck,
  ShieldCheck,
  MapPin,
} from "lucide-react";

export default function ComoComprar() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Como Comprar
          </h1>

          <div className="space-y-8 text-gray-700">
            <section>
              <p className="text-lg mb-6">
                Comprar na Dominus Tech é simples, rápido e seguro! Siga o passo
                a passo abaixo e tenha seus produtos favoritos em poucos
                cliques.
              </p>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                      Escolha Seus Produtos
                    </h2>
                    <p className="text-gray-600">
                      Navegue pelo nosso catálogo, use a busca ou explore por
                      categorias e departamentos. Quando encontrar o produto
                      desejado, clique nele para ver mais detalhes,
                      especificações e fotos. Adicione ao carrinho quando
                      estiver pronto para comprar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-green-600" />
                      Revise Seu Carrinho
                    </h2>
                    <p className="text-gray-600">
                      Acesse o carrinho de compras para revisar os produtos
                      selecionados. Você pode alterar quantidades, remover itens
                      ou continuar comprando. Verifique os preços, condições de
                      parcelamento e o valor total antes de prosseguir.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                      Faça Login ou Cadastre-se
                    </h2>
                    <p className="text-gray-600">
                      Para finalizar a compra, você precisa estar logado. Se já
                      possui uma conta, faça login. Caso contrário, crie uma
                      conta rapidamente fornecendo seus dados. É rápido, seguro
                      e gratuito!
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    4
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      Informe o Endereço de Entrega
                    </h2>
                    <p className="text-gray-600">
                      Informe o endereço onde deseja receber seus produtos. Você
                      pode cadastrar múltiplos endereços e escolher o mais
                      conveniente para cada compra. Verifique se todos os dados
                      estão corretos para evitar problemas na entrega.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    5
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-green-600" />
                      Escolha a Forma de Pagamento
                    </h2>
                    <p className="text-gray-600 mb-3">
                      Selecione a forma de pagamento que preferir:
                    </p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600">
                      <li>
                        <strong>Cartão de Crédito:</strong> Parcelamento em até
                        18x com juros (conforme condições)
                      </li>
                      <li>
                        <strong>Cartão de Débito:</strong> Pagamento à vista com
                        desconto
                      </li>
                      <li>
                        <strong>PIX:</strong> Desconto especial e confirmação
                        imediata
                      </li>
                      <li>
                        <strong>Transferência Bancária:</strong> Desconto e
                        pagamento à vista
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    6
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-green-600" />
                      Confirme e Acompanhe Seu Pedido
                    </h2>
                    <p className="text-gray-600">
                      Revise todas as informações do pedido e confirme a compra.
                      Você receberá um e-mail de confirmação com os detalhes do
                      pedido e um código de rastreamento. Acompanhe o status da
                      entrega através do nosso site ou pelo código fornecido.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-green-50 p-8 rounded-lg border border-green-200">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Dicas para uma Compra Segura
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>
                    Verifique sempre os dados antes de finalizar a compra
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Mantenha seus dados de login em segurança</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>Confirme que o endereço de entrega está correto</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>
                    Guarde o número do pedido e o e-mail de confirmação
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>
                    Em caso de dúvidas, entre em contato com nossa Central de
                    Atendimento
                  </span>
                </li>
              </ul>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Perguntas Frequentes
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Preciso criar uma conta para comprar?
                  </h3>
                  <p className="text-gray-600">
                    Sim, é necessário criar uma conta para finalizar a compra.
                    Isso garante a segurança das suas informações e permite que
                    você acompanhe seus pedidos.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Posso comprar pelo telefone?
                  </h3>
                  <p className="text-gray-600">
                    Sim! Entre em contato conosco pelos telefones (61) 8449-7981
                    (Samambaia Sul) ou (61) 9633-5282 (Águas Lindas) e nossa
                    equipe terá prazer em ajudá-lo.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Como sei se o produto está disponível?
                  </h3>
                  <p className="text-gray-600">
                    Produtos disponíveis mostram o botão "Adicionar ao
                    Carrinho". Se o produto estiver esgotado, você pode entrar
                    em contato conosco para verificar a disponibilidade ou
                    receber notificação quando o produto estiver disponível
                    novamente.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
