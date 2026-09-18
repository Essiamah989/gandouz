"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  ImageOff,
  X,
  Check,
  AlertTriangle,
  Upload,
  ImagePlus,
  Loader2,
  Package,
  CheckCircle2,
  XCircle,
  Tag,
  Star,
  Layers,
  Filter,
  RefreshCw,
  Power
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  images: string[];
  categoryId: string;
  brandId?: string;
  basePrice: number;
  salePrice?: number | null;
  isFeatured: boolean;
  isActive: boolean;
  loyaltyPoints?: number;
  tags?: string[];
  stock: number;
  category?: { id?: string; name: string };
  brand?: { id?: string; name: string };
};

type Category = { id: string; name: string; slug?: string };
type Brand = { id: string; name: string; slug?: string };

type FilterTab = "all" | "in_stock" | "out_of_stock" | "on_sale" | "featured";

const EMPTY_PRODUCT: Omit<Product, "id" | "category" | "brand"> = {
  name: "",
  slug: "",
  description: "",
  images: [""],
  categoryId: "",
  brandId: "",
  basePrice: 0,
  salePrice: null,
  isFeatured: false,
  isActive: true,
  loyaltyPoints: 0,
  tags: [],
  stock: 20,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  
  // Filtering & Search
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortField, setSortField] = useState<string>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  
  // Modals and state
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<"closed" | "add" | "edit" | "delete">("closed");
  const [form, setForm] = useState<any>({ ...EMPTY_PRODUCT });
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const showToast = (type: "success" | "error", msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, cRes, bRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/brands"),
      ]);
      if (pRes.ok) setProducts(await pRes.json());
      if (cRes.ok) setCategories(await cRes.json());
      if (bRes.ok) setBrands(await bRes.json());
    } catch (err) {
      console.error(err);
      showToast("error", "Échec du chargement du catalogue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openAdd = () => {
    setForm({ ...EMPTY_PRODUCT });
    setEditId(null);
    setModal("add");
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      images: p.images?.length ? p.images : [""],
      categoryId: p.categoryId,
      brandId: p.brandId || "",
      basePrice: p.basePrice,
      salePrice: p.salePrice ?? "",
      isFeatured: p.isFeatured ?? false,
      isActive: p.isActive !== false,
      loyaltyPoints: p.loyaltyPoints || 0,
      tags: (p.tags || []).join(", "),
      stock: p.stock ?? 20,
    });
    setEditId(p.id);
    setModal("edit");
  };

  const openDelete = (id: string) => {
    setDeleteId(id);
    setModal("delete");
  };

  const closeModal = () => {
    setModal("closed");
    setEditId(null);
    setDeleteId(null);
    setUploadError(null);
  };

  // Quick toggle active state directly from table row
  const toggleActiveStatus = async (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setTogglingId(p.id);
    const nextState = p.isActive === false ? true : false;
    
    try {
      const res = await fetch(`/api/admin/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...p,
          isActive: nextState,
        }),
      });

      if (res.ok) {
        showToast("success", nextState ? `"${p.name}" marqué comme Actif (En stock)` : `"${p.name}" marqué en Rupture de Stock`);
        fetchAll();
      } else {
        showToast("error", "Échec de mise à jour du statut du produit");
      }
    } catch {
      showToast("error", "Erreur de communication avec le serveur");
    } finally {
      setTogglingId(null);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      setUploading(false);
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        setUploadError(json.error || "Échec du téléchargement");
        return null;
      }
      const { url } = await res.json();
      return url as string;
    } catch {
      setUploading(false);
      setUploadError("Erreur réseau pendant le téléchargement");
      return null;
    }
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
        images: [...f.images.filter((u: string) => u.trim()), ...urls],
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
      loyaltyPoints: Number(form.loyaltyPoints || 0),
      stock: Number(form.stock || 0),
      isActive: Boolean(form.isActive),
      isFeatured: Boolean(form.isFeatured),
    };

    try {
      const url = editId ? `/api/admin/products/${editId}` : "/api/admin/products";
      const method = editId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSaving(false);
      if (res.ok) {
        showToast("success", editId ? "Produit modifié avec succès !" : "Produit ajouté avec succès !");
        closeModal();
        fetchAll();
      } else {
        showToast("error", "Une erreur s'est produite.");
      }
    } catch {
      setSaving(false);
      showToast("error", "Impossible de sauvegarder le produit.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/products/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("success", "Produit désactivé (Rupture de stock).");
        closeModal();
        fetchAll();
      } else {
        showToast("error", "Échec de suppression.");
      }
    } catch {
      showToast("error", "Échec de suppression.");
    }
  };

  // KPI Calculations
  const totalCount = products.length;
  const inStockCount = products.filter(p => p.isActive !== false && (p.stock === undefined || p.stock > 0)).length;
  const outOfStockCount = products.filter(p => p.isActive === false || p.stock <= 0).length;
  const onSaleCount = products.filter(p => p.salePrice !== null && p.salePrice !== undefined && Number(p.salePrice) > 0 && Number(p.salePrice) < Number(p.basePrice)).length;
  const featuredCount = products.filter(p => p.isFeatured).length;

  // Filter & Search Logic
  const filtered = products.filter(p => {
    // Search query matching
    if (search.trim()) {
      const s = search.toLowerCase().trim();
      const matchName = p.name?.toLowerCase().includes(s);
      const matchSlug = p.slug?.toLowerCase().includes(s);
      const matchCat = (p.category?.name || "").toLowerCase().includes(s);
      const matchBrand = (p.brand?.name || "").toLowerCase().includes(s);
      const matchTags = (p.tags || []).some(t => t.toLowerCase().includes(s));
      const matchDesc = (p.description || "").toLowerCase().includes(s);
      if (!matchName && !matchSlug && !matchCat && !matchBrand && !matchTags && !matchDesc) {
        return false;
      }
    }

    // Category filter dropdown
    if (selectedCategory && p.categoryId !== selectedCategory) {
      return false;
    }

    // Tab filter
    if (activeTab === "in_stock") {
      return p.isActive !== false && (p.stock === undefined || p.stock > 0);
    }
    if (activeTab === "out_of_stock") {
      return p.isActive === false || p.stock <= 0;
    }
    if (activeTab === "on_sale") {
      return p.salePrice !== null && p.salePrice !== undefined && Number(p.salePrice) > 0 && Number(p.salePrice) < Number(p.basePrice);
    }
    if (activeTab === "featured") {
      return Boolean(p.isFeatured);
    }

    return true;
  }).sort((a, b) => {
    let aVal: any = a[sortField as keyof Product];
    let bVal: any = b[sortField as keyof Product];
    if (sortField === "category") {
      aVal = a.category?.name || "";
      bVal = b.category?.name || "";
    } else if (sortField === "price") {
      aVal = Number(a.salePrice || a.basePrice);
      bVal = Number(b.salePrice || b.basePrice);
    } else if (sortField === "stock") {
      aVal = Number(a.stock || 0);
      bVal = Number(b.stock || 0);
    } else if (sortField === "status") {
      const aOutOfStock = a.isActive === false || a.stock <= 0 ? 0 : 1;
      const bOutOfStock = b.isActive === false || b.stock <= 0 ? 0 : 1;
      aVal = aOutOfStock;
      bVal = bOutOfStock;
    }
    if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setActiveTab("all");
    setSelectedCategory("");
  };

  const hasActiveFilters = search.trim() !== "" || activeTab !== "all" || selectedCategory !== "";

  return (
    <div className="min-h-screen pb-16 bg-[#F8FAFC]">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-2.5 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all duration-300 animate-in fade-in slide-in-from-top-4 ${
          toast.type === "success" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
        }`}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-[#06091F] px-8 py-8 border-b border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[#F5D800] text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Gestion des Stocks & Catalogue
            </p>
            <h1 className="text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              CATALOGUE PRODUITS
            </h1>
            <p className="text-white/60 text-xs mt-1">
              Gérez les stocks en temps réel, les prix, et la visibilité des produits sur votre boutique.
            </p>
          </div>

          <button
            onClick={openAdd}
            id="admin-add-product-btn"
            className="self-start md:self-auto flex items-center gap-2 bg-[#F5D800] hover:bg-[#ffe600] text-[#06091F] px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#F5D800]/10 hover:shadow-[#F5D800]/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Ajouter un Produit
          </button>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
          <button
            onClick={() => setActiveTab("all")}
            className={`text-left p-3.5 rounded-2xl border transition-all ${
              activeTab === "all"
                ? "bg-white/15 border-[#F5D800] ring-2 ring-[#F5D800]/30 text-white"
                : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/70">Total Produits</span>
              <Layers className="w-4 h-4 text-[#F5D800]" />
            </div>
            <p className="text-2xl font-black mt-1 text-white">{totalCount}</p>
          </button>

          <button
            onClick={() => setActiveTab("in_stock")}
            className={`text-left p-3.5 rounded-2xl border transition-all ${
              activeTab === "in_stock"
                ? "bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400/30 text-white"
                : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/70">En Stock</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-black mt-1 text-emerald-400">{inStockCount}</p>
          </button>

          <button
            onClick={() => setActiveTab("out_of_stock")}
            className={`text-left p-3.5 rounded-2xl border transition-all ${
              activeTab === "out_of_stock"
                ? "bg-rose-500/20 border-rose-400 ring-2 ring-rose-400/30 text-white"
                : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/70">Rupture de Stock</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <p className="text-2xl font-black mt-1 text-rose-400">{outOfStockCount}</p>
          </button>

          <button
            onClick={() => setActiveTab("on_sale")}
            className={`text-left p-3.5 rounded-2xl border transition-all ${
              activeTab === "on_sale"
                ? "bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/30 text-white"
                : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/70">En Solde</span>
              <Tag className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black mt-1 text-amber-400">{onSaleCount}</p>
          </button>

          <button
            onClick={() => setActiveTab("featured")}
            className={`text-left p-3.5 rounded-2xl border transition-all ${
              activeTab === "featured"
                ? "bg-yellow-500/20 border-yellow-400 ring-2 ring-yellow-400/30 text-white"
                : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-white/70">En Vedette</span>
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            </div>
            <p className="text-2xl font-black mt-1 text-yellow-400">{featuredCount}</p>
          </button>
        </div>
      </div>

      <div className="px-6 lg:px-8 py-6">
        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs mb-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, catégorie, marque, tag, slug..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 border border-gray-200 rounded-xl bg-gray-50/50 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/15 focus:border-[#06091F] transition-all"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  title="Effacer la recherche"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Dropdown & Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="appearance-none bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700 py-2.5 pl-3.5 pr-8 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#06091F]/15 cursor-pointer"
                >
                  <option value="">Toutes les catégories ({categories.length})</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={fetchAll}
                className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                title="Actualiser le catalogue"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              </button>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs font-bold text-red-600 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50 transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" /> Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-gray-100 no-scrollbar">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filtrer par :
            </span>

            {[
              { id: "all", label: "Tous les Produits", count: totalCount },
              { id: "in_stock", label: "En Stock Uniquement", count: inStockCount },
              { id: "out_of_stock", label: "En Rupture Uniquement", count: outOfStockCount },
              { id: "on_sale", label: "En Solde Uniquement", count: onSaleCount },
              { id: "featured", label: "En Vedette Uniquement", count: featuredCount },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as FilterTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? "bg-[#06091F] text-[#F5D800] shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  activeTab === tab.id ? "bg-[#F5D800] text-[#06091F]" : "bg-gray-200 text-gray-700"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Products Table Card */}
        <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
          {loading ? (
            <div className="py-24 text-center">
              <Loader2 className="w-8 h-8 text-[#06091F] animate-spin mx-auto mb-3" />
              <p className="text-sm font-semibold text-gray-500">Chargement des articles du catalogue...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center px-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <Package className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="text-base font-bold text-[#06091F]">Aucun produit ne correspond à vos filtres</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Essayez un autre mot-clé ou réinitialisez vos filtres de recherche.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-[#06091F] text-white text-xs font-bold rounded-xl hover:bg-[#1C2E5E] transition-colors"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50/80 border-b border-gray-100">
                  <tr>
                    <th
                      className="px-6 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/80 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      <div className="flex items-center gap-1.5">
                        Produit
                        {sortField === "name" && (sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-[#06091F]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#06091F]" />)}
                      </div>
                    </th>
                    <th
                      className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell cursor-pointer hover:bg-gray-100/80 transition-colors"
                      onClick={() => handleSort("category")}
                    >
                      <div className="flex items-center gap-1.5">
                        Catégorie / Marque
                        {sortField === "category" && (sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-[#06091F]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#06091F]" />)}
                      </div>
                    </th>
                    <th
                      className="text-right px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/80 transition-colors"
                      onClick={() => handleSort("price")}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        Prix (TND)
                        {sortField === "price" && (sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-[#06091F]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#06091F]" />)}
                      </div>
                    </th>
                    <th
                      className="text-center px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/80 transition-colors hidden lg:table-cell"
                      onClick={() => handleSort("stock")}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        Stock
                        {sortField === "stock" && (sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-[#06091F]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#06091F]" />)}
                      </div>
                    </th>
                    <th
                      className="text-center px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100/80 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        Statut / Disponibilité
                        {sortField === "status" && (sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-[#06091F]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#06091F]" />)}
                      </div>
                    </th>
                    <th className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filtered.map(p => {
                    const isOutOfStock = p.isActive === false || (p.stock !== undefined && p.stock <= 0);
                    const isLowStock = !isOutOfStock && p.stock !== undefined && p.stock <= 5;
                    const hasDiscount = p.salePrice !== null && p.salePrice !== undefined && Number(p.salePrice) > 0 && Number(p.salePrice) < Number(p.basePrice);
                    const discountPercent = hasDiscount
                      ? Math.round(((Number(p.basePrice) - Number(p.salePrice)) / Number(p.basePrice)) * 100)
                      : 0;

                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-gray-50/70 transition-colors ${
                          isOutOfStock ? "bg-red-50/20" : ""
                        }`}
                      >
                        {/* Product info */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3.5">
                            <div className="relative w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                              {p.images?.[0] ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={p.images[0]} alt={p.name} className="w-full h-full object-contain p-1" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ImageOff className="w-4 h-4 text-gray-300" />
                                </div>
                              )}
                              {isOutOfStock && (
                                <div className="absolute inset-0 bg-red-950/40 flex items-center justify-center">
                                  <span className="text-[8px] font-black text-white bg-red-600 px-1 py-0.2 rounded uppercase">
                                    ÉPUISÉ
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-[#06091F] leading-snug truncate max-w-xs">{p.name}</p>
                                {p.isFeatured && (
                                  <span className="shrink-0 inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-yellow-100 text-yellow-800 border border-yellow-300">
                                    ★ En vedette
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 font-mono mt-0.5 truncate max-w-xs">/{p.slug}</p>
                              {p.tags && p.tags.length > 0 && (
                                <div className="flex gap-1 mt-1 flex-wrap">
                                  {p.tags.slice(0, 3).map((tag, idx) => (
                                    <span key={idx} className="text-[9px] font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Category & Brand */}
                        <td className="px-4 py-4 hidden md:table-cell">
                          <p className="font-semibold text-gray-800 text-xs">{p.category?.name || "—"}</p>
                          <p className="text-[11px] text-gray-400 mt-0.5">{p.brand?.name || "Générique"}</p>
                        </td>

                        {/* Price */}
                        <td className="px-4 py-4 text-right font-medium">
                          {hasDiscount ? (
                            <div>
                              <div className="flex items-center justify-end gap-1.5">
                                <span className="font-bold text-[#06091F]">{Number(p.salePrice).toFixed(3)} TND</span>
                                <span className="text-[10px] font-extrabold bg-red-100 text-red-700 px-1.5 py-0.2 rounded">
                                  -{discountPercent}%
                                </span>
                              </div>
                              <span className="block text-xs text-gray-400 line-through">{Number(p.basePrice).toFixed(3)} TND</span>
                            </div>
                          ) : (
                            <span className="font-bold text-[#06091F]">{Number(p.basePrice).toFixed(3)} TND</span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="px-4 py-4 text-center hidden lg:table-cell">
                          <div className="inline-flex flex-col items-center">
                            <span className={`font-extrabold text-sm ${
                              p.stock <= 0 ? "text-red-600" : p.stock <= 5 ? "text-amber-600" : "text-emerald-700"
                            }`}>
                              {p.stock ?? 0}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">unités</span>
                          </div>
                        </td>

                        {/* Status / Stock Tag & Quick Toggle */}
                        <td className="px-4 py-4 text-center">
                          <div className="flex flex-col items-center gap-1.5">
                            {/* Quick Active Toggle Button */}
                            <button
                              onClick={(e) => toggleActiveStatus(p, e)}
                              disabled={togglingId === p.id}
                              title={p.isActive !== false ? "Cliquer pour marquer en Rupture de Stock (Inactif)" : "Cliquer pour Activer"}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                                p.isActive !== false
                                  ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                              }`}
                            >
                              {togglingId === p.id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Power className={`w-3 h-3 ${p.isActive !== false ? "text-emerald-600" : "text-gray-400"}`} />
                              )}
                              <span>{p.isActive !== false ? "Actif" : "Inactif"}</span>
                            </button>

                            {/* Stock Badge */}
                            {isOutOfStock ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black bg-red-600 text-white uppercase tracking-wider shadow-xs">
                                RUPTURE DE STOCK
                              </span>
                            ) : isLowStock ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase tracking-wider">
                                Stock Faible ({p.stock})
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Disponible
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            <button
                              onClick={() => openEdit(p)}
                              className="p-2 rounded-xl hover:bg-[#06091F]/10 text-gray-600 hover:text-[#06091F] transition-colors"
                              title="Modifier le produit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openDelete(p.id)}
                              className="p-2 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                              title="Désactiver / Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {(modal === "add" || modal === "edit") && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 overflow-y-auto py-8 px-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-xl font-black text-[#06091F] uppercase tracking-wide" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                  {modal === "add" ? "Ajouter un Nouveau Produit" : "Modifier le Produit"}
                </h2>
                <p className="text-xs text-gray-500">Renseignez les détails du produit, son tarif, ses tags et l'état des stocks.</p>
              </div>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-gray-200 text-gray-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Nom du Produit *</label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm((f: any) => ({ ...f, name: e.target.value, slug: slugify(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20"
                    placeholder="Ex: Château Saint-Maur Cru Classé Rosé"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Identifiant URL (Slug)</label>
                  <input
                    value={form.slug}
                    onChange={e => setForm((f: any) => ({ ...f, slug: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20 font-mono text-xs"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Catégorie *</label>
                  <select
                    required
                    value={form.categoryId}
                    onChange={e => setForm((f: any) => ({ ...f, categoryId: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20"
                  >
                    <option value="">Sélectionner une catégorie...</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Marque</label>
                  <select
                    value={form.brandId}
                    onChange={e => setForm((f: any) => ({ ...f, brandId: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20"
                  >
                    <option value="">Aucune marque / Générique</option>
                    {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Quantité en Stock (Unités) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.stock}
                    onChange={e => setForm((f: any) => ({ ...f, stock: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20 font-bold"
                  />
                </div>

                {/* Base Price */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Prix de Base (TND) *</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    required
                    value={form.basePrice}
                    onChange={e => setForm((f: any) => ({ ...f, basePrice: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20 font-bold"
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Prix Promotionnel (TND)</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={form.salePrice ?? ""}
                    onChange={e => setForm((f: any) => ({ ...f, salePrice: e.target.value }))}
                    placeholder="Laisser vide si pas de réduction"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20"
                  />
                </div>

                {/* Loyalty Points */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Points de Fidélité Gagnés</label>
                  <input
                    type="number"
                    min="0"
                    value={form.loyaltyPoints}
                    onChange={e => setForm((f: any) => ({ ...f, loyaltyPoints: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Tags (séparés par virgule)</label>
                  <input
                    value={form.tags}
                    onChange={e => setForm((f: any) => ({ ...f, tags: e.target.value }))}
                    placeholder="vin, champagne, rouge, reserve"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20"
                  />
                </div>

                {/* Description */}
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Description Détaillée</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#06091F]/20 resize-none"
                    placeholder="Notes de dégustation, cépages, degré d'alcool, conseils d'accords mets & vins..."
                  />
                </div>

                {/* Product Images */}
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 block">Photos du Produit</label>

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
                    className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
                      dragOver
                        ? "border-[#06091F] bg-[#06091F]/5"
                        : "border-gray-200 hover:border-[#06091F]/40 hover:bg-gray-50"
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
                        <Loader2 className="w-8 h-8 text-[#06091F] animate-spin" />
                        <p className="text-sm font-medium text-[#06091F]">Téléchargement de la photo...</p>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl bg-[#06091F]/5 flex items-center justify-center">
                          <ImagePlus className="w-6 h-6 text-[#06091F]/60" />
                        </div>
                        <p className="text-sm font-bold text-gray-700">Glissez vos images ici ou <span className="text-[#06091F] underline">parcourez vos fichiers</span></p>
                        <p className="text-xs text-gray-400">JPEG, PNG, WebP, GIF · Max 5 Mo par fichier</p>
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
                        <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shadow-xs bg-gray-50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt="" className="w-full h-full object-contain p-1" />
                          <button
                            type="button"
                            onClick={() => setForm((f: any) => ({ ...f, images: f.images.filter((_: string, i: number) => i !== idx) }))}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Manual URL fallback */}
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><Upload className="w-3 h-3" /> Ou collez des URLs d'images (une par ligne) :</p>
                    <textarea
                      rows={2}
                      value={form.images.join("\n")}
                      onChange={e => setForm((f: any) => ({ ...f, images: e.target.value.split("\n") }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#06091F]/20 resize-none font-mono"
                      placeholder="https://example.com/bouteille.jpg"
                    />
                  </div>
                </div>

                {/* Status switches */}
                <div className="col-span-2 flex items-center gap-6 p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={e => setForm((f: any) => ({ ...f, isActive: e.target.checked }))}
                      className="w-4 h-4 accent-[#06091F] rounded"
                    />
                    <div>
                      <span className="text-sm font-bold text-gray-800">Produit Actif (Disponible)</span>
                      <p className="text-[11px] text-gray-400">Si décoché, le produit apparaîtra avec le badge "Rupture de Stock"</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer border-l border-gray-200 pl-6">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={e => setForm((f: any) => ({ ...f, isFeatured: e.target.checked }))}
                      className="w-4 h-4 accent-[#F5D800] rounded"
                    />
                    <div>
                      <span className="text-sm font-bold text-gray-800">Mettre en Vedette</span>
                      <p className="text-[11px] text-gray-400">Afficher sur la page d'accueil de la boutique</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-[#06091F] text-white text-sm font-bold hover:bg-[#1C2E5E] transition-colors disabled:opacity-60 flex items-center gap-2 shadow-md"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Enregistrement..." : modal === "add" ? "Créer le Produit" : "Enregistrer les Modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modal === "delete" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 border border-red-100">
              <Trash2 className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-[#06091F] mb-1.5">Désactiver ce produit ?</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-6">
              Ce produit sera marqué comme inactif et affiché avec le badge <strong>Rupture de Stock</strong> sur la boutique. Vous pourrez le réactiver à tout moment.
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-600/20"
              >
                Désactiver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
