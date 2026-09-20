"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, ShoppingBag, Tag, BarChart3, Settings, ArrowRight,
  Ticket, TrendingUp, DollarSign, Clock, CheckCircle, Truck, Star,
  Layers, CheckCircle2, XCircle
} from "lucide-react";

type Order = { id: string; total: number; status: string; createdAt: string; customerName: string; orderNumber: string };

const adminNav = [
  { icon: ShoppingBag, title: "Commandes", desc: "Consulter, valider et gérer toutes les commandes clients.", href: "/admin/orders", id: "admin-card-orders" },
  { icon: Package,     title: "Produits",  desc: "Ajouter, modifier le stock et gérer le catalogue de produits.",       href: "/admin/products",    id: "admin-card-products" },
  { icon: Tag,         title: "Catégories & Marques", desc: "Organiser le catalogue avec vos catégories et marques.", href: "/admin/categories", id: "admin-card-categories" },
  { icon: Ticket,      title: "Promotions", desc: "Codes promotionnels, remises et campagnes marketing.",              href: "/admin/promotions",  id: "admin-card-promotions" },
  { icon: BarChart3,   title: "Analytiques", desc: "Rapports des ventes, tendances et chiffre d'affaires.",      href: "/admin/analytics",   id: "admin-card-analytics" },
  { icon: Star,        title: "Témoignages", desc: "Modérer et publier les avis clients vérifiés.",              href: "/admin/testimonials", id: "admin-card-testimonials" },
  { icon: Settings,    title: "Paramètres",  desc: "Frais de livraison, fidélité et coordonnées du magasin.",     href: "/admin/settings",    id: "admin-card-settings" },
];

export default function AdminDashboardPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalRevenue = orders.filter(o => o.status !== "CANCELLED").reduce((s, o) => s + Number(o.total || 0), 0);
  const pending      = orders.filter(o => ["PENDING", "PENDING_VALIDATION"].includes(o.status)).length;
  const delivered    = orders.filter(o => o.status === "DELIVERED").length;
  const recent       = [...orders].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 6);

  const kpis = [
    { label: "Total Commandes", value: loading ? "—" : orders.length, sub: "Toutes périodes", color: "text-[#1C2E5E]", bg: "bg-[#1C2E5E]/5", icon: ShoppingBag },
    { label: "En Attente", value: loading ? "—" : pending, sub: "Nécessite validation", color: "text-amber-600", bg: "bg-amber-50", icon: Clock },
    { label: "Chiffre d'Affaires", value: loading ? "—" : `${totalRevenue.toFixed(3)} TND`, sub: "Commandes valides", color: "text-emerald-600", bg: "bg-emerald-50", icon: DollarSign },
    { label: "Livrées", value: loading ? "—" : delivered, sub: "Commandes finalisées", color: "text-gray-700", bg: "bg-gray-50", icon: Truck },
  ];

  const STATUS_LABEL: Record<string, string> = {
    PENDING: "En attente",
    PENDING_VALIDATION: "En attente de validation",
    VALIDATED: "Validée",
    PREPARING: "En préparation",
    READY: "Prête",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
  };

  const STATUS_COLOR: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    PENDING_VALIDATION: "bg-amber-100 text-amber-800 border-amber-200",
    VALIDATED: "bg-blue-100 text-blue-800 border-blue-200",
    PREPARING: "bg-purple-100 text-purple-800 border-purple-200",
    READY: "bg-emerald-100 text-emerald-800 border-emerald-200",
    DELIVERED: "bg-gray-100 text-gray-700 border-gray-200",
    CANCELLED: "bg-rose-100 text-rose-800 border-rose-200",
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#06091F] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 border-b border-white/10">
        <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-1">Distribution Gandouz · Administration</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          TABLEAU DE BORD
        </h1>
        <p className="text-white/60 text-xs mt-1">Bienvenue — Vue d'ensemble en temps réel de votre activité commerciale</p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(k => (
            <div key={k.label} className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 font-semibold mb-1">{k.label}</p>
                  <p className={`text-2xl font-black ${k.color}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {k.value}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{k.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center`}>
                  <k.icon className={`w-5 h-5 ${k.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Nav Cards */}
          <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {adminNav.map(({ icon: Icon, title, desc, href, id }) => (
              <Link
                key={id}
                href={href}
                id={id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs hover:shadow-md hover:border-[#F5D800]/50 group flex flex-col justify-between gap-3 transition-all"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#06091F] flex items-center justify-center group-hover:bg-[#1C2E5E] transition-colors mb-3">
                    <Icon className="w-5 h-5 text-[#F5D800]" />
                  </div>
                  <h3 className="font-bold text-[#06091F] text-base mb-1">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[#06091F] group-hover:text-[#F5D800] transition-colors text-xs font-bold pt-2 border-t border-gray-100">
                  Accéder à {title} <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-bold text-[#06091F] text-sm uppercase tracking-wide">Commandes Récentes</h2>
                <Link href="/admin/orders" className="text-xs text-[#1C2E5E] hover:text-[#F5D800] font-bold transition-colors">
                  Voir tout →
                </Link>
              </div>
              {loading ? (
                <div className="py-12 text-center text-gray-400 text-xs font-medium">Chargement des commandes...</div>
              ) : recent.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs font-medium">Aucune commande pour le moment.</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {recent.map(o => (
                    <Link
                      key={o.id}
                      href="/admin/orders"
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50/80 transition-colors"
                    >
                      <div className="min-w-0 pr-3">
                        <p className="text-xs font-bold text-[#06091F]">#{o.orderNumber}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{o.customerName || "Client"}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full border ${STATUS_COLOR[o.status] || "bg-gray-100 text-gray-700"}`}>
                          {STATUS_LABEL[o.status] || o.status}
                        </span>
                        <p className="text-xs font-black text-[#06091F] mt-1">{Number(o.total || 0).toFixed(3)} TND</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
