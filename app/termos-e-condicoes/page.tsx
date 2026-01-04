import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export default function TermosECondicoes() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Termos e Condições
          </h1>

          <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
            <section>
              <p className="text-sm text-gray-500 mb-6">
                Última atualização: Janeiro de 2025
              </p>
              <p>
                Ao acessar e utilizar o site da Dominus Tech, você concorda em
                cumprir e estar vinculado aos seguintes termos e condições de
                uso. Por favor, leia cuidadosamente antes de utilizar nossos
                serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Aceitação dos Termos
              </h2>
              <p>
                Ao acessar este site e realizar compras, você confirma que leu,
                compreendeu e aceita todos os termos e condições aqui descritos.
                Se você não concorda com qualquer parte destes termos, não deve
                utilizar nosso site ou serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Uso do Site
              </h2>
              <p>
                Você concorda em utilizar o site apenas para fins legais e de
                acordo com estes termos. É proibido:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  Utilizar o site de forma que possa danificar, desabilitar ou
                  sobrecarregar nossos servidores
                </li>
                <li>
                  Tentar obter acesso não autorizado a qualquer parte do site
                </li>
                <li>
                  Reproduzir, duplicar ou copiar qualquer conteúdo sem
                  autorização
                </li>
                <li>
                  Utilizar robôs, spiders ou outros dispositivos automatizados
                  para acessar o site
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Produtos e Preços
              </h2>
              <p>
                Fazemos o possível para garantir que todas as informações sobre
                produtos, incluindo descrições, preços e disponibilidade,
                estejam corretas. No entanto, reservamos o direito de corrigir
                erros e fazer alterações a qualquer momento.
              </p>
              <p>
                Os preços estão sujeitos a alterações sem aviso prévio. O preço
                efetivamente cobrado será o preço exibido no momento da
                finalização da compra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Pagamento
              </h2>
              <p>
                Aceitamos diversas formas de pagamento, incluindo cartões de
                crédito, débito, dinheiro ou pix.
              </p>
              <p>
                Ao realizar uma compra, você declara que possui autorização para
                utilizar o método de pagamento selecionado e que as informações
                fornecidas são precisas e completas.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Entrega
              </h2>
              <p>
                As entregas são realizadas conforme os prazos informados no
                momento da compra. Não nos responsabilizamos por atrasos
                causados por transportadoras ou fatores externos fora de nosso
                controle.
              </p>
              <p>
                O cliente deve estar presente no endereço de entrega no horário
                agendado. Em caso de ausência, a entrega poderá ser reagendada
                conforme a política da transportadora.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Garantia e Devoluções
              </h2>
              <p>
                Todos os produtos comercializados pela Dominus Tech possuem
                garantia do fabricante, conforme especificado na documentação de
                cada produto. Para mais informações sobre trocas e devoluções,
                consulte nossa política específica.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Propriedade Intelectual
              </h2>
              <p>
                Todo o conteúdo do site, incluindo textos, gráficos, logos,
                imagens e software, é propriedade da Dominus Tech ou de seus
                fornecedores e está protegido por leis de direitos autorais e
                outras leis de propriedade intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Limitação de Responsabilidade
              </h2>
              <p>
                A Dominus Tech não será responsável por quaisquer danos diretos,
                indiretos, incidentais ou consequenciais resultantes do uso ou
                da impossibilidade de uso do site ou de produtos adquiridos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Alterações nos Termos
              </h2>
              <p>
                Reservamos o direito de modificar estes termos e condições a
                qualquer momento. As alterações entrarão em vigor imediatamente
                após sua publicação no site. Recomendamos que você revise
                regularmente esta página.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Lei Aplicável
              </h2>
              <p>
                Estes termos e condições são regidos pelas leis brasileiras.
                Qualquer disputa relacionada a estes termos será resolvida nos
                tribunais competentes do Distrito Federal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contato
              </h2>
              <p>
                Se você tiver dúvidas sobre estes termos e condições, entre em
                contato conosco através dos canais de atendimento disponíveis em
                nosso site.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
