"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, Check, AlertTriangle, Settings2, Truck, Star, MessageCircle, Store, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

type SettingField = {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  type?: "text" | "number";
  suffix?: string;
};

const FIELDS: SettingField[] = [
  { key: "store_name", label: "Nom de la boutique", description: "Affiché dans les e-mails et les reçus", icon: Store, type: "text" },
  { key: "shipping_fee", label: "Frais de livraison standard (TND)", description: "Frais appliqués pour les commandes inférieures au seuil", icon: Truck, type: "number", suffix: "TND" },
  { key: "free_shipping", label: "Seuil de livraison gratuite (TND)", description: "Montant minimum du panier pour bénéficier de la livraison offerte", icon: Truck, type: "number", suffix: "TND" },
  { key: "loyalty_rate", label: "Taux de points de fidélité", description: "Nombre de points gagnés par TND dépensé", icon: Star, type: "number", suffix: "pts / TND" },
  { key: "whatsapp", label: "Numéro de contact / WhatsApp", description: "Numéro de téléphone d'assistance affiché sur le site", icon: MessageCircle, type: "text" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Password state
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        setForm(data);
      }
    } catch {
      setError("Impossible de charger les paramètres.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const handleSave = async (key: string) => {
    setSaving(key);
    setError(null);
    try {
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
        setError(`Échec de la sauvegarde de "${key}"`);
      }
    } catch {
      setSaving(null);
      setError("Erreur réseau pendant la sauvegarde.");
    }
  };

  const handlePasswordChange = async () => {
    setPwError(null);
    if (!pwForm.next) { setPwError("Le nouveau mot de passe est obligatoire."); return; }
    if (pwForm.next.length < 6) { setPwError("Le nouveau mot de passe doit contenir au moins 6 caractères."); return; }
    if (pwForm.next !== pwForm.confirm) { setPwError("Les mots de passe ne correspondent pas."); return; }

    setPwSaving(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: pwForm.current, newPassword: pwForm.next }),
      });
      setPwSaving(false);

      if (res.ok) {
        setPwSuccess(true);
        setPwForm({ current: "", next: "", confirm: "" });
        setTimeout(() => setPwSuccess(false), 4000);
      } else {
        const data = await res.json().catch(() => ({}));
        setPwError(data.error || "Une erreur s'est produite.");
      }
    } catch {
      setPwSaving(false);
      setPwError("Erreur réseau.");
    }
  };

  const isDirty = (key: string) => form[key] !== settings[key];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-[#06091F] px-8 py-8 border-b border-white/10">
        <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-1">Admin · Paramètres Généraux</p>
        <h1 className="text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          PARAMÈTRES DE LA BOUTIQUE
        </h1>
        <p className="text-white/60 text-xs mt-1">Configurez les frais de port, le programme de fidélité et la sécurité</p>
      </div>

      <div className="px-8 py-8 max-w-2xl space-y-5">
        {loading ? (
          <div className="py-20 text-center text-gray-400 text-xs font-medium">Chargement des paramètres...</div>
        ) : (
          <>
            {error && (
              <div className="flex items-center gap-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl px-4 py-3 text-sm font-semibold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {FIELDS.map(field => (
              <div key={field.key} className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#06091F]/5 flex items-center justify-center shrink-0 mt-0.5">
                      <field.icon className="w-5 h-5 text-[#06091F]" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-bold text-[#06091F] mb-0.5">
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
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/15 font-semibold pr-16"
                          />
                          {field.suffix && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-bold">
                              {field.suffix}
                            </span>
                          )}
                        </div>
                        <button
                          id={`save-setting-${field.key}`}
                          onClick={() => handleSave(field.key)}
                          disabled={!isDirty(field.key) || saving === field.key}
                          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 shadow-xs ${
                            saved === field.key
                              ? "bg-emerald-600 text-white"
                              : isDirty(field.key)
                              ? "bg-[#06091F] text-[#F5D800] hover:bg-[#1C2E5E]"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          {saved === field.key ? (
                            <><Check className="w-3.5 h-3.5" /> Enregistré</>
                          ) : saving === field.key ? (
                            <>Enregistrement...</>
                          ) : (
                            <><Save className="w-3.5 h-3.5" /> Enregistrer</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loyalty Info Card */}
            <div className="bg-gradient-to-br from-[#06091F] to-[#1C2E5E] rounded-3xl p-6 text-white shadow-md">
              <div className="flex items-center gap-2.5 mb-3">
                <Star className="w-5 h-5 text-[#F5D800]" />
                <h3 className="font-bold text-lg uppercase tracking-wide" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  PROGRAMME DE FIDÉLITÉ CADOPOINTS
                </h3>
              </div>
              <p className="text-white/70 text-xs leading-relaxed">
                Vos clients accumulent <strong className="text-[#F5D800]">{settings.loyalty_rate || 1} Cadopoint(s)</strong> par TND dépensé sur leurs commandes validées.
                Ces points sont automatiquement crédités sur leur solde fidélité.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Taux actuel", value: `${settings.loyalty_rate || 1} pts/TND` },
                  { label: "Livraison gratuite", value: `${settings.free_shipping || "200"} TND` },
                  { label: "Frais livraison", value: `${settings.shipping_fee || "7"} TND` },
                ].map(s => (
                  <div key={s.label} className="bg-white/10 rounded-2xl px-3 py-2.5 text-center border border-white/10">
                    <p className="text-white/60 text-[10px] uppercase font-bold mb-0.5">{s.label}</p>
                    <p className="text-white font-black text-sm">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Password Change Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#06091F]/5 flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5 text-[#06091F]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#06091F]">Sécurité & Mot de Passe Admin</h3>
                  <p className="text-xs text-gray-400">Modifiez le mot de passe d'accès au panneau d'administration</p>
                </div>
              </div>

              {pwSuccess && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl px-4 py-3 text-xs font-bold mb-4">
                  <ShieldCheck className="w-4 h-4 shrink-0" /> Mot de passe mis à jour avec succès.
                </div>
              )}

              {pwError && (
                <div className="flex items-center gap-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl px-4 py-3 text-xs font-bold mb-4">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {pwError}
                </div>
              )}

              <div className="space-y-3.5">
                {/* Current password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Mot de passe actuel</label>
                  <div className="relative">
                    <input
                      id="admin-current-password"
                      type={showCurrent ? "text" : "password"}
                      value={pwForm.current}
                      onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                      placeholder="Mot de passe actuel"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/15 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* New password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      id="admin-new-password"
                      type={showNext ? "text" : "password"}
                      value={pwForm.next}
                      onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))}
                      placeholder="Minimum 6 caractères"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/15 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNext(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNext ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Confirmer le nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      id="admin-confirm-password"
                      type={showConfirm ? "text" : "password"}
                      value={pwForm.confirm}
                      onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                      placeholder="Confirmez le mot de passe"
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/15 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="admin-save-password-btn"
                    onClick={handlePasswordChange}
                    disabled={pwSaving}
                    className="w-full py-2.5 rounded-xl bg-[#06091F] hover:bg-[#1C2E5E] text-[#F5D800] text-xs font-bold transition-all disabled:opacity-60 shadow-xs"
                  >
                    {pwSaving ? "Mise à jour..." : "Modifier le Mot de Passe"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
