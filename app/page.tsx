"use client"

import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { ProductCard } from "@/components/product-card"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { InitTestData } from "@/components/init-test-data"
import { ProductFilters } from "@/components/product-filters"
import { Flame } from "lucide-react"
import { useStore } from "@/lib/store-context"
import { useState, useMemo } from "react"

export default function Home() {
  const { products } = useStore()
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000,
    departments: [] as string[],
    categories: [] as string[],
  })

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const priceMatch = product.price >= filters.minPrice && product.price <= filters.maxPrice
      const deptMatch = filters.departments.length === 0 || filters.departments.includes(product.departmentId)
      const catMatch = filters.categories.length === 0 || filters.categories.includes(product.categoryId)
      return priceMatch && deptMatch && catMatch
    })
  }, [products, filters])

  return (
    <div className="min-h-screen bg-gray-50">
      <InitTestData />
      <Header />
      <HeroBanner />

      {/* Destaques Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Flame className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-900">DESTAQUES</h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="md:col-span-1">
            <ProductFilters onFiltersChange={setFilters} />
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-700 text-lg font-medium">
                  Nenhum produto encontrado com os filtros selecionados
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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

            {/* Pagination */}
            {filteredProducts.length > 0 && (
              <div className="flex items-center justify-center gap-4 mt-8">
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                  Anterior
                </button>
                <span className="text-gray-800 font-medium">1 / 1</span>
                <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                  Próxima
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Features />
      <Footer />

      <WhatsAppFloat />
    </div>
  )
}
