"use client"

import { useStore } from "@/lib/store-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ArrowLeft } from "lucide-react"

export function DashboardContent() {
  const { analytics, cookiesAccepted } = useStore()

  const sortedAnalytics = [...analytics].sort((a, b) => b.clicks - a.clicks)
  const topProducts = sortedAnalytics.slice(0, 10)
  const totalClicks = analytics.reduce((acc, a) => acc + a.clicks, 0)

  const COLORS = [
    "#16a34a",
    "#22c55e",
    "#86efac",
    "#dcfce7",
    "#22d3ee",
    "#0ea5e9",
    "#3b82f6",
    "#8b5cf6",
    "#d946ef",
    "#ec4899",
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/admin" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-8">
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </Link>

      <h1 className="text-3xl font-bold mb-8">Dashboard de Analytics</h1>

      {!cookiesAccepted ? (
        <Card className="bg-yellow-50 border-yellow-200 mb-8">
          <CardContent className="p-6">
            <p className="text-yellow-800 font-semibold">
              Usuários não aceitaram cookies. Os dados não serão coletados até que aceitem.
            </p>
          </CardContent>
        </Card>
      ) : null}

      {analytics.length === 0 ? (
        <Card className="bg-white">
          <CardContent className="p-8 text-center">
            <p className="text-gray-600 text-lg mb-4">Nenhum dado coletado ainda</p>
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700 text-white">Ir para Loja</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total de Cliques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalClicks}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Produtos Visualizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Média de Cliques</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{(totalClicks / analytics.length).toFixed(1)}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Produtos Mais Clicados</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="productName" angle={-45} textAnchor="end" height={100} fontSize={12} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#16a34a" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Cliques</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={topProducts}
                      dataKey="clicks"
                      nameKey="productName"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {topProducts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Todos os Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Produto</th>
                      <th className="text-center py-3 px-4 font-semibold">Cliques</th>
                      <th className="text-right py-3 px-4 font-semibold">Último Clique</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedAnalytics.map((item) => (
                      <tr key={item.productId} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{item.productName}</td>
                        <td className="text-center py-3 px-4 font-bold text-green-600">{item.clicks}</td>
                        <td className="text-right py-3 px-4 text-sm text-gray-600">
                          {new Date(item.lastClicked).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
