"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export function CookieConsent() {
  const { cookiesAccepted, setCookiesAccepted } = useStore()
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    setShowBanner(!cookiesAccepted)
  }, [cookiesAccepted])

  const handleAccept = () => {
    setCookiesAccepted(true)
    setShowBanner(false)
  }

  const handleReject = () => {
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-green-600 p-4 z-40">
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="text-white text-sm flex-1">
          <p className="mb-1">
            Usamos cookies para melhorar sua experiência e rastrear dados de cliques de produtos para analytics.
          </p>
          <p className="text-xs text-gray-400">
            Ao aceitar, você permite que coletemos dados sobre quais produtos você visualiza.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            className="text-white border-white hover:bg-gray-900 bg-transparent"
          >
            Rejeitar
          </Button>
          <Button size="sm" onClick={handleAccept} className="bg-green-600 hover:bg-green-700 text-white">
            Aceitar
          </Button>
        </div>
        <button onClick={handleReject} className="text-white hover:text-gray-400">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
