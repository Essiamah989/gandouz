import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, ShieldCheck, Award } from "lucide-react";

export const metadata = {
  title: "About Us — Cavista Store Clone",
  description: "Learn about Tunisia's finest cellar collection and mobile bar service providers.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Hero */}
      <div className="gandouz-gradient py-20 text-center text-white relative">
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Our Heritage
          </h1>
          <p className="text-white/70 text-base max-w-xl mx-auto mt-4 leading-relaxed">
            From our cellars in La Goulette, we distribute the finest wines, beers, and spirits, curating private party beverage setups since 2012.
          </p>
        </div>
      </div>

      {/* Narrative */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <span className="text-[#F5D800] text-xs font-bold uppercase tracking-[0.3em] bg-[#06091F] px-3.5 py-1 rounded-full">
              WINE CELLAR SPECIALISTS
            </span>
            <h2 className="text-4xl font-black text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Curators of Luxury Beverages
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We started with a simple belief: finding rare wines, premium whiskies, and quality craft beers should be simple. Over the years, we expanded our cellar to house international labels, local vineyard specialties, and professional mixology accessories.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Beyond retail, our specialized mobile bar teams travel across Tunisia, supplying private events, VIP galas, and corporate parties with world-class cocktail bartenders and bespoke counter installations.
            </p>
          </div>

          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-lg">
            <Image
              src="https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=800&auto=format&fit=crop"
              alt="Wine Cellar"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center pt-8 border-t border-gray-200">
          {[
            {
              icon: ShieldCheck,
              title: "Quality Integrity",
              desc: "Every bottle is certified original and stored at precise climate-controlled temperatures."
            },
            {
              icon: Star,
              title: "Exclusive Selection",
              desc: "From private reserve champagnes to craft beers, we offer items unavailable in standard stores."
            },
            {
              icon: Award,
              title: "Cadopoint loyalty",
              desc: "We reward our patrons on every checkout, returning cashback straight to their balance."
            }
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-4">
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
            Ready to explore our cellar?
          </h3>
          <p className="text-white/60 text-sm max-w-md mx-auto mt-2 mb-8">
            Browse our catalog, place your order, and pay with Cash on Delivery.
          </p>
          <Link href="/products" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider">
            Start Shopping <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
