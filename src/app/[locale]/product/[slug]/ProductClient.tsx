"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart";
import { Star, Trophy, ShoppingCart, ArrowLeft, ShieldCheck, Sparkles, Heart } from "lucide-react";

export default function ProductClient({ product }: { product: any }) {
  const [selectedVariant, setSelectedVariant] = useState<any>(
    product?.variants && product.variants.length > 0 ? product.variants[0] : null
  );
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
        <h2 className="text-3xl font-black text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>Product Not Found</h2>
        <p className="text-sm text-gray-500 mt-2">The bottle or item you requested does not exist in our cellar.</p>
        <Link href="/products" className="mt-6 btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const baseDisplayPrice = product.salePrice !== null ? Number(product.salePrice) : Number(product.basePrice);
  const currentPrice = selectedVariant
    ? (selectedVariant.salePrice !== null ? Number(selectedVariant.salePrice) : Number(selectedVariant.price))
    : baseDisplayPrice;

  const handleAddToCart = () => {
    const itemName = selectedVariant 
      ? `${product.name} (${selectedVariant.size})` 
      : product.name;

    addItem({
      id: selectedVariant ? selectedVariant.id : product.id,
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
          <ArrowLeft className="w-4 h-4" /> Back to Shop Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 lg:p-10 border border-gray-100 shadow-sm">
          {/* Images Section */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src={selectedImage || "https://placehold.co/400x400/1C2E5E/F5D800?text=Product"}
                alt={product.name}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto py-1">
                {product.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 ${
                      selectedImage === img ? "border-[#F5D800]" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  {product.brand?.name || "Premium Quality"} · {product.category?.name}
                </p>
                <button 
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                  aria-label="Wishlist"
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
                  <span className="text-xs font-semibold text-gray-400 ml-1.5">(4.9 rating)</span>
                </div>
                {product.loyaltyPoints > 0 && (
                  <span className="inline-flex items-center gap-1 bg-[#06091F] text-[#F5D800] border border-[#F5D800]/25 text-[10px] font-black px-3 py-1 rounded-full shadow-sm">
                    <Trophy className="w-3 h-3" />
                    Earns +{product.loyaltyPoints} Cavacoins
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mt-4">
                {product.description || "No description provided for this cellar item."}
              </p>

              {product.variants && product.variants.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Variant (Size/Volume)</h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map((v: any) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2.5 rounded-xl border text-xs font-bold uppercase transition-all ${
                          selectedVariant?.id === v.id
                            ? "bg-[#06091F] text-[#F5D800] border-transparent shadow-sm"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {v.size} — {(v.salePrice || v.price).toLocaleString()} TND
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  (selectedVariant?.stock || product.stock) > 0 ? "bg-green-500" : "bg-red-500"
                }`} />
                <span className="text-xs font-bold text-gray-500">
                  {(selectedVariant?.stock || product.stock) > 0 
                    ? `In Stock (${selectedVariant?.stock || product.stock} bottles left)` 
                    : "Out of Stock"}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-baseline gap-2.5 mb-5">
                <span className="text-3xl font-black text-[#06091F] tracking-tight">
                  {currentPrice.toLocaleString()} TND
                </span>
                {selectedVariant?.salePrice !== null && selectedVariant?.salePrice !== undefined && (
                  <span className="text-sm text-gray-400 line-through">
                    {Number(selectedVariant.price).toLocaleString()} TND
                  </span>
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="px-4 py-3 text-gray-500 hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold text-[#06091F]">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="px-4 py-3 text-gray-500 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={(selectedVariant?.stock || product.stock) <= 0}
                  className="btn-gold flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed uppercase"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {added ? "Item Added!" : "Add to Cart"}
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#F5D800]" />
                  <span className="text-[10px] font-bold text-gray-500">100% SECURE COD</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#F5D800]" />
                  <span className="text-[10px] font-bold text-gray-500">CAVACOIN CREDIT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
