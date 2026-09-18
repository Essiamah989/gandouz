import Link from "next/link";
import { CheckCircle, ArrowRight, Phone, Mail } from "lucide-react";
import { Suspense } from "react";

function ConfirmationContent({ orderNumber }: { orderNumber: string }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F2F2F2] px-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center">
        {/* Icône de succès */}
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <h1
          className="text-4xl font-extrabold text-[#06091F] mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
        >
          MERCI POUR VOTRE COMMANDE !
        </h1>
        <p className="text-gray-600 text-base mb-6 leading-relaxed">
          Votre commande a bien été reçue. Notre équipe va examiner votre commande et vous contacter si nécessaire pour confirmer la livraison.
        </p>

        {/* Numéro de commande */}
        <div className="bg-[#F2F2F2] rounded-2xl p-5 mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Numéro de Commande</p>
          <p
            className="text-3xl font-extrabold text-[#1C2E5E]"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            #{orderNumber || "000000"}
          </p>
        </div>

        {/* Badge de statut */}
        <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
          <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          En attente de validation
        </div>

        {/* Prochaines étapes */}
        <div className="bg-[#06091F] rounded-2xl p-5 mb-6 text-left">
          <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-3">
            Prochaines étapes
          </p>
          <ul className="flex flex-col gap-2">
            {[
              "Notre équipe examine les détails de votre commande.",
              "Nous vous contactons par téléphone pour confirmer.",
              "Votre commande est préparée et expédiée.",
              "Vous recevez vos produits et réglez à la livraison !",
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                <span className="text-[#F5D800] font-bold shrink-0">{i + 1}.</span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex gap-3 justify-center mb-8">
          <a
            href="tel:+21654333612"
            id="confirm-call-btn"
            className="flex items-center gap-2 text-sm font-semibold text-[#1C2E5E] hover:text-[#F5D800] transition-colors"
          >
            <Phone className="w-4 h-4" /> Appelez-nous
          </a>
          <span className="text-gray-300">|</span>
          <a
            href="mailto:contact.gandouz@gmail.com"
            id="confirm-email-btn"
            className="flex items-center gap-2 text-sm font-semibold text-[#1C2E5E] hover:text-[#F5D800] transition-colors"
          >
            <Mail className="w-4 h-4" /> Écrivez-nous
          </a>
        </div>

        <Link
          href="/products"
          id="confirm-continue-btn"
          className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold"
        >
          Continuer mes achats <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default async function OrderConfirmationPage(props: {
  searchParams: Promise<{ orderNumber?: string }>;
}) {
  const searchParams = await props.searchParams;
  const orderNumber = searchParams?.orderNumber ?? "000000";

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <ConfirmationContent orderNumber={orderNumber} />
    </Suspense>
  );
}
