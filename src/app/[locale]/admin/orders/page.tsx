"use client";

import { useState, useEffect } from "react";
import {
  Package, Search, Eye, Clock, CheckCircle, Truck, Star, XCircle,
  ChevronDown, Phone, Mail, Printer, DollarSign, CheckSquare,
} from "lucide-react";

type OrderStatus =
  | "PENDING" | "PENDING_VALIDATION" | "VALIDATED"
  | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";

type OrderItem = {
  productId?: string; productName?: string; name?: string;
  variantSize?: string; unitPrice?: number; price?: number;
  qty?: number; quantity?: number; total?: number;
};

type Order = {
  id: string; orderNumber: string; customerName: string;
  email: string; phone: string; city: string; address?: string;
  subtotal?: number; discount?: number; shipping?: number;
  total: number; status: OrderStatus; cashCollected?: boolean;
  notes?: string; createdAt: string; updatedAt?: string;
  items: OrderItem[];
  statusHistory?: Array<{ status: string; note?: string; createdAt: string; createdBy?: string }>;
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: React.ElementType }> = {
  PENDING:            { label: "Pending",            color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  PENDING_VALIDATION: { label: "Pending Validation", color: "bg-yellow-100 text-yellow-700 border-yellow-200", icon: Clock },
  VALIDATED:          { label: "Validated",          color: "bg-blue-100 text-blue-700 border-blue-200",       icon: CheckCircle },
  PREPARING:          { label: "Preparing",          color: "bg-purple-100 text-purple-700 border-purple-200", icon: Package },
  READY:              { label: "Ready",              color: "bg-green-100 text-green-700 border-green-200",    icon: Star },
  DELIVERED:          { label: "Delivered",          color: "bg-gray-100 text-gray-700 border-gray-200",      icon: Truck },
  CANCELLED:          { label: "Cancelled",          color: "bg-red-100 text-red-700 border-red-200",         icon: XCircle },
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

function getItemName(item: OrderItem) { return item.productName || item.name || "Product"; }
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
    const matchSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.phone?.includes(search);
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#06091F] px-8 py-8">
        <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-1">Admin · Operations</p>
        <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          ORDER MANAGEMENT
        </h1>
        <p className="text-white/50 text-sm mt-1">{orders.length} total orders</p>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Pending", value: stats.pending, color: "text-yellow-600", bg: "bg-yellow-50" },
            { label: "Validated", value: stats.validated, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "In Progress", value: stats.progress, color: "text-purple-600", bg: "bg-purple-50" },
            { label: "Delivered", value: stats.delivered, color: "text-green-600", bg: "bg-green-50" },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl px-5 py-4 border border-white`}>
              <p className="text-xs text-gray-500 mb-1">{s.label}</p>
              <p className={`text-3xl font-extrabold ${s.color}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {s.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="xl:col-span-2">
            {/* Filters */}
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="admin-orders-search"
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Order #, name, phone..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F5D800]/40 shadow-sm"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as OrderStatus | "ALL")}
                  className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F5D800]/40 shadow-sm font-medium cursor-pointer"
                >
                  <option value="ALL">All Statuses</option>
                  {ALL_STATUSES.map(s => (
                    <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-4 border-[#F5D800] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <Package className="w-10 h-10 mx-auto mb-3 text-gray-200" />
                  <p className="text-sm">No orders found.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
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
                              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.color}`}>
                                <Icon className="w-3 h-3" />
                                {cfg.label}
                              </span>
                              {order.cashCollected && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                  <DollarSign className="w-3 h-3" /> Paid
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 font-medium">{order.customerName}</p>
                            <p className="text-xs text-gray-400">{order.phone} · {order.city}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-[#06091F] text-sm">{order.total.toFixed(3)} TND</p>
                            <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
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
          <div className="xl:col-span-1">
            {selected ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm sticky top-6 overflow-hidden">
                {/* Panel Header */}
                <div className="bg-[#06091F] px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest">Order Details</p>
                    <p className="text-white font-bold">#{selected.orderNumber}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-white/50 hover:text-white text-xs transition-colors">
                    ✕ Close
                  </button>
                </div>

                <div className="p-5 space-y-5">
                  {/* Status Badge */}
                  <div className="text-center">
                    {(() => {
                      const cfg = STATUS_CONFIG[selected.status] || STATUS_CONFIG.PENDING;
                      const Icon = cfg.icon;
                      return (
                        <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-4 py-1.5 rounded-full border ${cfg.color}`}>
                          <Icon className="w-4 h-4" />
                          {cfg.label}
                        </span>
                      );
                    })()}
                  </div>

                  {/* Customer Info */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Customer</p>
                    <p className="font-bold text-[#06091F] text-sm">{selected.customerName}</p>
                    <a href={`tel:${selected.phone}`} className="flex items-center gap-1.5 text-xs text-[#1C2E5E] hover:text-[#F5D800] mt-1 transition-colors">
                      <Phone className="w-3 h-3" /> {selected.phone}
                    </a>
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-1.5 text-xs text-[#1C2E5E] hover:text-[#F5D800] mt-0.5 transition-colors">
                      <Mail className="w-3 h-3" /> {selected.email}
                    </a>
                    <p className="text-xs text-gray-500 mt-1">{selected.address}, {selected.city}</p>
                    {selected.notes && (
                      <p className="text-xs italic text-gray-400 mt-1 bg-gray-50 px-2 py-1.5 rounded-lg">"{selected.notes}"</p>
                    )}
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Items</p>
                    <div className="space-y-1.5">
                      {selected.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs bg-gray-50 rounded-lg px-3 py-2">
                          <span className="text-gray-700 font-medium truncate mr-2">
                            {getItemName(item)}
                            {item.variantSize && <span className="text-gray-400"> ({item.variantSize})</span>}
                            <span className="text-gray-500"> ×{getItemQty(item)}</span>
                          </span>
                          <span className="font-bold text-[#06091F] shrink-0">
                            {(getItemPrice(item) * getItemQty(item)).toFixed(3)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 mt-2 pt-2 space-y-1">
                      {selected.subtotal != null && (
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Subtotal</span><span>{selected.subtotal.toFixed(3)} TND</span>
                        </div>
                      )}
                      {selected.discount != null && selected.discount > 0 && (
                        <div className="flex justify-between text-xs text-green-600">
                          <span>Discount</span><span>-{selected.discount.toFixed(3)} TND</span>
                        </div>
                      )}
                      {selected.shipping != null && (
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Shipping</span><span>{selected.shipping.toFixed(3)} TND</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold text-[#06091F] text-sm pt-1">
                        <span>Total</span><span>{selected.total.toFixed(3)} TND</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</p>

                    {nextStatus && (
                      <button
                        id={`admin-advance-${selected.id}`}
                        onClick={() => handleStatusUpdate(selected.id, nextStatus)}
                        disabled={updating}
                        className="w-full py-2.5 rounded-xl bg-[#F5D800] text-[#06091F] text-xs font-bold flex items-center justify-center gap-2 hover:bg-yellow-400 transition-colors disabled:opacity-60"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Mark as {STATUS_CONFIG[nextStatus].label}
                      </button>
                    )}

                    <button
                      id={`admin-cash-${selected.id}`}
                      onClick={() => handleCashToggle(selected.id, selected.cashCollected || false)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border-2 transition-colors ${
                        selected.cashCollected
                          ? "border-green-300 bg-green-50 text-green-700 hover:bg-green-100"
                          : "border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      {selected.cashCollected ? "Cash Collected ✓" : "Mark Cash Collected"}
                    </button>

                    {selected.status !== "CANCELLED" && selected.status !== "DELIVERED" && (
                      <button
                        id={`admin-cancel-${selected.id}`}
                        onClick={() => handleStatusUpdate(selected.id, "CANCELLED")}
                        disabled={updating}
                        className="w-full py-2.5 rounded-xl text-xs font-bold border-2 border-red-200 text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Cancel Order
                      </button>
                    )}

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`tel:${selected.phone}`}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#1C2E5E] text-white text-xs font-bold hover:bg-[#06091F] transition-colors"
                      >
                        <Phone className="w-3 h-3" /> Call
                      </a>
                      <button
                        onClick={() => window.print()}
                        className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition-colors"
                      >
                        <Printer className="w-3 h-3" /> Print
                      </button>
                    </div>
                  </div>

                  {/* Status History */}
                  {selected.statusHistory && selected.statusHistory.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">History</p>
                      <div className="space-y-2 max-h-36 overflow-y-auto">
                        {[...selected.statusHistory].reverse().map((h, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#F5D800] mt-1.5 shrink-0" />
                            <div>
                              <p className="text-xs font-semibold text-gray-700">{h.status}</p>
                              {h.note && <p className="text-xs text-gray-400">{h.note}</p>}
                              <p className="text-xs text-gray-300">{new Date(h.createdAt).toLocaleString()}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center text-center min-h-64">
                <Eye className="w-10 h-10 text-gray-200 mb-3" />
                <p className="text-sm text-gray-400 font-medium">Select an order</p>
                <p className="text-xs text-gray-300 mt-1">Click any order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
