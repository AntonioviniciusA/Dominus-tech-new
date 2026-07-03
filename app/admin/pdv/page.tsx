"use client"

import { PdvClient } from "@/components/pdv-client"

export default function PdvPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-green-500">Ponto de Venda (PDV)</h1>
          <p className="text-gray-400 text-sm mt-1">Realize vendas e gerencie o carrinho</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 flex-1">
        <PdvClient />
      </div>
    </div>
  )
}
