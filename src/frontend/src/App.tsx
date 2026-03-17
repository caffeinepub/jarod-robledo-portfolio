import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import About from "./components/About";
import AdminPanel from "./components/AdminPanel";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Nav from "./components/Nav";
import Portfolio from "./components/Portfolio";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useInitializeAdmin, useIsAdmin } from "./hooks/useQueries";

function AdminSetup() {
  const [token, setToken] = useState("");
  const { mutate, isPending, isError, error } = useInitializeAdmin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate(token);
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-background">
      <div
        data-ocid="admin.setup.panel"
        className="max-w-md w-full mx-auto px-6 py-16"
      >
        <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-4 text-center">
          One-Time Setup
        </p>
        <h2 className="font-display text-2xl font-medium mb-3 text-center">
          Claim Admin Access
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed text-center mb-8">
          Enter your Caffeine Admin Token to set yourself as the admin of this
          portfolio. This only needs to be done once.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            data-ocid="admin.token_input"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Caffeine Admin Token"
            required
            className="w-full px-4 py-3 bg-card border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-foreground/30"
          />

          {isError && (
            <p
              data-ocid="admin.setup.error_state"
              className="text-red-400 text-sm"
            >
              {String((error as Error)?.message).includes("already")
                ? "Admin has already been claimed by another account."
                : "Token invalid. Check your Caffeine Admin Token and try again."}
            </p>
          )}

          <button
            data-ocid="admin.claim_button"
            type="submit"
            disabled={isPending || !token}
            className="w-full py-3 bg-foreground text-background text-sm tracking-wider uppercase font-medium rounded hover:bg-foreground/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isPending ? "Claiming..." : "Claim Admin Access"}
          </button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
          Find your Admin Token in the Caffeine dashboard under your project
          settings.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const { identity } = useInternetIdentity();
  const [showAdmin, setShowAdmin] = useState(false);
  const { data: isAdmin } = useIsAdmin();

  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      <Nav
        isAdmin={isAuthenticated}
        showAdmin={showAdmin}
        onToggleAdmin={() => setShowAdmin((v) => !v)}
      />

      {showAdmin && isAuthenticated ? (
        isAdmin === false ? (
          <AdminSetup />
        ) : (
          <AdminPanel onClose={() => setShowAdmin(false)} />
        )
      ) : (
        <main>
          <Hero />
          <Portfolio />
          <About />
          <Contact />
        </main>
      )}

      <Footer />
    </div>
  );
}
