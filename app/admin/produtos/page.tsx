"use client"

import type React from "react"
import { useState } from "react"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, ArrowLeft, Edit2, Check, X } from "lucide-react"
import Link from "next/link"

export default function ProdutosPage() {
  const { products, departments, categories, addProduct, updateProduct, deleteProduct } = useStore()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    departmentId: "",
    categoryId: "",
    installments: "",
    installmentPrice: "",
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.price || !formData.departmentId || !formData.categoryId) {
      alert("Preencha todos os campos obrigatórios")
      return
    }

    addProduct({
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      image: formData.image || "/placeholder.svg?height=300&width=300",
      departmentId: formData.departmentId,
      categoryId: formData.categoryId,
      installments: formData.installments ? Number.parseInt(formData.installments) : undefined,
      installmentPrice: formData.installmentPrice ? Number.parseFloat(formData.installmentPrice) : undefined,
    })

    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      departmentId: "",
      categoryId: "",
      installments: "",
      installmentPrice: "",
    })
  }

  const startEdit = (product: any) => {
    setEditingId(product.id)
    setEditData(product)
  }

  const saveEdit = () => {
    if (!editData.name || !editData.price || !editData.departmentId || !editData.categoryId) {
      alert("Preencha todos os campos obrigatórios")
      return
    }
    updateProduct(editingId!, editData)
    setEditingId(null)
    setEditData({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <Link href="/admin" className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-green-500">Gerenciar Produtos</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1 bg-white rounded-lg p-6 border border-gray-200 h-fit sticky top-4">
            <h2 className="text-xl font-bold mb-6 text-gray-900">Cadastrar Novo Produto</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-900">
                  Nome do Produto *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: REDMI 14C 128 GB 8GB"
                  className="text-gray-900 placeholder-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-gray-900">
                  Descrição
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do produto"
                  rows={3}
                  className="text-gray-900 placeholder-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="price" className="text-gray-900">
                  Preço (R$) *
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="899.99"
                  className="text-gray-900 placeholder-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="image" className="text-gray-900">
                  URL da Imagem
                </Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                  className="text-gray-900 placeholder-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="department" className="text-gray-900">
                  Departamento *
                </Label>
                <select
                  id="department"
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                >
                  <option value="">Selecione um departamento</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-900">
                  Categoria *
                </Label>
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                >
                  <option value="">Selecione uma categoria</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="installments" className="text-gray-900">
                    Parcelas
                  </Label>
                  <Input
                    id="installments"
                    type="number"
                    value={formData.installments}
                    onChange={(e) => setFormData({ ...formData, installments: e.target.value })}
                    placeholder="12"
                    className="text-gray-900 placeholder-gray-500"
                  />
                </div>
                <div>
                  <Label htmlFor="installmentPrice" className="text-gray-900">
                    Valor da Parcela
                  </Label>
                  <Input
                    id="installmentPrice"
                    type="number"
                    step="0.01"
                    value={formData.installmentPrice}
                    onChange={(e) => setFormData({ ...formData, installmentPrice: e.target.value })}
                    placeholder="75.00"
                    className="text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Cadastrar Produto
              </Button>
            </form>
          </div>

          {/* Products List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Produtos Cadastrados ({products.length})</h2>
              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                {products.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum produto cadastrado</p>
                ) : (
                  products.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {editingId === product.id ? (
                        <div className="p-4 bg-gray-50 space-y-3">
                          <div>
                            <Label className="text-gray-900">Nome</Label>
                            <Input
                              value={editData.name}
                              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                              className="text-gray-900"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-900">Preço (R$)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={editData.price}
                              onChange={(e) => setEditData({ ...editData, price: Number.parseFloat(e.target.value) })}
                              className="text-gray-900"
                            />
                          </div>
                          <div>
                            <Label className="text-gray-900">Descrição</Label>
                            <Textarea
                              value={editData.description}
                              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                              className="text-gray-900"
                              rows={2}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-gray-900">Departamento</Label>
                              <select
                                value={editData.departmentId}
                                onChange={(e) => setEditData({ ...editData, departmentId: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-900 bg-white text-sm"
                              >
                                {departments.map((dept) => (
                                  <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <Label className="text-gray-900">Categoria</Label>
                              <select
                                value={editData.categoryId}
                                onChange={(e) => setEditData({ ...editData, categoryId: e.target.value })}
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-900 bg-white text-sm"
                              >
                                {categories.map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button size="sm" onClick={saveEdit} className="flex-1">
                              <Check className="w-4 h-4 mr-2" />
                              Salvar
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEdit} className="flex-1 bg-transparent">
                              <X className="w-4 h-4 mr-2" />
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 flex items-start gap-4">
                          <img
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 break-words">{product.name}</h3>
                            <p className="text-sm text-gray-600">R$ {product.price.toFixed(2)}</p>
                            {product.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => startEdit(product)}
                              className="text-gray-600"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => deleteProduct(product.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
