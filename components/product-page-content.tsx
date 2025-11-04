"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ShoppingCart, AlertCircle, Minus, Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface ProductPageContentProps {
  slug: string
}

export function ProductPageContent({ slug }: ProductPageContentProps) {
  const { products, addCart, trackProductClick, cookiesAccepted, setCookiesAccepted } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showCookieWarning, setShowCookieWarning] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (products.length > 0) {
      setIsLoading(false)
    }
  }, [products])

  const product = products.find((p) => p.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase())

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-gray-600">Carregando produto...</p>
      </div>
    )
  }

  if (!product) {
    console.log("[v0] Product not found. Slug:", slug)
    console.log(
      "[v0] Available products:",
      products.map((p) => p.name.toLowerCase().replace(/\s+/g, "-")),
    )
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Produto não encontrado</h1>
        <p className="text-gray-600 mb-6">O produto que você está procurando não existe.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  const productImages = [product.image, "/product-variant.png"]

  const handleBuyClick = () => {
    if (!cookiesAccepted) {
      setShowCookieWarning(true)
      return
    }
    trackProductClick(product)
    setShowBuyModal(true)
  }

  const handleAddToCart = () => {
    if (!cookiesAccepted) {
      setCookiesAccepted(true)
    }
    addCart(product, quantity)
    setShowBuyModal(false)
  }

  const installmentPrice = (product.price / 10).toFixed(2)

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Image Gallery */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center aspect-square">
              <div className="relative w-full h-full">
                <Image
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                />
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-lg border-2 overflow-hidden flex items-center justify-center transition-all ${
                    selectedImage === idx
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-gray-400 bg-gray-50"
                  }`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`Imagem ${idx + 1}`}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="flex flex-col gap-6">
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-700 text-base leading-relaxed">{product.description}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span className="text-red-600 font-semibold text-sm">Últimas unidades (1 unidade disponível)</span>
            </div>

            {/* Main Price */}
            <div className="border-t border-b border-gray-200 py-6 space-y-2">
              <p className="text-4xl font-bold text-green-600">R$ {product.price.toFixed(2).replace(".", ",")}</p>
              <p className="text-sm text-gray-700">Em até 10x sem juros</p>
            </div>

            {/* Installment Options */}
            <Card className="bg-gray-50 border-0">
              <CardContent className="p-4 space-y-2">
                <p className="text-lg font-bold text-gray-900">10x de R$ {installmentPrice.replace(".", ",")}</p>
                <p className="text-xs text-gray-600">(com juros de 2.19% a.m.)</p>
                <Link href="#" className="text-blue-600 hover:underline text-sm font-semibold">
                  Ver mais opções de pagamento
                </Link>
              </CardContent>
            </Card>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-900">Quantidade</label>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4 text-gray-600" />
                </button>
                <span className="px-6 py-2 font-semibold text-lg text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100 transition-colors">
                  <Plus className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <Button
                variant="outline"
                className="text-gray-900 border-gray-300 hover:bg-gray-50 font-bold py-6 bg-transparent"
                onClick={handleBuyClick}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Adicionar ao carrinho
              </Button>
              <Button className="bg-green-600 hover:bg-green-700 text-white font-bold py-6" onClick={handleBuyClick}>
                <ArrowLeft className="w-5 h-5 mr-2 rotate-180" />
                Comprar agora
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Warning Modal */}
      <Dialog open={showCookieWarning} onOpenChange={setShowCookieWarning}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              Aceitar Cookies
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-800">
              Para continuar com a compra, você precisa aceitar os cookies para que possamos rastrear dados de
              navegação.
            </p>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowCookieWarning(false)} className="text-gray-900">
              Não aceitar
            </Button>
            <Button
              onClick={() => {
                setCookiesAccepted(true)
                setShowCookieWarning(false)
                setShowBuyModal(true)
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Aceitar e Continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Buy Modal */}
      <Dialog open={showBuyModal} onOpenChange={setShowBuyModal}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle className="text-gray-900">Escolha uma opção</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="font-semibold text-gray-900 mb-2">
                {quantity}x {product.name}
              </p>
              <p className="text-3xl font-bold text-green-600">
                R$ {(product.price * quantity).toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowBuyModal(false)} className="text-gray-900">
              Cancelar
            </Button>
            <Button onClick={handleAddToCart} className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
              Adicionar ao Carrinho
            </Button>
            <Link href="/carrinho" className="flex-1">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Ver Carrinho</Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
