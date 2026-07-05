"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Check, AlertTriangle, Settings2, Truck, Star, MessageCircle, Store } from "lucide-react";

type SettingField = {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  type?: "text" | "number";
  suffix?: string;
};

const FIELDS: SettingField[] = [
  { key: "store_name", label: "Store Name", description: "Displayed in emails and receipts", icon: Store, type: "text" },
  { key: "shipping_fee", label: "Shipping Fee (TND)", description: "Standard delivery fee charged at checkout", icon: Truck, type: "number", suffix: "TND" },
  { key: "free_shipping", label: "Free Shipping Threshold (TND)", description: "Orders above this amount get free delivery", icon: Truck, type: "number", suffix: "TND" },
  { key: "loyalty_rate", label: "Loyalty Points Rate", description: "Points earned per TND spent", icon: Star, type: "number", suffix: "pts / TND" },
  { key: "whatsapp", label: "WhatsApp Number", description: "Contact number shown on the site", icon: MessageCircle, type: "text" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/settings");
    if (res.ok) {
      const data = await res.json();
      setSettings(data);
      setForm(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async (key: string) => {
    setSaving(key);
    setError(null);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: form[key] }),
    });
    setSaving(null);
    if (res.ok) {
      setSettings(prev => ({ ...prev, [key]: form[key] }));
      setSaved(key);
      setTimeout(() => setSaved(null), 2500);
    } else {
      setError(`Failed to save "${key}"`);
    }
  };

  const isDirty = (key: string) => form[key] !== settings[key];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#06091F] px-8 py-8">
        <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-1">Admin · Configuration</p>
        <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          STORE SETTINGS
        </h1>
        <p className="text-white/50 text-sm mt-1">Configure fees, loyalty, and contact details</p>
      </div>

      <div className="px-8 py-8 max-w-2xl">
        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading settings...</div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-3 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {FIELDS.map(field => (
              <div key={field.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-9 h-9 rounded-xl bg-[#06091F]/5 flex items-center justify-center shrink-0 mt-0.5">
                      <field.icon className="w-4 h-4 text-[#06091F]" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold text-[#06091F] mb-0.5">
                        {field.label}
                      </label>
                      <p className="text-xs text-gray-400 mb-3">{field.description}</p>
                      <div className="relative flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            id={`setting-${field.key}`}
                            type={field.type || "text"}
                            step={field.type === "number" ? "0.001" : undefined}
                            value={form[field.key] ?? ""}
                            onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20 pr-16"
                          />
                          {field.suffix && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                              {field.suffix}
                            </span>
                          )}
                        </div>
                        <button
                          id={`save-setting-${field.key}`}
                          onClick={() => handleSave(field.key)}
                          disabled={!isDirty(field.key) || saving === field.key}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 ${
                            saved === field.key
                              ? "bg-green-600 text-white"
                              : isDirty(field.key)
                              ? "bg-[#06091F] text-white hover:bg-[#1C2E5E]"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {saved === field.key ? (
                            <><Check className="w-3.5 h-3.5" /> Saved</>
                          ) : saving === field.key ? (
                            <>Saving...</>
                          ) : (
                            <><Save className="w-3.5 h-3.5" /> Save</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loyalty Info Card */}
            <div className="bg-gradient-to-br from-[#06091F] to-[#1C2E5E] rounded-2xl p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-[#F5D800]" />
                <h3 className="font-bold text-lg" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  CADOPOINTS LOYALTY PROGRAM
                </h3>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                Customers earn <strong className="text-[#F5D800]">{settings.loyalty_rate || 1} Cadopoint(s)</strong> per TND spent on eligible orders.
                Cadopoints can be redeemed for discounts on future purchases. Adjust the rate above to control earning speed.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Current Rate", value: `${settings.loyalty_rate || 1} pts/TND` },
                  { label: "Free Ship Min", value: `${settings.free_shipping || "200"} TND` },
                  { label: "Delivery Fee", value: `${settings.shipping_fee || "7"} TND` },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-xl px-3 py-2 text-center">
                    <p className="text-white/50 text-xs mb-0.5">{s.label}</p>
                    <p className="text-white font-bold text-sm">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
