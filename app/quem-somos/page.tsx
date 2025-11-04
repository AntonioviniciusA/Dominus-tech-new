import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export default function QuemSomos() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Quem Somos</h1>

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Nossa História
              </h2>
              <p>
                A Dominus Tech nasceu da paixão por tecnologia e do desejo de
                oferecer aos nossos clientes os melhores produtos tecnológicos
                com preços justos e atendimento de qualidade. Fundada em 2020,
                nossa empresa se tornou referência no mercado de tecnologia,
                oferecendo uma ampla variedade de produtos que vão desde
                smartphones e notebooks até acessórios e periféricos.
              </p>
              <p>
                Com duas lojas físicas localizadas em Samambaia Sul e Águas
                Lindas, no Distrito Federal, e uma forte presença online, a
                Dominus Tech está sempre próxima dos nossos clientes, oferecendo
                conveniência e qualidade em cada compra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Nossa Missão
              </h2>
              <p>
                Nossa missão é democratizar o acesso à tecnologia de qualidade,
                oferecendo produtos inovadores e serviços excepcionais que
                transformem a vida dos nossos clientes. Acreditamos que a
                tecnologia deve ser acessível a todos e trabalhamos
                incansavelmente para tornar isso uma realidade.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Nossos Valores
              </h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Qualidade:</strong> Selecionamos apenas os melhores
                  produtos e marcas do mercado.
                </li>
                <li>
                  <strong>Confiança:</strong> Construímos relacionamentos
                  duradouros baseados em transparência e honestidade.
                </li>
                <li>
                  <strong>Inovação:</strong> Estamos sempre em busca das últimas
                  tendências e tecnologias.
                </li>
                <li>
                  <strong>Atendimento:</strong> Nossos clientes são nossa
                  prioridade, e oferecemos suporte completo em todas as etapas.
                </li>
                <li>
                  <strong>Sustentabilidade:</strong> Comprometidos com práticas
                  sustentáveis e responsabilidade ambiental.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Por Que Escolher a Dominus Tech?
              </h2>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Variedade de Produtos
                  </h3>
                  <p className="text-gray-600">
                    Oferecemos uma ampla gama de produtos tecnológicos das
                    melhores marcas do mercado, sempre atualizados com as
                    últimas novidades.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Preços Competitivos
                  </h3>
                  <p className="text-gray-600">
                    Trabalhamos com os melhores preços do mercado, oferecendo
                    condições especiais de pagamento e parcelamento sem juros.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Atendimento Especializado
                  </h3>
                  <p className="text-gray-600">
                    Nossa equipe é altamente capacitada para ajudar você a
                    encontrar o produto perfeito para suas necessidades.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Garantia e Suporte
                  </h3>
                  <p className="text-gray-600">
                    Todos os nossos produtos contam com garantia oficial e
                    oferecemos suporte completo mesmo após a compra.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Nossas Lojas
              </h2>
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Samambaia Sul
                  </h3>
                  <p className="text-gray-600">
                    Qs 118 Conjunto 06, Samambaia Sul - DF
                  </p>
                  <p className="text-gray-600">Telefone: (61) 8449-7981</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Águas Lindas
                  </h3>
                  <p className="text-gray-600">
                    Qd 05 Lt 23, Águas Lindas - GO
                  </p>
                  <p className="text-gray-600">Telefone: (61) 9633-5282</p>
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
