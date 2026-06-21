"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Search, ChevronDown, ChevronUp, ImageOff, X, Check, AlertTriangle } from "lucide-react";

type Variant = { id?: string; size: string; price: number; salePrice?: number | null; stock: number; sku?: string };
type Product = {
  id: string; name: string; slug: string; description?: string;
  images: string[]; categoryId: string; brandId?: string;
  basePrice: number; salePrice?: number | null;
  isFeatured: boolean; isActive: boolean; loyaltyPoints?: number;
  tags?: string[]; variants: Variant[];
  category?: { name: string }; brand?: { name: string };
};
type Category = { id: string; name: string };
type Brand = { id: string; name: string };

const EMPTY_PRODUCT: Omit<Product, "id" | "category" | "brand"> = {
  name: "", slug: "", description: "", images: [""], categoryId: "",
  brandId: "", basePrice: 0, salePrice: null, isFeatured: false, isActive: true,
  loyaltyPoints: 0, tags: [], variants: [{ size: "", price: 0, stock: 0, sku: "" }],
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"closed" | "add" | "edit" | "delete">("closed");
  const [form, setForm] = useState<any>({ ...EMPTY_PRODUCT });
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [pRes, cRes, bRes] = await Promise.all([
      fetch("/api/admin/products"),
      fetch("/api/admin/categories"),
      fetch("/api/admin/brands"),
    ]);
    if (pRes.ok) setProducts(await pRes.json());
    if (cRes.ok) setCategories(await cRes.json());
    if (bRes.ok) setBrands(await bRes.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const openAdd = () => {
    setForm({ ...EMPTY_PRODUCT });
    setEditId(null);
    setModal("add");
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name, slug: p.slug, description: p.description || "",
      images: p.images?.length ? p.images : [""],
      categoryId: p.categoryId, brandId: p.brandId || "",
      basePrice: p.basePrice, salePrice: p.salePrice ?? "",
      isFeatured: p.isFeatured, isActive: p.isActive,
      loyaltyPoints: p.loyaltyPoints || 0,
      tags: (p.tags || []).join(", "),
      variants: p.variants?.length ? p.variants : [{ size: "", price: 0, stock: 0, sku: "" }],
    });
    setEditId(p.id);
    setModal("edit");
  };

  const openDelete = (id: string) => { setDeleteId(id); setModal("delete"); };
  const closeModal = () => { setModal("closed"); setEditId(null); setDeleteId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      tags: typeof form.tags === "string" ? form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : form.tags,
      salePrice: form.salePrice === "" || form.salePrice == null ? null : Number(form.salePrice),
      basePrice: Number(form.basePrice),
      loyaltyPoints: Number(form.loyaltyPoints),
      variants: form.variants.map((v: any) => ({
        ...v,
        price: Number(v.price),
        salePrice: v.salePrice === "" || v.salePrice == null ? null : Number(v.salePrice),
        stock: Number(v.stock),
      })),
    };

    const url = editId ? `/api/admin/products/${editId}` : "/api/admin/products";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      showToast("success", editId ? "Product updated!" : "Product created!");
      closeModal();
      fetchAll();
    } else {
      showToast("error", "Something went wrong.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/products/${deleteId}`, { method: "DELETE" });
    if (res.ok) {
      showToast("success", "Product deactivated.");
      closeModal();
      fetchAll();
    } else {
      showToast("error", "Delete failed.");
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category?.name || "").toLowerCase().includes(search.toLowerCase())
  );

  const updateVariant = (idx: number, field: string, val: any) => {
    setForm((f: any) => {
      const variants = [...f.variants];
      variants[idx] = { ...variants[idx], [field]: val };
      return { ...f, variants };
    });
  };

  const addVariant = () => setForm((f: any) => ({ ...f, variants: [...f.variants, { size: "", price: 0, stock: 0, sku: "" }] }));
  const removeVariant = (idx: number) => setForm((f: any) => ({ ...f, variants: f.variants.filter((_: any, i: number) => i !== idx) }));

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
          PRODUCTS
        </h1>
        <p className="text-white/50 text-sm mt-1">{products.filter(p => p.isActive !== false).length} active products</p>
      </div>

      <div className="px-8 py-6">
        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20"
            />
          </div>
          <button
            onClick={openAdd}
            id="admin-add-product-btn"
            className="flex items-center gap-2 bg-[#06091F] hover:bg-[#1C2E5E] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-20 text-center text-gray-400 text-sm">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-sm">No products found.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Variants</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <>
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            {p.images?.[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageOff className="w-4 h-4 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-[#06091F] leading-tight">{p.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell text-gray-600">{p.category?.name || "—"}</td>
                      <td className="px-4 py-4 text-right">
                        {p.salePrice ? (
                          <div>
                            <span className="font-bold text-[#06091F]">{p.salePrice.toFixed(3)} TND</span>
                            <span className="block text-xs text-gray-400 line-through">{p.basePrice.toFixed(3)}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-[#06091F]">{p.basePrice.toFixed(3)} TND</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center hidden lg:table-cell">
                        <button
                          onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                          className="flex items-center gap-1 mx-auto text-xs text-[#1C2E5E] font-medium hover:text-[#F5D800] transition-colors"
                        >
                          {p.variants?.length || 0} variants
                          {expandedId === p.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.isActive !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {p.isActive !== false ? "Active" : "Inactive"}
                        </span>
                        {p.isFeatured && (
                          <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">★</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => openEdit(p)}
                            className="p-1.5 rounded-lg hover:bg-[#1C2E5E]/10 text-gray-500 hover:text-[#1C2E5E] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDelete(p.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === p.id && (
                      <tr key={`${p.id}-exp`}>
                        <td colSpan={6} className="px-6 pb-4 bg-gray-50/80">
                          <div className="flex flex-wrap gap-2 mt-1">
                            {p.variants?.map(v => (
                              <span key={v.id || v.size} className="bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-xs text-gray-600">
                                <strong>{v.size}</strong> — {v.salePrice ? `${v.salePrice} TND` : `${v.price} TND`} · Stock: {v.stock}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-[#06091F]">{modal === "add" ? "Add New Product" : "Edit Product"}</h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-100 text-gray-500"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Product Name *</label>
                  <input required value={form.name} onChange={e => setForm((f: any) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Slug</label>
                  <input value={form.slug} onChange={e => setForm((f: any) => ({ ...f, slug: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Category *</label>
                  <select required value={form.categoryId} onChange={e => setForm((f: any) => ({ ...f, categoryId: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20">
                    <option value="">Select category...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Brand</label>
                  <select value={form.brandId} onChange={e => setForm((f: any) => ({ ...f, brandId: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20">
                    <option value="">No brand</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Base Price (TND) *</label>
                  <input type="number" step="0.01" min="0" required value={form.basePrice} onChange={e => setForm((f: any) => ({ ...f, basePrice: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Sale Price (TND)</label>
                  <input type="number" step="0.01" min="0" value={form.salePrice ?? ""} onChange={e => setForm((f: any) => ({ ...f, salePrice: e.target.value }))}
                    placeholder="Leave empty if no sale"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Loyalty Points</label>
                  <input type="number" min="0" value={form.loyaltyPoints} onChange={e => setForm((f: any) => ({ ...f, loyaltyPoints: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Tags (comma separated)</label>
                  <input value={form.tags} onChange={e => setForm((f: any) => ({ ...f, tags: e.target.value }))}
                    placeholder="wine, premium, france"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20 resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Image URLs (one per line)</label>
                  <textarea rows={2}
                    value={form.images.join("\n")}
                    onChange={e => setForm((f: any) => ({ ...f, images: e.target.value.split("\n").filter(Boolean) }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20 resize-none font-mono text-xs" />
                </div>
                <div className="col-span-2 flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isFeatured} onChange={e => setForm((f: any) => ({ ...f, isFeatured: e.target.checked }))} className="w-4 h-4 accent-[#F5D800]" />
                    <span className="text-sm font-medium text-gray-700">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm((f: any) => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-[#1C2E5E]" />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              {/* Variants */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Variants</label>
                  <button type="button" onClick={addVariant} className="text-xs font-semibold text-[#1C2E5E] hover:text-[#F5D800] flex items-center gap-1 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Variant
                  </button>
                </div>
                <div className="space-y-3">
                  {form.variants.map((v: Variant, i: number) => (
                    <div key={i} className="grid grid-cols-5 gap-2 items-end bg-gray-50 p-3 rounded-xl">
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Size</label>
                        <input value={v.size} onChange={e => updateVariant(i, "size", e.target.value)} placeholder="75cl"
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1C2E5E]/20" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Price</label>
                        <input type="number" step="0.01" value={v.price} onChange={e => updateVariant(i, "price", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1C2E5E]/20" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Sale Price</label>
                        <input type="number" step="0.01" value={v.salePrice ?? ""} onChange={e => updateVariant(i, "salePrice", e.target.value)} placeholder="—"
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1C2E5E]/20" />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 mb-1 block">Stock</label>
                        <input type="number" value={v.stock} onChange={e => updateVariant(i, "stock", e.target.value)}
                          className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#1C2E5E]/20" />
                      </div>
                      <div className="flex items-end">
                        {form.variants.length > 1 && (
                          <button type="button" onClick={() => removeVariant(i)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#06091F] text-white text-sm font-semibold hover:bg-[#1C2E5E] transition-colors disabled:opacity-60">
                  {saving ? "Saving..." : modal === "add" ? "Create Product" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {modal === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[#06091F] mb-2">Deactivate Product?</h3>
            <p className="text-gray-500 text-sm mb-6">This product will be hidden from the store. You can reactivate it later.</p>
            <div className="flex gap-3">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">Deactivate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
