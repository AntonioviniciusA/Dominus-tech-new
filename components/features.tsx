import { Truck, CreditCard, Shield } from "lucide-react"

export function Features() {
  return (
    <section className="bg-black py-12 border-y border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Entrega */}
          <div className="flex items-start gap-4">
            <div className="bg-green-600/20 p-4 rounded-lg">
              <Truck className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Entrega</h3>
              <p className="text-gray-400 text-sm">Entregamos para todo o DF e entorno</p>
            </div>
          </div>

          {/* Parcele */}
          <div className="flex items-start gap-4">
            <div className="bg-green-600/20 p-4 rounded-lg">
              <CreditCard className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Parcele</h3>
              <p className="text-gray-400 text-sm">Parcele em até 18x com juros</p>
            </div>
          </div>

          {/* Compra Segura */}
          <div className="flex items-start gap-4">
            <div className="bg-green-600/20 p-4 rounded-lg">
              <Shield className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg mb-1">Compra Segura</h3>
              <p className="text-gray-400 text-sm">Seus dados protegidos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
