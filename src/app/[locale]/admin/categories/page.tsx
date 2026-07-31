"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Tag, Layers, Pencil, X, Check, AlertTriangle, Upload, Image as ImageIcon } from "lucide-react";

type Category = { id: string; name: string; slug: string; description?: string; image?: string };
type Brand    = { id: string; name: string; slug: string; description?: string; logo?: string };

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function ItemCard({ name, sub, image, onEdit }: { name: string; sub?: string; image?: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        {image ? (
          <img src={image} alt={name} className="w-10 h-10 rounded-xl object-cover border border-gray-100" />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
            <ImageIcon className="w-5 h-5" />
          </div>
        )}
        <div>
          <p className="font-semibold text-[#06091F] text-sm">{name}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-[#1C2E5E]/10 text-gray-400 hover:text-[#1C2E5E] transition-colors">
        <Pencil className="w-4 h-4" />
      </button>
    </div>
  );
}

type ModalState = { open: boolean; type: "category" | "brand"; name: string; slug: string; description: string; logo: string; image: string };
const EMPTY: ModalState = { open: false, type: "category", name: "", slug: "", description: "", logo: "", image: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands]         = useState<Brand[]>([]);
  const [loading, setLoading]       = useState(true);
  const [modal, setModal]           = useState<ModalState>(EMPTY);
  const [saving, setSaving]         = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [toast, setToast]           = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [cRes, bRes] = await Promise.all([
      fetch("/api/admin/categories"),
      fetch("/api/admin/brands"),
    ]);
    if (cRes.ok) setCategories(await cRes.json());
    if (bRes.ok) setBrands(await bRes.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = (type: "category" | "brand") =>
    setModal({ open: true, type, name: "", slug: "", description: "", logo: "", image: "" });

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
        showToast("success", "Image uploaded!");
      } else {
        showToast("error", "Failed to upload image.");
      }
    } catch {
      showToast("error", "Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = modal.type === "category" ? "/api/admin/categories" : "/api/admin/brands";
    const body: any = { name: modal.name, slug: modal.slug, description: modal.description };
    if (modal.type === "category" && modal.image) body.image = modal.image;
    if (modal.type === "brand" && modal.logo) body.logo = modal.logo;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    if (res.ok) {
      showToast("success", `${modal.type === "category" ? "Category" : "Brand"} created!`);
      closeModal();
      fetchAll();
    } else {
      showToast("error", "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="bg-[#06091F] px-8 py-8">
        <p className="text-[#F5D800] text-xs font-semibold uppercase tracking-widest mb-1">Admin · Catalog</p>
        <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          CATEGORIES & BRANDS
        </h1>
        <p className="text-white/50 text-sm mt-1">Organise your product catalog</p>
      </div>

      <div className="px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#1C2E5E]" />
              <h2 className="font-bold text-[#06091F]">Categories</h2>
              <span className="bg-[#06091F]/10 text-[#06091F] text-xs font-semibold px-2 py-0.5 rounded-full">{categories.length}</span>
            </div>
            <button
              id="admin-add-category-btn"
              onClick={() => openAdd("category")}
              className="flex items-center gap-1.5 bg-[#06091F] hover:bg-[#1C2E5E] text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          {loading ? (
            <div className="py-10 text-center text-gray-400 text-sm">Loading...</div>
          ) : categories.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">No categories yet.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {categories.map(c => (
                <ItemCard
                  key={c.id}
                  name={c.name}
                  sub={c.slug}
                  image={c.image}
                  onEdit={() => setModal({ open: true, type: "category", name: c.name, slug: c.slug, description: c.description || "", logo: "", image: c.image || "" })}
                />
              ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#1C2E5E]" />
              <h2 className="font-bold text-[#06091F]">Brands</h2>
              <span className="bg-[#06091F]/10 text-[#06091F] text-xs font-semibold px-2 py-0.5 rounded-full">{brands.length}</span>
            </div>
            <button
              id="admin-add-brand-btn"
              onClick={() => openAdd("brand")}
              className="flex items-center gap-1.5 bg-[#06091F] hover:bg-[#1C2E5E] text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          {loading ? (
            <div className="py-10 text-center text-gray-400 text-sm">Loading...</div>
          ) : brands.length === 0 ? (
            <div className="py-10 text-center text-gray-400 text-sm">No brands yet.</div>
          ) : (
            <div className="divide-y divide-gray-50">
              {brands.map(b => (
                <ItemCard
                  key={b.id}
                  name={b.name}
                  sub={b.description}
                  image={b.logo}
                  onEdit={() => setModal({ open: true, type: "brand", name: b.name, slug: b.slug, description: b.description || "", logo: b.logo || "", image: "" })}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#06091F]">
                New {modal.type === "category" ? "Category" : "Brand"}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-7 py-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Name *</label>
                <input
                  required
                  value={modal.name}
                  onChange={e => setModal(m => ({ ...m, name: e.target.value, slug: slugify(e.target.value) }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Slug</label>
                <input
                  value={modal.slug}
                  onChange={e => setModal(m => ({ ...m, slug: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Description</label>
                <textarea
                  rows={2}
                  value={modal.description}
                  onChange={e => setModal(m => ({ ...m, description: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20 resize-none"
                />
              </div>

              {/* Image / Logo Upload */}
              <div>
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">
                  {modal.type === "category" ? "Category Image" : "Brand Logo"}
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <input
                    type="text"
                    value={modal.type === "category" ? modal.image : modal.logo}
                    onChange={e => setModal(m => modal.type === "category" ? { ...m, image: e.target.value } : { ...m, logo: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20"
                  />
                  <label className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    {uploading ? "..." : "Upload"}
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                </div>
                {(modal.type === "category" ? modal.image : modal.logo) && (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                    <img src={modal.type === "category" ? modal.image : modal.logo} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving || uploading} className="flex-1 py-2.5 rounded-xl bg-[#06091F] text-white text-sm font-semibold hover:bg-[#1C2E5E] transition-colors disabled:opacity-60">
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
