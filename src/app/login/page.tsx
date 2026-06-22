"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { setToken, setStoredUser, adminApi } from "@/lib/api";
import { AdminRole } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("azdine@lamenagereparis.fr");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleForgotPassword() {
    const target = email.trim();
    if (!target) {
      toast.error("Saisissez votre email d'abord");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(target);
    if (error) {
      toast.error("Envoi du lien impossible");
      return;
    }
    toast.success("Lien de réinitialisation envoyé par email");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: pwd,
      });
      if (error || !data.session || !data.user) {
        toast.error("Email ou mot de passe incorrect");
        return;
      }

      const ADMIN_ROLES = ["super_admin", "admin", "manager", "editor", "support"];

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", data.user.id)
        .single();
      const role = profile?.role as string | undefined;
      if (!role || !ADMIN_ROLES.includes(role)) {
        await supabase.auth.signOut();
        toast.error("Accès réservé aux administrateurs");
        return;
      }

      setToken(data.session.access_token);
      setStoredUser({
        id: data.user.id,
        email: data.user.email ?? email.trim(),
        role: role as AdminRole,
        fullName: profile?.full_name ?? "",
      });
      // Log the sign-in event — fire and forget, never block navigation
      adminApi.activity.logLogin().catch(() => {});
      router.push("/dashboard");
    } catch {
      toast.error("Connexion impossible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="hero-side">
        <div className="hero-content">
          <div className="hero-rule"></div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div style={{ display: "flex", gap: 3 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#2EA3F2",
                }}
              ></span>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#FFC107",
                }}
              ></span>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#EF4444",
                }}
              ></span>
            </div>
          </div>
          <div className="hero-brand">La Ménagère Paris</div>
          <div className="hero-tagline">Espace administrateur</div>
          <div className="hero-quote">
            « L&apos;élégance française mise en ligne, du salon à
            l&apos;outre-mer. »
          </div>
        </div>
      </div>
      <div className="login-side">
        <div className="login-card">
          <div className="mobile-brand">
            <div style={{ display: "flex", gap: 3 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#2EA3F2",
                }}
              ></span>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#FFC107",
                }}
              ></span>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#EF4444",
                }}
              ></span>
            </div>
            <span
              style={{
                fontFamily: "var(--display)",
                fontSize: 18,
                color: "var(--primary)",
                fontWeight: 600,
              }}
            >
              La Ménagère Paris
            </span>
          </div>
          <div className="login-eyebrow">Espace pro · v1.0</div>
          <h1 className="login-title">Connexion administrateur.</h1>
          <p className="login-sub">
            Accédez au tableau de bord de votre boutique.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label">Email</label>
              <input
                className="input"
                type="email"
                placeholder="azdine@lamenagereparis.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="field login-input-wrap">
              <label className="field-label">Mot de passe</label>
              <input
                className="input"
                type={showPwd ? "text" : "password"}
                placeholder="••••••••"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
              <button
                type="button"
                className="eye"
                onClick={() => setShowPwd((v) => !v)}
                aria-label="Afficher le mot de passe"
              >
                {showPwd ? (
                  <EyeOff size={18} strokeWidth={1.6} />
                ) : (
                  <Eye size={18} strokeWidth={1.6} />
                )}
              </button>
            </div>
            <button
              type="button"
              className="forgot"
              onClick={handleForgotPassword}
              style={{ display: "block", width: "100%", border: "none", background: "none", padding: 0 }}
            >
              Mot de passe oublié ?
            </button>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: "100%", marginTop: 8 }}
              disabled={loading}
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>

            <div className="or-divider">
              <span>ou</span>
            </div>

            <a
              href="mailto:admin@lamenagereparis.fr?subject=Demande%20d%27acc%C3%A8s%20%C3%A0%20l%27espace%20administrateur"
              className="btn btn-outline"
              style={{ width: "100%" }}
            >
              <Mail size={14} strokeWidth={1.7} />
              <span>Demander un accès</span>
            </a>
          </form>

          <div className="login-foot">Sécurisé par chiffrement TLS · v1.0.0</div>
        </div>
      </div>
    </div>
  );
}
