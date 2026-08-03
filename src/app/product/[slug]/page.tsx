import { getProductBySlug } from "@/lib/db";
import ProductClient from "./ProductClient";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  
  return <ProductClient product={product} />;
}
