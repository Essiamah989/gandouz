import type { Metadata } from "next";
import { Filter, Search, Star, Trophy, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories, getBrands } from "@/lib/db";

export const metadata: Metadata = {
  title: "Shop Wine & Spirits Catalog",
  description: "Browse premium champagnes, wines, beers, and bar accessories.",
};

type PageProps = {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    search?: string;
    sort?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const activeCategory = params.category || "";
  const activeBrand = params.brand || "";
  const searchQuery = params.search || "";
  const activeSort = params.sort || "newest";

  // Fetch data from DB (mock or actual postgres)
  const categories = await getCategories();
  const brands = await getBrands();
  let products = await getProducts({
    categorySlug: activeCategory,
    brandSlug: activeBrand,
    search: searchQuery,
  });

  // Perform sorting
  if (activeSort === "price-asc") {
    products.sort((a: any, b: any) => {
      const pA = a.salePrice !== null ? Number(a.salePrice) : Number(a.basePrice);
      const pB = b.salePrice !== null ? Number(b.salePrice) : Number(b.basePrice);
      return pA - pB;
    });
  } else if (activeSort === "price-desc") {
    products.sort((a: any, b: any) => {
      const pA = a.salePrice !== null ? Number(a.salePrice) : Number(a.basePrice);
      const pB = b.salePrice !== null ? Number(b.salePrice) : Number(b.basePrice);
      return pB - pA;
    });
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Page Header */}
      <div className="gandouz-gradient py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-[0.3em] mb-2">Cavista Store Clone</p>
          <h1 className="text-5xl lg:text-6xl font-black text-white uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            CELLAR & ACCESSORIES
          </h1>
          <p className="text-white/60 text-sm mt-2 max-w-md mx-auto">
            Order premium drinks online with Cash on Delivery. Zero online payment required.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Box */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-[#06091F] text-sm uppercase tracking-wider mb-3">Search Products</h3>
              <form action="/products" method="GET" className="relative">
                {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
                {activeBrand && <input type="hidden" name="brand" value={activeBrand} />}
                {activeSort && <input type="hidden" name="sort" value={activeSort} />}
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  name="search"
                  defaultValue={searchQuery}
                  type="text"
                  placeholder="Type to search..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#F5D800] focus:border-transparent"
                />
              </form>
            </div>

            {/* Categories Filter */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-[#06091F] text-sm uppercase tracking-wider mb-3">Categories</h3>
              <div className="flex flex-col gap-1.5">
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(activeBrand ? { brand: activeBrand } : {}),
                    ...(searchQuery ? { search: searchQuery } : {}),
                    ...(activeSort ? { sort: activeSort } : {}),
                  })}`}
                  className={`text-xs font-semibold py-2 px-3 rounded-lg transition-colors ${
                    !activeCategory
                      ? "bg-[#06091F] text-[#F5D800]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Categories
                </Link>
                {categories.map((cat: any) => (
                  <Link
                    key={cat.id}
                    href={`/products?${new URLSearchParams({
                      category: cat.slug,
                      ...(activeBrand ? { brand: activeBrand } : {}),
                      ...(searchQuery ? { search: searchQuery } : {}),
                      ...(activeSort ? { sort: activeSort } : {}),
                    })}`}
                    className={`text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex justify-between items-center ${
                      activeCategory === cat.slug
                        ? "bg-[#06091F] text-[#F5D800]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Brands Filter */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="font-bold text-[#06091F] text-sm uppercase tracking-wider mb-3">Brands</h3>
              <div className="flex flex-col gap-1.5">
                <Link
                  href={`/products?${new URLSearchParams({
                    ...(activeCategory ? { category: activeCategory } : {}),
                    ...(searchQuery ? { search: searchQuery } : {}),
                    ...(activeSort ? { sort: activeSort } : {}),
                  })}`}
                  className={`text-xs font-semibold py-2 px-3 rounded-lg transition-colors ${
                    !activeBrand
                      ? "bg-[#06091F] text-[#F5D800]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Brands
                </Link>
                {brands.map((brand: any) => (
                  <Link
                    key={brand.id}
                    href={`/products?${new URLSearchParams({
                      brand: brand.slug,
                      ...(activeCategory ? { category: activeCategory } : {}),
                      ...(searchQuery ? { search: searchQuery } : {}),
                      ...(activeSort ? { sort: activeSort } : {}),
                    })}`}
                    className={`text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex justify-between items-center ${
                      activeBrand === brand.slug
                        ? "bg-[#06091F] text-[#F5D800]"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span>{brand.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Catalog Listing */}
          <div className="lg:col-span-3 space-y-6">
            {/* Sort & Stats Bar */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              <span className="text-xs font-semibold text-gray-500">
                Showing {products.length} products
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-400">Sort by:</span>
                <div className="flex bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                  <Link
                    href={`/products?${new URLSearchParams({
                      ...(activeCategory ? { category: activeCategory } : {}),
                      ...(activeBrand ? { brand: activeBrand } : {}),
                      ...(searchQuery ? { search: searchQuery } : {}),
                      sort: "newest",
                    })}`}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${
                      activeSort === "newest" ? "bg-[#06091F] text-white" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Newest
                  </Link>
                  <Link
                    href={`/products?${new URLSearchParams({
                      ...(activeCategory ? { category: activeCategory } : {}),
                      ...(activeBrand ? { brand: activeBrand } : {}),
                      ...(searchQuery ? { search: searchQuery } : {}),
                      sort: "price-asc",
                    })}`}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${
                      activeSort === "price-asc" ? "bg-[#06091F] text-white" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Price: Low to High
                  </Link>
                  <Link
                    href={`/products?${new URLSearchParams({
                      ...(activeCategory ? { category: activeCategory } : {}),
                      ...(activeBrand ? { brand: activeBrand } : {}),
                      ...(searchQuery ? { search: searchQuery } : {}),
                      sort: "price-desc",
                    })}`}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-md transition-all ${
                      activeSort === "price-desc" ? "bg-[#06091F] text-white" : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Price: High to Low
                  </Link>
                </div>
              </div>
            </div>

            {/* Grid */}
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <RefreshCw className="w-10 h-10 text-gray-300 mx-auto mb-3 animate-spin" />
                <h3 className="font-bold text-lg text-[#06091F]">No Products Found</h3>
                <p className="text-gray-500 text-sm mt-1">Try resetting your filter parameters or checking your spellings.</p>
                <Link
                  href="/products"
                  className="mt-4 inline-flex px-6 py-2.5 bg-[#06091F] text-white font-semibold rounded-xl text-xs hover:bg-[#1C2E5E] transition-colors"
                >
                  Clear Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p: any) => {
                  const displayPrice = p.salePrice !== null ? p.salePrice : p.basePrice;
                  const hasDiscount = p.salePrice !== null;
                  
                  return (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      id={`product-card-${p.id}`}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover group shadow-sm flex flex-col justify-between"
                    >
                      <div className="relative aspect-square bg-gray-50">
                        <Image
                          src={p.images && p.images[0] ? p.images[0] : "https://placehold.co/400x400/1C2E5E/F5D800?text=Product"}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          unoptimized
                        />
                        {hasDiscount && (
                          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded shadow-sm">
                            SALE
                          </span>
                        )}
                        {p.loyaltyPoints > 0 && (
                          <span className="absolute bottom-3 left-3 bg-[#06091F]/90 text-[#F5D800] border border-[#F5D800]/25 text-[9px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                            <Trophy className="w-2.5 h-2.5" />
                            +{p.loyaltyPoints} Cavacoins
                          </span>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                            {p.brand?.name || "Cavista Cellar"}
                          </p>
                          <h3 className="font-bold text-[#06091F] text-sm leading-snug mt-1 group-hover:text-[#1C2E5E] transition-colors line-clamp-2">
                            {p.name}
                          </h3>
                          <div className="flex items-center gap-1 my-1.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className="w-3 h-3 fill-[#F5D800] text-[#F5D800]" />
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                          <div className="flex flex-col">
                            {hasDiscount && (
                              <span className="text-[10px] text-gray-400 line-through">
                                {Number(p.basePrice).toLocaleString()} TND
                              </span>
                            )}
                            <span className="font-black text-[#06091F] text-sm">
                              {Number(displayPrice).toLocaleString()} TND
                            </span>
                          </div>
                          <span className="text-[10px] text-[#06091F] bg-[#F5D800] group-hover:bg-[#06091F] group-hover:text-white px-3 py-1.5 rounded-md font-bold transition-all">
                            View Details
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
