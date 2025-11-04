import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export default function PoliticaDeCookies() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Política de Cookies
          </h1>

          <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
            <section>
              <p className="text-sm text-gray-500 mb-6">
                Última atualização: Janeiro de 2025
              </p>
              <p>
                Esta Política de Cookies explica o que são cookies, como a
                Dominus Tech os utiliza em nosso site e como você pode gerenciar
                suas preferências de cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. O que são Cookies?
              </h2>
              <p>
                Cookies são pequenos arquivos de texto armazenados em seu
                dispositivo (computador, tablet ou smartphone) quando você
                visita um site. Eles são amplamente utilizados para tornar os
                sites funcionais ou mais eficientes, bem como para fornecer
                informações aos proprietários do site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Como Utilizamos Cookies
              </h2>
              <p>Utilizamos cookies para diversos propósitos:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Funcionalidade Essencial:</strong> Para garantir que o
                  site funcione corretamente
                </li>
                <li>
                  <strong>Preferências:</strong> Para lembrar suas preferências
                  e configurações
                </li>
                <li>
                  <strong>Análise:</strong> Para entender como os visitantes
                  interagem com nosso site
                </li>
                <li>
                  <strong>Marketing:</strong> Para personalizar anúncios e medir
                  a eficácia de campanhas
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Tipos de Cookies que Utilizamos
              </h2>

              <div className="space-y-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Cookies Essenciais
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Essenciais para o funcionamento do site. Sem eles, alguns
                    recursos podem não estar disponíveis.
                  </p>
                  <p className="text-sm text-gray-500">
                    Exemplos: cookies de sessão, autenticação, segurança
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Cookies de Desempenho
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Coletam informações sobre como você utiliza o site para nos
                    ajudar a melhorar sua experiência.
                  </p>
                  <p className="text-sm text-gray-500">
                    Exemplos: análise de tráfego, tempo de carregamento, páginas
                    mais visitadas
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Cookies de Funcionalidade
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Permitem que o site lembre suas escolhas e ofereça recursos
                    aprimorados e personalizados.
                  </p>
                  <p className="text-sm text-gray-500">
                    Exemplos: preferências de idioma, região, tamanho de texto
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Cookies de Marketing
                  </h3>
                  <p className="text-gray-600 mb-2">
                    Utilizados para rastrear visitantes em diferentes sites para
                    exibir anúncios relevantes.
                  </p>
                  <p className="text-sm text-gray-500">
                    Exemplos: remarketing, personalização de anúncios, medição
                    de campanhas
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Cookies de Terceiros
              </h2>
              <p>
                Alguns cookies são colocados por serviços de terceiros que
                aparecem em nossas páginas. Estes incluem:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Google Analytics:</strong> Para análise de tráfego e
                  comportamento dos usuários
                </li>
                <li>
                  <strong>Redes Sociais:</strong> Para compartilhamento de
                  conteúdo e integração com redes sociais
                </li>
                <li>
                  <strong>Publicidade:</strong> Para exibição de anúncios
                  relevantes
                </li>
              </ul>
              <p className="mt-4">
                Não temos controle sobre cookies de terceiros. Recomendamos que
                você consulte as políticas de privacidade desses serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Como Gerenciar Cookies
              </h2>
              <p>
                Você pode controlar e gerenciar cookies de várias formas. Tenha
                em mente que, ao remover ou bloquear cookies, algumas partes do
                site podem não funcionar corretamente.
              </p>

              <div className="bg-white p-6 rounded-lg shadow-sm mt-4 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Gerenciamento pelo Navegador
                  </h3>
                  <p className="text-gray-600 mb-2">
                    A maioria dos navegadores permite que você:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600">
                    <li>
                      Veja quais cookies você tem e delete-os individualmente
                    </li>
                    <li>Bloqueie cookies de terceiros</li>
                    <li>Bloqueie todos os cookies</li>
                    <li>Delete todos os cookies ao fechar o navegador</li>
                    <li>Permita cookies apenas de sites específicos</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Instruções por Navegador
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-4 text-gray-600">
                    <li>
                      <strong>Chrome:</strong> Configurações → Privacidade e
                      segurança → Cookies
                    </li>
                    <li>
                      <strong>Firefox:</strong> Opções → Privacidade e Segurança
                      → Cookies e dados do site
                    </li>
                    <li>
                      <strong>Safari:</strong> Preferências → Privacidade →
                      Cookies e dados de sites
                    </li>
                    <li>
                      <strong>Edge:</strong> Configurações → Cookies e
                      permissões de site
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Consentimento
              </h2>
              <p>
                Ao continuar navegando em nosso site após ser informado sobre o
                uso de cookies, você está consentindo com o uso de cookies
                conforme descrito nesta política.
              </p>
              <p>
                Você pode retirar seu consentimento a qualquer momento alterando
                as configurações do seu navegador ou utilizando nossas
                ferramentas de gerenciamento de cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Alterações nesta Política
              </h2>
              <p>
                Podemos atualizar esta Política de Cookies periodicamente.
                Recomendamos que você revise esta página regularmente para se
                manter informado sobre nosso uso de cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Contato
              </h2>
              <p>
                Se você tiver dúvidas sobre nossa Política de Cookies, entre em
                contato conosco:
              </p>
              <div className="bg-white p-6 rounded-lg shadow-sm mt-4">
                <p className="font-semibold text-gray-900">Dominus Tech</p>
                <p className="text-gray-600">
                  E-mail: dominusassistencia@gmail.com
                </p>
                <p className="text-gray-600">
                  Telefone: (61) 8449-7981 (Samambaia Sul)
                </p>
                <p className="text-gray-600">
                  Telefone: (61) 9633-5282 (Águas Lindas)
                </p>
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
