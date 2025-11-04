"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CarrinhoPage() {
  const { cart, removeCart, updateCartQuantity, clearCart } = useStore()

  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)

  const handleWhatsAppCheckout = () => {
    const message = cart
      .map(
        (item) =>
          `${item.quantity}x ${item.name} - R$ ${(item.product.price * item.quantity).toFixed(2).replace(".", ",")}`,
      )
      .join("\n")

    const whatsappMessage = encodeURIComponent(
      `Olá! Gostaria de fazer o seguinte pedido:\n\n${message}\n\n*Total: R$ ${total.toFixed(2).replace(".", ",")}*`,
    )

    window.open(`https://wa.me/5585987654321?text=${whatsappMessage}`, "_blank")
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-800 hover:text-green-600 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>

          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Carrinho vazio</h1>
            <p className="text-gray-700 mb-6">Você não tem produtos no carrinho ainda.</p>
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Continuar Comprando</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-800 hover:text-green-600 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Seu Carrinho</h1>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.product.id} className="bg-white">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-24 h-24 flex-shrink-0">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-2">{item.product.name}</h3>
                      <p className="text-green-600 font-bold mb-4">
                        R$ {item.product.price.toFixed(2).replace(".", ",")}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="px-3 py-1 text-gray-800 hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 font-semibold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="px-3 py-1 text-gray-800 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeCart(item.product.id)}
                          className="text-red-600 hover:text-red-800 ml-auto"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">
                        R$ {(item.product.price * item.quantity).toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card className="bg-white sticky top-8">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Resumo do Pedido</h2>

                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between text-gray-900">
                    <span>Subtotal:</span>
                    <span>R$ {total.toFixed(2).replace(".", ",")}</span>
                  </div>
                  <div className="flex justify-between text-gray-900">
                    <span>Frete:</span>
                    <span className="text-gray-700">Calcular</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-bold text-lg text-gray-900">
                    <span>Total:</span>
                    <span className="text-green-600">R$ {total.toFixed(2).replace(".", ",")}</span>
                  </div>
                </div>

                <Button
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6"
                >
                  Finalizar no WhatsApp
                </Button>

                <Button onClick={() => clearCart()} variant="outline" className="w-full text-gray-900">
                  Limpar Carrinho
                </Button>

                <Link href="/" className="block">
                  <Button variant="outline" className="w-full bg-transparent text-gray-900 hover:bg-gray-100">
                    Continuar Comprando
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
