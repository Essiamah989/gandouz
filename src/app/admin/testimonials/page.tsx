"use client";

import { useState, useEffect } from "react";
import {
  Star, Plus, Trash2, Edit3, Eye, EyeOff, X, Check, AlertTriangle, Quote,
} from "lucide-react";

type Testimonial = {
  id: string;
  author: string;
  role: string | null;
  content: string;
  rating: number;
  avatarUrl: string | null;
  isVisible: boolean;
  createdAt: string;
};

const EMPTY_FORM = {
  author: "",
  role: "",
  content: "",
  rating: 5,
  avatarUrl: "",
  isVisible: true,
};

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.ok) setTestimonials(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
    setError(null);
  };

  const openEdit = (t: Testimonial) => {
    setEditing(t);
    setForm({
      author: t.author,
      role: t.role || "",
      content: t.content,
      rating: t.rating,
      avatarUrl: t.avatarUrl || "",
      isVisible: t.isVisible,
    });
    setShowForm(true);
    setError(null);
  };

  const handleSave = async () => {
    if (!form.author.trim() || !form.content.trim()) {
      setError("L'auteur et le contenu sont obligatoires.");
      return;
    }
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      rating: Number(form.rating),
      role: form.role || null,
      avatarUrl: form.avatarUrl || null,
      ...(editing ? { id: editing.id } : {}),
    };

    const res = await fetch("/api/admin/testimonials", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (res.ok) {
      setShowForm(false);
      setEditing(null);
      setSuccess(editing ? "Témoignage mis à jour avec succès." : "Témoignage ajouté avec succès.");
      setTimeout(() => setSuccess(null), 3000);
      fetchTestimonials();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Une erreur s'est produite.");
    }
  };

  const handleToggleVisibility = async (t: Testimonial) => {
    const res = await fetch("/api/admin/testimonials", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: t.id, isVisible: !t.isVisible }),
    });
    if (res.ok) {
      setTestimonials(prev => prev.map(x => x.id === t.id ? { ...x, isVisible: !x.isVisible } : x));
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setTestimonials(prev => prev.filter(t => t.id !== id));
      setConfirmDelete(null);
      setSuccess("Témoignage supprimé.");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const renderStars = (rating: number, interactive = false, onChange?: (n: number) => void) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          onClick={() => interactive && onChange && onChange(n)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`w-4 h-4 ${n <= rating ? "text-[#F5D800] fill-[#F5D800]" : "text-gray-200 fill-gray-200"}`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#06091F] px-8 py-8">
        <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-1">Admin · Contenu</p>
        <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          TÉMOIGNAGES
        </h1>
        <p className="text-white/50 text-sm mt-1">{testimonials.length} témoignage{testimonials.length !== 1 ? "s" : ""} au total</p>
      </div>

      <div className="px-8 py-6 space-y-4">
        {/* Notifications */}
        {success && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 rounded-xl px-4 py-3 text-sm">
            <Check className="w-4 h-4 shrink-0" /> {success}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">Gérez les témoignages affichés sur la page d'accueil.</p>
          <button
            id="admin-testimonials-add"
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-[#F5D800] text-[#06091F] rounded-xl text-sm font-bold hover:bg-yellow-400 transition-colors"
          >
            <Plus className="w-4 h-4" /> Ajouter un témoignage
          </button>
        </div>

        {/* Create / Edit Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#06091F] text-lg">
                {editing ? "Modifier le témoignage" : "Nouveau témoignage"}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 text-red-600 border border-red-200 rounded-xl px-4 py-3 text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Auteur *</label>
                <input
                  id="testimonial-author"
                  value={form.author}
                  onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                  placeholder="Nom du client"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5D800]/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rôle / Titre</label>
                <input
                  id="testimonial-role"
                  value={form.role}
                  onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  placeholder="Ex : Client fidèle"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5D800]/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Contenu *</label>
              <textarea
                id="testimonial-content"
                rows={3}
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                placeholder="Le témoignage du client..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5D800]/40 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Note</label>
                {renderStars(form.rating, true, n => setForm(f => ({ ...f, rating: n })))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">URL de l'avatar (optionnel)</label>
                <input
                  id="testimonial-avatar"
                  value={form.avatarUrl}
                  onChange={e => setForm(f => ({ ...f, avatarUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#F5D800]/40"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                id="testimonial-visible"
                type="checkbox"
                checked={form.isVisible}
                onChange={e => setForm(f => ({ ...f, isVisible: e.target.checked }))}
                className="w-4 h-4 accent-[#F5D800]"
              />
              <label htmlFor="testimonial-visible" className="text-sm text-gray-700">Visible sur la boutique</label>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                id="testimonial-save"
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm font-bold bg-[#06091F] text-white rounded-xl hover:bg-[#1C2E5E] transition-colors disabled:opacity-60"
              >
                {saving ? "Enregistrement..." : editing ? "Mettre à jour" : "Créer"}
              </button>
            </div>
          </div>
        )}

        {/* Testimonials List */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-[#F5D800] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : testimonials.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <Quote className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Aucun témoignage pour le moment.</p>
            <p className="text-gray-300 text-xs mt-1">Cliquez sur « Ajouter un témoignage » pour commencer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {testimonials.map(t => (
              <div
                key={t.id}
                className={`bg-white rounded-2xl border shadow-sm p-5 space-y-3 transition-opacity ${
                  t.isVisible ? "border-gray-100 opacity-100" : "border-gray-100 opacity-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {t.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.avatarUrl} alt={t.author} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#06091F] text-[#F5D800] flex items-center justify-center font-bold text-sm shrink-0">
                        {t.author.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-[#06091F] text-sm">{t.author}</p>
                      {t.role && <p className="text-xs text-gray-400">{t.role}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleVisibility(t)}
                      title={t.isVisible ? "Masquer" : "Afficher"}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                    >
                      {t.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openEdit(t)}
                      title="Modifier"
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(t.id)}
                      title="Supprimer"
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {renderStars(t.rating)}

                <p className="text-sm text-gray-600 leading-relaxed italic">"{t.content}"</p>

                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    t.isVisible ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {t.isVisible ? "Visible" : "Masqué"}
                  </span>
                  <span className="text-xs text-gray-300">
                    {new Date(t.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                {/* Delete confirm */}
                {confirmDelete === t.id && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-red-700 font-medium">Supprimer ce témoignage ?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1 text-xs bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Confirmer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
