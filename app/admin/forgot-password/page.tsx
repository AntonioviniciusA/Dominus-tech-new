"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSuccess(true)
        setEmail("")
      } else {
        const data = await response.json()
        setError(data.error || "Erro ao processar solicitação.")
      }
    } catch (err) {
      setError("Erro ao conectar. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/images/design-mode/Logo.png"
                alt="Logo"
                width={100}
                height={100}
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Redefinir Senha</h1>
            <p className="text-gray-600 text-sm mt-2">
              Digite seu email para receber um link de redefinição
            </p>
          </div>

          {success && (
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Email enviado!</p>
                <p className="text-xs text-green-700 mt-1">
                  Se o email existe, você receberá um link para redefinir sua senha.
                </p>
              </div>
            </div>
          )}

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full text-gray-900"
                  disabled={isLoading}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar link"}
              </Button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-4">
                Verifique sua caixa de entrada e clique no link para redefinir sua senha.
              </p>
            </div>
          )}

          <Link href="/admin/login" className="flex items-center gap-2 justify-center mt-6 text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para login
          </Link>

          <p className="text-xs text-gray-500 text-center mt-4">
            Desenvolvido por DominusTech
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
