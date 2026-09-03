"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* En-tête */}
      <div className="gandouz-gradient py-20 text-center text-white">
        <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          Contactez-nous
        </h1>
        <p className="text-white/70 text-sm mt-3 max-w-md mx-auto leading-relaxed">
          Une question sur nos produits ou une commande ? Écrivez-nous, nous vous répondrons rapidement.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Coordonnées */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#06091F] text-[#F5D800] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#06091F] uppercase tracking-wider">Notre Adresse</h4>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">La Goulette, Tunisie</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#06091F] text-[#F5D800] flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#06091F] uppercase tracking-wider">Téléphone</h4>
                <div className="flex flex-col gap-1 mt-1 text-xs text-gray-500">
                  <a href="tel:+21654333612" className="hover:text-[#06091F] transition-colors">+216 54333612</a>
                  <a href="tel:+21654555712" className="hover:text-[#06091F] transition-colors">+216 54555712</a>
                  <a href="tel:+21654555885" className="hover:text-[#06091F] transition-colors">+216 54555885</a>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#06091F] text-[#F5D800] flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#06091F] uppercase tracking-wider">Email</h4>
                <p className="text-xs text-gray-500 mt-1">
                  <a href="mailto:contact.gandouz@gmail.com" className="hover:text-[#06091F] transition-colors">
                    contact.gandouz@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 p-8 shadow-md">
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-[#06091F] text-lg uppercase">Message envoyé !</h4>
                <p className="text-xs text-gray-400 mt-1">Nous examinerons votre demande et vous répondrons dans les plus brefs délais.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2 bg-gray-100 text-[#06091F] text-xs font-bold rounded-lg uppercase tracking-wider"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-2xl font-black text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Écrivez-nous
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nom</label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Votre nom"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#F5D800]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Adresse e-mail</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@exemple.com"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#F5D800]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Sujet</label>
                  <input
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Sujet du message"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#F5D800]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Votre Message</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Décrivez votre demande en détail..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#F5D800] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-gold py-3 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "Envoi en cours..." : "Envoyer le message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
