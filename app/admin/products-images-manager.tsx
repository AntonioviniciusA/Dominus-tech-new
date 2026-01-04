"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Upload, Trash2, X } from "lucide-react";
import { toast } from "sonner";

interface ProductImagesManagerProps {
  productId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface ProductImage {
  id: string;
  productId: string;
  imageData: string;
  createdAt: string;
}

export function ProductImagesManager({
  productId,
  productName,
  isOpen,
  onClose,
}: ProductImagesManagerProps) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && productId) {
      fetchImages();
    }
  }, [isOpen, productId]);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/products/${productId}/images`);
      if (!response.ok) throw new Error("Falha ao carregar imagens");
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar imagens");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione um arquivo de imagem válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;

      try {
        const response = await fetch(
          `/api/admin/products/${productId}/images`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageData: base64String }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.details || "Falha ao salvar imagem");
        }

        const newImage = await response.json();
        setImages((prev) => [newImage, ...prev]);
        toast.success("Imagem adicionada com sucesso");
      } catch (error) {
        console.error("Erro detalhado:", error);
        toast.error(
          error instanceof Error ? error.message : "Erro ao salvar imagem"
        );
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta imagem?")) return;

    try {
      const response = await fetch(`/api/admin/products/images/${imageId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Falha ao excluir imagem");

      setImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Imagem removida com sucesso");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remover imagem");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Imagens - {productName}</DialogTitle>
          <DialogDescription>
            Adicione imagens extras para o produto. As imagens são salvas
            diretamente no banco de dados.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Fotos Adicionais</h3>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Enviando..." : "Adicionar Foto"}
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8">Carregando imagens...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
              Nenhuma imagem extra cadastrada para este produto.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group border rounded-lg overflow-hidden aspect-square bg-gray-100"
                >
                  <img
                    src={image.imageData}
                    alt="Produto extra"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
