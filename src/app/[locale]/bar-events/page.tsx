"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Users, GlassWater, ArrowLeft, ArrowRight, ShieldCheck, Check, Sparkles, AlertCircle } from "lucide-react";

const BAR_PACKAGES = [
  {
    name: "Classic Mobile Bar",
    price: "450 TND",
    description: "Ideal for birthday parties and intimate gatherings of up to 40 guests.",
    features: [
      "1 Professional bartender/mixologist",
      "Standard wooden bar counter setup",
      "Menu of 4 classic cocktails & soft drinks",
      "4 Hours of active service",
      "Standard glassware & ice supply"
    ],
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Premium Cocktail Bar",
    price: "900 TND",
    description: "Our most popular setup. Perfect for weddings, corporate launches, and parties of up to 100 guests.",
    features: [
      "2 Certified mixologists",
      "Luminous custom modular bar counter",
      "Customized menu of 6 signatures & classics",
      "6 Hours of active service",
      "Elite crystal glassware & custom garnishes",
      "Custom print menu card board"
    ],
    image: "https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=600&auto=format&fit=crop",
    popular: true
  },
  {
    name: "VIP Elite Cellar Bar",
    price: "1,800 TND",
    description: "Ultimate luxury bar experience for high-end galas and VIP events of up to 250 guests.",
    features: [
      "3 Master mixologists & bar assistants",
      "Premium gold-trimmed marble bar setup",
      "Premium spirits: Single Malts, Cognac & Champagne cocktails",
      "Unlimited hours of service (up to 10h)",
      "Bespoke engraved premium glassware",
      "Custom dry ice / smoke smoke show effects"
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
    package: "Premium Cocktail Bar",
    notes: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request
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
      {/* Header */}
      <div className="gandouz-gradient py-20 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#F5D800_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="relative max-w-4xl mx-auto px-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-[#F5D800] uppercase font-bold tracking-widest hover:underline mb-4">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cellar Shop
          </Link>
          <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Mobile Bar Rental
          </h1>
          <p className="text-white/70 text-base lg:text-lg max-w-xl mx-auto mt-4 leading-relaxed">
            Turn your private gatherings, galas, and wedding events into an elite mixology experience with our premium mobile bar setups.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Packages Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-black text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Select Your Bar Counter Setup
          </h2>
          <p className="text-gray-500 text-sm mt-1">Pricing includes full tools setup, ice supply, and bartenders</p>
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
                  MOST POPULAR
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
                  Select Package
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Form Section */}
        <div className="max-w-3xl mx-auto" id="booking-form">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 lg:p-12 shadow-md">
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Request Received!
                </h3>
                <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                  Thank you for booking with us, <strong>{formData.name}</strong>. Our events manager will contact you at <strong>{formData.phone}</strong> or <strong>{formData.email}</strong> within 24 hours to confirm menu items and event logistics.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-[#06091F] rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Submit Another Request
                  </button>
                  <Link
                    href="/"
                    className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    Back to Homepage
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-1 text-[#F5D800] text-xs font-bold uppercase tracking-widest">
                    <Sparkles className="w-3.5 h-3.5" />
                    RESERVATION REQUEST
                  </span>
                  <h3 className="text-3xl font-black text-[#06091F] uppercase mt-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Book Your Custom Bar
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Provide event details below. No payment online required.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Contact Name</label>
                    <input
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-xs focus:ring-2 focus:ring-[#F5D800] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Phone Number</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+216 XX XXX XXX"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-xs focus:ring-2 focus:ring-[#F5D800] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email Address</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-xs focus:ring-2 focus:ring-[#F5D800] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Event Date</label>
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
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Expected Guests</label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-xs focus:ring-2 focus:ring-[#F5D800] focus:border-transparent outline-none appearance-none"
                      >
                        <option value="20">Up to 20 Guests</option>
                        <option value="50">20 - 50 Guests</option>
                        <option value="100">50 - 100 Guests</option>
                        <option value="250">100 - 250 Guests</option>
                        <option value="500">250+ Guests</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Bar Counter Package</label>
                    <div className="relative">
                      <GlassWater className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <select
                        name="package"
                        value={formData.package}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white text-xs focus:ring-2 focus:ring-[#F5D800] focus:border-transparent outline-none appearance-none"
                      >
                        <option value="Classic Mobile Bar">Classic Mobile Bar — 450 TND</option>
                        <option value="Premium Cocktail Bar">Premium Cocktail Bar — 900 TND</option>
                        <option value="VIP Elite Cellar Bar">VIP Elite Cellar Bar — 1,800 TND</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Special Event Requests / Details</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us about the venue, custom drinks requests, theme..."
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-xs focus:ring-2 focus:ring-[#F5D800] focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-blue-700 leading-normal">
                    🔒 No payment is collected. This submission acts as a booking request. Our operations coordinator will contact you to review availability and confirm your bar reservation.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl text-xs font-bold uppercase btn-gold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? "Submitting Booking..." : "Submit Reservation Request"}
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
