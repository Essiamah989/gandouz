"use client";

import Link from "next/link";
import Image from "next/image";
import { User, Trophy, ShoppingBag, Heart, ExternalLink, Calendar } from "lucide-react";

export default function AccountClient({ user, orders, wishlist }: { user: any, orders: any[], wishlist: any[] }) {
  return (
    <div className="min-h-screen bg-[#F2F2F2] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* User Profile Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm text-center">
              <div className="w-20 h-20 bg-[#06091F] rounded-full flex items-center justify-center mx-auto mb-4 text-[#F5D800]">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold text-[#06091F]">
                {user ? `${user.firstName} ${user.lastName}` : "Guest User"}
              </h2>
              <p className="text-xs text-gray-400 mt-1">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-2 font-medium">{user?.phone}</p>
            </div>

            {/* Cavacoins Loyalty */}
            <div className="bg-[#06091F] text-white rounded-3xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#F5D800]/5 rounded-full filter blur-xl" />
              <div className="flex items-center gap-2 text-[#F5D800] text-xs font-bold uppercase tracking-widest mb-4">
                <Trophy className="w-4 h-4" />
                <span>Loyalty Balance</span>
              </div>
              <p className="text-5xl font-black tracking-tight text-[#F5D800]" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                35 <span className="text-lg text-white font-medium">Cavacoins</span>
              </p>
              <p className="text-xs text-white/60 mt-2 leading-relaxed">
                Equivalent to <strong>35.000 TND</strong> in cashback. Points will automatically activate upon your next checkout confirmation.
              </p>
              
              <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Points Statement</p>
                <div className="flex justify-between items-center text-xs text-white/80">
                  <span>Earned from order #GDZ-123456</span>
                  <span className="text-green-400 font-bold">+15</span>
                </div>
                <div className="flex justify-between items-center text-xs text-white/80">
                  <span>Manual Admin Reward</span>
                  <span className="text-green-400 font-bold">+20</span>
                </div>
              </div>
            </div>
          </div>

          {/* Orders & Wishlist Section */}
          <div className="lg:col-span-8 space-y-8">
            {/* Order History */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-4 mb-6">
                <ShoppingBag className="w-5 h-5 text-[#F5D800]" />
                <h3 className="text-xl font-bold text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  Order History
                </h3>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-400">No orders placed yet.</p>
                  <p className="text-xs text-gray-400 mt-1">Ready to explore? Head over to our catalog!</p>
                  <Link href="/products" className="mt-4 inline-flex btn-gold px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o: any) => (
                    <div
                      key={o.id}
                      className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-[#06091F]">{o.orderNumber}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            o.status === "DELIVERED"
                              ? "bg-green-100 text-green-700"
                              : o.status === "CANCELLED"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}>
                            {o.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {o.items?.length || 1} items · {Number(o.total).toLocaleString()} TND
                        </p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 pt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <Link
                        href={`/order-confirmation?orderNumber=${o.orderNumber}`}
                        className="inline-flex items-center gap-1.5 text-xs text-[#1C2E5E] hover:text-[#F5D800] font-bold transition-colors uppercase tracking-wider shrink-0"
                      >
                        Track Status <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-sm">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-4 mb-6">
                <Heart className="w-5 h-5 text-[#F5D800]" />
                <h3 className="text-xl font-bold text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  My Wishlist
                </h3>
              </div>

              {wishlist.length === 0 ? (
                <p className="text-sm font-semibold text-gray-400 text-center py-6">Your wishlist is currently empty.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wishlist.map((p: any) => (
                    <div key={p.id} className="flex gap-4 border border-gray-100 rounded-2xl p-3 bg-gray-50/20 items-center justify-between">
                      <div className="flex gap-3 items-center min-w-0">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <Image src={p.images && p.images[0] ? p.images[0] : "https://placehold.co/400x400/1C2E5E/F5D800?text=Product"} alt="" fill className="object-cover" unoptimized />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-[#06091F] truncate leading-tight">{p.name}</h4>
                          <span className="font-bold text-xs text-[#06091F] block mt-1">
                            {Number(p.salePrice || p.basePrice).toLocaleString()} TND
                          </span>
                        </div>
                      </div>

                      <Link href={`/product/${p.slug}`} className="text-xs font-bold bg-[#06091F] text-white px-3.5 py-2 rounded-xl hover:bg-[#1C2E5E] transition-all uppercase tracking-wider shrink-0">
                        View
                      </Link>
                    </div>
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
