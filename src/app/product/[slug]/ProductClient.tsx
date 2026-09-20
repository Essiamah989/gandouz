"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { Star, Trophy, ShoppingCart, ArrowLeft, ShieldCheck, Sparkles, Heart } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function ProductClient({ product }: { product: any }) {
  const [selectedImage, setSelectedImage] = useState<string>(
    product?.images && product.images.length > 0 ? product.images[0] : ""
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] flex flex-col items-center justify-center p-4">
        <h2 className="text-3xl font-black text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Produit Introuvable</h2>
        <p className="text-sm text-gray-500 mt-2">L'article que vous recherchez n'existe pas ou n'est plus disponible.</p>
        <Link href="/products" className="mt-6 btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Retour au Catalogue
        </Link>
      </div>
    );
  }

  const baseDisplayPrice = product.salePrice !== null ? Number(product.salePrice) : Number(product.basePrice);
  const currentPrice = baseDisplayPrice;

  const handleAddToCart = () => {
    const itemName = product.name;

    addItem({
      id: product.id,
      productId: product.id,
      name: itemName,
      price: currentPrice,
      quantity: qty,
      image: selectedImage || "https://placehold.co/400x400/1C2E5E/F5D800?text=Product",
      slug: product.slug
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/products" className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#06091F] mb-6 uppercase tracking-wider transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour au Catalogue
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 lg:p-10 border border-gray-100 shadow-sm">
          {/* Section Images */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-3">
              <Image
                src={selectedImage || "https://placehold.co/400x400/1C2E5E/F5D800?text=Product"}
                alt={product.name}
                fill
                className="object-contain p-3"
                unoptimized
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 bg-gray-50 p-1 ${
                      selectedImage === img ? "border-[#F5D800]" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-contain p-1" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section Détails */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  {product.brand?.name || "Qualité Premium"} · {product.category?.name}
                </p>
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                  aria-label="Ajouter aux favoris"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-[#06091F] uppercase mt-2 leading-none" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-3 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-[#F5D800] text-[#F5D800]" />
                  ))}
                  <span className="text-xs font-semibold text-gray-400 ml-1.5">(Avis 4.9/5)</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mt-4">
                {product.description || "Aucune description détaillée n'est disponible pour ce produit."}
              </p>

              {(() => {
                const isOutOfStock = product.isActive === false || (product.stock !== undefined && product.stock <= 0);
                return (
                  <div className="mt-6 flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      !isOutOfStock ? "bg-green-500 ring-4 ring-green-100" : "bg-red-500 ring-4 ring-red-100"
                    }`} />
                    <span className="text-xs font-semibold text-gray-700">
                      {!isOutOfStock
                        ? `${product.stock ?? 20} articles disponibles en stock`
                        : "Actuellement en rupture de stock"}
                    </span>
                    {isOutOfStock && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-red-100 text-red-700 uppercase tracking-wider">
                        Épuisé
                      </span>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-baseline gap-2.5 mb-5">
                <span className="text-3xl font-black text-[#06091F] tracking-tight">
                  {formatPrice(currentPrice)}
                </span>
                {product.salePrice !== null && product.salePrice !== undefined && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPrice(product.basePrice)}
                  </span>
                )}
              </div>

              {(() => {
                const isOutOfStock = product.isActive === false || (product.stock !== undefined && product.stock <= 0);
                return (
                  <div className="flex gap-4">
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                      <button
                        onClick={() => setQty(Math.max(1, qty - 1))}
                        disabled={isOutOfStock}
                        className="px-3.5 py-3 hover:bg-gray-100 font-semibold text-gray-600 text-sm transition-colors disabled:opacity-40"
                      >
                        -
                      </button>
                      <span className="px-4 py-3 text-sm font-bold text-[#06091F] min-w-[40px] text-center">
                        {isOutOfStock ? 0 : qty}
                      </span>
                      <button
                        onClick={() => setQty(qty + 1)}
                        disabled={isOutOfStock}
                        className="px-3.5 py-3 hover:bg-gray-100 font-semibold text-gray-600 text-sm transition-colors disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      disabled={isOutOfStock}
                      className="btn-gold flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 uppercase"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isOutOfStock ? "Rupture de Stock" : added ? "Ajouté au Panier !" : "Ajouter au Panier"}
                    </button>
                  </div>
                );
              })()}

              <div className="mt-6 grid grid-cols-1 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#F5D800]" />
                  <span className="text-[10px] font-bold text-gray-500">PAIEMENT 100% SÉCURISÉ À LA LIVRAISON</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
