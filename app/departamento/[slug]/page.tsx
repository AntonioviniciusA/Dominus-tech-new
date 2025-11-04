"use client"

import { useStore } from "@/lib/store-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { ProductCard } from "@/components/product-card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DepartamentoPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const { departments, getProductsByDepartment } = useStore()

  const department = departments.find((d) => d.slug === slug)
  const products = department ? getProductsByDepartment(department.id) : []

  if (!department) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Departamento não encontrado</h1>
          <Link href="/" className="text-primary hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <h1 className="text-3xl font-bold mb-8">{department.name}</h1>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum produto encontrado neste departamento</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                productId={product.id}
                slug={product.name.toLowerCase().replace(/\s+/g, "-")}
                name={product.name}
                description={product.description}
                price={product.price}
                installments={product.installments || 1}
                installmentPrice={product.installmentPrice || product.price}
                image={product.image}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
