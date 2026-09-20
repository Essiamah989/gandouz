"use client";

import { useState, useEffect } from "react";

import {
  Package, Search, Eye, Clock, CheckCircle, Truck, Star, XCircle,
  ChevronDown, Phone, Mail, Printer, DollarSign, CheckSquare, X
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

type OrderStatus =
  | "PENDING" | "PENDING_VALIDATION" | "VALIDATED"
  | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";

type OrderItem = {
  productId?: string; productName?: string; name?: string;
  variantSize?: string; unitPrice?: number; price?: number;
  qty?: number; quantity?: number; total?: number;
};

type Order = {
  id: string; orderNumber: string; customerName?: string;
  email?: string; phone?: string; city?: string; address?: string;
  guestEmail?: string; shippingAddress?: any;
  subtotal?: number; discount?: number; shipping?: number;
  total: number; status: OrderStatus; cashCollected?: boolean;
  notes?: string; createdAt: string; updatedAt?: string;
  items: OrderItem[];
  statusHistory?: Array<{ status: string; note?: string; createdAt: string; createdBy?: string }>;
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:            { label: "En attente",             color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
  PENDING_VALIDATION: { label: "Validation en attente",  color: "bg-amber-100 text-amber-800 border-amber-200", icon: Clock },
  VALIDATED:          { label: "Validée",                color: "bg-blue-100 text-blue-800 border-blue-200",       icon: CheckCircle },
  PREPARING:          { label: "En préparation",         color: "bg-purple-100 text-purple-800 border-purple-200", icon: Package },
  READY:              { label: "Prête",                  color: "bg-emerald-100 text-emerald-800 border-emerald-200",    icon: Star },
  DELIVERED:          { label: "Livrée",                 color: "bg-gray-100 text-gray-700 border-gray-200",      icon: Truck },
  CANCELLED:          { label: "Annulée",                color: "bg-rose-100 text-rose-800 border-rose-200",         icon: XCircle },
};

const STATUS_FLOW: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING:            "VALIDATED",
  PENDING_VALIDATION: "VALIDATED",
  VALIDATED:          "PREPARING",
  PREPARING:          "READY",
  READY:              "DELIVERED",
};

const ALL_STATUSES: OrderStatus[] = [
  "PENDING", "PENDING_VALIDATION", "VALIDATED", "PREPARING", "READY", "DELIVERED", "CANCELLED",
];

function getItemName(item: OrderItem) { return item.productName || item.name || "Produit"; }
function getItemQty(item: OrderItem)  { return item.qty || item.quantity || 1; }
function getItemPrice(item: OrderItem){ return item.unitPrice || item.price || 0; }

export default function AdminOrdersPage() {
  const [orders, setOrders]             = useState<Order[]>([]);
  const [selected, setSelected]         = useState<Order | null>(null);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
  const [loading, setLoading]           = useState(true);
  const [updating, setUpdating]         = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/orders");
      if (r.ok) setOrders(await r.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const filtered = orders.filter(o => {
    const cName = o.customerName || o.shippingAddress?.customerName || "";
    const pNum = o.phone || o.shippingAddress?.phone || "";
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      cName.toLowerCase().includes(search.toLowerCase()) ||
      pNum.includes(search);
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    setUpdating(true);
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status: newStatus }),
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, status: newStatus } : null);
    }
    setUpdating(false);
  };

  const handleCashToggle = async (orderId: string, current: boolean) => {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, cashCollected: !current }),
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, cashCollected: !current } : o));
      if (selected?.id === orderId) setSelected(prev => prev ? { ...prev, cashCollected: !current } : null);
    }
  };

  const stats = {
    pending:   orders.filter(o => ["PENDING", "PENDING_VALIDATION"].includes(o.status)).length,
    validated: orders.filter(o => o.status === "VALIDATED").length,
    progress:  orders.filter(o => ["PREPARING", "READY"].includes(o.status)).length,
    delivered: orders.filter(o => o.status === "DELIVERED").length,
  };

  const nextStatus = selected ? STATUS_FLOW[selected.status] : undefined;

  return (
    <div className="min-h-screen bg-[#F8FAFC] print:min-h-0 print:bg-white">
      {/* Header */}
      <div className="bg-[#06091F] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 border-b border-white/10 print:hidden">
        <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-1">Admin · Opérations Commerciales</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          GESTION DES COMMANDES
        </h1>
        <p className="text-white/60 text-xs mt-1">{orders.length} commandes au total</p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 print:p-0 print:space-y-0 print:m-0">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 print:hidden">
          {[
            { label: "En Attente", value: stats.pending, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Validées", value: stats.validated, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "En Préparation", value: stats.progress, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Livrées", value: stats.delivered, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 border border-gray-200/80 shadow-xs`}>
              <p className="text-[11px] sm:text-xs text-gray-500 font-semibold mb-1 truncate">{s.label}</p>
              <p className={`text-2xl sm:text-3xl font-black ${s.color}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 print:block">
          {/* Orders List */}
          <div className="xl:col-span-2 print:hidden">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="admin-orders-search"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="N° commande, client, tél..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F5D800]/40 shadow-xs"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as OrderStatus | "ALL")}
                  className="w-full sm:w-auto appearance-none pl-4 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F5D800]/40 shadow-xs font-semibold cursor-pointer"
                >
                  <option value="ALL">Tous les statuts</option>
                  {ALL_STATUSES.map(s => (
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-[#F5D800] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Package className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                  <p className="text-sm font-semibold">Aucune commande trouvée.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {filtered.map(order => {
                    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
                    const Icon = cfg.icon;
                    return (
                      <button
                        key={order.id}
                        id={`admin-order-row-${order.id}`}
                        onClick={() => setSelected(order)}
                        className={`w-full text-left px-5 py-4 hover:bg-gray-50/80 transition-colors ${
                          selected?.id === order.id ? "bg-[#F5D800]/5 border-l-4 border-l-[#F5D800]" : ""
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="font-bold text-[#06091F] text-sm">#{order.orderNumber}</span>
                              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${cfg.color}`}>
                                <Icon className="w-3 h-3" />
                                {cfg.label}
                              </span>
                              {order.cashCollected && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                  <DollarSign className="w-3 h-3" /> Encaissé
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-800 font-bold">{order.customerName || order.shippingAddress?.customerName || "Client inconnu"}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{order.phone || order.shippingAddress?.phone} · {order.city || order.shippingAddress?.city}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-black text-[#06091F] text-sm">{formatPrice(order.total)}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="xl:col-span-1 print:w-full print:m-0 print:block">
            {selected ? (
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs sticky top-6 overflow-hidden print:static print:border-none print:shadow-none">
                {/* Panel Header */}
                <div className="bg-[#06091F] px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest print:text-gray-800">Détails de la Commande</p>
                    <p className="text-white font-bold print:text-black">#{selected.orderNumber}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-white/50 hover:text-white text-xs transition-colors print:hidden">
                    ✕ Fermer
                  </button>
                </div>

                <div className="p-5 space-y-5">
                  {/* Status Badge */}
                  <div className="text-center">
                    {(() => {
                      const cfg = STATUS_CONFIG[selected.status] || STATUS_CONFIG.PENDING;
                      const Icon = cfg.icon;
                      return (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-1.5 rounded-full border ${cfg.color}`}>
                          <Icon className="w-4 h-4" />
                          {cfg.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Customer Info */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Informations Client</p>
                    <p className="font-bold text-[#06091F] text-sm">{selected.customerName || selected.shippingAddress?.customerName}</p>
                    <a href={`tel:${selected.phone || selected.shippingAddress?.phone}`} className="flex items-center gap-1.5 text-xs text-[#1C2E5E] hover:text-[#F5D800] mt-1.5 font-semibold transition-colors">
                      <Phone className="w-3.5 h-3.5" /> {selected.phone || selected.shippingAddress?.phone}
                    </a>
                    <a href={`mailto:${selected.email || selected.guestEmail}`} className="flex items-center gap-1.5 text-xs text-[#1C2E5E] hover:text-[#F5D800] mt-1 font-semibold transition-colors">
                      <Mail className="w-3.5 h-3.5" /> {selected.email || selected.guestEmail}
                    </a>
                    <p className="text-xs text-gray-600 mt-1.5 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                      <strong>Adresse de livraison :</strong><br />
                      {selected.address || selected.shippingAddress?.address}, {selected.city || selected.shippingAddress?.city}
                    </p>
                    {selected.notes && (
                      <p className="text-xs italic text-gray-500 mt-1.5 bg-amber-50/60 border border-amber-100 p-2 rounded-xl">
                        <strong>Note client :</strong> "{selected.notes}"
                      </p>
                    )}
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Articles Commandés</p>
                    <div className="space-y-1.5">
                      {selected.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
                          <span className="text-gray-800 font-semibold truncate mr-2">
                            {getItemName(item)}
                            {item.variantSize && <span className="text-gray-400"> ({item.variantSize})</span>}
                            <span className="text-gray-500 font-normal"> × {getItemQty(item)}</span>
                          </span>
                          <span className="font-bold text-[#06091F] shrink-0">
                            {formatPrice(Number(getItemPrice(item)) * Number(getItemQty(item)))}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 mt-3 pt-3 space-y-1.5">
                      {selected.subtotal != null && (
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Sous-total</span><span>{formatPrice(selected.subtotal)}</span>
                        </div>
                      )}
                      {selected.discount != null && selected.discount > 0 && (
                        <div className="flex justify-between text-xs text-emerald-600 font-semibold">
                          <span>Remise / Code Promo</span><span>-{formatPrice(selected.discount)}</span>
                        </div>
                      )}
                      {selected.shipping != null && (
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Frais de livraison</span><span>{formatPrice(selected.shipping)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-black text-[#06091F] text-base pt-2 border-t border-gray-100">
                        <span>Total TTC</span><span>{formatPrice(selected.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2.5 print:hidden">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Actions Rapides</p>

                    {nextStatus && (
                      <button
                        id={`admin-advance-${selected.id}`}
                        onClick={() => handleStatusUpdate(selected.id, nextStatus)}
                        disabled={updating}
                        className="w-full py-2.5 rounded-xl bg-[#06091F] hover:bg-[#1C2E5E] text-[#F5D800] text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60 shadow-xs"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Passer en statut : {STATUS_CONFIG[nextStatus].label}
                      </button>
                    )}

                    <button
                      id={`admin-cash-${selected.id}`}
                      onClick={() => handleCashToggle(selected.id, selected.cashCollected || false)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border-2 transition-colors ${
                        selected.cashCollected
                          ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                          : "border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <CheckSquare className="w-4 h-4" />
                      {selected.cashCollected ? "Montant Encaissé (Payé ✓)" : "Marquer comme Encaissé (Espèces)"}
                    </button>

                    {selected.status !== "CANCELLED" && selected.status !== "DELIVERED" && (
                      <button
                        id={`admin-cancel-${selected.id}`}
                        onClick={() => handleStatusUpdate(selected.id, "CANCELLED")}
                        disabled={updating}
                        className="w-full py-2.5 rounded-xl text-xs font-bold border-2 border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <XCircle className="w-4 h-4" /> Annuler la Commande
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`tel:${selected.phone || selected.shippingAddress?.phone}`}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1C2E5E] text-white text-xs font-bold hover:bg-[#06091F] transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" /> Appeler
                      </a>
                      <button
                        onClick={() => window.print()}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gray-100 text-gray-800 text-xs font-bold hover:bg-gray-200 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" /> Imprimer Bon
                      </button>
                    </div>
                  </div>

                  {/* Status History */}
                  {selected.statusHistory && selected.statusHistory.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Historique des Statuts</p>
                      <div className="space-y-2 max-h-36 overflow-y-auto print:max-h-none print:overflow-visible">
                        {[...selected.statusHistory].reverse().map((h, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#F5D800] mt-1.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-gray-700">{STATUS_CONFIG[h.status as OrderStatus]?.label || h.status}</p>
                              {h.note && <p className="text-xs text-gray-400">{h.note}</p>}
                              <p className="text-[10px] text-gray-400">{new Date(h.createdAt).toLocaleString('fr-FR')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6 flex flex-col items-center justify-center text-center min-h-64">
                <Eye className="w-10 h-10 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 font-bold">Sélectionnez une commande</p>
                <p className="text-xs text-gray-400 mt-1">Cliquez sur une commande pour afficher ses détails</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
