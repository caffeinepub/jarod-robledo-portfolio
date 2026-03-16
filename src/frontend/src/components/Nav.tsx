import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface NavProps {
  isAdmin: boolean;
  showAdmin: boolean;
  onToggleAdmin: () => void;
}

export default function Nav({ isAdmin, showAdmin, onToggleAdmin }: NavProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const qc = useQueryClient();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      qc.clear();
    } else {
      try {
        await login();
      } catch (e: any) {
        if (e?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-foreground/95 backdrop-blur-sm shadow-architectural"
          : "bg-foreground"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          type="button"
          onClick={() => scrollTo("hero")}
          className="font-display text-primary-foreground text-lg tracking-[0.12em] uppercase font-medium hover:opacity-75 transition-opacity"
        >
          Jarod Robledo
        </button>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <button
            type="button"
            data-ocid="nav.work_link"
            onClick={() => scrollTo("work")}
            className="text-primary-foreground/70 hover:text-primary-foreground text-sm tracking-widest uppercase transition-colors font-medium"
          >
            Work
          </button>
          <button
            type="button"
            data-ocid="nav.about_link"
            onClick={() => scrollTo("about")}
            className="text-primary-foreground/70 hover:text-primary-foreground text-sm tracking-widest uppercase transition-colors font-medium"
          >
            About
          </button>
          <button
            type="button"
            data-ocid="nav.contact_link"
            onClick={() => scrollTo("contact")}
            className="text-primary-foreground/70 hover:text-primary-foreground text-sm tracking-widest uppercase transition-colors font-medium"
          >
            Contact
          </button>

          {isAdmin && (
            <button
              type="button"
              data-ocid="nav.admin_link"
              onClick={onToggleAdmin}
              className={`text-sm tracking-widest uppercase transition-colors font-medium ${
                showAdmin
                  ? "text-accent"
                  : "text-primary-foreground/70 hover:text-primary-foreground"
              }`}
            >
              {showAdmin ? "← Portfolio" : "Admin"}
            </button>
          )}

          {isAuthenticated ? (
            <Button
              data-ocid="auth.logout_button"
              onClick={handleAuth}
              size="sm"
              variant="outline"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground text-xs tracking-widest uppercase"
            >
              Sign Out
            </Button>
          ) : (
            <Button
              data-ocid="auth.login_button"
              onClick={handleAuth}
              disabled={isLoggingIn}
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground text-xs tracking-widest uppercase"
            >
              {isLoggingIn ? "Signing in…" : "Admin Login"}
            </Button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          className="md:hidden text-primary-foreground"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-foreground border-t border-primary-foreground/10 px-6 py-4 flex flex-col gap-4">
          <button
            type="button"
            data-ocid="nav.work_link"
            onClick={() => scrollTo("work")}
            className="text-primary-foreground/70 text-sm tracking-widest uppercase text-left"
          >
            Work
          </button>
          <button
            type="button"
            data-ocid="nav.about_link"
            onClick={() => scrollTo("about")}
            className="text-primary-foreground/70 text-sm tracking-widest uppercase text-left"
          >
            About
          </button>
          <button
            type="button"
            data-ocid="nav.contact_link"
            onClick={() => scrollTo("contact")}
            className="text-primary-foreground/70 text-sm tracking-widest uppercase text-left"
          >
            Contact
          </button>
          {isAdmin && (
            <button
              type="button"
              data-ocid="nav.admin_link"
              onClick={() => {
                onToggleAdmin();
                setMobileOpen(false);
              }}
              className="text-accent text-sm tracking-widest uppercase text-left"
            >
              Admin
            </button>
          )}
          {isAuthenticated ? (
            <button
              type="button"
              data-ocid="auth.logout_button"
              onClick={handleAuth}
              className="text-primary-foreground/50 text-sm tracking-widest uppercase text-left"
            >
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              data-ocid="auth.login_button"
              onClick={handleAuth}
              disabled={isLoggingIn}
              className="text-primary-foreground/50 text-sm tracking-widest uppercase text-left"
            >
              Admin Login
            </button>
          )}
        </div>
      )}
    </header>
  );
}
