import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Frequently Asked Questions — Cavista Store Clone",
  description: "Common questions about our online ordering, delivery times, Cadopoints, and mobile bar rentals.",
};

const FAQS = [
  {
    q: "How does the ordering process work?",
    a: "Browse products, add selected quantities/sizes to your shopping cart, and submit the checkout form. No online payment is required. Once submitted, our team reviews the order and contacts you to confirm delivery details. You pay the delivery driver in cash upon arrival."
  },
  {
    q: "Do you accept credit card payments online?",
    a: "No. Currently we only support Cash on Delivery (COD). This ensures you can inspect all beverage items and accessories for quality assurance before completing payment."
  },
  {
    q: "What are Cadopoints and how do I earn them?",
    a: "Cadopoints is our signature customer loyalty program. For every purchase you make, you earn loyalty points (Cadopoints) credited to your account. 1 Cadopoint equals 1 TND. You can redeem these points during checkout to claim discounts on future orders."
  },
  {
    q: "How do I request a mobile bar rental setup?",
    a: "Head to our Bar Rental Service page, review the Classic, Premium, and VIP counter options, and fill out the event booking form. Our coordinator will contact you to check venue logistics, date availability, and finalize cocktail menus."
  },
  {
    q: "Where do you deliver and what are the delivery fees?",
    a: "We deliver across major municipalities in Tunisia, with local hubs in Tunis, La Goulette, Oran, etc. The standard shipping fee is 7.000 TND, but orders exceeding 200.000 TND receive free delivery."
  }
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Header */}
      <div className="gandouz-gradient py-20 text-center text-white">
        <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          FAQ Support
        </h1>
        <p className="text-white/70 text-sm mt-3 max-w-md mx-auto leading-relaxed">
          Quick answers to common questions about our wines cellar catalog, loyalty points, and delivery procedures.
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

        {/* Still have questions */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 text-center mt-12 shadow-sm">
          <h4 className="font-bold text-[#06091F] text-base uppercase">Still Have Questions?</h4>
          <p className="text-xs text-gray-400 mt-1 mb-6">If you couldn't find the answer you were looking for, please contact our team.</p>
          <Link href="/contact" className="btn-gold inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
            Contact Support <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
