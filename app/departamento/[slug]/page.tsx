"use client";

import { useStore } from "@/lib/store-context";
import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { ProductCard } from "@/components/product-card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function DepartamentoPage({
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
  const { departments, getProductsByDepartment, isLoaded } = useStore();

  const toSlug = (s?: string) =>
    typeof s === "string" ? s.toLowerCase().replace(/\s+/g, "-") : "";
  const ns = typeof slugParam === "string" ? slugParam.toLowerCase() : "";
  const stripped = ns.endsWith("s") ? ns.slice(0, -1) : ns;
  const plural = ns.endsWith("s") ? ns : `${ns}s`;
  const safeDepartments = Array.isArray(departments)
    ? departments.filter(
        (d) =>
          d &&
          typeof d.id === "string" &&
          typeof d.name === "string" &&
          typeof d.slug === "string"
      )
    : [];
  const department =
    safeDepartments.find((d) => d.slug === ns) ||
    safeDepartments.find((d) => d.slug === stripped) ||
    safeDepartments.find((d) => d.slug === plural) ||
    safeDepartments.find((d) => toSlug(d.name) === ns) ||
    safeDepartments.find((d) => toSlug(d.name) === stripped) ||
    safeDepartments.find((d) => toSlug(d.name) === plural);
  const productsStore = department
    ? getProductsByDepartment(department.id)
    : [];
  const [productsApi, setProductsApi] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  console.log(
    "[Page][Departamento] slug:",
    slugParam,
    "resolved department:",
    department
  );
  console.log(
    "[Page][Departamento] store products count:",
    productsStore.length
  );

  useEffect(() => {
    const fetchProducts = async () => {
      if (!department) return;
      setLoading(true);
      try {
        console.log(
          "[Page][Departamento] fetching via API for departmentId:",
          department.id
        );
        const res = await fetch(
          `/api/products?departmentId=${encodeURIComponent(department.id)}`
        );
        console.log("[Page][Departamento] API status:", res.status);
        if (res.ok) {
          const data = await res.json();
          setProductsApi(Array.isArray(data) ? data : []);
          console.log(
            "[Page][Departamento] api products count:",
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
  }, [department?.id]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4 text-black">Carregando...</h1>
          <p className="text-gray-600">
            Aguarde enquanto carregamos os produtos do departamento.
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4 text-black">
            Departamento não encontrado
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

        <h1 className="text-3xl font-bold mb-8 text-black">{department.name}</h1>

        {(productsApi.length || productsStore.length) === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum produto encontrado neste departamento
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
