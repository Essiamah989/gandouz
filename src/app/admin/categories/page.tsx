"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Tag, Layers, Pencil, Trash2, X, Check, AlertTriangle, Upload, Image as ImageIcon, Loader2, AlertOctagon, Package } from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: { products: number };
};
type Brand = { id: string; name: string; slug: string; description?: string; logo?: string };

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ItemCard({
  name,
  sub,
  image,
  productCount,
  onEdit,
  onDelete
}: {
  name: string;
  sub?: string;
  image?: string;
  productCount?: number;
  onEdit: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50/80 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        {image ? (
          <img src={image} alt={name} className="w-11 h-11 rounded-xl object-contain bg-gray-50 p-1 border border-gray-200 shrink-0" />
        ) : (
          <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 shrink-0">
            <ImageIcon className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-[#06091F] text-sm truncate">{name}</p>
            {productCount !== undefined && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                productCount > 0 ? "bg-amber-100 text-amber-900 border border-amber-200" : "bg-gray-100 text-gray-500"
              }`}>
                {productCount} {productCount === 1 ? "produit" : "produits"}
              </span>
            )}
          </div>
          {sub && <p className="text-xs text-gray-400 font-mono mt-0.5 truncate">{sub}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onEdit}
          className="p-2 rounded-xl hover:bg-[#06091F]/10 text-gray-500 hover:text-[#06091F] transition-colors"
          title="Modifier"
        >
          <Pencil className="w-4 h-4" />
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            className="p-2 rounded-xl hover:bg-rose-50 text-gray-400 hover:text-rose-600 transition-colors"
            title="Supprimer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

type ModalState = { open: boolean; type: "category" | "brand"; editId?: string; name: string; slug: string; description: string; logo: string; image: string };
const EMPTY: ModalState = { open: false, type: "category", editId: undefined, name: "", slug: "", description: "", logo: "", image: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands]         = useState<Brand[]>([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState<ModalState>(EMPTY);
  const [deleteCategoryItem, setDeleteCategoryItem] = useState<Category | null>(null);
  const [deleting, setDeleting]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [toast, setToast]           = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, bRes] = await Promise.all([
        fetch("/api/admin/categories"),
        fetch("/api/admin/brands"),
      ]);
      if (cRes.ok) setCategories(await cRes.json());
      if (bRes.ok) setBrands(await bRes.json());
    } catch {
      showToast("error", "Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = (type: "category" | "brand") =>
    setModal({ open: true, type, editId: undefined, name: "", slug: "", description: "", logo: "", image: "" });

  const closeModal = () => setModal(EMPTY);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) {
        const { url } = await res.json();
        if (modal.type === "category") {
          setModal(m => ({ ...m, image: url }));
        } else {
          setModal(m => ({ ...m, logo: url }));
        }
        showToast("success", "Image téléchargée avec succès !");
      } else {
        showToast("error", "Échec du téléchargement.");
      }
    } catch {
      showToast("error", "Erreur lors du téléchargement.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = modal.type === "category" ? "/api/admin/categories" : "/api/admin/brands";
    const method = modal.editId ? "PUT" : "POST";
    const body: any = { name: modal.name, slug: modal.slug, description: modal.description };
    if (modal.editId) body.id = modal.editId;
    if (modal.type === "category") body.image = modal.image;
    if (modal.type === "brand") body.logo = modal.logo;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      setSaving(false);
      if (res.ok) {
        showToast("success", `${modal.type === "category" ? "Catégorie" : "Marque"} ${modal.editId ? "modifiée" : "créée"} avec succès !`);
        closeModal();
        fetchAll();
      } else {
        showToast("error", "Une erreur s'est produite.");
      }
    } catch {
      setSaving(false);
      showToast("error", "Impossible d'enregistrer.");
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategoryItem) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories?id=${deleteCategoryItem.id}`, {
        method: "DELETE"
      });
      setDeleting(false);
      if (res.ok) {
        showToast("success", `La catégorie « ${deleteCategoryItem.name} » a été supprimée avec succès !`);
        setDeleteCategoryItem(null);
        fetchAll();
      } else {
        showToast("error", "Échec de la suppression de la catégorie.");
      }
    } catch {
      setDeleting(false);
      showToast("error", "Erreur réseau lors de la suppression.");
    }
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
        <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-1">Admin · Organisation du Catalogue</p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          CATÉGORIES & MARQUES
        </h1>
        <p className="text-white/60 text-xs mt-1">Structurez et organisez vos rayons de vins, spiritueux et champagnes</p>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#06091F] flex items-center justify-center text-[#F5D800]">
                <Layers className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="font-bold text-[#06091F] text-base">Catégories</h2>
                <span className="text-xs text-gray-400 font-semibold">{categories.length} catégories actives</span>
              </div>
            </div>
            <button
              id="admin-add-category-btn"
              onClick={() => openAdd("category")}
              className="flex items-center gap-1.5 bg-[#06091F] hover:bg-[#1C2E5E] text-[#F5D800] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>
          {loading ? (
            <div className="py-12 text-center text-gray-400 text-xs font-medium">Chargement des catégories...</div>
          ) : categories.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs font-medium">Aucune catégorie pour le moment.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {categories.map(c => {
                const assignedProducts = c._count?.products ?? 0;
                return (
                  <ItemCard
                    key={c.id}
                    name={c.name}
                    sub={c.slug}
                    image={c.image}
                    productCount={assignedProducts}
                    onEdit={() => setModal({ open: true, type: "category", editId: c.id, name: c.name, slug: c.slug, description: c.description || "", logo: "", image: c.image || "" })}
                    onDelete={() => setDeleteCategoryItem(c)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#06091F] flex items-center justify-center text-[#F5D800]">
                <Tag className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="font-bold text-[#06091F] text-base">Marques & Domaines</h2>
                <span className="text-xs text-gray-400 font-semibold">{brands.length} marques référencées</span>
              </div>
            </div>
            <button
              id="admin-add-brand-btn"
              onClick={() => openAdd("brand")}
              className="flex items-center gap-1.5 bg-[#06091F] hover:bg-[#1C2E5E] text-[#F5D800] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>
          {loading ? (
            <div className="py-12 text-center text-gray-400 text-xs font-medium">Chargement des marques...</div>
          ) : brands.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-xs font-medium">Aucune marque pour le moment.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {brands.map(b => (
                <ItemCard
                  key={b.id}
                  name={b.name}
                  sub={b.description || b.slug}
                  image={b.logo}
                  onEdit={() => setModal({ open: true, type: "brand", editId: b.id, name: b.name, slug: b.slug, description: b.description || "", logo: b.logo || "", image: "" })}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-black text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                {modal.editId ? "Modifier" : "Ajouter"} {modal.type === "category" ? "une Catégorie" : "une Marque"}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-200 text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Nom *</label>
                <input
                  required
                  value={modal.name}
                  onChange={e => setModal(m => ({ ...m, name: e.target.value, slug: slugify(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20"
                  placeholder="Ex: Vins Rouges ou Dom Pérignon"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Identifiant Slug URL</label>
                <input
                  value={modal.slug}
                  onChange={e => setModal(m => ({ ...m, slug: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#06091F]/20"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea
                  rows={2}
                  value={modal.description}
                  onChange={e => setModal(m => ({ ...m, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20 resize-none"
                  placeholder="Brève description..."
                />
              </div>

              {/* Image / Logo Upload */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">
                  {modal.type === "category" ? "Image de la Catégorie" : "Logo de la Marque"}
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={modal.type === "category" ? modal.image : modal.logo}
                    onChange={e => setModal(m => modal.type === "category" ? { ...m, image: e.target.value } : { ...m, logo: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#06091F]/20 font-mono"
                  />
                  <label className="flex items-center gap-1.5 px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl cursor-pointer transition-colors shrink-0">
                    {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    <span>{uploading ? "..." : "Parcourir"}</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
                {(modal.type === "category" ? modal.image : modal.logo) && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-1">
                    <img src={modal.type === "category" ? modal.image : modal.logo} alt="Aperçu" className="w-full h-full object-contain" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 py-2.5 rounded-xl bg-[#06091F] text-white text-xs font-bold hover:bg-[#1C2E5E] transition-colors disabled:opacity-60 shadow-sm"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation Alert Modal */}
      {deleteCategoryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 sm:p-7">
              {/* Alert Header Icon */}
              <div className="flex items-center gap-3.5 mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  (deleteCategoryItem._count?.products ?? 0) > 0 ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
                }`}>
                  {(deleteCategoryItem._count?.products ?? 0) > 0 ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <AlertOctagon className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#06091F] uppercase" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Supprimer la Catégorie
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold">Confirmation de suppression</p>
                </div>
              </div>

              {/* Warning box if category has assigned products */}
              {(deleteCategoryItem._count?.products ?? 0) > 0 ? (
                <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
                    <Package className="w-4 h-4 text-amber-600" />
                    <span>Produits Assignés Détectés</span>
                  </div>
                  <p className="text-xs text-amber-900 leading-relaxed font-medium">
                    ⚠️ Cette catégorie contient actuellement{" "}
                    <span className="font-extrabold text-amber-950 bg-amber-200/80 px-1.5 py-0.5 rounded text-[13px]">
                      {deleteCategoryItem._count?.products} produit{(deleteCategoryItem._count?.products ?? 0) > 1 ? "s" : ""}
                    </span>{" "}
                    assigné{(deleteCategoryItem._count?.products ?? 0) > 1 ? "s" : ""}.
                  </p>
                  <p className="text-[11px] text-amber-800/80 leading-relaxed">
                    Si vous supprimez la catégorie <strong>« {deleteCategoryItem.name} »</strong>, ses produits rattachés seront également supprimés ou détachés du catalogue.
                  </p>
                </div>
              ) : (
                <div className="mb-5 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    Êtes-vous sûr de vouloir supprimer définitivement la catégorie <strong>« {deleteCategoryItem.name} »</strong> ?
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Cette action est immédiate et irréversible.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteCategoryItem(null)}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  disabled={deleting}
                  className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Suppression...</span>
                    </>
                  ) : (
                    <span>Supprimer la catégorie</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

