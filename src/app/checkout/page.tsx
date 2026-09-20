"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { ShoppingBag, User, Phone, Mail, MapPin, Building2, FileText, ArrowRight, Loader2, ShieldCheck, Tag } from "lucide-react";
import { formatPrice } from "@/lib/utils";

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
  const [shippingFee, setShippingFee] = useState(7);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(200);

  const [user, setUser] = useState<any>(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [useLoyalty, setUseLoyalty] = useState(false);
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  useEffect(() => {
    // Fetch settings
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(data => {
        if (data.shipping_fee !== undefined) setShippingFee(Number(data.shipping_fee));
        if (data.free_shipping !== undefined) setFreeShippingThreshold(Number(data.free_shipping));
      })
      .catch(console.error);

    // Fetch user details & available loyalty points
    fetch("/api/me")
      .then(r => r.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          setForm(prev => ({
            ...prev,
            customerName: `${data.user.firstName || ""} ${data.user.lastName || ""}`.trim() || prev.customerName,
            email: data.user.email || prev.email,
            phone: data.user.phone || prev.phone
          }));
        }
      })
      .catch(console.error);
  }, []);

  const handleValidatePromo = async () => {
    if (!promoCode.trim()) return;
    setIsValidatingPromo(true);
    setPromoError("");
    setPromoSuccess("");
    try {
      const res = await fetch("/api/promotions/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode, subtotal }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedPromo(data);
        setPromoSuccess(`Code promo "${data.code}" appliqué avec succès !`);
      } else {
        setPromoError(data.error || "Code promo invalide ou expiré.");
        setAppliedPromo(null);
      }
    } catch {
      setPromoError("Impossible de vérifier le code promo.");
    } finally {
      setIsValidatingPromo(false);
    }
  };

  let promoDiscount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === "PERCENTAGE") {
      promoDiscount = (subtotal * appliedPromo.value) / 100;
    } else {
      promoDiscount = appliedPromo.value;
    }
  }

  const maxRedeemablePoints = user?.loyaltyAcc ? Math.min(Math.floor(subtotal - promoDiscount), user.loyaltyAcc.balance) : 0;
  const pointsRedeemed = useLoyalty ? maxRedeemablePoints : 0;

  const discount = promoDiscount + pointsRedeemed;
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const total = Math.max(0, subtotal - discount) + shipping;

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
    if (!form.customerName.trim()) newErrors.customerName = "Le nom complet est obligatoire.";
    if (!form.phone.trim()) newErrors.phone = "Le numéro de téléphone est obligatoire.";
    if (!form.email.trim()) newErrors.email = "L'adresse e-mail est obligatoire.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Veuillez entrer une adresse e-mail valide.";
    if (!form.address.trim()) newErrors.address = "L'adresse de livraison est obligatoire.";
    if (!form.city.trim()) newErrors.city = "La ville ou région est obligatoire.";
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
          discount,
          shipping,
          total,
          pointsRedeemed,
          promoCode: appliedPromo?.code || null
        }),
      });

      if (!res.ok) throw new Error("Échec de la commande");

      const data = await res.json();
      clearCart();
      router.push(`/order-confirmation?orderNumber=${data.orderNumber}`);
    } catch {
      alert("Une erreur s'est produite lors de la validation. Veuillez réessayer.");
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
        : "border-gray-200 focus:ring-[#06091F]/20 focus:border-[#06091F] bg-white"
    }`;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="gandouz-gradient py-12 text-center text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#F5D800] text-xs font-bold uppercase tracking-[0.3em] mb-2">Étape Finale</p>
          <h1 className="text-5xl font-extrabold uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            FINALISER VOTRE COMMANDE
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact & Delivery Form */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Contact Info */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-xs">
                <h2 className="text-2xl font-black text-[#06091F] mb-6 flex items-center gap-2.5 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  <User className="w-5 h-5 text-[#F5D800]" />
                  INFORMATIONS DE CONTACT
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkout-name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Nom & Prénom <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="checkout-name"
                        name="customerName"
                        type="text"
                        value={form.customerName}
                        onChange={handleChange}
                        placeholder="Votre nom complet"
                        className={`${inputClass("customerName")} pl-10`}
                      />
                    </div>
                    {errors.customerName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.customerName}</p>}
                  </div>

                  <div>
                    <label htmlFor="checkout-phone" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Numéro de Téléphone <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="checkout-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+216 54 333 612"
                        className={`${inputClass("phone")} pl-10`}
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.phone}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="checkout-email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Adresse E-mail <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="checkout-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="exemple@domaine.com"
                        className={`${inputClass("email")} pl-10`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.email}</p>}
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-8 shadow-xs">
                <h2 className="text-2xl font-black text-[#06091F] mb-6 flex items-center gap-2.5 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  <MapPin className="w-5 h-5 text-[#F5D800]" />
                  ADRESSE DE LIVRAISON
                </h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label htmlFor="checkout-address" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Adresse Complète (Rue, Bâtiment, Étage) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="checkout-address"
                        name="address"
                        type="text"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Ex: Avenue Habib Bourguiba, Résidence Les Palmiers"
                        className={`${inputClass("address")} pl-10`}
                      />
                    </div>
                    {errors.address && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.address}</p>}
                  </div>

                  <div>
                    <label htmlFor="checkout-city" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Ville / Gouvernorat <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        id="checkout-city"
                        name="city"
                        type="text"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="Ex: Tunis, La Goulette, Le Kram, La Marsa, Sousse..."
                        className={`${inputClass("city")} pl-10`}
                      />
                    </div>
                    {errors.city && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="checkout-notes" className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                      Instructions Particulières <span className="text-gray-400 font-normal">(Facultatif)</span>
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <textarea
                        id="checkout-notes"
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Indications pour le livreur, créneau horaire souhaité..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20 focus:border-[#06091F] bg-white resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-24">
                <h2 className="text-2xl font-black text-[#06091F] mb-5 flex items-center gap-2 uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  <ShoppingBag className="w-5 h-5 text-[#F5D800]" />
                  VOTRE COMMANDE
                </h2>

                {/* Items list */}
                <div className="flex flex-col gap-3 mb-5 max-h-64 overflow-y-auto pr-1 divide-y divide-gray-100">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm gap-2 pt-2.5 first:pt-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#06091F] truncate text-xs">{item.name}</p>
                        <p className="text-gray-400 text-[11px] mt-0.5">Quantité : {item.quantity}</p>
                      </div>
                      <span className="font-bold text-[#06091F] shrink-0 text-xs">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="border-t border-gray-100 pt-4 mb-4 space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Code Promotionnel
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Entrez votre code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs uppercase font-bold focus:outline-none focus:ring-2 focus:ring-[#06091F]/20 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleValidatePromo}
                      disabled={isValidatingPromo}
                      className="px-4 py-2.5 bg-[#06091F] text-[#F5D800] rounded-xl text-xs font-bold hover:bg-[#1C2E5E] transition-all disabled:opacity-50"
                    >
                      {isValidatingPromo ? "..." : "Appliquer"}
                    </button>
                  </div>
                  {promoError && <p className="text-rose-600 text-[11px] mt-1 font-semibold">{promoError}</p>}
                  {promoSuccess && <p className="text-emerald-600 text-[11px] mt-1 font-semibold">{promoSuccess}</p>}
                </div>

                <div className="border-t border-gray-100 pt-4 flex flex-col gap-2.5 mb-6 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Sous-total</span>
                    <span className="font-bold text-[#06091F]">{formatPrice(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Remise Promo</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Frais de livraison</span>
                    {shipping === 0 ? (
                      <span className="font-bold text-emerald-600">Gratuite</span>
                    ) : (
                      <span className="font-bold text-[#06091F]">{formatPrice(shipping)}</span>
                    )}
                  </div>
                  <div className="flex justify-between font-black text-[#06091F] text-xl pt-3 border-t border-gray-100 items-baseline">
                    <span>Total à Payer</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <button
                  id="checkout-submit-btn"
                  type="submit"
                  disabled={isLoading || items.length === 0}
                  className="btn-gold w-full flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Traitement de la commande...
                    </>
                  ) : (
                    <>
                      Confirmer la Commande <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="mt-4 p-3.5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-2 justify-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-[11px] text-gray-600 text-center leading-tight">
                    Paiement à la livraison en espèces ou par chèque.
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
