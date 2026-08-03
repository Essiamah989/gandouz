"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const [shippingFee, setShippingFee] = useState(7);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(200);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(data => {
        if (data.shipping_fee !== undefined) setShippingFee(Number(data.shipping_fee));
        if (data.free_shipping !== undefined) setFreeShippingThreshold(Number(data.free_shipping));
      })
      .catch(console.error);
  }, []);

  const subtotal = totalPrice();
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Header */}
      <div className="gandouz-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-[0.3em] mb-2">Review</p>
          <h1 className="text-5xl font-extrabold text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            SHOPPING CART
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
            <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-[#06091F] mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6 text-sm">Browse our products and add items to get started.</p>
            <Link
              href="/products"
              id="cart-empty-shop-btn"
              className="inline-flex items-center gap-2 btn-gold px-8 py-3 rounded-lg text-sm"
            >
              Browse Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  id={`cart-item-${item.id}`}
                  className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 flex gap-4 shadow-sm"
                >
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#06091F] text-sm leading-tight mb-1">{item.name}</h3>
                    <p className="text-[#F5D800] font-bold text-base mb-3">{item.price.toLocaleString('fr-FR')} TND</p>

                    <div className="flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          id={`cart-decrease-${item.id}`}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors text-[#06091F]"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-bold text-[#06091F] min-w-[1.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          id={`cart-increase-${item.id}`}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white transition-colors text-[#06091F]"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        id={`cart-remove-${item.id}`}
                        onClick={() => removeItem(item.id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col justify-between items-end">
                    <p className="font-bold text-[#06091F] text-base">
                      {(item.price * item.quantity).toLocaleString('fr-FR')} TND
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-[#06091F] mb-5" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  ORDER SUMMARY
                </h2>
                <div className="flex flex-col gap-3 mb-5">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal ({totalItems()} items)</span>
                    <span className="font-semibold text-[#06091F]">{subtotal.toLocaleString('fr-FR')} TND</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="font-semibold text-green-600">Free</span>
                    ) : (
                      <span className="font-semibold text-[#06091F]">{shipping.toLocaleString('fr-FR')} TND</span>
                    )}
                  </div>
                  <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-bold text-[#06091F]">Total</span>
                    <span className="font-bold text-[#06091F] text-lg">{total.toLocaleString('fr-FR')} TND</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  id="cart-checkout-btn"
                  className="btn-gold w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/products"
                  id="cart-continue-shopping"
                  className="block text-center text-sm text-[#1C2E5E] hover:text-[#F5D800] transition-colors mt-4"
                >
                  Continue Shopping
                </Link>

                <div className="mt-5 p-3 bg-[#F2F2F2] rounded-xl">
                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    🔒 No online payment required. Your order will be manually reviewed and confirmed by our team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
