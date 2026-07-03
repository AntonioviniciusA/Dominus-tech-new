import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { ResetPasswordContent } from "./reset-password-content"

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white">
        <CardContent className="p-8 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-gray-900 animate-spin" />
          <p className="text-gray-600 mt-4">Carregando...</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordContent />
    </Suspense>
  )
}
