import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Foire Aux Questions - Distribution Gandouz",
  description: "Questions fréquentes sur les commandes, la livraison et les services de Distribution Gandouz.",
};

const FAQS = [
  {
    q: "Comment fonctionne le processus de commande ?",
    a: "Parcourez notre catalogue, ajoutez les articles et quantités souhaités à votre panier, puis validez le formulaire de commande. Aucun paiement en ligne n'est requis. Dès réception, notre équipe examine votre commande et vous contacte par téléphone pour convenir des détails de livraison. Vous réglez directement le livreur en espèces à la livraison."
  },
  {
    q: "Acceptez-vous les paiements par carte bancaire en ligne ?",
    a: "Non. Nous privilégions le paiement à la livraison (Cash on Delivery). Cela vous permet de vérifier l'état et la conformité de vos bouteilles et articles avant d'effectuer le règlement."
  },
  {
    q: "Que sont les Cadopoints et comment en bénéficier ?",
    a: "Les Cadopoints constituent notre programme de fidélité. Lors de chaque commande confirmée, vous cumulez des points de fidélité crédités sur votre compte. 1 Cadopoint équivaut à 1 TND de réduction, utilisable directement lors de vos prochains achats."
  },
  {
    q: "Quelles sont vos zones et tarifs de livraison ?",
    a: "Nous assurons la livraison sur le Grand Tunis, La Goulette, Le Kram, Carthage, La Marsa et les principales localités environnantes. Les frais de livraison standard sont de 7,000 TND. La livraison est offerte pour toute commande supérieure à 200,000 TND."
  },
  {
    q: "Proposez-vous un service de Bar Mobile pour les événements ?",
    a: "Oui ! Nous proposons la location de bars mobiles avec barmen et mixologues professionnels pour vos soirées privées, mariages et événements d'entreprise. Vous pouvez réserver directement sur notre page Bar Événements."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* En-tête */}
      <div className="gandouz-gradient py-20 text-center text-white">
        <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Foire Aux Questions
        </h1>
        <p className="text-white/70 text-sm mt-3 max-w-md mx-auto leading-relaxed">
          Retrouvez les réponses à vos questions concernant notre catalogue de vins, notre programme de fidélité et nos modes de livraison.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 lg:p-8 border border-gray-100 shadow-sm space-y-3">
              <div className="flex gap-3 items-start">
                <HelpCircle className="w-5 h-5 text-[#F5D800] shrink-0 mt-0.5" />
                <h3 className="font-bold text-sm text-[#06091F] uppercase tracking-wide">
                  {faq.q}
                </h3>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed pl-8">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Vous avez encore des questions ? */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center mt-12 shadow-sm">
          <h4 className="font-bold text-[#06091F] text-base uppercase">Vous avez encore des questions ?</h4>
          <p className="text-xs text-gray-400 mt-1 mb-6">Si vous ne trouvez pas la réponse souhaitée, notre équipe se tient à votre entière disposition.</p>
          <Link href="/contact" className="btn-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
            Contacter le support <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
