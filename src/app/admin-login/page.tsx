"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle } from "lucide-react";

// Identifiants admin codés en dur — à déplacer dans les variables d'environnement en production
const ADMIN_USER = "admin";
const ADMIN_PASS = "gandouz2026";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await new Promise((resolve) => setTimeout(resolve, 400));

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      // Définir le cookie d'auth (validité 1 jour) — le middleware le vérifie
      document.cookie = `ADMIN_AUTH=true; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
      router.push("/admin");
      router.refresh();
    } else {
      setError("Identifiant ou mot de passe incorrect.");
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#06091F] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Décorations d'arrière-plan */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #F5D800 0, #F5D800 1px, transparent 0, transparent 50%)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F5D800]/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full filter blur-[80px] pointer-events-none" />

      {/* Carte */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
          {/* Logo & Titre */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F5D800]/10 border border-[#F5D800]/20 mb-4">
              <ShieldCheck className="w-8 h-8 text-[#F5D800]" />
            </div>
            <h1
              className="text-3xl font-black text-white uppercase tracking-tight"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              GANDOUZ
            </h1>
            <p className="text-white/50 text-sm mt-1 tracking-widest uppercase font-semibold">
              Accès Administrateur
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Nom d'utilisateur */}
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="Nom d'utilisateur"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#F5D800]/50 focus:bg-white/8 transition-all"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#F5D800]/50 focus:bg-white/8 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-3.5 py-2.5">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-red-400 text-xs font-medium">{error}</p>
              </div>
            )}

            {/* Soumettre */}
            <button
              id="admin-login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-[#F5D800] hover:bg-yellow-300 text-[#06091F] font-black py-3.5 rounded-xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-[#F5D800]/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-[#06091F]/30 border-t-[#06091F] rounded-full animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          {/* Retour à la boutique */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              ← Retour à la boutique
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
