"use client";

import type React from "react";
import { useState } from "react";
import { useStore } from "@/lib/store-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, ArrowLeft, Edit2, Check, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function CategoriasPage() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshData,
  } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      alert("Preencha todos os campos");
      return;
    }

    addCategory({
      name: formData.name,
      slug: formData.slug,
    });

    setFormData({ name: "", slug: "" });
  };

  const startEdit = (category: any) => {
    setEditingId(category.id);
    setEditData(category);
  };

  const saveEdit = () => {
    if (!editData.name || !editData.slug) {
      alert("Preencha todos os campos");
      return;
    }
    updateCategory(editingId!, editData);
    setEditingId(null);
    setEditData({});
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleDeleteClick = (categoryId: string, categoryName: string) => {
    setCategoryToDelete(categoryId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      await deleteCategory(categoryToDelete);
      toast.success("Categoria deletada com sucesso!");
      await refreshData();
    } catch (error) {
      toast.error("Erro ao deletar categoria. Tente novamente.");
      console.error("Erro ao deletar categoria:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
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
            Gerenciar Categorias
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1 bg-white rounded-lg p-6 border border-gray-200 h-fit sticky top-4">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              Cadastrar Nova Categoria
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-900">
                  Nome da Categoria
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    });
                  }}
                  placeholder="Ex: Acessórios"
                  className="text-gray-900 placeholder-gray-500"
                />
              </div>

              <div>
                <Label htmlFor="slug" className="text-gray-900">
                  Slug (URL)
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  placeholder="acessorios"
                  className="text-gray-900 placeholder-gray-500"
                />
                <p className="text-xs text-gray-600 mt-1">
                  URL: /categoria/{formData.slug || "slug"}
                </p>
              </div>

              <Button type="submit" className="w-full">
                Cadastrar Categoria
              </Button>
            </form>
          </div>

          {/* Categories List */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-900">
              Categorias Cadastradas ({categories.length})
            </h2>
            <div className="grid md:grid-cols-2 gap-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {categories.length === 0 ? (
                <p className="text-gray-500 text-center py-8 col-span-full">
                  Nenhuma categoria cadastrada
                </p>
              ) : (
                categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    {editingId === cat.id ? (
                      <div className="space-y-2">
                        <Input
                          value={editData.name}
                          onChange={(e) =>
                            setEditData({ ...editData, name: e.target.value })
                          }
                          placeholder="Nome"
                          className="text-gray-900"
                        />
                        <Input
                          value={editData.slug}
                          onChange={(e) =>
                            setEditData({ ...editData, slug: e.target.value })
                          }
                          placeholder="Slug"
                          className="text-gray-900"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={saveEdit}
                            className="flex-1"
                          >
                            <Check className="w-3 h-3 mr-1" />
                            Salvar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                            className="bg-red-600 flex-1"
                          >
                            <X className="w-3 h-3 mr-1" />
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          /categoria/{cat.slug}
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(cat)}
                            className="flex-1 text-gray-600"
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteClick(cat.id, cat.name)}
                            className="flex-1"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Deletar
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar esta categoria? Esta ação não pode
              ser desfeita e todos os produtos relacionados também serão
              removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deletando..." : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
