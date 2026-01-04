import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { WhatsAppFloat } from "@/components/whatsapp-float";
import { ProductPageContent } from "@/components/product-page-content";
import { turso } from "@/lib/turso";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getProductAndImages(slug: string) {
  // Buscar todos os produtos para encontrar o correto pelo slug gerado
  // Idealmente, deveríamos ter uma coluna slug no banco
  const { rows: products } = await turso.execute("SELECT * FROM products");

  const product = products.find(
    (p: any) => p.name.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  );

  if (!product) return { extraImages: [] };

  const { rows: images } = await turso.execute({
    sql: "SELECT image_data FROM product_images WHERE product_id = ?",
    args: [product.id],
  });

  return {
    extraImages: images.map((img: any) => img.image_data as string),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const { extraImages } = await getProductAndImages(slug);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <ProductPageContent slug={slug} extraImages={extraImages} />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
