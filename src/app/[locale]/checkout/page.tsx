"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingBag, User, Phone, Mail, MapPin, Building2, FileText, ArrowRight, Loader2 } from "lucide-react";

type FormData = {
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const subtotal = totalPrice();
  const shipping = 0;
  const total = subtotal + shipping;

  const [form, setForm] = useState<FormData>({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    notes: "",
  });

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.customerName.trim()) newErrors.customerName = "Full name is required.";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required.";
    if (!form.email.trim()) newErrors.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Please enter a valid email.";
    if (!form.address.trim()) newErrors.address = "Delivery address is required.";
    if (!form.city.trim()) newErrors.city = "City is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items,
          subtotal,
          shipping,
          total,
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      const data = await res.json();
      clearCart();
      router.push(`/order-confirmation?orderNumber=${data.orderNumber}`);
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const inputClass = (field: keyof FormData) =>
    `w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
      errors[field]
        ? "border-red-400 focus:ring-red-300 bg-red-50"
        : "border-gray-200 focus:ring-[#F5D800] focus:border-[#F5D800] bg-white"
    }`;

  return (
    <div className="min-h-screen bg-[#F2F2F2]">
      {/* Header */}
      <div className="gandouz-gradient py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-[0.3em] mb-2">Final Step</p>
          <h1 className="text-5xl font-extrabold text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            CHECKOUT
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact & Delivery Form */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Contact Info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#06091F] mb-5 flex items-center gap-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  <User className="w-5 h-5 text-[#F5D800]" />
                  CONTACT INFORMATION
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkout-name" className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="checkout-name"
                        name="customerName"
                        type="text"
                        value={form.customerName}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className={`${inputClass("customerName")} pl-10`}
                      />
                    </div>
                    {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                  </div>

                  <div>
                    <label htmlFor="checkout-phone" className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="checkout-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+216 XXX XXX XXX"
                        className={`${inputClass("phone")} pl-10`}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-email" className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="checkout-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className={`${inputClass("email")} pl-10`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-[#06091F] mb-5 flex items-center gap-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  <MapPin className="w-5 h-5 text-[#F5D800]" />
                  DELIVERY INFORMATION
                </h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="checkout-address" className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="checkout-address"
                        name="address"
                        type="text"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Street, building number..."
                        className={`${inputClass("address")} pl-10`}
                      />
                    </div>
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label htmlFor="checkout-city" className="block text-xs font-semibold text-gray-600 mb-1.5">
                      City <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="checkout-city"
                        name="city"
                        type="text"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="City name"
                        className={`${inputClass("city")} pl-10`}
                      />
                    </div>
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="checkout-notes" className="block text-xs font-semibold text-gray-600 mb-1.5">
                      Order Notes <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        id="checkout-notes"
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Any special instructions, delivery notes..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5D800] focus:border-[#F5D800] bg-white resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-24">
                <h2 className="text-xl font-bold text-[#06091F] mb-5 flex items-center gap-2" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  <ShoppingBag className="w-5 h-5 text-[#F5D800]" />
                  YOUR ORDER
                </h2>

                {/* Items list */}
                <div className="flex flex-col gap-3 mb-5 max-h-64 overflow-y-auto pr-1">
                   {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#06091F] truncate">{item.name}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-[#06091F] shrink-0">
                        {(item.price * item.quantity).toLocaleString('fr-FR')} TND
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-100 pt-4 flex flex-col gap-2 mb-5">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>{subtotal.toLocaleString('fr-FR')} TND</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? "text-green-600" : ""}>
                      {shipping === 0 ? "Free" : `${shipping.toLocaleString('fr-FR')} TND`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-[#06091F] text-base pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>{total.toLocaleString('fr-FR')} TND</span>
                  </div>
                </div>

                <button
                  id="checkout-submit-btn"
                  type="submit"
                  disabled={isLoading || items.length === 0}
                  className="btn-gold w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Confirm Order <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-4 p-3 bg-[#F2F2F2] rounded-xl">
                  <p className="text-xs text-gray-500 text-center leading-relaxed">
                    🔒 No payment required. Our team will contact you to confirm your order.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
