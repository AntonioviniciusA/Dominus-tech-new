"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useStore } from "@/lib/store-context"
import { useState } from "react"

interface ProductCardProps {
  name: string
  description: string
  price: number
  installments: number
  installmentPrice: number
  image: string
  productId?: string
  slug?: string
  onBuyClick?: () => void
}

export function ProductCard({
  name,
  description,
  price,
  installments,
  installmentPrice,
  image,
  productId,
  slug,
  onBuyClick,
}: ProductCardProps) {
  const { trackProductClick } = useStore()
  const [isClicked, setIsClicked] = useState(false)

  const handleProductClick = () => {
    if (productId) {
      trackProductClick({
        id: productId,
        name,
        description,
        price,
        image,
        departmentId: "",
        categoryId: "",
        installments,
        installmentPrice,
      })
      setIsClicked(true)
    }
  }

  const handleBuyClick = () => {
    handleProductClick()
    onBuyClick?.()
  }

  return (
    <Link href={slug ? `/produto/${slug}` : "#"} onClick={handleProductClick} className="block">
      <Card className="bg-white border-gray-200 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
        <CardContent className="p-4 flex-1">
          <div className="relative aspect-square mb-4">
            <Image src={image || "/placeholder.svg"} alt={name} fill className="object-contain" />
          </div>
          <h3 className="font-bold text-lg mb-2 text-background">{name}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{description}</p>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-green-600">R$ {price.toFixed(2).replace(".", ",")}</p>
            <p className="text-sm text-gray-600">
              ou {installments}x de R$ {installmentPrice.toFixed(2).replace(".", ",")} com juros
            </p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
            onClick={(e) => {
              e.preventDefault()
              handleBuyClick()
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Comprar
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
