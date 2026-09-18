import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, ShieldCheck, Award, MapPin, Clock, Phone, Navigation, Sparkles, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "À Propos | Distribution Gandouz",
  description: "Découvrez l'histoire, le savoir-faire et l'emplacement de notre dépôt de distribution Gandouz à Kheredine / Le Kram / La Goulette, Tunis.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <div className="bg-[#06091F] py-20 text-center text-white relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(#F5D800 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-[#F5D800]/10 text-[#F5D800] border border-[#F5D800]/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Notre Histoire & Savoir-Faire
          </span>
          <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            NOTRE HISTOIRE & CELLIER
          </h1>
          <p className="text-white/70 text-base max-w-2xl mx-auto mt-4 leading-relaxed font-medium">
            Depuis notre centre de distribution situé à La Goulette / Le Kram, nous distribuons les meilleurs vins, bières artisanales, spiritueux et champagnes d'exception à travers toute la Tunisie.
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <span className="text-[#06091F] text-xs font-black uppercase tracking-[0.25em] bg-[#F5D800] px-3.5 py-1 rounded-full">
              SPÉCIALISTE EN DISTRIBUTION
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-[#06091F] uppercase leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              L'EXCELLENCE DES BOISSONS RARES & RAFFINÉES
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
              Fondée sur une passion authentique pour les terroirs et la sommellerie, la <strong>Distribution Gandouz</strong> s'est imposée comme une référence incontournable en Tunisie. Nous sélectionnons méticuleusement chaque cuvée, grand cru et spiritueux de prestige pour garantir une expérience gustative irréprochable.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
              Au-delà de la vente au détail et aux professionnels, notre équipe d'experts et nos bars mobiles événementiels se déplacent pour sublimer vos soirées privées, galas d'entreprise et réceptions VIP avec des cocktails sur mesure.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
                <p className="text-3xl font-black text-[#06091F]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>+500</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Références en stock</p>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-xs">
                <p className="text-3xl font-black text-[#06091F]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>100%</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Produits certifiés d'origine</p>
              </div>
            </div>
          </div>

          <div className="relative h-[440px] rounded-3xl overflow-hidden shadow-xl border border-gray-100 group">
            <Image
              src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop"
              alt="Cellier de vins et spiritueux Gandouz"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06091F]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-[#F5D800] text-xs font-bold uppercase tracking-wider">Cave & Dépôt Privé</p>
              <p className="text-lg font-bold">Conservation optimale & température régulée</p>
            </div>
          </div>
        </div>

        {/* Store Location & Distribution Point Section */}
        <div className="mb-20 bg-white rounded-3xl border border-gray-200/80 shadow-md overflow-hidden" id="localisation">
          <div className="p-8 lg:p-10 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-[#06091F] font-bold text-xs uppercase tracking-widest mb-1">
                <MapPin className="w-4 h-4 text-red-500" />
                <span>Emplacement de notre Dépôt de Distribution</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-black text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                OÙ NOUS TROUVER À TUNIS
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Point de distribution stratégique situé entre <strong>Khéreddine, Le Kram et La Goulette</strong>.
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Kheredine+Le+Kram+Tunis"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#06091F] hover:bg-[#1C2E5E] text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md self-start md:self-auto"
            >
              <Navigation className="w-4 h-4 text-[#F5D800]" />
              Ouvrir sur Google Maps
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Map Photo Display */}
            <div className="lg:col-span-7 relative min-h-[380px] lg:min-h-[480px] bg-gray-100 flex items-center justify-center p-3 border-b lg:border-b-0 lg:border-r border-gray-100">
              <div className="relative w-full h-full min-h-[360px] rounded-2xl overflow-hidden shadow-inner border border-gray-200">
                <Image
                  src="/store-location.jpg"
                  alt="Plan d'accès Dépôt Distribution Gandouz - Kheredine Le Kram La Goulette"
                  fill
                  className="object-contain md:object-cover"
                  unoptimized
                  priority
                />
              </div>
            </div>

            {/* Location & Access Details */}
            <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-[#06091F] mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#F5D800]" />
                    Coordonnées & Accès
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Notre dépôt principal est idéalement positionné sur l'axe reliant <strong>La Goulette</strong>, <strong>Khéreddine</strong> et <strong>Le Kram</strong>, facilement accessible depuis l'Avenue Habib Bourguiba et la RR23.
                  </p>
                </div>

                <div className="space-y-3.5 text-sm">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#06091F] block text-xs uppercase tracking-wider">Adresse</span>
                      <span className="text-gray-600">Secteur Khéreddine / Le Kram / La Goulette, Tunis, Tunisie</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <Clock className="w-4 h-4 text-[#1C2E5E] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#06091F] block text-xs uppercase tracking-wider">Horaires d'ouverture</span>
                      <span className="text-gray-600">Lundi au Samedi : 09h00 – 20h00</span>
                      <span className="block text-xs text-gray-400">Dimanche : Commandes en ligne 24h/24</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[#06091F] block text-xs uppercase tracking-wider">Contact & Commandes</span>
                      <span className="text-gray-600 font-semibold">+216 50 123 456 / WhatsApp disponible</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Services disponibles sur place :</span>
                  <div className="space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Retrait rapide sur place (Click & Collect)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Livraison express Grand Tunis et toute la Tunisie</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Paiement sécurisé à la livraison (Espèces ou Chèque)</span>
                    </div>
                  </div>
                </div>
              </div>

              <Link
                href="/contact"
                className="w-full text-center py-3 bg-[#06091F] hover:bg-[#1C2E5E] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
              >
                Nous Contacter pour une Commande
              </Link>
            </div>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-8 border-t border-gray-200">
          {[
            {
              icon: ShieldCheck,
              title: "Authenticité & Qualité",
              desc: "Chaque bouteille provient de filières officielles et certifiées, stockée dans des conditions climatiques idéales."
            },
            {
              icon: Star,
              title: "Sélection Exclusive",
              desc: "Des champagnes rares aux vins médaillés et bières de spécialité, introuvables en grande distribution."
            },
            {
              icon: Award,
              title: "Programme Fidélité",
              desc: "Gagnez des points à chaque commande et bénéficiez de remises immédiates sur vos prochains achats."
            }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-[#06091F] text-[#F5D800] flex items-center justify-center mx-auto shadow-md">
                <item.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-[#06091F] rounded-3xl p-8 lg:p-12 text-center text-white mt-20 relative overflow-hidden shadow-xl">
          <h3 className="text-3xl lg:text-4xl font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Prêt à Découvrir Notre Sélection ?
          </h3>
          <p className="text-white/60 text-sm max-w-md mx-auto mt-2 mb-8">
            Parcourez notre catalogue en ligne, validez votre panier et profitez du paiement à la livraison.
          </p>
          <Link href="/products" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider">
            Explorer le Catalogue <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
