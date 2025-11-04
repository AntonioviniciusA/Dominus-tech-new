"use client"

import Link from "next/link"
import { Package, FolderTree, Tag, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-6">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-500">Área Administrativa</h1>
            <p className="text-gray-400 mt-2">Gerencie produtos, departamentos, categorias e visualize analytics</p>
          </div>
          <button
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" })
              window.location.href = "/admin/login"
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-6">
          <Link href="/admin/produtos">
            <div className="bg-white rounded-lg p-8 border-2 border-gray-200 hover:border-primary transition-colors cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Package className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">Produtos</h2>
                <p className="text-gray-600">Cadastre e gerencie produtos da loja</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/departamentos">
            <div className="bg-white rounded-lg p-8 border-2 border-gray-200 hover:border-primary transition-colors cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <FolderTree className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">Departamentos</h2>
                <p className="text-gray-600">Organize produtos por departamentos</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/categorias">
            <div className="bg-white rounded-lg p-8 border-2 border-gray-200 hover:border-primary transition-colors cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Tag className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">Categorias</h2>
                <p className="text-gray-600">Crie categorias para seus produtos</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/dashboard">
            <div className="bg-white rounded-lg p-8 border-2 border-gray-200 hover:border-primary transition-colors cursor-pointer group">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold mb-2">Analytics</h2>
                <p className="text-gray-600">Visualize dados de cliques dos produtos</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline" size="lg">
              Voltar para a Loja
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
