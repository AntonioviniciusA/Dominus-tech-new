"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"

export function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isValidating, setIsValidating] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)

  // Valida o token ao carregar a página
  useEffect(() => {
    if (!token) {
      setError("Token não fornecido")
      setIsValidating(false)
      return
    }

    const validateToken = async () => {
      try {
        const response = await fetch(`/api/admin/reset-password?token=${token}`)
        const data = await response.json()

        if (response.ok && data.valid) {
          setIsTokenValid(true)
        } else {
          setError(data.error || "Token inválido ou expirado")
        }
      } catch (err) {
        setError("Erro ao validar token. Tente novamente.")
      } finally {
        setIsValidating(false)
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!password || !confirmPassword) {
      setError("Todos os campos são obrigatórios")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    if (password !== confirmPassword) {
      setError("As senhas não correspondem")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/admin/login")
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || "Erro ao redefinir senha")
      }
    } catch (err) {
      setError("Erro ao conectar. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isValidating) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="w-full max-w-md bg-white">
          <CardContent className="p-8 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-gray-900 animate-spin" />
            <p className="text-gray-600 mt-4">Validando link...</p>
          </CardContent>
        </Card>
      </div>
    )
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
              Digite sua nova senha
            </p>
          </div>

          {isTokenValid && !success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua nova senha"
                    className="w-full text-gray-900 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirme sua nova senha"
                    className="w-full text-gray-900 pr-10"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-600 hover:text-gray-900"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2"
                disabled={isLoading}
              >
                {isLoading ? "Redefinindo..." : "Redefinir Senha"}
              </Button>
            </form>
          )}

          {success && (
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <p className="text-gray-900 font-semibold mb-2">Senha redefinida com sucesso!</p>
              <p className="text-gray-600 text-sm">
                Redirecionando para login em alguns segundos...
              </p>
            </div>
          )}

          {!isTokenValid && !success && (
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <p className="text-red-600 font-semibold mb-2">{error}</p>
              <p className="text-gray-600 text-sm mb-6">
                O link pode estar expirado ou já ter sido utilizado.
              </p>
              <Link href="/admin/forgot-password">
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  Solicitar novo link
                </Button>
              </Link>
            </div>
          )}

          <p className="text-xs text-gray-500 text-center mt-4">
            Desenvolvido por DominusTech
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
