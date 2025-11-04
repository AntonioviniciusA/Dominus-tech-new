"use client"

import { MessageCircle } from "lucide-react"

export function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    // Substitua pelo número de WhatsApp da Dominus Tech (formato: 5561999999999)
    const phoneNumber = "5561999999999"
    const message = encodeURIComponent("Olá! Gostaria de mais informações.")
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
  }

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50 flex items-center justify-center"
      aria-label="Fale conosco no WhatsApp"
    >
      <MessageCircle className="w-7 h-7" fill="currentColor" />
    </button>
  )
}
