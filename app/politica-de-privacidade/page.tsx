import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";

export default function PoliticaDePrivacidade() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Política de Privacidade
          </h1>

          <div className="prose prose-lg max-w-none space-y-8 text-gray-700">
            <section>
              <p className="text-sm text-gray-500 mb-6">
                Última atualização: Janeiro de 2025
              </p>
              <p>
                A Dominus Tech está comprometida em proteger a privacidade e os
                dados pessoais de nossos clientes. Esta Política de Privacidade
                descreve como coletamos, utilizamos, armazenamos e protegemos
                suas informações pessoais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Informações que Coletamos
              </h2>
              <p>
                Coletamos as seguintes informações quando você utiliza nosso
                site ou serviços:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Informações de Identificação:</strong> Nome, CPF,
                  e-mail, telefone e endereço
                </li>
                <li>
                  <strong>Informações de Pagamento:</strong> Dados do cartão de
                  crédito ou informações bancárias (processadas de forma segura
                  por nossos parceiros)
                </li>
                <li>
                  <strong>Informações de Navegação:</strong> Endereço IP, tipo
                  de navegador, páginas visitadas e tempo de permanência
                </li>
                <li>
                  <strong>Informações de Compra:</strong> Histórico de compras,
                  produtos visualizados e preferências
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Como Utilizamos suas Informações
              </h2>
              <p>Utilizamos suas informações pessoais para:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Processar e entregar seus pedidos</li>
                <li>
                  Comunicar-nos com você sobre seu pedido, produtos e serviços
                </li>
                <li>Melhorar nossos produtos e serviços</li>
                <li>
                  Enviar comunicações de marketing (com seu consentimento)
                </li>
                <li>Prevenir fraudes e garantir a segurança do site</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Compartilhamento de Informações
              </h2>
              <p>
                Não vendemos suas informações pessoais. Compartilhamos suas
                informações apenas nas seguintes situações:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Prestadores de Serviços:</strong> Com empresas que nos
                  ajudam a operar nosso negócio (processamento de pagamentos,
                  entrega, etc.)
                </li>
                <li>
                  <strong>Obrigações Legais:</strong> Quando exigido por lei ou
                  para proteger nossos direitos
                </li>
                <li>
                  <strong>Com seu Consentimento:</strong> Em outras situações
                  com seu consentimento explícito
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Segurança dos Dados
              </h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais
                adequadas para proteger suas informações pessoais contra acesso
                não autorizado, alteração, divulgação ou destruição.
              </p>
              <p>
                Utilizamos criptografia SSL para proteger as transações online e
                armazenamos dados em servidores seguros com acesso restrito.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Cookies e Tecnologias Similares
              </h2>
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua
                experiência de navegação, analisar o tráfego do site e
                personalizar conteúdo. Para mais informações, consulte nossa
                Política de Cookies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Seus Direitos (LGPD)
              </h2>
              <p>
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem
                os seguintes direitos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  <strong>Acesso:</strong> Solicitar acesso às suas informações
                  pessoais
                </li>
                <li>
                  <strong>Correção:</strong> Solicitar correção de dados
                  incompletos ou desatualizados
                </li>
                <li>
                  <strong>Exclusão:</strong> Solicitar a exclusão de dados
                  desnecessários ou excessivos
                </li>
                <li>
                  <strong>Portabilidade:</strong> Solicitar a portabilidade dos
                  seus dados
                </li>
                <li>
                  <strong>Revogação:</strong> Revogar seu consentimento a
                  qualquer momento
                </li>
                <li>
                  <strong>Oposição:</strong> Opor-se ao tratamento de dados em
                  certas circunstâncias
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Retenção de Dados
              </h2>
              <p>
                Mantemos suas informações pessoais apenas pelo tempo necessário
                para cumprir os propósitos descritos nesta política, a menos que
                um período de retenção mais longo seja exigido ou permitido por
                lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Menores de Idade
              </h2>
              <p>
                Nossos serviços não são direcionados a menores de 18 anos. Não
                coletamos intencionalmente informações pessoais de menores. Se
                tomarmos conhecimento de que coletamos informações de um menor,
                tomaremos medidas para excluir essas informações.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Alterações nesta Política
              </h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente.
                Recomendamos que você revise esta página regularmente para se
                manter informado sobre como protegemos suas informações.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Contato
              </h2>
              <p>
                Se você tiver dúvidas sobre esta Política de Privacidade ou
                desejar exercer seus direitos, entre em contato conosco:
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
