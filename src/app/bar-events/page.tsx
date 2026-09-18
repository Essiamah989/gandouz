"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, GlassWater, ArrowLeft, ArrowRight, ShieldCheck, Check, Sparkles, AlertCircle } from "lucide-react";

const BAR_PACKAGES = [
  {
    name: "Bar Mobile Classique",
    price: "450 TND",
    description: "Idéal pour les anniversaires et réceptions intimes jusqu'à 40 invités.",
    features: [
      "1 Barman / mixologue professionnel",
      "Comptoir de bar en bois standard",
      "Menu de 4 cocktails classiques & soft drinks",
      "4 Heures de service actif",
      "Verrerie standard & approvisionnement en glaçons"
    ],
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Bar à Cocktails Premium",
    price: "900 TND",
    description: "Notre formule la plus prisée. Parfaite pour mariages, lancements d'entreprise et fêtes jusqu'à 100 invités.",
    features: [
      "2 Mixologues certifiés",
      "Comptoir de bar modulable et lumineux",
      "Menu personnalisé de 6 cocktails signatures & classiques",
      "6 Heures de service actif",
      "Verrerie haut de gamme & garnitures fraîches",
      "Tableau de menu personnalisé imprimé"
    ],
    image: "https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=600&auto=format&fit=crop",
    popular: true
  },
  {
    name: "Bar Cave Élite VIP",
    price: "1 800 TND",
    description: "L'expérience bar de grand luxe pour galas prestigieux et réceptions VIP jusqu'à 250 invités.",
    features: [
      "3 Maîtres mixologues & assistants",
      "Installation bar marbre & finitions dorées",
      "Spiritueux d'exception : Single Malts, Cognac & cocktails Champagne",
      "Heures de service illimitées (jusqu'à 10h)",
      "Verrerie gravée sur mesure",
      "Effets visuels fumée / carboglace spectaculaires"
    ],
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?q=80&w=600&auto=format&fit=crop"
  }
];

export default function BarEventsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: "20",
    package: "Bar à Cocktails Premium",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* En-tête */}
      <div className="gandouz-gradient py-20 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5D800_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#F5D800] uppercase font-bold tracking-widest hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Retour à la boutique
          </Link>
          <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Location de Bar Mobile
          </h1>
          <p className="text-white/70 text-base lg:text-lg max-w-xl mx-auto mt-4 leading-relaxed">
            Transformez vos réceptions privées, galas et mariages en une expérience mixologie inoubliable avec nos bars mobiles haut de gamme.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Formules */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Choisissez Votre Formule Bar
          </h2>
          <p className="text-gray-500 text-sm mt-1">Les tarifs incluent tout le matériel, les glaçons et le service des barmen</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {BAR_PACKAGES.map((pkg, i) => (
            <div
              key={i}
              className={`bg-white rounded-3xl overflow-hidden border shadow-sm flex flex-col justify-between relative ${
                pkg.popular ? "border-[#F5D800] ring-4 ring-[#F5D800]/10" : "border-gray-100"
              }`}
            >
              {pkg.popular && (
                <span className="absolute top-4 right-4 bg-[#F5D800] text-[#06091F] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full z-10 shadow-sm">
                  LE PLUS POPULAIRE
                </span>
              )}
              
              <div>
                <div className="relative h-60 bg-gray-100">
                  <Image src={pkg.image} alt={pkg.name} fill className="object-cover" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white text-3xl font-black tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {pkg.price}
                  </span>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{pkg.description}</p>
                  
                  <ul className="mt-6 space-y-3">
                    {pkg.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-gray-600">
                        <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="p-6 pt-0">
                <button
                  onClick={() => {
                    setFormData(prev => ({ ...prev, package: pkg.name }));
                    document.getElementById("booking-form")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-bold uppercase transition-all ${
                    pkg.popular
                      ? "btn-gold"
                      : "bg-[#06091F] text-white hover:bg-[#1C2E5E]"
                  }`}
                >
                  Choisir cette formule
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Section Formulaire de Réservation */}
        <div className="max-w-3xl mx-auto" id="booking-form">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 shadow-md">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Demande bien reçue !
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                  Merci pour votre demande, <strong>{formData.name}</strong>. Notre responsable événementiel vous contactera au <strong>{formData.phone}</strong> ou par email à <strong>{formData.email}</strong> sous 24 heures pour valider les disponibilités et la logistique.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#06091F] rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Nouvelle demande
                  </button>
                  <Link
                    href="/"
                    className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Retour à l'accueil
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-1 text-[#F5D800] text-xs font-bold uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" />
                    DEMANDE DE RÉSERVATION
                  </span>
                  <h3 className="text-3xl font-black text-[#06091F] uppercase mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Réserver un Bar Mobile
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Remplissez le formulaire ci-dessous. Aucun paiement en ligne requis.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nom & Prénom</label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom complet"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-xs focus:ring-2 focus:ring-[#F5D800] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Numéro de Téléphone</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+216 54 333 612"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-xs focus:ring-2 focus:ring-[#F5D800] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Adresse E-mail</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@exemple.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-xs focus:ring-2 focus:ring-[#F5D800] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Date de l'Événement</label>
                    <div className="relative">
                      <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        required
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-xs focus:ring-2 focus:ring-[#F5D800] focus:border-transparent outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nombre d'Invités Estimé</label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-xs focus:ring-2 focus:ring-[#F5D800] focus:border-transparent outline-none appearance-none"
                      >
                        <option value="20">Jusqu'à 20 personnes</option>
                        <option value="50">20 à 50 personnes</option>
                        <option value="100">50 à 100 personnes</option>
                        <option value="250">100 à 250 personnes</option>
                        <option value="500">250+ personnes</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Formule Choisie</label>
                    <div className="relative">
                      <GlassWater className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <select
                        name="package"
                        value={formData.package}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-xs focus:ring-2 focus:ring-[#F5D800] focus:border-transparent outline-none appearance-none"
                      >
                        <option value="Bar Mobile Classique">Bar Mobile Classique — 450 TND</option>
                        <option value="Bar à Cocktails Premium">Bar à Cocktails Premium — 900 TND</option>
                        <option value="Bar Cave Élite VIP">Bar Cave Élite VIP — 1 800 TND</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Détails et Demandes Particulières</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Lieu de l'événement, cocktails spécifiques souhaités, ambiance..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-xs focus:ring-2 focus:ring-[#F5D800] focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-blue-700 leading-normal">
                    🔒 Aucun paiement immédiat n'est requis. Notre coordinateur opérationnel vous contactera pour valider tous les détails de votre réservation.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl text-xs font-bold uppercase btn-gold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Envoi en cours..." : "Envoyer la Demande de Réservation"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
