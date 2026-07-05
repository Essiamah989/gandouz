"use client";

import { useState, useEffect } from "react";
import { TrendingUp, ShoppingBag, Package, DollarSign, ArrowUp, Clock, CheckCircle, Truck, Star, XCircle } from "lucide-react";

type Order = {
  id: string; orderNumber: string; customerName: string; total: number;
  status: string; createdAt: string; items: any[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PENDING_VALIDATION: "bg-yellow-100 text-yellow-700",
  VALIDATED: "bg-blue-100 text-blue-700",
  PREPARING: "bg-purple-100 text-purple-700",
  READY: "bg-green-100 text-green-700",
  DELIVERED: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string | number; sub?: string; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
          <p className={`text-3xl font-extrabold ${color}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color.replace("text-", "bg-").replace("-600", "-100").replace("-700", "-100")}`}>
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
    .reduce((sum, o) => sum + (o.total || 0), 0);

  const delivered = orders.filter(o => o.status === "DELIVERED").length;
  const pending   = orders.filter(o => ["PENDING", "PENDING_VALIDATION"].includes(o.status)).length;
  const cancelled = orders.filter(o => o.status === "CANCELLED").length;

  const avgOrder = orders.length > 0 ? totalRevenue / orders.filter(o => o.status !== "CANCELLED").length : 0;

  // Orders by status distribution
  const statusCounts = orders.reduce((acc: Record<string, number>, o) => {
    const s = o.status || "UNKNOWN";
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  // Recent orders
  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 8);

  // Top revenue days (last 7 days by day)
  const dailyRevenue: Record<string, number> = {};
  orders.filter(o => o.status !== "CANCELLED").forEach(o => {
    const day = new Date(o.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
    dailyRevenue[day] = (dailyRevenue[day] || 0) + o.total;
  });

  const maxRevenue = Math.max(...Object.values(dailyRevenue), 1);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#06091F] px-8 py-8">
        <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-1">Admin · Insights</p>
        <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          ANALYTICS
        </h1>
        <p className="text-white/50 text-sm mt-1">Sales overview and order performance</p>
      </div>

      <div className="px-8 py-6 space-y-6">
        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading analytics...</div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Revenue" value={`${totalRevenue.toFixed(3)} TND`} sub="All non-cancelled orders" icon={DollarSign} color="text-green-600" />
              <StatCard label="Total Orders" value={orders.length} sub={`${pending} pending`} icon={ShoppingBag} color="text-[#1C2E5E]" />
              <StatCard label="Avg. Order Value" value={isNaN(avgOrder) ? "—" : `${avgOrder.toFixed(3)} TND`} icon={TrendingUp} color="text-purple-600" />
              <StatCard label="Delivered" value={delivered} sub={`${cancelled} cancelled`} icon={Truck} color="text-gray-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-[#06091F] mb-1">Revenue by Day</h2>
                <p className="text-xs text-gray-400 mb-6">Based on confirmed orders</p>
                {Object.keys(dailyRevenue).length === 0 ? (
                  <div className="h-40 flex items-center justify-center text-gray-300 text-sm">No data yet</div>
                ) : (
                  <div className="flex items-end gap-2 h-40">
                    {Object.entries(dailyRevenue).slice(-10).map(([day, rev]) => (
                      <div key={day} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs text-gray-500 font-medium">{rev.toFixed(0)}</span>
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-[#1C2E5E] to-[#F5D800]/80 transition-all"
                          style={{ height: `${(rev / maxRevenue) * 100}%`, minHeight: "4px" }}
                        />
                        <span className="text-xs text-gray-400 whitespace-nowrap">{day}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-[#06091F] mb-1">Order Status</h2>
                <p className="text-xs text-gray-400 mb-5">Distribution of all orders</p>
                <div className="space-y-3">
                  {Object.entries(statusCounts).map(([status, count]) => {
                    const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0;
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[status] || "bg-gray-100 text-gray-600"}`}>
                            {status.replace(/_/g, " ")}
                          </span>
                          <span className="text-xs text-gray-500">{count} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#1C2E5E] rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(statusCounts).length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">No orders yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100">
                <h2 className="font-bold text-[#06091F]">Recent Orders</h2>
              </div>
              {recentOrders.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">No orders yet</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Customer</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                      <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentOrders.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-semibold text-[#06091F]">#{o.orderNumber}</td>
                        <td className="px-4 py-4 text-gray-600 hidden md:table-cell">{o.customerName}</td>
                        <td className="px-4 py-4 text-right font-bold text-[#06091F]">{Number(o.total || 0).toFixed(3)} TND</td>
                        <td className="px-4 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status] || "bg-gray-100 text-gray-600"}`}>
                            {(o.status || "UNKNOWN").replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-xs text-gray-400 hidden lg:table-cell">
                          {new Date(o.createdAt).toLocaleDateString()}
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
