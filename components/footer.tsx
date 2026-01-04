import { Instagram, MapPin, Mail, Phone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL || "#";
  return (
    <footer className="bg-black text-white border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Institucional */}
          <div>
            <h3 className="font-bold text-lg mb-4">Institucional</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/quem-somos"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link
                  href="/termos-e-condicoes"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Termos e Condições
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-privacidade"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/politica-de-cookies"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Política de Cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Ajuda */}
          <div>
            <h3 className="font-bold text-lg mb-4">Ajuda</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/central-de-atendimento"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Central de Atendimento
                </Link>
              </li>
              <li>
                <Link
                  href="/como-comprar"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Como Comprar
                </Link>
              </li>
              <li>
                <Link
                  href="/prazos-e-entregas"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Prazos e Entregas
                </Link>
              </li>
              <li>
                <Link
                  href="/trocas-e-devolucoes"
                  className="text-gray-400 hover:text-primary transition-colors text-sm"
                >
                  Trocas e Devoluções
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-green-500" />
                (61) 8449-7981 (SAMAMBAIA SUL)
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-green-500" />
                (61) 9633-5282 (ÁGUAS LINDAS)
              </li>
              <li className="flex items-center gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-green-500" />
                dominusassistencia@gmail.com
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
                Samambaia Sul, Qs 118 Conjunto 06
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-green-500 mt-0.5" />
                Águas Lindas, Qd 05 Lt 23
              </li>
            </ul>
          </div>

          {/* Redes Sociais */}
          <div>
            <h3 className="font-bold text-lg mb-4">Redes Sociais</h3>
            <div className="flex gap-4 mb-6">
              <a
                href={instagramUrl}
                className="bg-gray-800 hover:bg-green-600 p-3 rounded-lg transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Dominus - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}
