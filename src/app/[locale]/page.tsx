import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Truck, Clock, Star, Gift, Wine, Beer, Trophy, Calendar } from "lucide-react";
import { getProducts, getCategories } from "@/lib/db";

import { getDictionary } from "@/lib/i18n";

export const metadata = {
  title: "Cavista Store Clone — Premium Wines, Spirits & Mobile Bar Events",
  description: "Re-live the premier beverage shopping experience of Tunisia. Browse luxury champagnes, single malt whiskies, local wines, and request custom mobile bar bookings.",
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale as "en" | "fr");
  const categories = await getCategories();
  const featuredProducts = await getProducts({ featuredOnly: true, limit: 4 });

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
                  href={`/${locale}/products`}
                  id="hero-cta-shop"
                  className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-4.5 rounded-xl text-base font-bold transition-all"
                >
                  {dict.home.shopCatalog}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href={`/${locale}/bar-events`}
                  id="hero-cta-events"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4.5 rounded-xl text-base font-semibold border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all backdrop-blur-sm"
                >
                  <Calendar className="w-5 h-5 text-[#F5D800]" />
                  {dict.home.bookBar}
                </Link>
              </div>
            </div>

            {/* Hero Brand Identity */}
            <div className="flex-shrink-0 relative">
              <div className="w-72 h-72 lg:w-96 lg:h-96 relative flex items-center justify-center bg-white/5 border border-white/10 rounded-full p-8 backdrop-blur-md shadow-2xl">
                <div className="absolute inset-0 rounded-full bg-[#F5D800]/5 blur-3xl animate-pulse" />
                <Image
                  src="/logo.png"
                  alt="Cavista Brand Logo"
                  width={250}
                  height={250}
                  className="object-contain filter invert brightness-0 invert drop-shadow-[0_10px_30px_rgba(245,216,0,0.25)]"
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
                desc: "Vérification directe à la source pour toutes les marques premium.",
              },
              {
                icon: Truck,
                title: "Livraison Rapide",
                desc: "Livré en main propre en toute sécurité sous 24 à 48 heures.",
              },
              {
                icon: Clock,
                title: "Paiement à la Livraison Sécurisé",
                desc: "Aucune carte requise en ligne. Inspectez vos articles avant de payer.",
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
            <span className="text-[#F5D800] text-xs font-bold uppercase tracking-[0.3em] bg-[#06091F] text-gold px-3.5 py-1 rounded-full">
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
            {categories.map((cat: any) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                id={`cat-${cat.slug}`}
                className="group relative h-96 rounded-2xl overflow-hidden shadow-md flex flex-col justify-end p-6 border border-white/10"
              >
                {/* Background Image */}
                <Image
                  src={cat.image || "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop"}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06091F] via-[#06091F]/40 to-transparent" />
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {cat.name}
                  </h3>
                  <p className="text-white/70 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                    {cat.description || "Parcourez notre inventaire de haute qualité."}
                  </p>
                  <div className="inline-flex items-center gap-1 text-[#F5D800] text-xs font-bold mt-4 uppercase tracking-wider group-hover:underline">
                    Voir les Produits
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
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
              
              return (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  id={`product-${p.id}`}
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
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                        SALE
                      </span>
                    )}
                    {p.loyaltyPoints > 0 && (
                      <span className="absolute bottom-3 left-3 bg-[#06091F]/90 text-[#F5D800] border border-[#F5D800]/30 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                        <Trophy className="w-2.5 h-2.5" />
                        +{p.loyaltyPoints} Cavacoins
                      </span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                        {p.brand?.name || "Qualité Premium"}
                      </p>
                      <h3 className="font-bold text-[#06091F] text-base leading-snug mt-1 group-hover:text-[#1C2E5E] transition-colors line-clamp-2">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1 my-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3.5 h-3.5 fill-[#F5D800] text-[#F5D800]" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                      <div className="flex flex-col">
                        {hasDiscount && (
                          <span className="text-xs text-gray-400 line-through">
                            {Number(p.basePrice).toLocaleString('fr-FR')} TND
                          </span>
                        )}
                        <span className="font-black text-[#06091F] text-lg">
                          {Number(displayPrice).toLocaleString('fr-FR')} TND
                        </span>
                      </div>
                      <span className="text-xs text-[#06091F] bg-[#F5D800] group-hover:bg-[#06091F] group-hover:text-white px-3 py-2 rounded-lg font-bold transition-all shadow-sm">
                        Voir Produit
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CAVACOINS LOYALTY BANNER ===== */}
      <section className="py-16 bg-[#06091F] text-white relative overflow-hidden" id="loyalty-banner">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#F5D800] rounded-full filter blur-[120px] animate-pulse" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 p-8 lg:p-12 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 bg-[#F5D800]/10 border border-[#F5D800]/25 text-[#F5D800] text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full mb-4">
                <Gift className="w-3.5 h-3.5" />
                PROGRAMME DE FIDÉLITÉ
              </span>
              <h2 className="text-4xl lg:text-5xl font-black mb-4 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Découvrez les <span className="text-[#F5D800]">Cavacoins</span>
              </h2>
              <p className="text-white/70 text-base max-w-2xl leading-relaxed mb-6">
                Chaque achat vous rapporte des Cavacoins ! Cumulez des points sur chaque commande et échangez-les lors du paiement pour obtenir des réductions ou des accessoires. 1 Cavacoin équivaut à 1 TND de récompense de fidélité.
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-8 flex-wrap">
                <div className="text-left">
                  <span className="text-3xl font-black text-[#F5D800]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>1 CAVACOIN</span>
                  <p className="text-xs text-white/50">par 1 TND Dépensé</p>
                </div>
                <div className="w-px h-10 bg-white/20 hidden sm:block" />
                <div className="text-left">
                  <span className="text-3xl font-black text-[#F5D800]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>100% GRATUIT</span>
                  <p className="text-xs text-white/50">Inscription Automatique</p>
                </div>
              </div>
            </div>
            <div className="shrink-0 flex flex-col items-center justify-center bg-[#F5D800] text-[#06091F] p-8 rounded-2xl shadow-xl w-64 text-center">
              <Trophy className="w-12 h-12 mb-3 text-[#06091F]" />
              <h3 className="font-black text-xl leading-none">REJOINDRE</h3>
              <p className="text-xs opacity-75 mt-1">Commencez à cumuler des points dès votre premier achat</p>
              <Link href="/products" className="bg-[#06091F] text-white w-full py-2.5 rounded-lg text-sm font-bold mt-5 hover:bg-[#1C2E5E] transition-colors block">
                Faire des Achats
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MOBILE BAR SERVICES ===== */}
      <section className="py-20 bg-[#F2F2F2]" id="bar-events">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1">
              <div className="relative h-[450px] w-full rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                <Image
                  src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop"
                  alt="Mobile Bar Events"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="bg-[#F5D800] text-[#06091F] text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                    CLASSIQUE · PREMIUM · VIP
                  </span>
                  <h4 className="text-2xl font-black mt-2 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Location de Bars Mobiles
                  </h4>
                  <p className="text-xs text-white/70 mt-1">Nous amenons nos mixologues et des structures de bar haut de gamme directement à votre événement.</p>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <span className="text-[#F5D800] text-xs font-bold uppercase tracking-[0.3em] bg-[#06091F] px-3.5 py-1 rounded-full">
                PRIVÉ & PROFESSIONNEL
              </span>
              <h2
                className="text-4xl lg:text-5xl font-black text-[#06091F] mt-4 uppercase"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                Services de Location de Bar
              </h2>
              <p className="text-gray-600 mt-4 leading-relaxed">
                Vous organisez un mariage, un gala d'entreprise ou une fête au bord de la piscine ? Rendez cet événement inoubliable avec nos bars mobiles. Nous fournissons la structure, les équipements professionnels, des ingrédients premium et des barmans qualifiés.
              </p>
              
              <ul className="mt-6 space-y-3.5">
                {[
                  "Trois niveaux de configuration : Classique, Premium et VIP.",
                  "Menus de cocktails sur mesure créés spécialement pour vos invités.",
                  "Mixologues locaux certifiés et hautement qualifiés.",
                  "Verrerie complète, glaçons personnalisés et garnitures premium incluses."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-[#06091F] text-[#F5D800] flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href="/bar-events"
                  className="inline-flex items-center gap-2 bg-[#06091F] text-white hover:bg-[#1C2E5E] px-8 py-3.5 rounded-xl font-bold transition-all shadow-md"
                >
                  Réservez Votre Événement <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
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
            {[
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
                text: "Les points Cavacoins changent la donne. J'ai déjà échangé des points contre un kit de shaker gratuit. Validation manuelle très fluide et livreurs sympathiques.",
                name: "Ahmed Toumi",
                role: "Barman Amateur"
              }
            ].map((t, i) => (
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
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
