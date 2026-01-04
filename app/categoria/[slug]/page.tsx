"use client";

import { useStore } from "@/lib/store-context";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { ProductCard } from "@/components/product-card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CategoriaPage({
  params,
}: {
  params?: { slug?: string };
}) {
  const routeParams = useParams();
  const slugParam =
    typeof (routeParams as any)?.slug === "string"
      ? (routeParams as any).slug
      : typeof params?.slug === "string"
      ? params!.slug!
      : "";
  const { categories, getProductsByCategory, isLoaded } = useStore();
  const [loading, setLoading] = useState(false);
  const [productsApi, setProductsApi] = useState<any[]>([]);

  const toSlug = (s?: string) =>
    typeof s === "string" ? s.toLowerCase().replace(/\s+/g, "-") : "";
  const ns = typeof slugParam === "string" ? slugParam.toLowerCase() : "";
  const stripped = ns.endsWith("s") ? ns.slice(0, -1) : ns;
  const plural = ns.endsWith("s") ? ns : `${ns}s`;
  const safeCategories = Array.isArray(categories)
    ? categories.filter(
        (c) =>
          c &&
          typeof c.id === "string" &&
          typeof c.name === "string" &&
          typeof c.slug === "string"
      )
    : [];
  const category =
    safeCategories.find((c) => c.slug === ns) ||
    safeCategories.find((c) => c.slug === stripped) ||
    safeCategories.find((c) => c.slug === plural) ||
    safeCategories.find((c) => toSlug(c.name) === ns) ||
    safeCategories.find((c) => toSlug(c.name) === stripped) ||
    safeCategories.find((c) => toSlug(c.name) === plural);
  const productsStore = category ? getProductsByCategory(category.id) : [];
  console.log(
    "[Page][Categoria] slug:",
    slugParam,
    "resolved category:",
    category
  );
  console.log("[Page][Categoria] store products count:", productsStore.length);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!category) return;
      setLoading(true);
      try {
        console.log(
          "[Page][Categoria] fetching via API for categoryId:",
          category.id
        );
        const res = await fetch(
          `/api/products?categoryId=${encodeURIComponent(category.id)}`
        );
        console.log("[Page][Categoria] API status:", res.status);
        if (res.ok) {
          const data = await res.json();
          setProductsApi(Array.isArray(data) ? data : []);
          console.log(
            "[Page][Categoria] api products count:",
            Array.isArray(data) ? data.length : 0
          );
        } else {
          setProductsApi([]);
        }
      } catch {
        setProductsApi([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category?.id]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4 text-black">Carregando...</h1>
          <p className="text-gray-600">
            Aguarde enquanto carregamos os produtos da categoria.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4 text-black">
            Categoria não encontrada
          </h1>
          <Link href="/" className="text-primary hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-green-600">{category.name}</h1>

        {(productsApi.length || productsStore.length) === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum produto encontrado nesta categoria
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {(productsApi.length ? productsApi : productsStore).map(
              (product) => (
                <ProductCard
                  key={product.id}
                  productId={product.id}
                  slug={toSlug(product.name)}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  installments={product.installments || 1}
                  installmentPrice={product.installmentPrice || product.price}
                  image={product.image}
                />
              )
            )}
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
