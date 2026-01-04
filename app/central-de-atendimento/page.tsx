import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";

export default function CentralDeAtendimento() {
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "556184497981";

  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Central de Atendimento
          </h1>

          <div className="space-y-8 text-gray-700">
            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Entre em Contato Conosco
              </h2>
              <p className="mb-6">
                Estamos aqui para ajudar! Escolha a forma de contato mais
                conveniente para você.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Telefone
                    </h3>
                    <p className="text-gray-600 mb-1">Samambaia Sul:</p>
                    <a
                      href="tel:6184497981"
                      className="text-green-600 hover:underline font-medium"
                    >
                      (61) 8449-7981
                    </a>
                    <p className="text-gray-600 mb-1 mt-3">Águas Lindas:</p>
                    <a
                      href="tel:6196335282"
                      className="text-green-600 hover:underline font-medium"
                    >
                      (61) 9633-5282
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">E-mail</h3>
                    <a
                      href="mailto:dominusassistencia@gmail.com"
                      className="text-green-600 hover:underline font-medium"
                    >
                      dominusassistencia@gmail.com
                    </a>
                    <p className="text-gray-600 text-sm mt-2">
                      Respondemos em até 24 horas úteis
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MessageCircle className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      WhatsApp
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Entre em contato através do nosso WhatsApp
                    </p>
                    <a
                      href={`https://wa.me/${phoneNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Falar no WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Lojas Físicas
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="font-medium text-gray-900">Samambaia Sul</p>
                      <p className="text-sm">Qs 118 Conjunto 06</p>
                      <p className="font-medium text-gray-900 mt-3">
                        Águas Lindas
                      </p>
                      <p className="text-sm">Qd 05 Lt 23</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Horário de Atendimento
              </h2>
              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-green-600 mt-1" />
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <strong>Segunda a Sexta:</strong> 9h às 18h
                  </p>
                  <p className="text-gray-700">
                    <strong>Sábado:</strong> 9h às 14h
                  </p>
                  <p className="text-gray-700">
                    <strong>Domingo:</strong> Fechado
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Perguntas Frequentes
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Como posso rastrear meu pedido?
                  </h3>
                  <p className="text-gray-600">
                    Você pode entrar em contato conosco para informações sobre
                    seu pedido.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Qual o prazo de entrega?
                  </h3>
                  <p className="text-gray-600">
                    O prazo de entrega varia conforme a região e o produto.
                    Geralmente, entregas na região do DF e entorno levam de 2 a
                    5 dias úteis. Para mais informações, consulte nossa página
                    de Prazos e Entregas.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Como faço para trocar ou devolver um produto?
                  </h3>
                  <p className="text-gray-600">
                    Você tem até 7 dias corridos para solicitar a troca ou
                    devolução, conforme o Código de Defesa do Consumidor. Para
                    mais detalhes, consulte nossa página de Trocas e Devoluções.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Quais formas de pagamento são aceitas?
                  </h3>
                  <p className="text-gray-600">
                    Aceitamos cartões de crédito (em até 18x com juros), cartão
                    de débito, transferência bancária e PIX.
                  </p>
                </div>
              </div>
            </section>

            <section className="bg-white p-8 rounded-lg shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Outros Canais
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Redes Sociais
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Siga-nos nas redes sociais para ficar por dentro de
                    novidades, promoções e dicas:
                  </p>
                  <div className="flex gap-4">
                    <a
                      href={instagramUrl}
                      className="text-green-600 hover:underline font-medium"
                    >
                      Instagram
                    </a>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Newsletter
                  </h3>
                  <p className="text-gray-600">
                    Cadastre-se em nossa newsletter para receber ofertas
                    exclusivas e novidades em primeira mão.
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
