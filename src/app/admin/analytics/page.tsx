"use client";

import { useState, useEffect } from "react";
import { TrendingUp, ShoppingBag, Package, DollarSign, ArrowUp, Clock, CheckCircle, Truck, Star, XCircle } from "lucide-react";

type Order = {
  id: string; orderNumber: string; customerName: string; total: number;
  status: string; createdAt: string; items: any[];
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  PENDING_VALIDATION: "Validation en attente",
  VALIDATED: "Validée",
  PREPARING: "En préparation",
  READY: "Prête",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800 border border-amber-200",
  PENDING_VALIDATION: "bg-amber-100 text-amber-800 border border-amber-200",
  VALIDATED: "bg-blue-100 text-blue-800 border border-blue-200",
  PREPARING: "bg-purple-100 text-purple-800 border border-purple-200",
  READY: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  DELIVERED: "bg-gray-100 text-gray-700 border border-gray-200",
  CANCELLED: "bg-rose-100 text-rose-800 border border-rose-200",
};

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string | number; sub?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{label}</p>
          <p className={`text-3xl font-black ${color}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${color.replace("text-", "bg-").replace("-600", "-100").replace("-700", "-100")}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then(r => r.json())
      .then(data => { setOrders(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const totalRevenue = orders
    .filter(o => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  const delivered = orders.filter(o => o.status === "DELIVERED").length;
  const pending   = orders.filter(o => ["PENDING", "PENDING_VALIDATION"].includes(o.status || "")).length;
  const cancelled = orders.filter(o => o.status === "CANCELLED").length;

  const validOrdersCount = orders.filter(o => o.status !== "CANCELLED").length;
  const avgOrder = validOrdersCount > 0 ? totalRevenue / validOrdersCount : 0;

  // Orders by status distribution
  const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
    const s = o.status || "UNKNOWN";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  // Recent orders
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

  // Top revenue days
  const dailyRevenue: Record<string, number> = {};
  orders.filter(o => o.status !== "CANCELLED").forEach(o => {
    const day = new Date(o.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
    dailyRevenue[day] = (dailyRevenue[day] || 0) + (Number(o.total) || 0);
  });

  const maxRevenue = Math.max(...Object.values(dailyRevenue), 1);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#06091F] px-8 py-8 border-b border-white/10">
        <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-1">Admin · Rapports & Statistiques</p>
        <h1 className="text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          ANALYTIQUES & PERFORMANCES
        </h1>
        <p className="text-white/60 text-xs mt-1">Évolution des ventes, volume des commandes et chiffre d'affaires</p>
      </div>

      <div className="px-8 py-6 space-y-6">
        {loading ? (
          <div className="py-20 text-center text-gray-400 text-xs font-medium">Chargement des statistiques...</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Chiffre d'Affaires" value={`${totalRevenue.toFixed(3)} TND`} sub="Commandes non annulées" icon={DollarSign} color="text-emerald-600" />
              <StatCard label="Total Commandes" value={orders.length} sub={`${pending} en attente`} icon={ShoppingBag} color="text-[#1C2E5E]" />
              <StatCard label="Panier Moyen" value={isNaN(avgOrder) ? "—" : `${avgOrder.toFixed(3)} TND`} icon={TrendingUp} color="text-purple-600" />
              <StatCard label="Commandes Livrées" value={delivered} sub={`${cancelled} annulées`} icon={Truck} color="text-gray-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6">
                <h2 className="font-bold text-[#06091F] text-base mb-0.5">Revenu Journalier (TND)</h2>
                <p className="text-xs text-gray-400 mb-6">Calculé sur les commandes confirmées</p>
                {Object.keys(dailyRevenue).length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-gray-400 text-xs font-medium">Aucune donnée pour le moment</div>
                ) : (
                  <div className="flex items-end gap-2 h-44 pt-4">
                    {Object.entries(dailyRevenue).slice(-10).map(([day, rev]) => (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[10px] text-gray-600 font-bold">{rev.toFixed(0)}</span>
                        <div
                          className="w-full rounded-t-xl bg-gradient-to-t from-[#06091F] to-[#F5D800] transition-all shadow-xs"
                          style={{ height: `${Math.max(8, (rev / maxRevenue) * 100)}%` }}
                        />
                        <span className="text-[10px] text-gray-400 font-semibold whitespace-nowrap">{day}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6">
                <h2 className="font-bold text-[#06091F] text-base mb-0.5">Répartition des Statuts</h2>
                <p className="text-xs text-gray-400 mb-5">Distribution sur l'ensemble des commandes</p>
                <div className="space-y-3.5">
                  {Object.entries(statusCounts).map(([status, count]) => {
                    const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[status] || "bg-gray-100 text-gray-600"}`}>
                            {STATUS_LABELS[status] || status}
                          </span>
                          <span className="text-xs text-gray-600 font-bold">{count} ({pct}%)</span>
                        </div>
                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#06091F] rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(statusCounts).length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-6">Aucune commande enregistrée</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="font-bold text-[#06091F] text-sm uppercase tracking-wide">Dernières Commandes Passées</h2>
              </div>
              {recentOrders.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-xs font-medium">Aucune commande pour le moment</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/80 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">N° Commande</th>
                      <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Client</th>
                      <th className="text-right px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="text-center px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                      <th className="text-right px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="px-6 py-3.5 font-bold text-[#06091F]">#{o.orderNumber}</td>
                        <td className="px-4 py-3.5 text-gray-700 font-medium hidden md:table-cell">{o.customerName || "Client"}</td>
                        <td className="px-4 py-3.5 text-right font-black text-[#06091F]">{Number(o.total || 0).toFixed(3)} TND</td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${STATUS_COLORS[o.status] || "bg-gray-100 text-gray-600"}`}>
                            {STATUS_LABELS[o.status] || o.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right text-xs text-gray-400 hidden lg:table-cell">
                          {new Date(o.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
