"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Plus, Pencil, Trash2, Search, ChevronDown, ChevronUp, ImageOff, X, Check, AlertTriangle, Upload, ImagePlus, Loader2 } from "lucide-react";

type Product = {
  id: string; name: string; slug: string; description?: string;
  images: string[]; categoryId: string; brandId?: string;
  basePrice: number; salePrice?: number | null;
  isFeatured: boolean; isActive: boolean; loyaltyPoints?: number;
  tags?: string[]; stock: number;
  category?: { name: string }; brand?: { name: string };
};
type Category = { id: string; name: string };
type Brand = { id: string; name: string };

const EMPTY_PRODUCT: Omit<Product, "id" | "category" | "brand"> = {
  name: "", slug: "", description: "", images: [""], categoryId: "",
  brandId: "", basePrice: 0, salePrice: null, isFeatured: false, isActive: true,
  loyaltyPoints: 0, tags: [], stock: 20,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"closed" | "add" | "edit" | "delete">("closed");
  const [form, setForm] = useState<any>({ ...EMPTY_PRODUCT });
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
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
      stock: p.stock ?? 20,
    });
    setEditId(p.id);
    setModal("edit");
  };

  const openDelete = (id: string) => { setDeleteId(id); setModal("delete"); };
  const closeModal = () => { setModal("closed"); setEditId(null); setDeleteId(null); setUploadError(null); };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setUploadError(json.error || "Upload failed");
      return null;
    }
    const { url } = await res.json();
    return url as string;
  };

  const handleFileChange = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const url = await uploadFile(file);
      if (url) urls.push(url);
    }
    if (urls.length > 0) {
      setForm((f: any) => ({
        ...f,
        images: [...(f.images.filter((u: string) => u.trim())), ...urls],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      tags: typeof form.tags === "string" ? form.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : form.tags,
      salePrice: form.salePrice === "" || form.salePrice == null ? null : Number(form.salePrice),
      basePrice: Number(form.basePrice),
      loyaltyPoints: Number(form.loyaltyPoints),
      stock: Number(form.stock),
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
  ).sort((a, b) => {
    let aVal: any = a[sortField as keyof Product];
    let bVal: any = b[sortField as keyof Product];
    if (sortField === "category") {
      aVal = a.category?.name || "";
      bVal = b.category?.name || "";
    } else if (sortField === "price") {
      aVal = Number(a.salePrice || a.basePrice);
      bVal = Number(b.salePrice || b.basePrice);
    } else if (sortField === "status") {
      aVal = a.isActive ? 1 : 0;
      bVal = b.isActive ? 1 : 0;
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
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
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("name")}>Product {sortField === "name" && (sortDir === "asc" ? "↑" : "↓")}</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("category")}>Category {sortField === "category" && (sortDir === "asc" ? "↑" : "↓")}</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("price")}>Price {sortField === "price" && (sortDir === "asc" ? "↑" : "↓")}</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors hidden lg:table-cell" onClick={() => handleSort("stock")}>Stock {sortField === "stock" && (sortDir === "asc" ? "↑" : "↓")}</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort("status")}>Status {sortField === "status" && (sortDir === "asc" ? "↑" : "↓")}</th>
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
                            <span className="font-bold text-[#06091F]">{Number(p.salePrice).toFixed(3)} TND</span>
                            <span className="block text-xs text-gray-400 line-through">{Number(p.basePrice).toFixed(3)}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-[#06091F]">{Number(p.basePrice).toFixed(3)} TND</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center hidden lg:table-cell font-medium text-gray-600">
                        {p.stock}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-1.5">
                          <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${p.isActive !== false ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                              {p.isActive !== false ? "Active" : "Inactive"}
                            </span>
                            {p.isFeatured && (
                              <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">★</span>
                            )}
                          </div>
                          
                          {(() => {
                            if (p.stock === 0) return (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border border-red-200 uppercase tracking-wider">Out of Stock</span>
                            );
                            if (p.stock <= 5) return (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 uppercase tracking-wider">Low Stock</span>
                            );
                            return null;
                          })()}
                        </div>
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
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Product Images</label>

                  {/* Drag-and-drop upload zone */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={async e => {
                      e.preventDefault();
                      setDragOver(false);
                      await handleFileChange(e.dataTransfer.files);
                    }}
                    className={`relative border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                      dragOver
                        ? "border-[#1C2E5E] bg-[#1C2E5E]/5"
                        : "border-gray-200 hover:border-[#1C2E5E]/50 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      multiple
                      className="sr-only"
                      onChange={e => handleFileChange(e.target.files)}
                    />
                    {uploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-[#1C2E5E] animate-spin" />
                        <p className="text-sm font-medium text-[#1C2E5E]">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-[#06091F]/5 flex items-center justify-center">
                          <ImagePlus className="w-6 h-6 text-[#06091F]/40" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Drop images here or <span className="text-[#1C2E5E] underline">browse</span></p>
                        <p className="text-xs text-gray-400">JPEG, PNG, WebP, GIF · Max 5 MB each</p>
                      </>
                    )}
                  </div>

                  {uploadError && (
                    <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> {uploadError}
                    </p>
                  )}

                  {/* Thumbnails of added images */}
                  {form.images.filter((u: string) => u.trim()).length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {form.images.filter((u: string) => u.trim()).map((url: string, idx: number) => (
                        <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setForm((f: any) => ({ ...f, images: f.images.filter((_: string, i: number) => i !== idx) }))}
                            className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Manual URL fallback */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Upload className="w-3 h-3" /> Or paste image URLs (one per line):</p>
                    <textarea rows={2}
                      value={form.images.join("\n")}
                      onChange={e => setForm((f: any) => ({ ...f, images: e.target.value.split("\n") }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20 resize-none font-mono text-xs"
                      placeholder="https://example.com/image.jpg" />
                  </div>
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

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 mt-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 block">Stock Quantity *</label>
                  <input type="number" min="0" required value={form.stock} onChange={e => setForm((f: any) => ({ ...f, stock: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1C2E5E]/20" />
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
