"use client";

import type React from "react";
import { useState, useRef } from "react";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Trash2,
  ArrowLeft,
  Edit2,
  Check,
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { ProductImagesManager } from "../products-images-manager";

export default function ProdutosPage() {
  const {
    products,
    departments,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    departmentId: "",
    categoryId: "",
    installments: "",
    installmentPrice: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [imageInputType, setImageInputType] = useState<"url" | "upload" | null>(
    null
  );
  const [imagesManagerOpen, setImagesManagerOpen] = useState(false);
  const [selectedProductForImages, setSelectedProductForImages] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Função para converter imagem em base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verificar se é uma imagem
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione um arquivo de imagem válido");
      return;
    }

    // Verificar tamanho máximo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;

      // Atualiza o formData com a imagem em base64
      setFormData((prev) => ({
        ...prev,
        image: base64String,
      }));
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.price ||
      !formData.departmentId ||
      !formData.categoryId
    ) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    // Se não houver imagem, usar placeholder
    let finalImage = formData.image;
    if (!finalImage) {
      finalImage = "/placeholder.svg?height=300&width=300";
    }

    addProduct({
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      image: finalImage,
      departmentId: formData.departmentId,
      categoryId: formData.categoryId,
      installments: formData.installments
        ? Number.parseInt(formData.installments)
        : undefined,
      installmentPrice: formData.installmentPrice
        ? Number.parseFloat(formData.installmentPrice)
        : undefined,
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
      price: "",
      image: "",
      departmentId: "",
      categoryId: "",
      installments: "",
      installmentPrice: "",
    });
    setImageInputType(null);
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setEditData(product);
    // Verificar se a imagem é base64 ou URL para definir o tipo
    const isBase64 = product.image?.startsWith("data:image");
    setImageInputType(isBase64 ? "upload" : "url");
  };

  const saveEdit = () => {
    if (
      !editData.name ||
      !editData.price ||
      !editData.departmentId ||
      !editData.categoryId
    ) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    updateProduct(editingId!, editData);
    setEditingId(null);
    setEditData({});
    setImageInputType(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
    setImageInputType(null);
  };

  const openImagesManager = (product: any) => {
    setSelectedProductForImages({ id: product.id, name: product.name });
    setImagesManagerOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-black text-white py-6">
        <div className="container mx-auto px-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <h1 className="text-3xl font-bold text-green-500">
            Gerenciar Produtos
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          {!editingId && (
            <div className="lg:col-span-1 bg-white rounded-lg p-6 border border-gray-200 h-fit sticky top-4">
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                Cadastrar Novo Produto
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-900">
                    Nome do Produto *
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ex: REDMI 14C 128 GB 8GB"
                    className="text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-900">
                    Descrição
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="899.99"
                    className="text-gray-900 placeholder-gray-500"
                    required
                  />
                </div>

                {/* Seção de Imagem */}
                <div>
                  <Label className="text-gray-900 mb-2 block">
                    Imagem do Produto
                  </Label>

                  {/* Botões para escolher tipo de imagem */}
                  <div className="flex gap-2 mb-3">
                    <Button
                      type="button"
                      variant={imageInputType === "url" ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setImageInputType("url");
                        setFormData((prev) => ({ ...prev, image: "" }));
                      }}
                      className="flex-1"
                    >
                      <LinkIcon className="w-4 h-4 mr-2" />
                      Link
                    </Button>
                    <Button
                      type="button"
                      variant={
                        imageInputType === "upload" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => {
                        setImageInputType("upload");
                        triggerFileInput();
                      }}
                      className="flex-1"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                  </div>

                  {/* Input de URL - aparece quando selecionar Link */}
                  {imageInputType === "url" && (
                    <div className="space-y-2">
                      <Input
                        value={formData.image}
                        onChange={(e) =>
                          setFormData({ ...formData, image: e.target.value })
                        }
                        placeholder="https://exemplo.com/imagem.jpg"
                        className="text-gray-900 placeholder-gray-500"
                      />
                      <p className="text-xs text-gray-500">
                        Cole o link da imagem ou deixe em branco para usar
                        imagem padrão
                      </p>
                    </div>
                  )}

                  {/* Upload de arquivo - processamento automático */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {/* Preview da imagem se existir */}
                  {formData.image &&
                    formData.image !==
                      "/placeholder.svg?height=300&width=300" && (
                      <div className="mt-3 p-3 border border-gray-200 rounded">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                          Preview:
                        </p>
                        <div className="flex items-start gap-3">
                          <div className="w-20 h-20 border border-gray-300 rounded overflow-hidden">
                            <img
                              src={formData.image}
                              alt="Preview"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder.svg";
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-600 break-words">
                              {formData.image.startsWith("data:image")
                                ? "Imagem carregada (Base64)"
                                : formData.image.length > 50
                                ? `${formData.image.substring(0, 50)}...`
                                : formData.image}
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() =>
                                setFormData((prev) => ({ ...prev, image: "" }))
                              }
                            >
                              Remover imagem
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                <div>
                  <Label htmlFor="department" className="text-gray-900">
                    Departamento *
                  </Label>
                  <select
                    id="department"
                    value={formData.departmentId}
                    onChange={(e) =>
                      setFormData({ ...formData, departmentId: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                    required
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
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 bg-white"
                    required
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          installments: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          installmentPrice: e.target.value,
                        })
                      }
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
          )}

          {/* Products List */}
          <div className={editingId ? "lg:col-span-3" : "lg:col-span-2"}>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-6 text-gray-900">
                {editingId
                  ? "Editando Produto"
                  : `Produtos Cadastrados (${products.length})`}
              </h2>
              <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                {products.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Nenhum produto cadastrado
                  </p>
                ) : (
                  products.map((product) => (
                    <div
                      key={product.id}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {editingId === product.id ? (
                        <div className="p-4 bg-gray-50 space-y-3">
                          <div>
                            <Label className="text-gray-900">Nome</Label>
                            <Input
                              value={editData.name}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  name: e.target.value,
                                })
                              }
                              className="text-gray-900"
                              required
                            />
                          </div>
                          <div>
                            <Label className="text-gray-900">Preço (R$)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={String(editData.price ?? "")}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                price: e.target.value,
                              })
                            }
                            className="text-gray-900"
                            required
                          />
                          </div>
                          <div>
                            <Label className="text-gray-900">Imagem</Label>
                            <div className="flex gap-2 mb-2">
                              <Button
                                type="button"
                                variant={
                                  imageInputType === "url"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => setImageInputType("url")}
                              >
                                <LinkIcon className="w-4 h-4 mr-2" />
                                Link
                              </Button>
                              <Button
                                type="button"
                                variant={
                                  imageInputType === "upload"
                                    ? "default"
                                    : "outline"
                                }
                                size="sm"
                                onClick={() => {
                                  setImageInputType("upload");
                                  triggerFileInput();
                                }}
                              >
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                              </Button>
                            </div>

                            {/* Input para URL */}
                            {imageInputType === "url" && (
                              <Input
                                value={editData.image}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    image: e.target.value,
                                  })
                                }
                                placeholder="URL da imagem"
                                className="text-gray-900"
                              />
                            )}

                            {/* Preview da imagem atual durante edição */}
                            {editData.image &&
                              editData.image !==
                                "/placeholder.svg?height=300&width=300" && (
                                <div className="mt-2 p-2 border border-gray-200 rounded">
                                  <p className="text-xs font-medium text-gray-900 mb-1">
                                    Imagem atual:
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 h-16 border border-gray-300 rounded overflow-hidden">
                                      <img
                                        src={editData.image}
                                        alt="Current"
                                        className="w-full h-full object-contain"
                                      />
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {editData.image.startsWith("data:image")
                                        ? "(Base64)"
                                        : "(URL)"}
                                    </span>
                                  </div>
                                </div>
                              )}
                          </div>
                          <div>
                            <Label className="text-gray-900">Descrição</Label>
                            <Textarea
                              value={editData.description}
                              onChange={(e) =>
                                setEditData({
                                  ...editData,
                                  description: e.target.value,
                                })
                              }
                              className="text-gray-900"
                              rows={2}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label className="text-gray-900">
                                Departamento
                              </Label>
                              <select
                                value={editData.departmentId}
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    departmentId: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-900 bg-white text-sm"
                                required
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
                                onChange={(e) =>
                                  setEditData({
                                    ...editData,
                                    categoryId: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded-md px-2 py-1 text-gray-900 bg-white text-sm"
                                required
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
                            <Button
                              size="sm"
                              onClick={saveEdit}
                              className="flex-1"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Salvar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                              className="flex-1 bg-transparent"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 flex items-start gap-4">
                          <div className="relative">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="w-20 h-20 object-cover rounded"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/placeholder.svg";
                              }}
                            />
                            {product.image?.startsWith("data:image") && (
                              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 py-0.5 rounded">
                                Base64
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 break-words">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              R$ {product.price.toFixed(2)}
                            </p>
                            {product.description && (
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                {product.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => openImagesManager(product)}
                              className="text-gray-600"
                              title="Gerenciar imagens"
                            >
                              <ImageIcon className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => startEdit(product)}
                              className="text-gray-600"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => deleteProduct(product.id)}
                            >
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

      {selectedProductForImages && (
        <ProductImagesManager
          productId={selectedProductForImages.id}
          productName={selectedProductForImages.name}
          isOpen={imagesManagerOpen}
          onClose={() => setImagesManagerOpen(false)}
        />
      )}
    </div>
  );
}
