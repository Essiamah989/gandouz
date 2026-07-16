"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package, ShoppingBag, Tag, BarChart3, Settings, ArrowRight,
  Ticket, TrendingUp, DollarSign, Clock, CheckCircle, Truck,
} from "lucide-react";

type Order = { id: string; total: number; status: string; createdAt: string; customerName: string; orderNumber: string };

const adminNav = [
  { icon: ShoppingBag, title: "Orders", desc: "View, validate, and manage all customer orders.", href: "/admin/orders", id: "admin-card-orders" },
  { icon: Package,     title: "Products",  desc: "Add, edit, and manage your product catalog.",       href: "/admin/products",    id: "admin-card-products" },
  { icon: Tag,         title: "Categories & Brands", desc: "Organise your catalog with categories and brands.", href: "/admin/categories", id: "admin-card-categories" },
  { icon: Ticket,      title: "Promotions", desc: "Discount codes and promo campaigns.",              href: "/admin/promotions",  id: "admin-card-promotions" },
  { icon: BarChart3,   title: "Analytics", desc: "Sales reports, order trends and performance.",      href: "/admin/analytics",   id: "admin-card-analytics" },
  { icon: Settings,    title: "Settings",  desc: "Shipping fees, loyalty rate, contact details.",     href: "/admin/settings",    id: "admin-card-settings" },
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
  const recent       = [...orders].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 5);

  const kpis = [
    { label: "Total Orders", value: loading ? "—" : orders.length, sub: "All time", color: "text-[#1C2E5E]", bg: "bg-[#1C2E5E]/5", icon: ShoppingBag },
    { label: "Pending", value: loading ? "—" : pending, sub: "Need review", color: "text-yellow-600", bg: "bg-yellow-50", icon: Clock },
    { label: "Revenue", value: loading ? "—" : `${totalRevenue.toFixed(0)} TND`, sub: "Non-cancelled", color: "text-green-600", bg: "bg-green-50", icon: DollarSign },
    { label: "Delivered", value: loading ? "—" : delivered, sub: "Completed", color: "text-gray-700", bg: "bg-gray-50", icon: Truck },
  ];

  const STATUS_COLOR: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    PENDING_VALIDATION: "bg-yellow-100 text-yellow-700",
    VALIDATED: "bg-blue-100 text-blue-700",
    PREPARING: "bg-purple-100 text-purple-700",
    READY: "bg-green-100 text-green-700",
    DELIVERED: "bg-gray-100 text-gray-700",
    CANCELLED: "bg-red-100 text-red-700",
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#06091F] px-8 py-8">
        <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-1">Distribution Gandouz</p>
        <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          ADMIN DASHBOARD
        </h1>
        <p className="text-white/50 text-sm mt-1">Welcome back — here's your store at a glance</p>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map(k => (
            <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{k.label}</p>
                  <p className={`text-2xl font-extrabold ${k.color}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    {k.value}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{k.sub}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center`}>
                  <k.icon className={`w-4 h-4 ${k.color}`} />
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
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-[#F5D800]/40 group flex flex-col gap-3 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#06091F] flex items-center justify-center group-hover:bg-[#1C2E5E] transition-colors">
                    <Icon className="w-4.5 h-4.5 text-[#F5D800]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-[#06091F] text-sm mb-0.5">{title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                </div>
                <div className="flex items-center gap-1 text-[#1C2E5E] group-hover:text-[#F5D800] transition-colors text-xs font-semibold mt-auto">
                  Open {title} <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Orders */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-bold text-[#06091F] text-sm">Recent Orders</h2>
                <Link href="/admin/orders" className="text-xs text-[#1C2E5E] hover:text-[#F5D800] font-semibold transition-colors">
                  View all →
                </Link>
              </div>
              {loading ? (
                <div className="py-10 text-center text-gray-400 text-sm">Loading...</div>
              ) : recent.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-sm">No orders yet.</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recent.map(o => (
                    <Link
                      key={o.id}
                      href="/admin/orders"
                      className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#06091F]">#{o.orderNumber}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{o.customerName}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLOR[o.status] || "bg-gray-100 text-gray-600"}`}>
                          {o.status?.replace(/_/g, " ")}
                        </span>
                        <p className="text-xs font-bold text-[#06091F] mt-0.5">{Number(o.total || 0).toFixed(3)} TND</p>
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
