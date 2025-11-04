"use client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { ProductPageContent } from "@/components/product-page-content"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProductPageContent slug={slug} />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
