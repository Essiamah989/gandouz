"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Ticket, Trash2, X, Check, AlertTriangle, Calendar, Loader2 } from "lucide-react";

type DiscountCode = {
  id: string; code: string; type: "PERCENTAGE" | "FIXED";
  value: number; minOrderValue?: number; maxUses?: number;
  usedCount: number; isActive: boolean; expiresAt?: string;
  createdAt?: string;
};

const EMPTY_CODE = {
  code: "", type: "PERCENTAGE" as const, value: 10,
  minOrderValue: "", maxUses: "", isActive: true, expiresAt: "",
};

export default function AdminPromotionsPage() {
  const [codes, setCodes]   = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(false);
  const [form, setForm]     = useState({ ...EMPTY_CODE });
  const [saving, setSaving] = useState(false);
  const [toast, setToast]   = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [delId, setDelId]   = useState<string | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCodes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promotions");
      if (res.ok) setCodes(await res.json());
    } catch {
      showToast("error", "Erreur lors du chargement des promotions.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      code: form.code.toUpperCase(),
      value: Number(form.value),
      minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : null,
      maxUses: form.maxUses ? Number(form.maxUses) : null,
      expiresAt: form.expiresAt || null,
    };
    try {
      const res = await fetch("/api/admin/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSaving(false);
      if (res.ok) {
        showToast("success", "Code promo créé avec succès !");
        setModal(false);
        setForm({ ...EMPTY_CODE });
        fetchCodes();
      } else {
        showToast("error", "Échec de création du code.");
      }
    } catch {
      setSaving(false);
      showToast("error", "Erreur serveur.");
    }
  };

  const toggleActive = async (code: DiscountCode) => {
    setCodes(prev => prev.map(c => c.id === code.id ? { ...c, isActive: !c.isActive } : c));
    showToast("success", `Code ${code.isActive ? "désactivé" : "activé"}.`);
  };

  const stats = {
    total: codes.length,
    active: codes.filter(c => c.isActive).length,
    used: codes.reduce((acc, c) => acc + (c.usedCount || 0), 0),
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}`}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#06091F] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 border-b border-white/10">
        <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-1">Admin · Marketing & Fidélité</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          CODES PROMO & PROMOTIONS
        </h1>
        <p className="text-white/60 text-xs mt-1">Gérez vos codes de réduction, remises en pourcentage ou montants fixes</p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total des Codes", value: stats.total, color: "text-[#1C2E5E]" },
            { label: "Codes Actifs", value: stats.active, color: "text-emerald-600" },
            { label: "Utilisations Totales", value: stats.used, color: "text-amber-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-200/80 shadow-xs px-5 sm:px-6 py-4 sm:py-5">
              <p className="text-xs text-gray-500 font-semibold mb-1">{s.label}</p>
              <p className={`text-3xl font-black ${s.color}`} style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex justify-end mb-4">
          <button
            id="admin-add-promo-btn"
            onClick={() => setModal(true)}
            className="flex items-center gap-2 bg-[#06091F] hover:bg-[#1C2E5E] text-[#F5D800] px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> Nouveau Code Promo
          </button>
        </div>

        {/* Codes Table */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="py-16 text-center text-gray-400 text-xs font-medium">Chargement des codes promo...</div>
          ) : codes.length === 0 ? (
            <div className="py-16 text-center">
              <Ticket className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-500">Aucun code promo créé pour le moment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead className="bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Réduction</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Panier Minimum</th>
                  <th className="text-center px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Utilisations</th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Expiration</th>
                  <th className="text-center px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-4 py-3.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {codes.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-[#F5D800]" />
                        <span className="font-bold text-[#06091F] font-mono tracking-wider">{c.code}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-[#06091F]">
                        {c.type === "PERCENTAGE" ? `${c.value}%` : `${c.value} TND`}
                      </span>
                      <span className="text-xs text-gray-400 ml-1.5 font-medium">{c.type === "PERCENTAGE" ? "de remise" : "déduction fixe"}</span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell text-gray-700 text-xs font-medium">
                      {c.minOrderValue ? `${c.minOrderValue} TND` : "Sans minimum"}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-sm font-bold text-gray-800">{c.usedCount || 0}</span>
                      {c.maxUses && <span className="text-gray-400 text-xs"> / {c.maxUses}</span>}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      {c.expiresAt ? (
                        <span className="flex items-center gap-1 text-xs text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(c.expiresAt).toLocaleDateString('fr-FR')}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">Illimitée</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => toggleActive(c)}
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
                          c.isActive ? "bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200" : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
                        }`}
                      >
                        {c.isActive ? "Actif" : "Inactif"}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <button
                        onClick={() => setDelId(c.id)}
                        className="p-2 rounded-xl hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
                        title="Supprimer le code"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
        </div>
      </div>

      {/* New Code Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-7 pt-5 sm:pt-6 pb-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-black text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                Créer un Code Promo
              </h2>
              <button onClick={() => setModal(false)} className="p-2 rounded-xl hover:bg-gray-200 text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-5 sm:px-7 py-5 sm:py-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="col-span-1 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Code Promo *</label>
                  <input
                    required
                    value={form.code}
                    onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                    placeholder="BIENVENUE10"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-[#06091F]/20 font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Type de remise</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#06091F]/20"
                  >
                    <option value="PERCENTAGE">Pourcentage (%)</option>
                    <option value="FIXED">Montant Fixe (TND)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
                    Valeur {form.type === "PERCENTAGE" ? "(%)" : "(TND)"} *
                  </label>
                  <input
                    required type="number" min="0" step="0.01"
                    value={form.value}
                    onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#06091F]/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Panier Min. (TND)</label>
                  <input
                    type="number" min="0" step="0.01"
                    value={form.minOrderValue}
                    onChange={e => setForm(f => ({ ...f, minOrderValue: e.target.value }))}
                    placeholder="Facultatif"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Max Utilisations</label>
                  <input
                    type="number" min="0"
                    value={form.maxUses}
                    onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))}
                    placeholder="Illimité"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Date d'Expiration</label>
                  <input
                    type="datetime-local"
                    value={form.expiresAt}
                    onChange={e => setForm(f => ({ ...f, expiresAt: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20"
                  />
                </div>
                <div className="col-span-2">
                  <label className="flex items-center gap-2.5 cursor-pointer bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                      className="w-4 h-4 accent-[#06091F] rounded"
                    />
                    <span className="text-sm font-bold text-gray-800">Activer immédiatement</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button type="button" onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-[#06091F] text-[#F5D800] text-xs font-bold hover:bg-[#1C2E5E] transition-colors disabled:opacity-60 shadow-sm flex items-center justify-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {saving ? "Création..." : "Créer le Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {delId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4 border border-rose-100">
              <Trash2 className="w-7 h-7 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-[#06091F] mb-1.5">Supprimer ce code promo ?</h3>
            <p className="text-gray-500 text-xs mb-6">Cette action est irréversible.</p>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50">Annuler</button>
              <button
                onClick={() => {
                  setCodes(prev => prev.filter(c => c.id !== delId));
                  setDelId(null);
                  showToast("success", "Code supprimé.");
                }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
