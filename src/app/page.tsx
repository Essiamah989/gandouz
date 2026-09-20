import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, Clock, Star, Gift, Wine, Beer, Trophy, Calendar } from "lucide-react";
import { getProducts, getCategories, getTestimonials } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

import { getDictionary } from "@/lib/i18n";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Distribution Gandouz - Vins & Spiritueux",
  description: "Distribution Gandouz - Le premier distributeur de vins, spiritueux premium et événements de bar mobile en Tunisie.",
};

export default async function HomePage() {
  const dict = await getDictionary();
  const categories = await getCategories();
  const featuredProducts = await getProducts({ featuredOnly: true, limit: 4, activeOnly: true });
  const dbTestimonials = await getTestimonials();

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* ===== HERO SECTION ===== */}
      <section className="relative gandouz-gradient overflow-hidden py-24 lg:py-36" id="hero">
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #F5D800 0, #F5D800 1px, transparent 0, transparent 50%)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Hero Text */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block bg-[#F5D800]/10 border border-[#F5D800]/30 text-[#F5D800] text-xs font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-6">
                ÉTABLI À LA GOULETTE
              </span>
              <h1
                className="text-6xl lg:text-8xl font-black text-white leading-[0.95] mb-6 tracking-tight uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                {dict.home.heroTitle}
              </h1>
              <p className="text-white/70 text-lg max-w-xl mb-10 leading-relaxed">
                {dict.home.heroSubtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/products"
                  id="hero-cta-shop"
                  className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-4.5 rounded-xl text-base font-bold transition-all"
                >
                  {dict.home.shopCatalog}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Hero Brand Identity */}
            <div className="flex-shrink-0 relative">
              <div className="w-72 h-72 lg:w-96 lg:h-96 relative flex items-center justify-center bg-white/5 border border-white/10 rounded-full p-8 backdrop-blur-md shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-[#F5D800]/5 blur-3xl animate-pulse" />
                <Image
                  src="/logo.png"
                  alt="Gandouz Logo"
                  width={250}
                  height={250}
                  className="object-contain filter invert brightness-0 drop-shadow-[0_10px_30px_rgba(245,216,0,0.25)]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Diagonal Wave shape */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="fill-[#F2F2F2] w-full h-12">
            <path d="M0,60 C480,10 960,10 1440,60 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* ===== TRUST ASSURANCE ===== */}
      <section className="py-12 bg-white border-b border-gray-100" id="trust-badges">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheck,
                title: "Produits 100% Originaux",
                desc: "Vérification directe à la source pour toutes les marques de prestige.",
              },
              {
                icon: Truck,
                title: "Livraison Rapide",
                desc: "Livré en main propre en toute sécurité avec soin.",
              },
              {
                icon: Clock,
                title: "Paiement à la Livraison Sécurisé",
                desc: "Aucun paiement en ligne requis. Inspectez vos articles avant de payer.",
              },
            ].map(({ icon: Icon, title, desc }, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-all hover:shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-[#06091F] flex items-center justify-center shrink-0 shadow-md">
                  <Icon className="w-5 h-5 text-[#F5D800]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#06091F] text-base leading-tight">{title}</h3>
                  <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SHOP BY CATEGORY ===== */}
      <section className="py-20 bg-[#F2F2F2]" id="categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#F5D800] text-xs font-bold uppercase tracking-[0.3em] bg-[#06091F] px-3.5 py-1 rounded-full">
              COLLECTIONS
            </span>
            <h2
              className="text-4xl lg:text-5xl font-black text-[#06091F] mt-4 uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Chefs-d'œuvre Sélectionnés
            </h2>
            <p className="text-gray-500 mt-2 max-w-lg mx-auto">Explorez nos diverses catégories de boissons et d'accessoires</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat: any) => {
              const catImage = cat.image || "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop";

              return (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  id={`cat-${cat.slug}`}
                  className="group bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Category Photo Container */}
                  <div className="relative h-60 w-full bg-gray-50 overflow-hidden p-2.5 border-b border-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={catImage}
                      alt={cat.name}
                      className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-5 right-5 bg-[#06091F]/80 backdrop-blur-md text-[#F5D800] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                      COLLECTION
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                    <div>
                      <h3
                        className="text-2xl font-black text-[#06091F] uppercase tracking-tight group-hover:text-[#1C2E5E] transition-colors"
                        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                      >
                        {cat.name}
                      </h3>
                      <p className="text-gray-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                        {cat.description || "Parcourez notre inventaire de haute qualité."}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1C2E5E] uppercase tracking-wider group-hover:text-[#F5D800] transition-colors">
                        Voir les Produits
                      </span>
                      <span className="w-8 h-8 rounded-xl bg-[#06091F] text-[#F5D800] group-hover:bg-[#F5D800] group-hover:text-[#06091F] transition-all flex items-center justify-center font-bold text-sm">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-20 bg-white" id="featured-products">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-[#F5D800] uppercase tracking-[0.3em] bg-[#06091F] px-3.5 py-1 rounded-full">
                BONNES AFFAIRES
              </span>
              <h2
                className="text-4xl lg:text-5xl font-black text-[#06091F] mt-4 uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Produits en Vedette
              </h2>
            </div>
            <Link
              href="/products"
              id="featured-see-all"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#1C2E5E] hover:text-[#F5D800] transition-colors uppercase tracking-wider"
            >
              Voir Tous les Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p: any) => {
              const displayPrice = p.salePrice !== null ? p.salePrice : p.basePrice;
              const hasDiscount = p.salePrice !== null;
              const isOutOfStock = p.isActive === false || (p.stock !== undefined && p.stock <= 0);
              
              return (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  id={`product-${p.id}`}
                  className={`bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover group shadow-sm flex flex-col justify-between relative ${
                    isOutOfStock ? "opacity-90" : ""
                  }`}
                >
                  <div className="relative aspect-square bg-gray-50 p-2">
                    <Image
                      src={p.images && p.images[0] ? p.images[0] : "https://placehold.co/400x400/1C2E5E/F5D800?text=Product"}
                      alt={p.name}
                      fill
                      className={`object-contain p-2 transition-transform duration-300 ${
                        isOutOfStock ? "grayscale-[20%] group-hover:scale-100" : "group-hover:scale-105"
                      }`}
                      unoptimized
                    />
                    {hasDiscount && !isOutOfStock && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                        PROMO
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="absolute top-3 left-3 bg-[#06091F] text-[#F5D800] border border-[#F5D800]/40 text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-md tracking-wider">
                        RUPTURE DE STOCK
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                          {p.brand?.name || "Qualité Premium"}
                        </p>
                        {isOutOfStock && (
                          <span className="text-[10px] font-bold text-red-500 uppercase">
                            Épuisé
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-[#06091F] text-base leading-snug mt-1 group-hover:text-[#1C2E5E] transition-colors line-clamp-2">
                        {p.name}
                      </h3>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        {hasDiscount ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-black text-[#06091F]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                              {formatPrice(displayPrice)}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              {formatPrice(p.basePrice)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-black text-[#06091F]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                            {formatPrice(displayPrice)}
                          </span>
                        )}
                      </div>
                      {isOutOfStock ? (
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">
                          Épuisé
                        </span>
                      ) : (
                        <span className="w-8 h-8 rounded-xl bg-[#06091F] text-[#F5D800] group-hover:bg-[#F5D800] group-hover:text-[#06091F] transition-all flex items-center justify-center font-bold text-lg">
                          +
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CLIENT TESTIMONIALS ===== */}
      <section className="py-20 bg-white" id="testimonials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">TÉMOIGNAGES</span>
            <h2 className="text-4xl font-black text-[#06091F] uppercase mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Ce que Disent nos Clients
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(() => {
              const fallback = [
                {
                  text: "La livraison est incroyablement rapide ! J'ai commandé deux bouteilles de whisky premium pour un dîner d'affaires, et elles sont arrivées en moins de 3 heures à La Goulette. Service fantastique.",
                  name: "Karim Meziane",
                  role: "Organisateur d'Événements"
                },
                {
                  text: "Nous avons loué le pack Bar Mobile VIP pour notre fête d'anniversaire, et les invités n'ont pas arrêté de féliciter les mixologues. L'installation correspondait parfaitement à l'ambiance luxe.",
                  name: "Selma Ben Jemaa",
                  role: "Hôte Privé"
                },
                {
                  text: "Les points Cadopoints changent la donne. J'ai déjà échangé des points contre un kit de shaker gratuit. Validation manuelle très fluide et livreurs sympathiques.",
                  name: "Ahmed Toumi",
                  role: "Barman Amateur"
                }
              ];
              const list = (dbTestimonials && dbTestimonials.length > 0) ? dbTestimonials : fallback;
              return list.map((t: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-[#F5D800] text-[#F5D800]" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 italic leading-relaxed">"{t.text}"</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <h4 className="font-bold text-sm text-[#06091F]">{t.name}</h4>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>
    </div>
  );
}
